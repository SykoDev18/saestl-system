package com.saestl_sistema.vm.service;

import com.saestl_sistema.vm.dto.ChangePasswordRequest;
import com.saestl_sistema.vm.dto.UpdatePreferencesRequest;
import com.saestl_sistema.vm.dto.UpdateProfileRequest;
import com.saestl_sistema.vm.dto.UserConfigResponse;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.UserRepository;
import com.saestl_sistema.vm.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ConfigService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public UserConfigResponse getCurrentConfig(String userEmail) {
        return toResponse(resolveUser(userEmail), null);
    }

    @Transactional
    public UserConfigResponse updateProfile(String userEmail, UpdateProfileRequest request) {
        User user = resolveUser(userEmail);
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (!user.getEmail().equalsIgnoreCase(normalizedEmail) && userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setPhone(normalizeOptional(request.getPhone()));
        user.setNumeroCuenta(normalizeOptional(request.getNumeroCuenta()));
        user.setCarrera(normalizeOptional(request.getCarrera()));
        user.setSemestre(normalizeOptional(request.getSemestre()));
        user.setBio(normalizeOptional(request.getBio()));

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole());
        return toResponse(saved, token);
    }

    @Transactional
    public UserConfigResponse updatePreferences(String userEmail, UpdatePreferencesRequest request) {
        User user = resolveUser(userEmail);
        user.setTheme(request.getTheme().trim().toLowerCase());
        user.setAccentColor(request.getAccentColor().trim());
        user.setLanguage(request.getLanguage().trim().toLowerCase());
        user.setNotifEmail(request.getNotifEmail());
        user.setNotifPush(request.getNotifPush());
        user.setNotifSms(request.getNotifSms());
        user.setNotifEventos(request.getNotifEventos());
        user.setNotifPresupuestos(request.getNotifPresupuestos());
        user.setNotifTransacciones(request.getNotifTransacciones());

        return toResponse(userRepository.save(user), null);
    }

    @Transactional
    public void changePassword(String userEmail, ChangePasswordRequest request) {
        User user = resolveUser(userEmail);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("La nueva contraseña debe ser diferente");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User resolveUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private UserConfigResponse toResponse(User user, String token) {
        return UserConfigResponse.builder()
                .token(token)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .numeroCuenta(user.getNumeroCuenta())
                .carrera(user.getCarrera())
                .semestre(user.getSemestre())
                .bio(user.getBio())
                .role(user.getRole())
                .theme(user.getTheme())
                .accentColor(user.getAccentColor())
                .language(user.getLanguage())
                .notifEmail(Boolean.TRUE.equals(user.getNotifEmail()))
                .notifPush(Boolean.TRUE.equals(user.getNotifPush()))
                .notifSms(Boolean.TRUE.equals(user.getNotifSms()))
                .notifEventos(Boolean.TRUE.equals(user.getNotifEventos()))
                .notifPresupuestos(Boolean.TRUE.equals(user.getNotifPresupuestos()))
                .notifTransacciones(Boolean.TRUE.equals(user.getNotifTransacciones()))
                .build();
    }
}