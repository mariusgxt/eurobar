package com.eurobar.eurobar_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email){
        return ResponseEntity.ok("Retrieved users with filters: username=" + 
                username + ", email=" + email);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok("Retrieved user with ID: " + userId);
    }
    
    @PostMapping("")
    public ResponseEntity<?> createUser(@RequestBody Object userRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Object userRequest) {
        return ResponseEntity.ok("Updated user with ID: " + userId);
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        return ResponseEntity.ok("Deleted user with ID: " + userId);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Object loginRequest) {
        return ResponseEntity.ok("User logged in successfully");
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Object registrationRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }
}
