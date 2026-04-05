package com.saestl_sistema.vm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class EventoRequest {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String date;

    @NotBlank
    private String time;

    private String endTime;

    @NotBlank
    private String location;

    private String address;
    private String mapsLink;
    private String type;
    private Integer registered;
    private Integer capacity;
    private Double budget;
    private String status;
    private Double cost;
    private String costPer;
    private String registrationDeadline;
    private String organizer;
    private List<String> requirements;
    private String notes;
}