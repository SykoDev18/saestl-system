package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.CuentaRequest;
import com.saestl_sistema.vm.dto.CuentaResponse;
import com.saestl_sistema.vm.service.CuentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
@RequiredArgsConstructor
public class CuentaController {

    private final CuentaService cuentaService;

    @GetMapping
    public ResponseEntity<List<CuentaResponse>> list() {
        return ResponseEntity.ok(cuentaService.findAll());
    }

    @PostMapping
    public ResponseEntity<CuentaResponse> create(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody @Valid CuentaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cuentaService.create(request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<CuentaResponse> markPaid(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long id) {
        return ResponseEntity.ok(cuentaService.markPaid(id, userDetails.getUsername()));
    }
}