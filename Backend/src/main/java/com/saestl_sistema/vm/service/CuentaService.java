package com.saestl_sistema.vm.service;

import com.saestl_sistema.vm.dto.CuentaRequest;
import com.saestl_sistema.vm.dto.CuentaResponse;
import com.saestl_sistema.vm.entity.Cuenta;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.CuentaRepository;
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
public class CuentaService {

    private final CuentaRepository cuentaRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CuentaResponse> findAll() {
        return cuentaRepository.findAll(Sort.by(Sort.Direction.ASC, "fechaLimite"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CuentaResponse create(CuentaRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Cuenta cuenta = Cuenta.builder()
                .descripcion(request.getDescription())
                .monto(BigDecimal.valueOf(request.getAmount()))
                .fechaLimite(LocalDate.parse(request.getDueDate()))
                .estado("PENDIENTE")
                .proveedor(request.getSupplier())
                .categoria(request.getCategory())
                .usuario(user)
                .build();

        return toResponse(cuentaRepository.save(cuenta));
    }

    @Transactional
    public CuentaResponse markPaid(Long id, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));
        cuenta.setEstado("PAGADO");

        return toResponse(cuentaRepository.save(cuenta));
    }

    private CuentaResponse toResponse(Cuenta cuenta) {
        return CuentaResponse.builder()
                .id(String.valueOf(cuenta.getId()))
                .description(cuenta.getDescripcion())
                .amount(cuenta.getMonto())
                .dueDate(cuenta.getFechaLimite().toString())
                .status(cuenta.getEstado().toLowerCase())
                .supplier(cuenta.getProveedor())
                .category(cuenta.getCategoria())
                .build();
    }
}