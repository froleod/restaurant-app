package by.froleod.backend_restaurant.domain.menu.controller;


import by.froleod.backend_restaurant.domain.menu.dto.CreateOrderDto;
import by.froleod.backend_restaurant.domain.menu.entity.Order;
import by.froleod.backend_restaurant.domain.menu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderDto createOrderDto) {
        Order order = orderService.createOrder(createOrderDto.username(), createOrderDto.items(), createOrderDto.deliveryAddress());
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(@RequestParam String username) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS))
                .body(orderService.getAllOrdersByUsername(username));
    }
}
