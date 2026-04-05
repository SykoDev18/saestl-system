package com.saestl_sistema.vm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "eventos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(length = 300)
    private String lugar;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String tipo = "academico";

    @Column(name = "hora_fin", length = 5)
    private String horaFin;

    @Column(length = 300)
    private String direccion;

    @Column(name = "maps_link", length = 500)
    private String mapsLink;

    @Column(nullable = false)
    @Builder.Default
    private Integer registrados = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacidad = 0;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal presupuesto = BigDecimal.ZERO;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String estado = "proximo";

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal costo = BigDecimal.ZERO;

    @Column(name = "costo_por", length = 20)
    private String costoPor;

    @Column(name = "fecha_limite_registro")
    private LocalDate fechaLimiteRegistro;

    @Column(length = 200)
    private String organizador;

    @Column(columnDefinition = "TEXT")
    private String requisitos;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

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
