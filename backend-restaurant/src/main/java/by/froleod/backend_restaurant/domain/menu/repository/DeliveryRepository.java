package by.froleod.backend_restaurant.domain.menu.repository;

import by.froleod.backend_restaurant.domain.menu.delivery.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
}
