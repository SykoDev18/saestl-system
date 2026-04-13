package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.PresupuestoRequest;
import com.saestl_sistema.vm.dto.PresupuestoResponse;
import com.saestl_sistema.vm.service.PresupuestoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuestos")
@RequiredArgsConstructor
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<List<PresupuestoResponse>> list(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(presupuestoService.findAll(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<PresupuestoResponse> create(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestBody @Valid PresupuestoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(presupuestoService.create(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PresupuestoResponse> update(@AuthenticationPrincipal UserDetails userDetails,
                                                      @PathVariable Long id,
                                                      @RequestBody @Valid PresupuestoRequest request) {
        return ResponseEntity.ok(presupuestoService.update(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable Long id) {
        presupuestoService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}