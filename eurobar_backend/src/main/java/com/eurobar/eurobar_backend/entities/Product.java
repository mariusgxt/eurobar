package com.eurobar.eurobar_backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @Column(nullable = false, unique = true)
    private String barcode;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private String company;

    public Product() {}

    public Product(String barcode, String region, String company) {
        this.barcode = barcode;
        this.region = region;
        this.company = company;
    }

    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
}
