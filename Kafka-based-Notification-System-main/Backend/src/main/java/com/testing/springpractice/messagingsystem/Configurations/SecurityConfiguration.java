package com.testing.springpractice.messagingsystem.Configurations;
import com.testing.springpractice.messagingsystem.Models.Users;
import com.testing.springpractice.messagingsystem.Repository.UsersRepository;
import com.testing.springpractice.messagingsystem.Utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import io.jsonwebtoken.Claims;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(MyUserDetailsService myUserDetailsService){
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(myUserDetailsService);
        authenticationProvider.setPasswordEncoder(encoder());
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
    public JwtAuthFilter jwtAuthFilter(UsersRepository usersRepository, JwtUtils jwtUtils) {
        return new JwtAuthFilter(usersRepository, jwtUtils);
    }
    @Bean
    public PasswordEncoder encoder(){
        return new BCryptPasswordEncoder(12);
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, UsersRepository usersRepository, JwtUtils jwtUtils){
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf->csrf.disable())
                .httpBasic(basic->basic.disable())
                .sessionManagement(sess->sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/index.html", "/assets/**", "/manifest.webmanifest", "/sw.js", "/icons/**", "/favicon.ico").permitAll()
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter(usersRepository, jwtUtils), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    static class JwtAuthFilter extends OncePerRequestFilter {

        private final UsersRepository usersRepository;
        private final JwtUtils jwtUtils;

        JwtAuthFilter(UsersRepository usersRepository, JwtUtils jwtUtils) {
            this.usersRepository = usersRepository;
            this.jwtUtils = jwtUtils;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                try {
                    Claims claims = jwtUtils.getClaims(token);
                    String username = claims.getSubject();

                    if (username != null 
                            && claims.getExpiration().after(new Date()) 
                            && SecurityContextHolder.getContext().getAuthentication() == null) {
                        
                        Optional<Users> userOpt = usersRepository.findByUsername(username);
                        if (userOpt.isPresent()) {
                            Users user = userOpt.get();
                            UsernamePasswordAuthenticationToken authToken = 
                                    new UsernamePasswordAuthenticationToken(user, token, user.getAuthorities());
                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        }
                    }
                } catch (Exception e) {
                    System.out.printf(e.getMessage());
                }
            }
            filterChain.doFilter(request, response);
        }
    }
}
