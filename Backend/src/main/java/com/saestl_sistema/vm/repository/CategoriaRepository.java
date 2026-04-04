package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByTipo(String tipo);
    List<Categoria> findByActivoTrue();
    List<Categoria> findByTipoAndActivoTrue(String tipo);
}
