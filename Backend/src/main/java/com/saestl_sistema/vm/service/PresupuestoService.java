package com.saestl_sistema.vm.service;

import com.saestl_sistema.vm.dto.PresupuestoResponse;
import com.saestl_sistema.vm.entity.Presupuesto;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.PresupuestoRepository;
import com.saestl_sistema.vm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PresupuestoResponse> findAll(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        int currentYear = LocalDate.now().getYear();

        List<Presupuesto> orderedBudgets = presupuestoRepository.findAll(Sort.by(
                Sort.Order.desc("anio"),
                Sort.Order.desc("mes"),
                Sort.Order.asc("id")
        ));

        List<Presupuesto> budgets = orderedBudgets.stream()
                .filter(presupuesto -> presupuesto.getUsuario() != null && user.getId().equals(presupuesto.getUsuario().getId()))
                .filter(presupuesto -> presupuesto.getAnio() == currentYear)
                .toList();

        if (budgets.isEmpty()) {
            budgets = orderedBudgets.stream()
                    .filter(presupuesto -> presupuesto.getUsuario() != null && user.getId().equals(presupuesto.getUsuario().getId()))
                    .toList();
        }

        return budgets.stream()
                .map(this::toResponse)
                .toList();
    }

    private PresupuestoResponse toResponse(Presupuesto presupuesto) {
        String categoryName = presupuesto.getCategoria() != null ? presupuesto.getCategoria().getNombre() : "Sin categoría";
        String periodLabel = String.format("%02d/%d", presupuesto.getMes(), presupuesto.getAnio());

        return PresupuestoResponse.builder()
                .id(String.valueOf(presupuesto.getId()))
                .name(categoryName + " / " + periodLabel)
                .allocated(presupuesto.getMontoLimite())
                .spent(java.math.BigDecimal.ZERO)
                .category(categoryName)
                .build();
    }
}