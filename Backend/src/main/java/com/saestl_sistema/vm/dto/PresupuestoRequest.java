package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PresupuestoRequest {

    private String name;

    @NotBlank
    private String category;

    @NotNull
    @Positive
    private BigDecimal allocated;

    @NotNull
    @Min(1)
    @Max(12)
    private Integer mes;

    @NotNull
    @Min(2020)
    @Max(2100)
    private Integer anio;
}