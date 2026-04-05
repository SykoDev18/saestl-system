package com.saestl_sistema.vm.service;

import com.saestl_sistema.vm.dto.RifaRequest;
import com.saestl_sistema.vm.dto.RifaResponse;
import com.saestl_sistema.vm.dto.RifaSellTicketsRequest;
import com.saestl_sistema.vm.entity.BoletoRifa;
import com.saestl_sistema.vm.entity.Rifa;
import com.saestl_sistema.vm.entity.User;
import com.saestl_sistema.vm.repository.BoletoRifaRepository;
import com.saestl_sistema.vm.repository.RifaRepository;
import com.saestl_sistema.vm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class RifaService {

    private final RifaRepository rifaRepository;
    private final BoletoRifaRepository boletoRifaRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RifaResponse> findAll() {
        return rifaRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RifaResponse create(RifaRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Rifa rifa = Rifa.builder()
                .nombre(request.getName())
                .descripcion(defaultDescription(request.getDescription(), request.getPrize()))
                .precioBoleto(BigDecimal.valueOf(request.getPricePerTicket()))
                .fechaSorteo(LocalDate.parse(request.getDrawDate()).atTime(12, 0))
                .activo(true)
                .usuario(user)
                .build();

        Rifa savedRifa = rifaRepository.save(rifa);

        List<BoletoRifa> boletos = new ArrayList<>();
        for (int i = 1; i <= request.getTotalTickets(); i++) {
            boletos.add(BoletoRifa.builder()
                    .rifa(savedRifa)
                    .numero(i)
                    .pagado(false)
                    .ganador(false)
                    .build());
        }
        boletoRifaRepository.saveAll(boletos);

        return toResponse(savedRifa);
    }

    @Transactional
    public RifaResponse sellTickets(Long rifaId, RifaSellTicketsRequest request, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Rifa rifa = rifaRepository.findById(rifaId)
                .orElseThrow(() -> new IllegalArgumentException("Rifa no encontrada"));

        List<BoletoRifa> boletos = new ArrayList<>();
        for (Integer ticketNumber : request.getTicketNumbers()) {
            BoletoRifa ticket = boletoRifaRepository.findByRifaIdAndNumero(rifaId, ticketNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Boleto no encontrado: " + ticketNumber));

            if (isSold(ticket)) {
                throw new IllegalArgumentException("El boleto ya fue vendido: " + ticketNumber);
            }

            ticket.setCompradorNombre(request.getBuyerName());
            ticket.setCompradorContacto(buildContact(request.getBuyerPhone(), request.getBuyerEmail()));
            ticket.setPagado(Boolean.TRUE.equals(request.getPaid()));
            boletos.add(ticket);
        }

        boletoRifaRepository.saveAll(boletos);
        return toResponse(rifa);
    }

    @Transactional
    public RifaResponse drawWinner(Long rifaId, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Rifa rifa = rifaRepository.findById(rifaId)
                .orElseThrow(() -> new IllegalArgumentException("Rifa no encontrada"));

        List<BoletoRifa> boletos = boletoRifaRepository.findByRifaId(rifaId);
        List<BoletoRifa> soldTickets = boletos.stream().filter(this::isSold).toList();

        if (soldTickets.isEmpty()) {
            throw new IllegalArgumentException("No hay boletos vendidos para realizar el sorteo");
        }

        boletos.forEach(ticket -> ticket.setGanador(false));
        BoletoRifa winnerTicket = soldTickets.get(ThreadLocalRandom.current().nextInt(soldTickets.size()));
        winnerTicket.setGanador(true);

        rifa.setActivo(false);

        boletoRifaRepository.saveAll(boletos);
        rifaRepository.save(rifa);

        return toResponse(rifa);
    }

    @Transactional
    public RifaResponse setActive(Long rifaId, boolean active, String userEmail) {
        userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + userEmail));

        Rifa rifa = rifaRepository.findById(rifaId)
                .orElseThrow(() -> new IllegalArgumentException("Rifa no encontrada"));

        rifa.setActivo(active);
        rifaRepository.save(rifa);

        return toResponse(rifa);
    }

    private RifaResponse toResponse(Rifa rifa) {
        List<BoletoRifa> boletos = boletoRifaRepository.findByRifaId(rifa.getId())
                .stream()
                .sorted(Comparator.comparing(BoletoRifa::getNumero))
                .toList();

        int soldTickets = (int) boletos.stream().filter(this::isSold).count();
        BoletoRifa winnerTicket = boletos.stream().filter(BoletoRifa::getGanador).findFirst().orElse(null);

        RifaResponse.Winner winner = winnerTicket == null ? null : RifaResponse.Winner.builder()
                .name(winnerTicket.getCompradorNombre())
            .phone(extractPhone(winnerTicket.getCompradorContacto()))
                .ticket(winnerTicket.getNumero())
                .build();

        String status = winnerTicket != null ? "sorteada" : (Boolean.TRUE.equals(rifa.getActivo()) ? "activa" : "cerrada");

        List<RifaResponse.Ticket> tickets = boletos.stream()
                .map(ticket -> RifaResponse.Ticket.builder()
                        .number(ticket.getNumero())
                        .sold(isSold(ticket))
                        .buyerName(ticket.getCompradorNombre())
                    .buyerPhone(extractPhone(ticket.getCompradorContacto()))
                    .buyerEmail(extractEmail(ticket.getCompradorContacto()))
                        .soldBy(null)
                        .soldDate(ticket.getCreatedAt() != null ? ticket.getCreatedAt().toLocalDate().toString() : null)
                        .paid(Boolean.TRUE.equals(ticket.getPagado()))
                        .build())
                .toList();

        return RifaResponse.builder()
                .id(String.valueOf(rifa.getId()))
                .name(rifa.getNombre())
                .description(rifa.getDescripcion())
                .prize(rifa.getDescripcion())
                .pricePerTicket(rifa.getPrecioBoleto())
                .totalTickets(boletos.size())
                .soldTickets(soldTickets)
                .startDate(rifa.getCreatedAt() != null ? rifa.getCreatedAt().toLocalDate().toString() : null)
                .endDate(rifa.getFechaSorteo() != null ? rifa.getFechaSorteo().toLocalDate().toString() : null)
                .drawDate(rifa.getFechaSorteo() != null ? rifa.getFechaSorteo().toLocalDate().toString() : null)
                .status(status)
                .createdBy(rifa.getUsuario() != null ? rifa.getUsuario().getFullName() : null)
                .winner(winner)
                .tickets(tickets)
                .build();
    }

    private boolean isSold(BoletoRifa ticket) {
        return ticket.getCompradorNombre() != null && !ticket.getCompradorNombre().isBlank();
    }

    private String defaultDescription(String description, String prize) {
        if (description != null && !description.isBlank()) {
            return description;
        }

        if (prize != null && !prize.isBlank()) {
            return prize;
        }

        return "Rifa";
    }

    private String buildContact(String phone, String email) {
        String normalizedPhone = phone == null ? "" : phone.trim();
        String normalizedEmail = email == null ? "" : email.trim();

        if (!normalizedPhone.isEmpty() && !normalizedEmail.isEmpty()) {
            return normalizedPhone + " | " + normalizedEmail;
        }

        if (!normalizedPhone.isEmpty()) {
            return normalizedPhone;
        }

        return normalizedEmail.isEmpty() ? null : normalizedEmail;
    }

    private String extractPhone(String contact) {
        if (contact == null || contact.isBlank()) {
            return null;
        }

        String[] parts = contact.split("\\|", 2);
        String first = parts[0].trim();
        if (first.contains("@")) {
            return null;
        }
        return first;
    }

    private String extractEmail(String contact) {
        if (contact == null || contact.isBlank()) {
            return null;
        }

        String[] parts = contact.split("\\|", 2);
        if (parts.length == 2) {
            return parts[1].trim();
        }

        String first = parts[0].trim();
        return first.contains("@") ? first : null;
    }
}