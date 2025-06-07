# 백엔드 개발 가이드

이 문서는 AI 악성프로세스 탐지 시스템의 백엔드 부분에 대한 상세한 개발 가이드를 제공합니다.

## 목차

1. [기술 스택](#기술-스택)
2. [디렉토리 구조](#디렉토리-구조)
3. [주요 컴포넌트](#주요-컴포넌트)
4. [데이터베이스 설정](#데이터베이스-설정)
5. [API 엔드포인트](#api-엔드포인트)
6. [보안 설정](#보안-설정)
7. [확장 및 커스터마이징](#확장-및-커스터마이징)

## 기술 스택

백엔드는 다음 기술을 사용하여 구현되었습니다:

- **Spring Boot**: Java 기반 웹 애플리케이션 프레임워크
- **Spring Data JPA**: 데이터 액세스 레이어
- **H2 Database**: 인메모리 관계형 데이터베이스
- **Lombok**: 보일러플레이트 코드 감소
- **Spring Web**: RESTful API 개발

## 디렉토리 구조

백엔드 프로젝트의 디렉토리 구조는 다음과 같습니다:

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/aidetector/
│   │   │   ├── config/          # 설정 클래스
│   │   │   │   ├── DataInitializer.java  # 샘플 데이터 초기화
│   │   │   │   └── WebConfig.java        # CORS 설정
│   │   │   ├── controller/      # REST 컨트롤러
│   │   │   │   └── EventController.java  # 이벤트 API 컨트롤러
│   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   ├── EventDTO.java         # 이벤트 DTO
│   │   │   │   ├── EventDetailDTO.java   # 이벤트 상세 DTO
│   │   │   │   └── StatsDTO.java         # 통계 DTO
│   │   │   ├── model/           # 엔티티 모델
│   │   │   │   └── Event.java            # 이벤트 엔티티
│   │   │   ├── repository/      # 데이터 액세스 레이어
│   │   │   │   └── EventRepository.java  # 이벤트 리포지토리
│   │   │   ├── service/         # 비즈니스 로직
│   │   │   │   └── EventService.java     # 이벤트 서비스
│   │   │   └── AiDetectorApplication.java # 메인 애플리케이션 클래스
│   │   └── resources/
│   │       ├── application.properties    # 애플리케이션 설정
│   │       └── static/                   # 정적 리소스
│   └── test/                    # 테스트 코드
├── pom.xml                      # Maven 프로젝트 설정
├── mvnw                         # Maven 래퍼 스크립트 (Unix)
└── mvnw.cmd                     # Maven 래퍼 스크립트 (Windows)
```

## 주요 컴포넌트

### 1. 메인 애플리케이션 클래스 (AiDetectorApplication.java)

Spring Boot 애플리케이션의 진입점입니다.

```java
package com.aidetector;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiDetectorApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiDetectorApplication.class, args);
    }
}
```

### 2. 이벤트 엔티티 (Event.java)

데이터베이스 테이블과 매핑되는 엔티티 클래스입니다.

```java
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

    @Column(nullable = false)
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
```

### 3. 데이터 전송 객체 (DTO)

클라이언트와 서버 간의 데이터 전송을 위한 객체입니다.

#### EventDTO.java

```java
package com.aidetector.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
    private Long id;
    private String timestamp;
    private String user;
    private Double anomaly;
    private String label;
    private String event;
}
```

#### EventDetailDTO.java

```java
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
```

#### StatsDTO.java

```java
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
```

### 4. 리포지토리 (EventRepository.java)

데이터베이스 액세스를 위한 인터페이스입니다.

```java
package com.aidetector.repository;

import com.aidetector.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByLabel(String label);
    
    List<Event> findByUserContaining(String user);
    
    @Query("SELECT COUNT(e) FROM Event e WHERE e.label = 'Anomaly'")
    Long countAnomalies();
    
    @Query("SELECT AVG(e.anomaly) FROM Event e")
    Double getAverageAnomaly();
    
    @Query("SELECT MAX(e.anomaly) FROM Event e")
    Double getMaxAnomaly();
}
```

### 5. 서비스 (EventService.java)

비즈니스 로직을 처리하는 서비스 클래스입니다.

```java
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
```

### 6. 컨트롤러 (EventController.java)

RESTful API 엔드포인트를 제공하는 컨트롤러 클래스입니다.

```java
package com.aidetector.controller;

import com.aidetector.dto.EventDTO;
import com.aidetector.dto.EventDetailDTO;
import com.aidetector.dto.StatsDTO;
import com.aidetector.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDetailDTO> getEventDetail(@PathVariable Long id) {
        EventDetailDTO eventDetail = eventService.getEventDetail(id);
        if (eventDetail != null) {
            return ResponseEntity.ok(eventDetail);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getStats() {
        return ResponseEntity.ok(eventService.getStats());
    }
}
```

### 7. CORS 설정 (WebConfig.java)

Cross-Origin Resource Sharing을 설정하는 클래스입니다.

```java
package com.aidetector.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 8. 데이터 초기화 (DataInitializer.java)

애플리케이션 시작 시 샘플 데이터를 생성하는 클래스입니다.

```java
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
```

## 데이터베이스 설정

애플리케이션은 H2 인메모리 데이터베이스를 사용합니다. 설정은 `application.properties` 파일에서 관리됩니다:

```properties
# 서버 포트 설정
server.port=8080

# H2 데이터베이스 설정
spring.datasource.url=jdbc:h2:mem:aidetectordb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# H2 콘솔 활성화
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA 설정
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# 로깅 설정
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# CORS 설정
spring.mvc.cors.allowed-origins=http://localhost:3000
spring.mvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.mvc.cors.allowed-headers=*
spring.mvc.cors.allow-credentials=true
```

### 다른 데이터베이스 사용하기

프로덕션 환경에서는 MySQL, PostgreSQL 등의 영구 데이터베이스를 사용할 수 있습니다. 예를 들어, MySQL을 사용하려면:

1. `pom.xml`에 의존성 추가:
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. `application.properties` 수정:
```properties
# MySQL 데이터베이스 설정
spring.datasource.url=jdbc:mysql://localhost:3306/aidetector?useSSL=false&serverTimezone=UTC
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# JPA 설정
spring.jpa.hibernate.ddl-auto=update
```

## API 엔드포인트

백엔드는 다음 RESTful API 엔드포인트를 제공합니다:

### 1. 모든 이벤트 조회

- **URL**: `/api/events`
- **Method**: GET
- **Response**: 이벤트 목록
```json
[
  {
    "id": 1,
    "timestamp": "2025-05-22 20:55",
    "user": "Joe Fam",
    "anomaly": 0.72,
    "label": "Anomaly",
    "event": "Event1"
  },
  {
    "id": 2,
    "timestamp": "2025-05-21 19:35",
    "user": "JuserB",
    "anomaly": 0.35,
    "label": "Normal",
    "event": "Event2"
  }
]
```

### 2. 이벤트 상세 정보 조회

- **URL**: `/api/events/{id}`
- **Method**: GET
- **Response**: 이벤트 상세 정보
```json
{
  "id": 1,
  "date": "2025-05-22",
  "anomalyScore": 0.72,
  "incident": "Suspicious process execution",
  "rowData": {
    "ip_address": "192.168.1.100",
    "user": "Joe Fam",
    "number": "1001",
    "location": "/usr/bin/bash"
  }
}
```

### 3. 통계 정보 조회

- **URL**: `/api/events/stats`
- **Method**: GET
- **Response**: 통계 정보
```json
{
  "totalEvents": 7,
  "anomalies": 5,
  "avgAnomaly": 0.7,
  "highestScore": 0.91
}
```

## 보안 설정

현재 구현에서는 기본적인 CORS 설정만 적용되어 있습니다. 프로덕션 환경에서는 다음과 같은 보안 설정을 추가하는 것이 좋습니다:

### 1. Spring Security 추가

1. `pom.xml`에 의존성 추가:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

2. 보안 설정 클래스 생성:
```java
package com.aidetector.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
            .and()
            .httpBasic();
        
        return http.build();
    }
}
```

### 2. JWT 인증 추가

1. `pom.xml`에 의존성 추가:
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

2. JWT 유틸리티 클래스 생성
3. JWT 필터 구현
4. 보안 설정 업데이트

## 확장 및 커스터마이징

### 1. 새로운 엔티티 추가

새로운 엔티티를 추가하려면 다음 단계를 따릅니다:

1. 엔티티 클래스 생성:
```java
package com.aidetector.model;

import javax.persistence.*;
import lombok.Data;

@Entity
@Table(name = "alerts")
@Data
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
    
    private String message;
    private LocalDateTime createdAt;
    private boolean acknowledged;
}
```

2. 리포지토리 인터페이스 생성:
```java
package com.aidetector.repository;

import com.aidetector.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByAcknowledged(boolean acknowledged);
}
```

3. 서비스 클래스 생성
4. 컨트롤러 클래스 생성

### 2. 실시간 알림 추가

WebSocket을 사용하여 실시간 알림을 구현할 수 있습니다:

1. `pom.xml`에 의존성 추가:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

2. WebSocket 설정 클래스 생성:
```java
package com.aidetector.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")
                .withSockJS();
    }
}
```

3. 알림 메시지 클래스 생성:
```java
package com.aidetector.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationMessage {
    private String type;
    private String content;
    private Object data;
}
```

4. 알림 서비스 구현:
```java
package com.aidetector.service;

import com.aidetector.dto.NotificationMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public NotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendNotification(String type, String content, Object data) {
        NotificationMessage message = new NotificationMessage(type, content, data);
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }
}
```

### 3. 외부 AI 서비스 연동

외부 AI 서비스를 연동하여 이상 행위 탐지 기능을 강화할 수 있습니다:

1. 클라이언트 클래스 생성:
```java
package com.aidetector.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AiServiceClient {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String apiKey;

    public AiServiceClient(
            RestTemplate restTemplate,
            @Value("${ai-service.url}") String apiUrl,
            @Value("${ai-service.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    public double analyzeAnomaly(Map<String, Object> data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(data, headers);
        
        Map<String, Object> response = restTemplate.postForObject(
                apiUrl + "/analyze", request, Map.class);
        
        return (double) response.get("anomalyScore");
    }
}
```

2. 설정 클래스에 RestTemplate 빈 추가:
```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

3. 서비스 클래스에서 사용:
```java
@Service
public class AnomalyDetectionService {

    private final AiServiceClient aiServiceClient;
    
    @Autowired
    public AnomalyDetectionService(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }
    
    public double detectAnomaly(Event event) {
        Map<String, Object> data = new HashMap<>();
        data.put("user", event.getUser());
        data.put("process", event.getLocation());
        data.put("ipAddress", event.getIpAddress());
        data.put("timestamp", event.getTimestamp().toString());
        
        return aiServiceClient.analyzeAnomaly(data);
    }
}
```

---

이 가이드는 백엔드 개발의 기본적인 측면을 다루고 있습니다. 추가 질문이나 도움이 필요하면 문의해주세요.

