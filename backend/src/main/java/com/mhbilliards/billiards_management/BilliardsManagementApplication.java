package com.mhbilliards.billiards_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")
public class BilliardsManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(BilliardsManagementApplication.class, args);
	}

}
