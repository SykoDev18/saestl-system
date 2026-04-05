package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.TransaccionRequest;
import com.saestl_sistema.vm.dto.TransaccionResponse;
import com.saestl_sistema.vm.service.TransaccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
@RequiredArgsConstructor
public class TransaccionController {

    private final TransaccionService transaccionService;

    @GetMapping
    public ResponseEntity<List<TransaccionResponse>> list() {
        return ResponseEntity.ok(transaccionService.findAll());
    }

    @PostMapping
    public ResponseEntity<TransaccionResponse> create(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestBody @Valid TransaccionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transaccionService.create(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransaccionResponse> update(@AuthenticationPrincipal UserDetails userDetails,
                                                      @PathVariable Long id,
                                                      @RequestBody @Valid TransaccionRequest request) {
        return ResponseEntity.ok(transaccionService.update(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails userDetails,
                                       @PathVariable Long id) {
        transaccionService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}