package com.saestl_sistema.vm.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
@Builder
public class EventoResponse {
    String id;
    String name;
    String description;
    String date;
    String time;
    String endTime;
    String location;
    String address;
    String mapsLink;
    String type;
    Integer registered;
    Integer capacity;
    BigDecimal budget;
    String status;
    BigDecimal cost;
    String costPer;
    String registrationDeadline;
    String organizer;
    List<String> requirements;
    String notes;
}