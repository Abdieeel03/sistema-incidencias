package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.SectionAssignmentRequestDTO;
import com.utp.sistemaincidencias.dto.SectionAssignmentResponseDTO;
import com.utp.sistemaincidencias.mapper.SectionAssignmentMapper;
import com.utp.sistemaincidencias.model.SectionAssignment;
import com.utp.sistemaincidencias.service.SectionAssignmentService;
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
class SectionAssignmentControllerTest {

    @Mock
    private SectionAssignmentService assignmentService;

    @Mock
    private SectionAssignmentMapper assignmentMapper;

    @InjectMocks
    private SectionAssignmentController assignmentController;

    private SectionAssignment createAssignment(Long id) {
        SectionAssignment assignment = new SectionAssignment();
        assignment.setId(id);
        return assignment;
    }

    private SectionAssignmentResponseDTO createResponseDTO(Long id) {
        LocalDateTime now = LocalDateTime.now();
        return new SectionAssignmentResponseDTO(id, 1L, 2L, 3L, 4L, now);
    }

    @Test
    void testGetAllAssignments() {
        SectionAssignment a1 = createAssignment(1L);
        SectionAssignment a2 = createAssignment(2L);
        SectionAssignmentResponseDTO dto1 = createResponseDTO(1L);
        SectionAssignmentResponseDTO dto2 = createResponseDTO(2L);

        when(assignmentService.getAllAssignments()).thenReturn(Arrays.asList(a1, a2));
        when(assignmentMapper.toResponseDTOList(Arrays.asList(a1, a2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<SectionAssignmentResponseDTO>> response =
                assignmentController.getAllAssignments();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetAssignmentByIdFound() {
        SectionAssignment assignment = createAssignment(1L);
        SectionAssignmentResponseDTO dto = createResponseDTO(1L);

        when(assignmentService.getAssignmentById(1L)).thenReturn(Optional.of(assignment));
        when(assignmentMapper.toResponseDTO(assignment)).thenReturn(dto);

        ResponseEntity<SectionAssignmentResponseDTO> response =
                assignmentController.getAssignmentById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testGetAssignmentByIdNotFound() {
        when(assignmentService.getAssignmentById(99L)).thenReturn(Optional.empty());

        ResponseEntity<SectionAssignmentResponseDTO> response =
                assignmentController.getAssignmentById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetByStudentId() {
        SectionAssignment assignment = createAssignment(1L);
        SectionAssignmentResponseDTO dto = createResponseDTO(1L);

        when(assignmentService.getByStudentId(5L)).thenReturn(List.of(assignment));
        when(assignmentMapper.toResponseDTOList(List.of(assignment))).thenReturn(List.of(dto));

        ResponseEntity<List<SectionAssignmentResponseDTO>> response =
                assignmentController.getByStudentId(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetBySectionId() {
        SectionAssignment assignment = createAssignment(1L);
        SectionAssignmentResponseDTO dto = createResponseDTO(1L);

        when(assignmentService.getBySectionId(3L)).thenReturn(List.of(assignment));
        when(assignmentMapper.toResponseDTOList(List.of(assignment))).thenReturn(List.of(dto));

        ResponseEntity<List<SectionAssignmentResponseDTO>> response =
                assignmentController.getBySectionId(3L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testCreateAssignment() {
        SectionAssignmentRequestDTO requestDTO = new SectionAssignmentRequestDTO(1L, 2L, 3L, 4L);
        SectionAssignment created = createAssignment(1L);
        SectionAssignmentResponseDTO responseDTO = createResponseDTO(1L);

        when(assignmentService.createAssignment(requestDTO)).thenReturn(created);
        when(assignmentMapper.toResponseDTO(created)).thenReturn(responseDTO);

        ResponseEntity<SectionAssignmentResponseDTO> response =
                assignmentController.createAssignment(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testDeleteAssignment() {
        doNothing().when(assignmentService).deleteAssignment(1L);

        ResponseEntity<Void> response = assignmentController.deleteAssignment(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(assignmentService, times(1)).deleteAssignment(1L);
    }
}
