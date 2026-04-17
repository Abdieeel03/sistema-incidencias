package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.IncidentRequestDTO;
import com.utp.sistemaincidencias.mapper.IncidentMapper;
import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import com.utp.sistemaincidencias.repository.IncidentRepository;
import com.utp.sistemaincidencias.repository.SchoolClassRepository;
import com.utp.sistemaincidencias.repository.StudentRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceImplTest {

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @Mock
    private IncidentMapper incidentMapper;

    @InjectMocks
    private IncidentServiceImpl incidentService;

    @Test
    void testGetAllIncidents() {
        Incident i1 = new Incident();
        i1.setId(1L);
        Incident i2 = new Incident();
        i2.setId(2L);

        when(incidentRepository.findAll()).thenReturn(Arrays.asList(i1, i2));

        List<Incident> result = incidentService.getAllIncidents();

        assertEquals(2, result.size());
        verify(incidentRepository, times(1)).findAll();
    }

    @Test
    void testGetIncidentByIdFound() {
        Incident incident = new Incident();
        incident.setId(1L);
        incident.setTitle("Pelea");

        when(incidentRepository.findById(1L)).thenReturn(Optional.of(incident));

        Optional<Incident> result = incidentService.getIncidentById(1L);

        assertTrue(result.isPresent());
        assertEquals("Pelea", result.get().getTitle());
    }

    @Test
    void testGetIncidentByIdNotFound() {
        when(incidentRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Incident> result = incidentService.getIncidentById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetIncidentsByStudent() {
        Incident incident = new Incident();
        incident.setId(1L);

        when(incidentRepository.findByStudentId(5L)).thenReturn(List.of(incident));

        List<Incident> result = incidentService.getIncidentsByStudent(5L);

        assertEquals(1, result.size());
        verify(incidentRepository, times(1)).findByStudentId(5L);
    }

    @Test
    void testGetIncidentsByStatus() {
        Incident incident = new Incident();
        incident.setStatus(IncidentStatus.abierta);

        when(incidentRepository.findByStatus(IncidentStatus.abierta)).thenReturn(List.of(incident));

        List<Incident> result = incidentService.getIncidentsByStatus(IncidentStatus.abierta);

        assertEquals(1, result.size());
        verify(incidentRepository, times(1)).findByStatus(IncidentStatus.abierta);
    }

    @Test
    void testCreateIncidentSuccess() {
        IncidentRequestDTO dto = new IncidentRequestDTO("Pelea", "Descripción",
                1L, 2L, 3L, IncidentStatus.abierta, LocalDateTime.now());
        Incident mappedIncident = new Incident();
        Incident savedIncident = new Incident();
        savedIncident.setId(1L);

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(userRepository.existsById(3L)).thenReturn(true);
        when(schoolClassRepository.existsById(2L)).thenReturn(true);
        when(incidentMapper.toEntity(dto)).thenReturn(mappedIncident);
        when(incidentRepository.save(any(Incident.class))).thenReturn(savedIncident);

        Incident result = incidentService.createIncident(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(studentRepository, times(1)).existsById(1L);
        verify(userRepository, times(1)).existsById(3L);
        verify(schoolClassRepository, times(1)).existsById(2L);
    }

    @Test
    void testCreateIncidentStudentNotExists() {
        IncidentRequestDTO dto = new IncidentRequestDTO("Pelea", "Descripción",
                1L, 2L, 3L, IncidentStatus.abierta, LocalDateTime.now());

        when(studentRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> incidentService.createIncident(dto));

        assertTrue(exception.getMessage().contains("estudiante"));
        verify(incidentRepository, never()).save(any(Incident.class));
    }

    @Test
    void testCreateIncidentReporterNotExists() {
        IncidentRequestDTO dto = new IncidentRequestDTO("Pelea", "Descripción",
                1L, 2L, 3L, IncidentStatus.abierta, LocalDateTime.now());

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(userRepository.existsById(3L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> incidentService.createIncident(dto));

        assertTrue(exception.getMessage().contains("reportero"));
        verify(incidentRepository, never()).save(any(Incident.class));
    }

    @Test
    void testCreateIncidentClassNotExists() {
        IncidentRequestDTO dto = new IncidentRequestDTO("Pelea", "Descripción",
                1L, 2L, 3L, IncidentStatus.abierta, LocalDateTime.now());

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(userRepository.existsById(3L)).thenReturn(true);
        when(schoolClassRepository.existsById(2L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> incidentService.createIncident(dto));

        assertTrue(exception.getMessage().contains("clase"));
        verify(incidentRepository, never()).save(any(Incident.class));
    }

    @Test
    void testUpdateIncidentSuccess() {
        IncidentRequestDTO dto = new IncidentRequestDTO("Actualizado", "Nueva desc",
                1L, 2L, 3L, IncidentStatus.resuelta, LocalDateTime.now());
        Incident existingIncident = new Incident();
        existingIncident.setId(1L);
        Incident savedIncident = new Incident();
        savedIncident.setId(1L);
        savedIncident.setTitle("Actualizado");

        when(incidentRepository.findById(1L)).thenReturn(Optional.of(existingIncident));
        doNothing().when(incidentMapper).updateEntity(dto, existingIncident);
        when(incidentRepository.save(existingIncident)).thenReturn(savedIncident);

        Incident result = incidentService.updateIncident(1L, dto);

        assertNotNull(result);
        assertEquals("Actualizado", result.getTitle());
    }

    @Test
    void testUpdateIncidentNotFound() {
        IncidentRequestDTO dto = new IncidentRequestDTO("Test", "Test",
                1L, 2L, 3L, IncidentStatus.abierta, LocalDateTime.now());

        when(incidentRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> incidentService.updateIncident(99L, dto));

        assertTrue(exception.getMessage().contains("Incidencia no encontrada"));
    }

    @Test
    void testDeleteIncident() {
        doNothing().when(incidentRepository).deleteById(1L);

        incidentService.deleteIncident(1L);

        verify(incidentRepository, times(1)).deleteById(1L);
    }
}
