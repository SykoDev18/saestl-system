package com.saestl_sistema.vm.service;

import com.saestl_sistema.vm.dto.PresupuestoGastoResponse;
import com.saestl_sistema.vm.dto.PresupuestoRequest;
import com.saestl_sistema.vm.dto.PresupuestoResponse;
import com.saestl_sistema.vm.entity.Categoria;
import com.saestl_sistema.vm.entity.Presupuesto;
import com.saestl_sistema.vm.entity.Transaccion;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.CategoriaRepository;
import com.saestl_sistema.vm.repository.PresupuestoRepository;
import com.saestl_sistema.vm.repository.TransaccionRepository;
import com.saestl_sistema.vm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
        private final CategoriaRepository categoriaRepository;
        private final TransaccionRepository transaccionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<PresupuestoResponse> findAll(String userEmail) {
                User user = resolveUser(userEmail);

                return presupuestoRepository.findByUsuarioId(user.getId(), Sort.by(
                Sort.Order.desc("anio"),
                Sort.Order.desc("mes"),
                                Sort.Order.asc("nombre")
                )).stream()
                                .map(presupuesto -> toResponse(presupuesto, user.getId()))
                .toList();
    }

        @Transactional
        public PresupuestoResponse create(PresupuestoRequest request, String userEmail) {
                User user = resolveUser(userEmail);
                Categoria categoria = resolveCategory(request.getCategory());
                validateUniquePeriod(null, categoria.getId(), request.getMes(), request.getAnio(), user.getId());

                Presupuesto presupuesto = Presupuesto.builder()
                                .nombre(resolveBudgetName(request, categoria))
                                .categoria(categoria)
                                .mes(request.getMes())
                                .anio(request.getAnio())
                                .montoLimite(request.getAllocated())
                                .usuario(user)
                                .build();

                return toResponse(presupuestoRepository.save(presupuesto), user.getId());
        }

        @Transactional
        public PresupuestoResponse update(Long id, PresupuestoRequest request, String userEmail) {
                User user = resolveUser(userEmail);
                Presupuesto presupuesto = findOwnedBudget(id, user.getId());
                Categoria categoria = resolveCategory(request.getCategory());
                validateUniquePeriod(id, categoria.getId(), request.getMes(), request.getAnio(), user.getId());

                presupuesto.setNombre(resolveBudgetName(request, categoria));
                presupuesto.setCategoria(categoria);
                presupuesto.setMes(request.getMes());
                presupuesto.setAnio(request.getAnio());
                presupuesto.setMontoLimite(request.getAllocated());

                return toResponse(presupuestoRepository.save(presupuesto), user.getId());
        }

        @Transactional
        public void delete(Long id, String userEmail) {
                User user = resolveUser(userEmail);
                presupuestoRepository.delete(findOwnedBudget(id, user.getId()));
        }

        private User resolveUser(String userEmail) {
                return userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));
        }

        private Presupuesto findOwnedBudget(Long id, Long userId) {
                return presupuestoRepository.findByIdAndUsuarioId(id, userId)
                                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));
        }

        private Categoria resolveCategory(String categoryName) {
                return categoriaRepository.findFirstByNombreAndActivoTrueOrderByIdAsc(categoryName)
                                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada: " + categoryName));
        }

        private void validateUniquePeriod(Long currentId, Long categoriaId, Integer mes, Integer anio, Long userId) {
                presupuestoRepository.findByCategoriaIdAndMesAndAnioAndUsuarioId(categoriaId, mes, anio, userId)
                                .filter(existing -> currentId == null || !existing.getId().equals(currentId))
                                .ifPresent(existing -> {
                                        throw new IllegalArgumentException("Ya existe un presupuesto para esa categoría y periodo");
                                });
        }

        private String resolveBudgetName(PresupuestoRequest request, Categoria categoria) {
                if (StringUtils.hasText(request.getName())) {
                        return request.getName().trim();
                }
                return categoria.getNombre();
        }

        private PresupuestoResponse toResponse(Presupuesto presupuesto, Long userId) {
                String categoryName = presupuesto.getCategoria() != null ? presupuesto.getCategoria().getNombre() : "Sin categoría";
                List<PresupuestoGastoResponse> gastos = loadGastos(presupuesto, userId);
                BigDecimal spent = gastos.stream()
                                .map(PresupuestoGastoResponse::getMonto)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return PresupuestoResponse.builder()
                .id(String.valueOf(presupuesto.getId()))
                                .name(presupuesto.getNombre())
                .allocated(presupuesto.getMontoLimite())
                                .spent(spent)
                .category(categoryName)
                                .mes(presupuesto.getMes())
                                .anio(presupuesto.getAnio())
                                .gastos(gastos)
                .build();
    }

        private List<PresupuestoGastoResponse> loadGastos(Presupuesto presupuesto, Long userId) {
                if (presupuesto.getCategoria() == null) {
                        return List.of();
                }

                LocalDate desde = LocalDate.of(presupuesto.getAnio(), presupuesto.getMes(), 1);
                LocalDate hasta = desde.withDayOfMonth(desde.lengthOfMonth());

                return transaccionRepository
                                .findByUsuarioIdAndCategoriaIdAndFechaBetweenAndEstadoNotOrderByFechaAscCreatedAtAsc(
                                                userId,
                                                presupuesto.getCategoria().getId(),
                                                desde,
                                                hasta,
                                                "RECHAZADO"
                                )
                                .stream()
                                .map(this::toGastoResponse)
                                .toList();
        }

        private PresupuestoGastoResponse toGastoResponse(Transaccion transaccion) {
                return PresupuestoGastoResponse.builder()
                                .id(String.valueOf(transaccion.getId()))
                                .monto(transaccion.getMonto())
                                .descripcion(transaccion.getDescripcion())
                                .fecha(transaccion.getFecha().toString())
                                .createdAt(transaccion.getCreatedAt().toString())
                                .build();
        }
}