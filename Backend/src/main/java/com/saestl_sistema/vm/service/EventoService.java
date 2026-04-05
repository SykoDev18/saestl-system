package com.saestl_sistema.vm.service;
// eeee joshis 
// se agrego para poder guardar eventos, se puede eliminar 
// si me da tiempo hago el de actualizar eventos, pero por ahora con esto ya se pueden crear eventos desde el frontend y se guardan en la base de datos, lo que no se hizo fue agregar validaciones ni nada, solo lo basico para que funcione y la profa moni se emocione
import com.saestl_sistema.vm.dto.EventoRequest;
import com.saestl_sistema.vm.dto.EventoResponse;
import com.saestl_sistema.vm.entity.Evento;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.EventoRepository;
import com.saestl_sistema.vm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EventoService {
// se agrego para poder guardar eventos, se puede eliminar 
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private final EventoRepository eventoRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EventoResponse> findAll() {
        return eventoRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EventoResponse create(EventoRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Evento evento = Evento.builder()
                .nombre(request.getName())
                .descripcion(request.getDescription())
                .fecha(parseDateTime(request.getDate(), request.getTime()))
                .lugar(request.getLocation())
                .tipo(defaultString(request.getType(), "academico"))
                .horaFin(normalizeTime(request.getEndTime()))
                .direccion(request.getAddress())
                .mapsLink(request.getMapsLink())
                .registrados(defaultInteger(request.getRegistered(), 0))
                .capacidad(defaultInteger(request.getCapacity(), 0))
                .presupuesto(defaultBigDecimal(request.getBudget()))
                .estado(defaultString(request.getStatus(), "proximo"))
                .costo(defaultBigDecimal(request.getCost()))
                .costoPor(request.getCostPer())
                .fechaLimiteRegistro(parseDate(request.getRegistrationDeadline()))
                .organizador(request.getOrganizer())
                .requisitos(joinLines(request.getRequirements()))
                .notas(request.getNotes())
                .activo(!"cancelado".equalsIgnoreCase(defaultString(request.getStatus(), "proximo")))
                .usuario(user)
                .build();

        return toResponse(eventoRepository.save(evento));
    }

    private EventoResponse toResponse(Evento evento) {
        return EventoResponse.builder()
                .id(String.valueOf(evento.getId()))
                .name(evento.getNombre())
                .description(evento.getDescripcion())
                .date(evento.getFecha() != null ? evento.getFecha().toLocalDate().toString() : null)
                .time(evento.getFecha() != null ? evento.getFecha().toLocalTime().format(TIME_FORMATTER) : null)
                .endTime(evento.getHoraFin())
                .location(evento.getLugar())
                .address(evento.getDireccion())
                .mapsLink(evento.getMapsLink())
                .type(evento.getTipo())
                .registered(evento.getRegistrados())
                .capacity(evento.getCapacidad())
                .budget(evento.getPresupuesto())
                .status(evento.getEstado())
                .cost(evento.getCosto())
                .costPer(evento.getCostoPor())
                .registrationDeadline(evento.getFechaLimiteRegistro() != null ? evento.getFechaLimiteRegistro().toString() : null)
                .organizer(evento.getOrganizador())
                .requirements(splitLines(evento.getRequisitos()))
                .notes(evento.getNotas())
                .build();
    }

    private LocalDateTime parseDateTime(String date, String time) {
        return LocalDateTime.of(LocalDate.parse(date), LocalTime.parse(time));
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) {
            return null;
        }

        return LocalDate.parse(date);
    }

    private String normalizeTime(String time) {
        if (time == null || time.isBlank()) {
            return null;
        }

        return LocalTime.parse(time).format(TIME_FORMATTER);
    }

    private String defaultString(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private Integer defaultInteger(Integer value, Integer fallback) {
        return value == null ? fallback : value;
    }

    private BigDecimal defaultBigDecimal(Double value) {
        return value == null ? BigDecimal.ZERO : BigDecimal.valueOf(value);
    }

    private String joinLines(List<String> lines) {
        if (lines == null || lines.isEmpty()) {
            return null;
        }

        return lines.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .reduce((left, right) -> left + "\n" + right)
                .orElse(null);
    }

    private List<String> splitLines(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }

        return value.lines().filter(line -> !line.isBlank()).toList();
    }
}