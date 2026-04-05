package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class RifaSellTicketsRequest {

    @NotEmpty
    private List<Integer> ticketNumbers;

    @NotBlank
    private String buyerName;

    private String buyerPhone;
    private String buyerEmail;
    private Boolean paid;
}