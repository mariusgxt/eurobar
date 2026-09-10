package com.eurobar.eurobar_backend.controller;

import java.security.Principal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.eurobar.eurobar_backend.entities.User;
import com.eurobar.eurobar_backend.repositories.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;
    private final PasswordEncoder passwords;

    public UserController(UserRepository users, PasswordEncoder passwords) {
        this.users = users;
        this.passwords = passwords;
    }

    private boolean owns(User user, Principal principal) {
        return principal != null && user.getUsername().equals(principal.getName());
    }

    private boolean valid(User user) {
        return user.getUsername() != null && user.getUsername().matches("[a-zA-Z0-9_.-]{3,64}")
            && user.getEmail() != null && user.getEmail().length() <= 254
            && user.getEmail().matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+")
            && user.getPassword() != null && user.getPassword().length() >= 12
            && user.getPassword().getBytes(StandardCharsets.UTF_8).length <= 72;
    }

    @GetMapping("")
    public ResponseEntity<?> currentUser(Principal principal) {
        return ResponseEntity.ok(users.findByUsername(principal.getName()).map(List::of).orElse(List.of()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable Long userId, Principal principal) {
        var user = users.findById(userId);
        if (user.isEmpty() || !owns(user.get(), principal)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user.get());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User input) {
        if (!valid(input)) return ResponseEntity.badRequest().body("Provide a username, email and password of 12 to 72 bytes");
        if (users.findByUsername(input.getUsername()).isPresent() || users.findByEmail(input.getEmail()).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Account already exists");
        var user = new User(input.getUsername(), passwords.encode(input.getPassword()), input.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(users.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(Principal principal) {
        return ResponseEntity.ok(users.findByUsername(principal.getName()).orElseThrow());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> update(@PathVariable Long userId, @RequestBody User input, Principal principal) {
        var found = users.findById(userId);
        if (found.isEmpty() || !owns(found.get(), principal)) return ResponseEntity.notFound().build();
        if (!valid(input)) return ResponseEntity.badRequest().body("Invalid account details");
        var user = found.get();
        // Keep the login identifier stable while updating the authenticated account.
        user.setEmail(input.getEmail());
        user.setPassword(passwords.encode(input.getPassword()));
        return ResponseEntity.ok(users.save(user));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> delete(@PathVariable Long userId, Principal principal) {
        var user = users.findById(userId);
        if (user.isEmpty() || !owns(user.get(), principal)) return ResponseEntity.notFound().build();
        users.delete(user.get());
        return ResponseEntity.noContent().build();
    }
}
