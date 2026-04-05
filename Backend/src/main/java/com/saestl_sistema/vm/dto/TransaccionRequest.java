package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TransaccionRequest {

    @NotBlank
    private String date;

    @NotBlank
    private String type;

    @NotBlank
    private String category;

    @NotBlank
    private String description;

    private String responsible;

    @NotNull
    @Positive
    private Double amount;

    @NotBlank
    private String status;

    @NotBlank
    private String metodoPago;
}