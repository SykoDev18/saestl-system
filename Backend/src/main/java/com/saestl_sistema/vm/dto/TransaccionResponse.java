package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class TransaccionResponse {
    String id;
    String date;
    String type;
    String category;
    String description;
    String responsible;
    BigDecimal amount;
    String status;
    String metodoPago;
}