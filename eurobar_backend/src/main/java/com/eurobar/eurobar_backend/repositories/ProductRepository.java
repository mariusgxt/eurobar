package com.eurobar.eurobar_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eurobar.eurobar_backend.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByBarcode(Long barcode);
}

