package com.aidetector.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "username", nullable = false)
    private String user;

    @Column(nullable = false)
    private Double anomaly;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String event;

    @Column
    private String ipAddress;

    @Column
    private String location;

    @Column
    private String processId;

    @Column(length = 1000)
    private String description;

    @Column
    private Boolean resolved;

    @Column
    private LocalDateTime resolvedAt;

    @Column
    private String resolvedBy;
}

