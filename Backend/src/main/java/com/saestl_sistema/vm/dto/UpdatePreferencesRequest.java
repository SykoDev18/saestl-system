package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePreferencesRequest {
    @NotBlank
    private String theme;

    @NotBlank
    private String accentColor;

    @NotBlank
    private String language;

    @NotNull
    private Boolean notifEmail;

    @NotNull
    private Boolean notifPush;

    @NotNull
    private Boolean notifSms;

    @NotNull
    private Boolean notifEventos;

    @NotNull
    private Boolean notifPresupuestos;

    @NotNull
    private Boolean notifTransacciones;
}