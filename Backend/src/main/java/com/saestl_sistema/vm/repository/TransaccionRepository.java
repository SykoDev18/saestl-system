package com.saestl_sistema.vm.repository;

import com.saestl_sistema.vm.entity.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByTipo(String tipo);
    List<Transaccion> findByUsuarioId(Long usuarioId);
    List<Transaccion> findByCategoriaId(Long categoriaId);
    List<Transaccion> findByFechaBetween(LocalDate desde, LocalDate hasta);
    List<Transaccion> findByTipoAndFechaBetween(String tipo, LocalDate desde, LocalDate hasta);

    @Query("SELECT COALESCE(SUM(t.monto), 0) FROM Transaccion t WHERE t.tipo = :tipo AND t.fecha BETWEEN :desde AND :hasta")
    BigDecimal sumMontoByTipoAndFechaBetween(@Param("tipo") String tipo,
                                             @Param("desde") LocalDate desde,
                                             @Param("hasta") LocalDate hasta);
}
