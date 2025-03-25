package by.froleod.backend_restaurant.domain.menu.service;

import by.froleod.backend_restaurant.domain.menu.dto.OrderItemDto;
import by.froleod.backend_restaurant.domain.menu.entity.Order;

import java.util.List;

public interface OrderService {

    Order createOrder(String username, List<OrderItemDto> items);

    List<Order> getAllOrdersByUsername(String username);

}
