package by.froleod.backend_restaurant.domain.menu.dto;

import java.util.List;


public record CreateOrderDto(String username, List<OrderItemDto> items) {
}
