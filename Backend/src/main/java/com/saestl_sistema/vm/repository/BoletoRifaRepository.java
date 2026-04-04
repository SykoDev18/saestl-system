package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.BoletoRifa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoletoRifaRepository extends JpaRepository<BoletoRifa, Long> {
    List<BoletoRifa> findByRifaId(Long rifaId);
    List<BoletoRifa> findByRifaIdAndPagadoTrue(Long rifaId);
    Optional<BoletoRifa> findByRifaIdAndNumero(Long rifaId, Integer numero);
    long countByRifaId(Long rifaId);
    long countByRifaIdAndPagadoTrue(Long rifaId);
    Optional<BoletoRifa> findByRifaIdAndGanadorTrue(Long rifaId);
}
