package com.studymate.api.dto;

public class AuthDtos {
    public static class SignupRequest {
        public String email;
        public String password;
        public String fullName;
    }
    public static class LoginRequest {
        public String email;
        public String password;
    }
    public static class AuthResponse {
        public String token;
        public String email;
        public String fullName;
        public String role;
        public AuthResponse() {}
        public AuthResponse(String token, String email, String fullName, String role) {
            this.token = token;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
        }
    }
}
