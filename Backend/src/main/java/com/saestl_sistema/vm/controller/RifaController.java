package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.RifaRequest;
import com.saestl_sistema.vm.dto.RifaResponse;
import com.saestl_sistema.vm.dto.RifaSellTicketsRequest;
import com.saestl_sistema.vm.service.RifaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rifas")
@RequiredArgsConstructor
public class RifaController {

    private final RifaService rifaService;

    @GetMapping
    public ResponseEntity<List<RifaResponse>> list() {
        return ResponseEntity.ok(rifaService.findAll());
    }

    @PostMapping
    public ResponseEntity<RifaResponse> create(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody @Valid RifaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rifaService.create(request, userDetails.getUsername()));
    }

    @PostMapping("/{rifaId}/vender")
    public ResponseEntity<RifaResponse> sellTickets(@AuthenticationPrincipal UserDetails userDetails,
                                                    @PathVariable Long rifaId,
                                                    @RequestBody @Valid RifaSellTicketsRequest request) {
        return ResponseEntity.ok(rifaService.sellTickets(rifaId, request, userDetails.getUsername()));
    }

    @PostMapping("/{rifaId}/sortear")
    public ResponseEntity<RifaResponse> drawWinner(@AuthenticationPrincipal UserDetails userDetails,
                                                   @PathVariable Long rifaId) {
        return ResponseEntity.ok(rifaService.drawWinner(rifaId, userDetails.getUsername()));
    }

    @PostMapping("/{rifaId}/cerrar")
    public ResponseEntity<RifaResponse> close(@AuthenticationPrincipal UserDetails userDetails,
                                              @PathVariable Long rifaId) {
        return ResponseEntity.ok(rifaService.setActive(rifaId, false, userDetails.getUsername()));
    }

    @PostMapping("/{rifaId}/abrir")
    public ResponseEntity<RifaResponse> reopen(@AuthenticationPrincipal UserDetails userDetails,
                                               @PathVariable Long rifaId) {
        return ResponseEntity.ok(rifaService.setActive(rifaId, true, userDetails.getUsername()));
    }
}