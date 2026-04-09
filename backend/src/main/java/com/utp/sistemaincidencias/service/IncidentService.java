package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import java.util.List;
import java.util.Optional;

public interface IncidentService {
    List<Incident> getAllIncidents();
    Optional<Incident> getIncidentById(Long id);
    List<Incident> getIncidentsByStudent(Long studentId);
    List<Incident> getIncidentsByStatus(IncidentStatus status);
    Incident createIncident(Incident incident);
    Incident updateIncidentStatus(Long id, IncidentStatus status);
    void deleteIncident(Long id);
}
