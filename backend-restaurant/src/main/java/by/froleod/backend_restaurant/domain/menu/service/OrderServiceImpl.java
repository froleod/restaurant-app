package by.froleod.backend_restaurant.domain.menu.service;

import by.froleod.backend_restaurant.domain.menu.delivery.Delivery;
import by.froleod.backend_restaurant.domain.menu.dto.OrderItemDto;
import by.froleod.backend_restaurant.domain.menu.entity.Order;
import by.froleod.backend_restaurant.domain.menu.entity.OrderItem;
import by.froleod.backend_restaurant.domain.menu.entity.Product;
import by.froleod.backend_restaurant.domain.menu.repository.DeliveryRepository;
import by.froleod.backend_restaurant.domain.menu.repository.OrderRepository;
import by.froleod.backend_restaurant.domain.menu.repository.ProductRepository;
import by.froleod.backend_restaurant.domain.user.entity.User;
import by.froleod.backend_restaurant.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final MailSenderService mailSenderService;
    private final DeliveryRepository deliveryRepository;

    @Transactional
    @Override
    public Order createOrder(String username, List<OrderItemDto> items, Delivery deliveryAddress) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("В обработке");

        double totalPrice = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemDto item : items) {
            Product product = productRepository.findById(item.productId()).orElseThrow();

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setOrder(order);
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(item.quantity());

            totalPrice += product.getPrice() * item.quantity();
            orderItems.add(orderItem);
        }
        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        Delivery delivery = new Delivery();
        delivery.setStreet(deliveryAddress.getStreet());
        delivery.setHouse(deliveryAddress.getHouse());
        delivery.setApartment(deliveryAddress.getApartment());
        delivery.setFloor(deliveryAddress.getFloor());
        delivery.setIntercom(deliveryAddress.getIntercom());
        delivery.setComment(deliveryAddress.getComment());
        delivery.setStatus("pending");

        deliveryRepository.save(delivery);

        var savedOrder = orderRepository.save(order);
        String emailSubject = "Твой заказ в ресторане Уют";
        mailSenderService.send(
                user.getEmail(),
                emailSubject,
                MailSenderService.buildOrderEmailText(savedOrder, delivery)
        );
        return savedOrder;
    }

    @Override
    public List<Order> getAllOrdersByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return orderRepository.findAllByUserId(user.getId());
    }
}
