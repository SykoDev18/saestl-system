package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {
    List<Presupuesto> findByMesAndAnio(Integer mes, Integer anio);
    List<Presupuesto> findByUsuarioIdAndAnio(Long usuarioId, Integer anio);
    List<Presupuesto> findByUsuarioId(Long usuarioId, Sort sort);
    Optional<Presupuesto> findByIdAndUsuarioId(Long id, Long usuarioId);
    Optional<Presupuesto> findByCategoriaIdAndMesAndAnioAndUsuarioId(Long categoriaId, Integer mes, Integer anio, Long usuarioId);
}
