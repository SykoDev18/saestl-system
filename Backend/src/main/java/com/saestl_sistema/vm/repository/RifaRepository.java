package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.Rifa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RifaRepository extends JpaRepository<Rifa, Long> {
    List<Rifa> findByActivoTrue();
    List<Rifa> findByUsuarioId(Long usuarioId);
}
