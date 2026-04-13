package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserConfigResponse {
    String token;
    String fullName;
    String email;
    String phone;
    String numeroCuenta;
    String carrera;
    String semestre;
    String bio;
    String role;
    String theme;
    String accentColor;
    String language;
    boolean notifEmail;
    boolean notifPush;
    boolean notifSms;
    boolean notifEventos;
    boolean notifPresupuestos;
    boolean notifTransacciones;
}