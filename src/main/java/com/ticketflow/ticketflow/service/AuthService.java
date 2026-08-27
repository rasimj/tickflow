package com.ticketflow.ticketflow.service;

import com.ticketflow.ticketflow.dto.AuthResponse;
import com.ticketflow.ticketflow.dto.LoginRequest;
import com.ticketflow.ticketflow.dto.RegisterRequest;
import com.ticketflow.ticketflow.model.User;
import com.ticketflow.ticketflow.repository.UserRepository;
import com.ticketflow.ticketflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        if (request.getRole() == User.Role.ADMIN) {
            throw new IllegalArgumentException("Admin accounts cannot be self-registered. Ask an existing admin to create one.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setAccountStatus(request.getRole() == User.Role.AGENT
                ? User.AccountStatus.PENDING_APPROVAL
                : User.AccountStatus.ACTIVE);

        User saved = userRepository.save(user);

        if (saved.getAccountStatus() == User.AccountStatus.PENDING_APPROVAL) {
            return new AuthResponse(null, saved.getEmail(), saved.getRole().name(), "PENDING_APPROVAL");
        }

        String token = jwtUtil.generateToken(saved.getEmail());
        return new AuthResponse(token, saved.getEmail(), saved.getRole().name(), "ACTIVE");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getAccountStatus().name());
    }
}