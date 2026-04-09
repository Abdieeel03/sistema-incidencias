package com.utp.sistemaincidencias.repository;

import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStudentId(Long studentId);
    List<Incident> findByStatus(IncidentStatus status);
    List<Incident> findByReportedById(Long userId);
}
