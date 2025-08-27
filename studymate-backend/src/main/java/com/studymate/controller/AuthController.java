package com.studymate.controller;

import com.studymate.api.dto.AuthMessage;
import com.studymate.api.dto.UserDto;
import com.studymate.entity.UserEntity;
import com.studymate.repository.UserRepository;
import com.studymate.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository users, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    record LoginRequest(String email, String password) {}
    record SignupRequest(String username, String fullName, String email, String password) {}

    @PostMapping("/signup")
    public ResponseEntity<AuthMessage> signup(@RequestBody SignupRequest req) {
        if (req.email() == null || req.password() == null) {
            AuthMessage err = new AuthMessage();
            err.message = "Email and password are required";
            return ResponseEntity.badRequest().body(err);
        }
        if (users.existsByEmail(req.email())) {
            AuthMessage err = new AuthMessage();
            err.message = "Email already in use";
            return ResponseEntity.status(409).body(err);
        }
        UserEntity u = new UserEntity();
        u.setUsername(req.username() != null ? req.username() : req.email().split("@")[0]);
        u.setEmail(req.email());
        u.setFullName(req.fullName());
        u.setPasswordHash(passwordEncoder.encode(req.password()));
        u.setRole("STUDENT");
        u.setIsActive(true);
        users.save(u);

        String token = jwtUtil.generateToken(u.getEmail(), Map.of("role", u.getRole(), "uid", u.getId().toString()));
        AuthMessage msg = new AuthMessage();
        msg.token = token;
        msg.user = toDto(u, req.username());
        msg.message = "Signup successful";
        return ResponseEntity.ok(msg);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthMessage> login(@RequestBody LoginRequest req) {
        System.out.println("Login Request" + req.email());
        System.out.println("Login request password" + req.password());

        Optional<UserEntity> ou = users.findByEmail(req.email());
        if (ou.isEmpty() || !passwordEncoder.matches(req.password(), ou.get().getPasswordHash())) {
            AuthMessage err = new AuthMessage();
            err.message = "Invalid email or password";
            return ResponseEntity.status(401).body(err);
        }
        var u = ou.get();
        u.setLastLogin(OffsetDateTime.now());
        users.save(u);
        String token = jwtUtil.generateToken(u.getEmail(), Map.of("role", u.getRole(), "uid", u.getId().toString()));
        AuthMessage msg = new AuthMessage();
        msg.token = token;
        msg.user = toDto(u, null);
        msg.message = "Login successful";
        return ResponseEntity.ok(msg);
    }

    private static UserDto toDto(UserEntity e, String username) {
        UserDto u = new UserDto();
        u.id = e.getId() != null ? e.getId().toString() : UUID.randomUUID().toString();
        u.username = (username != null && !username.isBlank()) ? username : e.getUsername();
        u.fullName = e.getFullName();
        u.email = e.getEmail();
        u.profilePicture = e.getProfilePicture();
        u.createdAt = e.getCreatedAt() != null ? e.getCreatedAt().toString() : OffsetDateTime.now().toString();
        u.lastLogin = e.getLastLogin() != null ? e.getLastLogin().toString() : null;
        return u;
    }
}

