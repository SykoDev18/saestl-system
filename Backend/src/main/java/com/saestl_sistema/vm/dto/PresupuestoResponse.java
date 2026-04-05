package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class PresupuestoResponse {
    String id;
    String name;
    BigDecimal allocated;
    BigDecimal spent;
    String category;
}