package com.eurobar.eurobar_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eurobar.eurobar_backend.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}

