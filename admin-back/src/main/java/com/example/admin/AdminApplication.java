package com.example.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import co.com.arena.real.config.FirebaseConfig;
import co.com.arena.real.config.FirestoreConfig;

@SpringBootApplication(
        scanBasePackages = {"com.example.admin", "co.com.arena.real"}
)
@EnableJpaRepositories("co.com.arena.real.infrastructure.repository")
@EntityScan("co.com.arena.real.domain.entity")
@Import({FirebaseConfig.class, FirestoreConfig.class})
public class AdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class, args);
    }
}
