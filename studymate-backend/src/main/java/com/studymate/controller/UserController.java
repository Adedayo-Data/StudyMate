package com.studymate.controller;

import com.studymate.api.dto.UserDto;
import com.studymate.entity.UserEntity;
import com.studymate.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String email = auth.getName();
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        
        UserEntity user = userOpt.get();
        UserDto u = new UserDto();
        u.id = user.getId().toString();
        u.username = user.getUsername();
        u.fullName = user.getFullName();
        u.email = user.getEmail();
        u.profilePicture = user.getProfilePicture();
        u.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : OffsetDateTime.now().toString();
        u.lastLogin = user.getLastLogin() != null ? user.getLastLogin().toString() : null;
        return ResponseEntity.ok(u);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> update(@RequestBody UserDto updates) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String email = auth.getName();
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        
        UserEntity user = userOpt.get();
        
        // Update allowed fields
        if (updates.fullName != null) user.setFullName(updates.fullName);
        if (updates.username != null) user.setUsername(updates.username);
        if (updates.profilePicture != null) user.setProfilePicture(updates.profilePicture);
        
        userRepository.save(user);
        
        // Return updated user data
        UserDto u = new UserDto();
        u.id = user.getId().toString();
        u.username = user.getUsername();
        u.fullName = user.getFullName();
        u.email = user.getEmail();
        u.profilePicture = user.getProfilePicture();
        u.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : OffsetDateTime.now().toString();
        u.lastLogin = user.getLastLogin() != null ? user.getLastLogin().toString() : null;
        return ResponseEntity.ok(u);
    }
}
