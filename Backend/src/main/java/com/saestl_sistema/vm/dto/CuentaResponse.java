package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class CuentaResponse {
    String id;
    String description;
    BigDecimal amount;
    String dueDate;
    String status;
    String supplier;
    String category;
}