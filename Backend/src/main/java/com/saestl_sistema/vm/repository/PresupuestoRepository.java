package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {
    List<Presupuesto> findByMesAndAnio(Integer mes, Integer anio);
    List<Presupuesto> findByUsuarioIdAndAnio(Long usuarioId, Integer anio);
    Optional<Presupuesto> findByCategoriaIdAndMesAndAnioAndUsuarioId(Long categoriaId, Integer mes, Integer anio, Long usuarioId);
}
