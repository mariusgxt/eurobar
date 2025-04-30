package com.eurobar.eurobar_backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SpringDocConfig {
    @Bean
    public OpenAPI api() {
        return new OpenAPI()
                .info(
                        new Info()
                                .title("Eurobar Backend API")
                                .description("The API documentation for the Eurobar Backend")
                                .version("V1")
                                .contact(new Contact().name("me"))
                                .license(new License().name("MIT"))
                );
    }
}
