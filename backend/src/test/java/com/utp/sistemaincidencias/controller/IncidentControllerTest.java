package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.IncidentRequestDTO;
import com.utp.sistemaincidencias.dto.IncidentResponseDTO;
import com.utp.sistemaincidencias.mapper.IncidentMapper;
import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import com.utp.sistemaincidencias.service.IncidentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentControllerTest {

    @Mock
    private IncidentService incidentService;

    @Mock
    private IncidentMapper incidentMapper;

    @InjectMocks
    private IncidentController incidentController;

    private Incident createIncident(Long id, String title) {
        Incident incident = new Incident();
        incident.setId(id);
        incident.setTitle(title);
        incident.setStatus(IncidentStatus.abierta);
        return incident;
    }

    private IncidentResponseDTO createResponseDTO(Long id, String title) {
        LocalDateTime now = LocalDateTime.now();
        return new IncidentResponseDTO(id, title, "Descripción",
                1L, 2L, 3L, IncidentStatus.abierta, now, now);
    }

    @Test
    void testGetAllIncidents() {
        Incident i1 = createIncident(1L, "Pelea");
        Incident i2 = createIncident(2L, "Tardanza");
        IncidentResponseDTO dto1 = createResponseDTO(1L, "Pelea");
        IncidentResponseDTO dto2 = createResponseDTO(2L, "Tardanza");

        when(incidentService.getAllIncidents()).thenReturn(Arrays.asList(i1, i2));
        when(incidentMapper.toResponseDTOList(Arrays.asList(i1, i2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<IncidentResponseDTO>> response = incidentController.getAllIncidents();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetIncidentByIdFound() {
        Incident incident = createIncident(1L, "Pelea");
        IncidentResponseDTO dto = createResponseDTO(1L, "Pelea");

        when(incidentService.getIncidentById(1L)).thenReturn(Optional.of(incident));
        when(incidentMapper.toResponseDTO(incident)).thenReturn(dto);

        ResponseEntity<IncidentResponseDTO> response = incidentController.getIncidentById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Pelea", response.getBody().getTitle());
    }

    @Test
    void testGetIncidentByIdNotFound() {
        when(incidentService.getIncidentById(99L)).thenReturn(Optional.empty());

        ResponseEntity<IncidentResponseDTO> response = incidentController.getIncidentById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetIncidentsByStudent() {
        Incident incident = createIncident(1L, "Pelea");
        IncidentResponseDTO dto = createResponseDTO(1L, "Pelea");

        when(incidentService.getIncidentsByStudent(5L)).thenReturn(List.of(incident));
        when(incidentMapper.toResponseDTOList(List.of(incident))).thenReturn(List.of(dto));

        ResponseEntity<List<IncidentResponseDTO>> response =
                incidentController.getIncidentsByStudent(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetIncidentsByStatus() {
        Incident incident = createIncident(1L, "Pelea");
        IncidentResponseDTO dto = createResponseDTO(1L, "Pelea");

        when(incidentService.getIncidentsByStatus(IncidentStatus.abierta))
                .thenReturn(List.of(incident));
        when(incidentMapper.toResponseDTOList(List.of(incident))).thenReturn(List.of(dto));

        ResponseEntity<List<IncidentResponseDTO>> response =
                incidentController.getIncidentsByStatus(IncidentStatus.abierta);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testCreateIncident() {
        LocalDateTime now = LocalDateTime.now();
        IncidentRequestDTO requestDTO = new IncidentRequestDTO("Pelea", "Descripción",
                1L, 2L, 3L, IncidentStatus.abierta, now);
        Incident createdIncident = createIncident(1L, "Pelea");
        IncidentResponseDTO responseDTO = createResponseDTO(1L, "Pelea");

        when(incidentService.createIncident(requestDTO)).thenReturn(createdIncident);
        when(incidentMapper.toResponseDTO(createdIncident)).thenReturn(responseDTO);

        ResponseEntity<IncidentResponseDTO> response =
                incidentController.createIncident(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testUpdateIncident() {
        LocalDateTime now = LocalDateTime.now();
        IncidentRequestDTO requestDTO = new IncidentRequestDTO("Actualizado", "Nueva desc",
                1L, 2L, 3L, IncidentStatus.resuelta, now);
        Incident updatedIncident = createIncident(1L, "Actualizado");
        IncidentResponseDTO responseDTO = createResponseDTO(1L, "Actualizado");

        when(incidentService.updateIncident(1L, requestDTO)).thenReturn(updatedIncident);
        when(incidentMapper.toResponseDTO(updatedIncident)).thenReturn(responseDTO);

        ResponseEntity<IncidentResponseDTO> response =
                incidentController.updateIncident(1L, requestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteIncident() {
        doNothing().when(incidentService).deleteIncident(1L);

        ResponseEntity<Void> response = incidentController.deleteIncident(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(incidentService, times(1)).deleteIncident(1L);
    }
}
