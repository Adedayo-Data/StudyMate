package com.studymate.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    private final Key key;
    private final long expirationMillis;

    public JwtUtil(
            @Value("${jwt.secret:VGhpcy1pczMtYS1zYWZlLXNob3J0LXNlY3JldC1jaGFuZ2UtaXQh}") String secretBase64,
            @Value("${jwt.expirationMillis:86400000}") long expirationMillis
    ) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretBase64));
        this.expirationMillis = expirationMillis;
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(now.toEpochMilli() + expirationMillis))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
