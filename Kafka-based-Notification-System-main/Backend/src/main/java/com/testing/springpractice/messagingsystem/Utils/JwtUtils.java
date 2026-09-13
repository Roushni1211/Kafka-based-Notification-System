package com.testing.springpractice.messagingsystem.Utils;

import com.testing.springpractice.messagingsystem.Models.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    public String jwtSecret;
    @Value("${jwt.expiration}")
    public Long validity;

    private Key getSecret(){
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    public String getToken(Users users){
        return Jwts.builder()
                .subject(users.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+validity))
                .signWith(getSecret())
                .claim("name", users.getName())
                .claim("verified", users.getVerified())
                .compact();
    }

    public Claims getClaims(String token){
        return Jwts.parser().setSigningKey(getSecret())
                .build().parseClaimsJws(token).getBody();
    }
    public String getUsername(String token){
        return getClaims(token).getSubject();
    }
}
