package by.froleod.backend_restaurant.domain.menu.controller;

import by.froleod.backend_restaurant.domain.menu.dto.ProductDto;
import by.froleod.backend_restaurant.domain.menu.entity.Product;
import by.froleod.backend_restaurant.domain.menu.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    @GetMapping
    public List<ProductDto> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.ok(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct
    ) {
        LOGGER.info("Updating product with id {}", id);
        return ResponseEntity.ok(productService.updateProduct(id, updatedProduct));
    }

    @DeleteMapping
    public ResponseEntity<String> deleteProduct(@RequestParam Long productId) {
        LOGGER.info("Deleting product with id {}", productId);
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Product with id " + productId + " was deleted");
    }
}