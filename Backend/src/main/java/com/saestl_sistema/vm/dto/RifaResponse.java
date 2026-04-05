package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
@Builder
public class RifaResponse {
    String id;
    String name;
    String description;
    String prize;
    BigDecimal pricePerTicket;
    Integer totalTickets;
    Integer soldTickets;
    String startDate;
    String endDate;
    String drawDate;
    String status;
    String createdBy;
    Winner winner;
    List<Ticket> tickets;

    @Value
    @Builder
    public static class Winner {
        String name;
        String phone;
        Integer ticket;
    }

    @Value
    @Builder
    public static class Ticket {
        Integer number;
        boolean sold;
        String buyerName;
        String buyerPhone;
        String buyerEmail;
        String soldBy;
        String soldDate;
        boolean paid;
    }
}