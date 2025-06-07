package com.aidetector.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDetailDTO {
    private Long id;
    private String date;
    private Double anomalyScore;
    private String incident;
    private Map<String, String> rowData;
}

