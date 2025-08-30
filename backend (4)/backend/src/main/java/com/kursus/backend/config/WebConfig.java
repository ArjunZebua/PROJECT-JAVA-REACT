package com.kursus.backend.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @SuppressWarnings("null")
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Melayani file gambar dari folder uploads
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
                
        
        // Alternative: jika ingin menggunakan classpath
        // registry.addResourceHandler("/uploads/**")
        //         .addResourceLocations("classpath:/static/uploads/");
    }
}
