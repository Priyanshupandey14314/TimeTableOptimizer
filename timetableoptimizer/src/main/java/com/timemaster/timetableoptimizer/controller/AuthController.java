package com.timemaster.timetableoptimizer.controller;

import com.timemaster.timetableoptimizer.dto.AuthResponse;
import com.timemaster.timetableoptimizer.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private com.timemaster.timetableoptimizer.repository.AppUserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = "dummy-session-token";

            var roles = authentication.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new AuthResponse(token, request.getUsername(), roles));
        } catch (org.springframework.security.core.AuthenticationException e) {
            System.out.println("Login failed for user: " + request.getUsername());
            e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.timemaster.timetableoptimizer.dto.RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        com.timemaster.timetableoptimizer.model.AppUser user = new com.timemaster.timetableoptimizer.model.AppUser();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Convert string roles to Enum roles if needed, or string roles
        // Assuming AppUser uses Set<Role> where Role is Enum or String
        // Let's check AppUser model first to be safe, but for now assuming Role enum
        // mapping
        // Simplification: default to USER or use provided roles

        java.util.Set<com.timemaster.timetableoptimizer.model.Role> roles = new java.util.HashSet<>();
        if (request.getRoles() != null) {
            request.getRoles().forEach(role -> {
                try {
                    roles.add(com.timemaster.timetableoptimizer.model.Role.valueOf(role.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // Ignore invalid roles or handle error
                }
            });
        }

        if (roles.isEmpty()) {
            roles.add(com.timemaster.timetableoptimizer.model.Role.STUDENT); // Default role
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
