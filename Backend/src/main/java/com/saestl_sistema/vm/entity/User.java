package com.saestl_sistema.vm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    @Builder.Default
    private String role = "USER";

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(length = 30)
    private String phone;

    @Column(name = "numero_cuenta", length = 50)
    private String numeroCuenta;

    @Column(length = 150)
    private String carrera;

    @Column(length = 20)
    private String semestre;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String theme = "dark";

    @Column(name = "accent_color", nullable = false, length = 7)
    @Builder.Default
    private String accentColor = "#8B1C23";

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String language = "es";

    @Column(name = "notif_email", nullable = false)
    @Builder.Default
    private Boolean notifEmail = true;

    @Column(name = "notif_push", nullable = false)
    @Builder.Default
    private Boolean notifPush = true;

    @Column(name = "notif_sms", nullable = false)
    @Builder.Default
    private Boolean notifSms = false;

    @Column(name = "notif_eventos", nullable = false)
    @Builder.Default
    private Boolean notifEventos = true;

    @Column(name = "notif_presupuestos", nullable = false)
    @Builder.Default
    private Boolean notifPresupuestos = true;

    @Column(name = "notif_transacciones", nullable = false)
    @Builder.Default
    private Boolean notifTransacciones = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
