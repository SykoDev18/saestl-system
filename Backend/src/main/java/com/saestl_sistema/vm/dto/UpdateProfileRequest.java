package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    private String phone;
    private String numeroCuenta;
    private String carrera;
    private String semestre;
    private String bio;
}