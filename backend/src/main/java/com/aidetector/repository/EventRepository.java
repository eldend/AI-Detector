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

