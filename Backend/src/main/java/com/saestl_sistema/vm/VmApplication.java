package com.saestl_sistema.vm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.saestl_sistema.vm.repository")
public class VmApplication {

	public static void main(String[] args) {
		SpringApplication.run(VmApplication.class, args);
	}

}
