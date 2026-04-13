package com.saestl_sistema.vm.controller;

import com.saestl_sistema.vm.dto.ChangePasswordRequest;
import com.saestl_sistema.vm.dto.UpdatePreferencesRequest;
import com.saestl_sistema.vm.dto.UpdateProfileRequest;
import com.saestl_sistema.vm.dto.UserConfigResponse;
import com.saestl_sistema.vm.service.ConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
@RequiredArgsConstructor
public class ConfigController {

    private final ConfigService configService;

    @GetMapping
    public ResponseEntity<UserConfigResponse> get(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(configService.getCurrentConfig(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserConfigResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                            @RequestBody @Valid UpdateProfileRequest request) {
        return ResponseEntity.ok(configService.updateProfile(userDetails.getUsername(), request));
    }

    @PutMapping("/preferences")
    public ResponseEntity<UserConfigResponse> updatePreferences(@AuthenticationPrincipal UserDetails userDetails,
                                                                @RequestBody @Valid UpdatePreferencesRequest request) {
        return ResponseEntity.ok(configService.updatePreferences(userDetails.getUsername(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody @Valid ChangePasswordRequest request) {
        configService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.noContent().build();
    }
}