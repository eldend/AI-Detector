package com.aidetector.service;

import com.aidetector.dto.EventDTO;
import com.aidetector.dto.EventDetailDTO;
import com.aidetector.dto.StatsDTO;
import com.aidetector.model.Event;
import com.aidetector.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public EventDetailDTO getEventDetail(Long id) {
        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            Map<String, String> rowData = new HashMap<>();
            rowData.put("ip_address", event.getIpAddress() != null ? event.getIpAddress() : "");
            rowData.put("user", event.getUser());
            rowData.put("number", event.getProcessId() != null ? event.getProcessId() : "");
            rowData.put("location", event.getLocation() != null ? event.getLocation() : "");

            return EventDetailDTO.builder()
                    .id(event.getId())
                    .date(event.getTimestamp().format(DATE_FORMATTER))
                    .anomalyScore(event.getAnomaly())
                    .incident(event.getDescription() != null ? event.getDescription() : "Unknown incident")
                    .rowData(rowData)
                    .build();
        }
        return null;
    }

    public StatsDTO getStats() {
        long totalEvents = eventRepository.count();
        long anomalies = eventRepository.countAnomalies();
        double avgAnomaly = eventRepository.getAverageAnomaly() != null ? eventRepository.getAverageAnomaly() : 0.0;
        double highestScore = eventRepository.getMaxAnomaly() != null ? eventRepository.getMaxAnomaly() : 0.0;

        return StatsDTO.builder()
                .totalEvents(totalEvents)
                .anomalies(anomalies)
                .avgAnomaly(Math.round(avgAnomaly * 100.0) / 100.0)
                .highestScore(Math.round(highestScore * 100.0) / 100.0)
                .build();
    }

    private EventDTO convertToDTO(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .timestamp(event.getTimestamp().format(FORMATTER))
                .user(event.getUser())
                .anomaly(event.getAnomaly())
                .label(event.getLabel())
                .event(event.getEvent())
                .build();
    }
}

