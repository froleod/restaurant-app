package by.froleod.backend_restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Разрешаем запросы к /api
                        .allowedOrigins("http://localhost") // Разрешаем запросы с фронтенда
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Разрешаем методы
                        .allowedHeaders("*") // Разрешаем все заголовки
                        .allowCredentials(true); // Разрешаем передачу куки и авторизации
            }
        };
    }
}