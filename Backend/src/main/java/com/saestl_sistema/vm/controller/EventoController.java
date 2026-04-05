package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.EventoRequest;
import com.saestl_sistema.vm.dto.EventoResponse;
import com.saestl_sistema.vm.service.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @GetMapping
    public ResponseEntity<List<EventoResponse>> list() {
        return ResponseEntity.ok(eventoService.findAll());
    }

    @PostMapping
    public ResponseEntity<EventoResponse> create(@AuthenticationPrincipal UserDetails userDetails,
                                                 @RequestBody @Valid EventoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventoService.create(request, userDetails.getUsername()));
    }
}