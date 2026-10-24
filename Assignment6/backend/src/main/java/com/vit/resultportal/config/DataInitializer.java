package com.vit.resultportal.config;

import com.vit.resultportal.model.Role;
import com.vit.resultportal.model.User;
import com.vit.resultportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner createDefaultUsers(UserRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (!repository.existsByUsername("admin")) {
                repository.save(new User("admin", encoder.encode("admin123"), Role.ADMIN));
            }
            if (!repository.existsByUsername("student")) {
                repository.save(new User("student", encoder.encode("student123"), Role.STUDENT));
            }
        };
    }
}
