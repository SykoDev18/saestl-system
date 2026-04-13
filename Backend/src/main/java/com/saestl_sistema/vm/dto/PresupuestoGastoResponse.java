package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class PresupuestoGastoResponse {
    String id;
    BigDecimal monto;
    String descripcion;
    String fecha;
    String createdAt;
}