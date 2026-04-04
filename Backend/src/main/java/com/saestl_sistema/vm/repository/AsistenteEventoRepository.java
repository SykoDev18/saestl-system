package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.AsistenteEvento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AsistenteEventoRepository extends JpaRepository<AsistenteEvento, Long> {
    List<AsistenteEvento> findByEventoId(Long eventoId);
    long countByEventoId(Long eventoId);
    long countByEventoIdAndPagoTrue(Long eventoId);
}
