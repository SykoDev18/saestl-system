package com.saestl_sistema.vm.service;

import com.saestl_sistema.vm.dto.TransaccionRequest;
import com.saestl_sistema.vm.dto.TransaccionResponse;
import com.saestl_sistema.vm.entity.Categoria;
import com.saestl_sistema.vm.entity.Transaccion;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.CategoriaRepository;
import com.saestl_sistema.vm.repository.TransaccionRepository;
import com.saestl_sistema.vm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final CategoriaRepository categoriaRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TransaccionResponse> findAll() {
        return transaccionRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TransaccionResponse create(TransaccionRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        String tipo = normalizeType(request.getType());
        Categoria categoria = resolveCategory(request.getCategory(), tipo);

        Transaccion transaccion = Transaccion.builder()
                .tipo(tipo)
                .monto(BigDecimal.valueOf(request.getAmount()))
                .descripcion(request.getDescription())
                .fecha(LocalDate.parse(request.getDate()))
                .categoria(categoria)
                .usuario(user)
                .estado(normalizeStatus(request.getStatus()))
                .metodoPago(normalizeMetodo(request.getMetodoPago()))
                .responsable(request.getResponsible())
                .build();

        return toResponse(transaccionRepository.save(transaccion));
    }

    @Transactional
    public TransaccionResponse update(Long id, TransaccionRequest request, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Transaccion transaccion = transaccionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaccion no encontrada"));

        String tipo = normalizeType(request.getType());
        Categoria categoria = resolveCategory(request.getCategory(), tipo);

        transaccion.setTipo(tipo);
        transaccion.setMonto(BigDecimal.valueOf(request.getAmount()));
        transaccion.setDescripcion(request.getDescription());
        transaccion.setFecha(LocalDate.parse(request.getDate()));
        transaccion.setCategoria(categoria);
        transaccion.setEstado(normalizeStatus(request.getStatus()));
        transaccion.setMetodoPago(normalizeMetodo(request.getMetodoPago()));
        transaccion.setResponsable(request.getResponsible());

        return toResponse(transaccionRepository.save(transaccion));
    }

    @Transactional
    public void delete(Long id, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));
        transaccionRepository.deleteById(id);
    }

    private Categoria resolveCategory(String nombre, String tipo) {
        return categoriaRepository.findByNombreAndTipo(nombre, tipo)
                .or(() -> categoriaRepository.findFirstByTipoAndActivoTrueOrderByIdAsc(tipo))
                .orElseThrow(() -> new IllegalArgumentException("No hay categoria disponible para tipo: " + tipo));
    }

    private String normalizeType(String type) {
        return "egreso".equalsIgnoreCase(type) ? "EGRESO" : "INGRESO";
    }

    private String normalizeStatus(String status) {
        if (status == null) {
            return "PENDIENTE";
        }
        return switch (status.toLowerCase()) {
            case "aprobado" -> "APROBADO";
            case "rechazado" -> "RECHAZADO";
            default -> "PENDIENTE";
        };
    }

    private String normalizeMetodo(String metodo) {
        if (metodo == null) {
            return "EFECTIVO";
        }
        return switch (metodo.toLowerCase()) {
            case "transferencia" -> "TRANSFERENCIA";
            case "tarjeta" -> "TARJETA";
            default -> "EFECTIVO";
        };
    }

    private TransaccionResponse toResponse(Transaccion transaccion) {
        return TransaccionResponse.builder()
                .id(String.valueOf(transaccion.getId()))
                .date(transaccion.getFecha().toString())
                .type("EGRESO".equalsIgnoreCase(transaccion.getTipo()) ? "egreso" : "ingreso")
                .category(transaccion.getCategoria() != null ? transaccion.getCategoria().getNombre() : "")
                .description(transaccion.getDescripcion())
                .responsible(transaccion.getResponsable())
                .amount(transaccion.getMonto())
                .status(transaccion.getEstado() != null ? transaccion.getEstado().toLowerCase() : "pendiente")
                .metodoPago(formatMetodoPago(transaccion.getMetodoPago()))
                .build();
    }

    private String formatMetodoPago(String metodoPago) {
        if (metodoPago == null) {
            return "Efectivo";
        }
        return switch (metodoPago.toUpperCase()) {
            case "TRANSFERENCIA" -> "Transferencia";
            case "TARJETA" -> "Tarjeta";
            default -> "Efectivo";
        };
    }
}