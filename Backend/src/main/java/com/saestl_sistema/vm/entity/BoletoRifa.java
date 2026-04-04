package com.saestl_sistema.vm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "boletos_rifa",
       uniqueConstraints = @UniqueConstraint(columnNames = {"rifa_id", "numero"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoletoRifa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rifa_id", nullable = false)
    private Rifa rifa;

    @Column(nullable = false)
    private Integer numero;

    @Column(name = "comprador_nombre", length = 200)
    private String compradorNombre;

    @Column(name = "comprador_contacto", length = 255)
    private String compradorContacto;

    @Column(nullable = false)
    @Builder.Default
    private Boolean pagado = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ganador = false;

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
