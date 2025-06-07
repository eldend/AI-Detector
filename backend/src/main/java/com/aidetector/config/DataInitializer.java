package com.aidetector.config;

import com.aidetector.model.Event;
import com.aidetector.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EventRepository eventRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Autowired
    public DataInitializer(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) {
        // 샘플 데이터 생성
        createSampleEvents();
    }

    private void createSampleEvents() {
        Event event1 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-22 20:55", FORMATTER))
                .user("Joe Fam")
                .anomaly(0.72)
                .label("Anomaly")
                .event("Event1")
                .ipAddress("192.168.1.100")
                .location("/usr/bin/bash")
                .processId("1001")
                .description("Suspicious process execution")
                .resolved(false)
                .build();

        Event event2 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-21 19:35", FORMATTER))
                .user("JuserB")
                .anomaly(0.35)
                .label("Normal")
                .event("Event2")
                .ipAddress("192.168.1.101")
                .location("/usr/bin/python")
                .processId("1002")
                .description("Regular script execution")
                .resolved(true)
                .resolvedAt(LocalDateTime.now())
                .resolvedBy("Admin")
                .build();

        Event event3 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-19 21:32", FORMATTER))
                .user("John Aoe")
                .anomaly(0.42)
                .label("Normal")
                .event("Event3")
                .ipAddress("172.158.32.33")
                .location("bin/bash")
                .processId("1012303")
                .description("User login from an unusual location")
                .resolved(false)
                .build();

        Event event4 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-19 21:32", FORMATTER))
                .user("Joe Yun")
                .anomaly(0.91)
                .label("Anomaly")
                .event("Event4")
                .ipAddress("192.168.1.103")
                .location("/usr/bin/curl")
                .processId("1004")
                .description("Unauthorized data exfiltration attempt")
                .resolved(false)
                .build();

        Event event5 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-19 21:32", FORMATTER))
                .user("Tim Wan")
                .anomaly(0.83)
                .label("Anomaly")
                .event("Event5")
                .ipAddress("192.168.1.104")
                .location("/tmp/malicious")
                .processId("1005")
                .description("Execution of suspicious binary in temporary directory")
                .resolved(false)
                .build();

        Event event6 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-19 21:32", FORMATTER))
                .user("Tim Wan")
                .anomaly(0.83)
                .label("Anomaly")
                .event("Event6")
                .ipAddress("192.168.1.104")
                .location("/etc/passwd")
                .processId("1006")
                .description("Unauthorized access to system files")
                .resolved(false)
                .build();

        Event event7 = Event.builder()
                .timestamp(LocalDateTime.parse("2025-05-19 21:32", FORMATTER))
                .user("Tim Wan")
                .anomaly(0.83)
                .label("Anomaly")
                .event("Event7")
                .ipAddress("192.168.1.104")
                .location("/var/log")
                .processId("1007")
                .description("Log file tampering detected")
                .resolved(false)
                .build();

        eventRepository.save(event1);
        eventRepository.save(event2);
        eventRepository.save(event3);
        eventRepository.save(event4);
        eventRepository.save(event5);
        eventRepository.save(event6);
        eventRepository.save(event7);
    }
}

