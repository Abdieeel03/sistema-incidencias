package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.SectionAssignmentRequestDTO;
import com.utp.sistemaincidencias.dto.SectionAssignmentResponseDTO;
import com.utp.sistemaincidencias.mapper.SectionAssignmentMapper;
import com.utp.sistemaincidencias.service.SectionAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/section-assignments")
@RequiredArgsConstructor
public class SectionAssignmentController {

    private final SectionAssignmentService assignmentService;
    private final SectionAssignmentMapper assignmentMapper;

    @GetMapping
    public ResponseEntity<List<SectionAssignmentResponseDTO>> getAllAssignments() {
        List<SectionAssignmentResponseDTO> assignments = assignmentMapper.toResponseDTOList(
                assignmentService.getAllAssignments());
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionAssignmentResponseDTO> getAssignmentById(@PathVariable Long id) {
        return assignmentService.getAssignmentById(id)
                .map(a -> ResponseEntity.ok(assignmentMapper.toResponseDTO(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SectionAssignmentResponseDTO>> getByStudentId(@PathVariable Long studentId) {
        List<SectionAssignmentResponseDTO> assignments = assignmentMapper.toResponseDTOList(
                assignmentService.getByStudentId(studentId));
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<List<SectionAssignmentResponseDTO>> getBySectionId(@PathVariable Long sectionId) {
        List<SectionAssignmentResponseDTO> assignments = assignmentMapper.toResponseDTOList(
                assignmentService.getBySectionId(sectionId));
        return ResponseEntity.ok(assignments);
    }

    @PostMapping
    public ResponseEntity<SectionAssignmentResponseDTO> createAssignment(@RequestBody SectionAssignmentRequestDTO dto) {
        SectionAssignmentResponseDTO response = assignmentMapper.toResponseDTO(
                assignmentService.createAssignment(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
