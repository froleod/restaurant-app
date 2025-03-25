package by.froleod.backend_restaurant.domain.auth.controller;

import by.froleod.backend_restaurant.domain.auth.dto.AuthResponse;
import by.froleod.backend_restaurant.domain.auth.dto.LoginRequest;
import by.froleod.backend_restaurant.domain.auth.dto.RegisterRequest;
import by.froleod.backend_restaurant.domain.auth.service.AuthService;
import by.froleod.backend_restaurant.domain.user.entity.User;
import by.froleod.backend_restaurant.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Аутентификация")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @Operation(summary = "Регистрация пользователя")
    @PostMapping("/register")
    public AuthResponse register(@Validated @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @Operation(summary = "Авторизация пользователя")
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @Operation(summary = "Информация о пользователе")
    @GetMapping("/me")
    public ResponseEntity<Optional<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> user = userService.findByUsername(userDetails.getUsername());
        return ResponseEntity.ok(user);
    }
}