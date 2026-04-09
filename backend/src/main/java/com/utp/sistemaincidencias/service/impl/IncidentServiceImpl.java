package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import com.utp.sistemaincidencias.repository.IncidentRepository;
import com.utp.sistemaincidencias.repository.StudentRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import com.utp.sistemaincidencias.repository.SchoolClassRepository;
import com.utp.sistemaincidencias.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final SchoolClassRepository schoolClassRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Incident> getIncidentById(Long id) {
        return incidentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByStudent(Long studentId) {
        return incidentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Incident> getIncidentsByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status);
    }

    @Override
    @Transactional
    public Incident createIncident(Incident incident) {
        if (!studentRepository.existsById(incident.getStudent().getId())) {
            throw new RuntimeException("El estudiante con ID " + incident.getStudent().getId() + " no existe");
        }

        if (!userRepository.existsById(incident.getReportedBy().getId())) {
            throw new RuntimeException(
                    "El usuario reportero con ID " + incident.getReportedBy().getId() + " no existe");
        }

        if (!schoolClassRepository.existsById(incident.getSchoolClass().getId())) {
            throw new RuntimeException("La clase con ID " + incident.getSchoolClass().getId() + " no existe");
        }

        return incidentRepository.save(incident);
    }

    @Override
    @Transactional
    public Incident updateIncidentStatus(Long id, IncidentStatus status) {
        return incidentRepository.findById(id).map(incident -> {
            incident.setStatus(status);
            return incidentRepository.save(incident);
        }).orElseThrow(() -> new RuntimeException("Incidencia no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}
