package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RifaRequest {

    @NotBlank
    private String name;

    private String description;

    private String prize;

    @NotNull
    @Min(1)
    private Double pricePerTicket;

    @NotNull
    @Min(1)
    private Integer totalTickets;

    @NotBlank
    private String drawDate;
}