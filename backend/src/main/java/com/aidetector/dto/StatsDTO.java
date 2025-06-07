package com.aidetector.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsDTO {
    private Long totalEvents;
    private Long anomalies;
    private Double avgAnomaly;
    private Double highestScore;
}

