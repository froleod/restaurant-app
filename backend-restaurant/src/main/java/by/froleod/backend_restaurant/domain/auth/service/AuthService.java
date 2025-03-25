package by.froleod.backend_restaurant.domain.auth.service;

import by.froleod.backend_restaurant.domain.auth.dto.AuthResponse;
import by.froleod.backend_restaurant.domain.auth.dto.LoginRequest;
import by.froleod.backend_restaurant.domain.auth.dto.RegisterRequest;
import by.froleod.backend_restaurant.domain.user.entity.Role;
import by.froleod.backend_restaurant.domain.user.entity.User;
import by.froleod.backend_restaurant.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        userService.create(user);

        var jwt = jwtService.generateToken(user);

        return new AuthResponse(jwt, user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
        ));

        var user = userService
                .userDetailsService()
                .loadUserByUsername(request.getUsername());

        var role = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        var jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt, role);
    }
}