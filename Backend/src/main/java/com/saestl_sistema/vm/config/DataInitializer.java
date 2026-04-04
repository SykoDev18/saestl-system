package com.saestl_sistema.vm.config;

import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .email("admin@uaeh.edu.mx")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Administrador SAESTL")
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            log.info(">>> Usuario admin creado: admin@uaeh.edu.mx / admin123");
        }
    }
}
