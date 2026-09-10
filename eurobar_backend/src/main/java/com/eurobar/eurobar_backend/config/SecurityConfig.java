package com.eurobar.eurobar_backend.config;

import com.eurobar.eurobar_backend.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }

    @Bean
    UserDetailsService userDetailsService(UserRepository users) {
        return username -> {
            var user = users.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
            return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword()).roles("USER").build();
        };
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/csrf").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**", "/").permitAll()
                .anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}
