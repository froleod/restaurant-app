package by.froleod.backend_restaurant.domain.menu.dto;

import by.froleod.backend_restaurant.domain.menu.delivery.Delivery;
import java.util.List;


public record CreateOrderDto(String username, List<OrderItemDto> items, Delivery deliveryAddress) {
}
