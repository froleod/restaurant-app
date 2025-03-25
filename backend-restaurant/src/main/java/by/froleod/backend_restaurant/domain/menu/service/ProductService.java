package by.froleod.backend_restaurant.domain.menu.service;

import by.froleod.backend_restaurant.domain.menu.dto.ProductDto;
import by.froleod.backend_restaurant.domain.menu.entity.Product;

import java.util.List;

public interface ProductService {

    List<ProductDto> getAllProducts();
    Product createProduct(Product product);
    void deleteProduct(Long id);
    Product updateProduct(Long id, Product product);
}