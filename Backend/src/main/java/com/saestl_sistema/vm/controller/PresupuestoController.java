package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.PresupuestoResponse;
import com.saestl_sistema.vm.service.PresupuestoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}