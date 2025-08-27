package com.studymate.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Skip JWT processing for auth endpoints
        String path = request.getRequestURI();
        if (path.equals("/api/auth/login") || path.equals("/api/auth/signup")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                Claims claims = jwtUtil.parse(token);
                String subject = claims.getSubject();
                String role = (String) claims.getOrDefault("role", "USER");
                var authToken = new UsernamePasswordAuthenticationToken(subject, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } catch (Exception ex) {
                // invalid token -> clear context; continue to entry point
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }
}
