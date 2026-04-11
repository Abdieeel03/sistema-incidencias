package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.IncidentRequestDTO;
import com.utp.sistemaincidencias.dto.IncidentResponseDTO;
import com.utp.sistemaincidencias.mapper.IncidentMapper;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import com.utp.sistemaincidencias.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;
    private final IncidentMapper incidentMapper;

    @GetMapping
    public ResponseEntity<List<IncidentResponseDTO>> getAllIncidents() {
        List<IncidentResponseDTO> incidents = incidentMapper.toResponseDTOList(incidentService.getAllIncidents());
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
                .map(incident -> ResponseEntity.ok(incidentMapper.toResponseDTO(incident)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<IncidentResponseDTO>> getIncidentsByStudent(@PathVariable Long studentId) {
        List<IncidentResponseDTO> incidents = incidentMapper.toResponseDTOList(
                incidentService.getIncidentsByStudent(studentId));
        return ResponseEntity.ok(incidents);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<IncidentResponseDTO>> getIncidentsByStatus(@PathVariable IncidentStatus status) {
        List<IncidentResponseDTO> incidents = incidentMapper.toResponseDTOList(
                incidentService.getIncidentsByStatus(status));
        return ResponseEntity.ok(incidents);
    }

    @PostMapping
    public ResponseEntity<IncidentResponseDTO> createIncident(@RequestBody IncidentRequestDTO dto) {
        IncidentResponseDTO response = incidentMapper.toResponseDTO(incidentService.createIncident(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponseDTO> updateIncident(@PathVariable Long id, @RequestBody IncidentRequestDTO dto) {
        IncidentResponseDTO response = incidentMapper.toResponseDTO(incidentService.updateIncident(id, dto));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }
}
