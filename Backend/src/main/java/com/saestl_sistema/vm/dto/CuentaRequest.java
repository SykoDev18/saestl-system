package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CuentaRequest {

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private Double amount;

    @NotBlank
    private String dueDate;

    @NotBlank
    private String supplier;

    @NotBlank
    private String category;
}