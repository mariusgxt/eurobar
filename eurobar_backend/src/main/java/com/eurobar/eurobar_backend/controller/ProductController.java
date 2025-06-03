package com.eurobar.eurobar_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eurobar.eurobar_backend.entities.Product;
import com.eurobar.eurobar_backend.repositories.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{barcode}")
    public ResponseEntity<?> getProductByBarcode(@PathVariable Long barcode) {
        Optional<Product> productOpt = productRepository.findByBarcode(barcode);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createProduct(@RequestBody Product productRequest) {
        if (productRequest.getBarcode() != null && productRepository.findByBarcode(productRequest.getBarcode()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Barcode already exists");
        }
        Product savedProduct = productRepository.save(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{barcode}")
    public ResponseEntity<?> updateProduct(@PathVariable Long barcode, @RequestBody Product productRequest) {
        Optional<Product> productOpt = productRepository.findByBarcode(barcode);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setRegion(productRequest.getRegion());
            product.setCompany(productRequest.getCompany());
            productRepository.save(product);
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }

    @DeleteMapping("/{barcode}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long barcode) {
        Optional<Product> productOpt = productRepository.findByBarcode(barcode);
        if (productOpt.isPresent()) {
            productRepository.delete(productOpt.get());
            return ResponseEntity.ok("Product deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }
}
