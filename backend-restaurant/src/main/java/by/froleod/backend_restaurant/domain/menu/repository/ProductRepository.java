package by.froleod.backend_restaurant.domain.menu.repository;

import by.froleod.backend_restaurant.domain.menu.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}