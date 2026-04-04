package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByActivoTrue();
    List<Evento> findByUsuarioId(Long usuarioId);
    List<Evento> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta);
    List<Evento> findByFechaAfterAndActivoTrue(LocalDateTime fecha);
}
