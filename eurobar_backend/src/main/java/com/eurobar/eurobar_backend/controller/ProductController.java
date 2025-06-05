package com.eurobar.eurobar_backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.eurobar.eurobar_backend.entities.Product;
import com.eurobar.eurobar_backend.repositories.ProductRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @Value("${external.openfoods}")
    String OpenfoodsURI;

    @Operation(
        summary="Gets all products",
        description="Gets all products in the database.",
        tags="Product",
        responses={
            @ApiResponse(responseCode="200", description="Found All Products."),
            @ApiResponse(responseCode="204", description="No product in database.")
        })
    @GetMapping("")
    public ResponseEntity<?> getAllProducts() {
        if(productRepository.findAll() != null){
        return ResponseEntity.ok(productRepository.findAll());
        }else{
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No Entries in the database to display.");
        }
    }

    @Operation(
        summary = "Get a barcode.",
        description = "Gets a single product matching the barcode.",
        tags = "Product",
        parameters = {
            @Parameter(name = "barcode", description = "Search for a product by its barcode.")
        },
        responses = {
            @ApiResponse(responseCode="200", description="Found Product.")
        })
    @GetMapping("/{barcode}")
    public ResponseEntity<?> getProductByBarcode(@PathVariable("barcode") String barcode) {
        Optional<Product> productOpt = productRepository.findByBarcode(barcode);
        if (productOpt.isPresent()) {
            return ResponseEntity.ok(productOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }

    @Operation(
        summary="Creates a new product",
        description="Creates a new product in the database using the parameters.",
        tags="Product",
        parameters = {
            @Parameter(name = "Product Request", description = "A product object in the request body.")
        },
        responses = {
            @ApiResponse(responseCode="200", description="The product has been created."),
            @ApiResponse(responseCode="409", description="The product with the entered barcode already exists in the database.")
        })
    @PostMapping("")
    public ResponseEntity<?> createProduct(@RequestBody Product productRequest) {
        if (productRequest.getBarcode() != null && productRepository.findByBarcode(productRequest.getBarcode()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Barcode already exists");
        }
        Product savedProduct = productRepository.save(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @Operation (
        summary="Updates a product.",
        description="Updates the product matching the barcode entered and overrides it with the entered request body.",
        tags="Product",
        parameters = {
            @Parameter(name="barcode", description="The barcode of the product that should be updated."),
            @Parameter(name="request body", description="The request body containing the new product.")
        },
        responses= {
            @ApiResponse(responseCode="200", description="The product has been updated."),
            @ApiResponse(responseCode="404", description="The product matching the barcode has not been found.")

        })
    @PutMapping("/{barcode}")
    public ResponseEntity<?> updateProduct(@PathVariable("barcode") String barcode, @RequestBody Product productRequest) {
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

    @Operation (
        summary = "Deletes a product.",
        description = "Deletes the product matching the barcode from the database.",
        tags = "Product",
        parameters = {
            @Parameter(name="barcode", description="The barcode of the product that should be deleted.")
        },
        responses = {
            @ApiResponse(responseCode="200", description="The product has been deleted."),
            @ApiResponse(responseCode="404", description="The product matching the barcode has not been found.")
        })    
    @DeleteMapping("/{barcode}")
    public ResponseEntity<?> deleteProduct(@PathVariable("barcode") String barcode) {
        Optional<Product> productOpt = productRepository.findByBarcode(barcode);
        if (productOpt.isPresent()) {
            productRepository.delete(productOpt.get());
            return ResponseEntity.ok("Product deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }

    @Operation (
        summary = "Gets the country and brand of a product given its barcode.",
        description = "Fetches the information of a product by sending its barcode to the OpenFood-Api and organizes the results into a cleaned up list of the countries and brands.",
        tags = "External",
        parameters = {
            @Parameter(name="barcode", description="The barcode of the product that needs to be searched.")
        },
        responses = {
            @ApiResponse(responseCode="200", description="The product and its information has been found."),
            @ApiResponse(responseCode="404", description="The product has not been found in the Open Food Database."),
            @ApiResponse(responseCode="500", description="Error fetching data from external Api.")
        })
    @GetMapping("/lookup/{barcode}")
    public ResponseEntity<?> lookupProduct(@PathVariable("barcode") String barcode) {
        //Local check
        Optional<Product> localProduct = productRepository.findByBarcode(barcode);
        if(localProduct.isPresent()){
            return ResponseEntity.ok(localProduct.get());
        }

        try {
            String uri = OpenfoodsURI.concat(barcode);
            RestTemplate restTemplate = new RestTemplate();
            String result = restTemplate.getForObject(uri, String.class);
        
            if(result != null){
                ObjectMapper objectMapper = new ObjectMapper();
                
                JsonNode jsonNode = objectMapper.readTree(result);
                
                // Use countries_hierarchy instead of countries
                JsonNode countriesHierarchy = jsonNode.path("product").path("countries_hierarchy");
                String region;

                if (countriesHierarchy.isArray() && countriesHierarchy.size() > 0) {
                    // Extract country codes from hierarchy (e.g., "en:germany" -> "germany")
                    List<String> countries = new ArrayList<>();
                    for (JsonNode countryNode : countriesHierarchy) {
                        String countryCode = countryNode.asText();
                        if (countryCode.startsWith("en:")) {
                            // Remove "en:" prefix and capitalize first letter
                            String countryName = countryCode.substring(3);
                            countryName = countryName.substring(0, 1).toUpperCase() + countryName.substring(1);
                            countries.add(countryName);
                        }
                    }
                    region = String.join(", ", countries);
                } else {
                    region = "Country not found";
                }

                String brand = jsonNode.path("product").path("brands").asText();

                if(region.isEmpty()){
                    region = "Country not found";
                }

                if(brand.isEmpty()){
                    brand = "Brand not found";
                }

                Product foundProduct = new Product(barcode, region, brand);
                CompletableFuture.runAsync(() -> {
                    productRepository.save(foundProduct);
                });
                return ResponseEntity.ok(foundProduct);
            }else{
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found in external API");
            }
            
        } catch (RestClientException | JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error fetching data from external Api " + e.getMessage());
        }
    }
    
}
