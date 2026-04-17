package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.ParentStudentRequestDTO;
import com.utp.sistemaincidencias.dto.ParentStudentResponseDTO;
import com.utp.sistemaincidencias.mapper.ParentStudentMapper;
import com.utp.sistemaincidencias.model.ParentStudent;
import com.utp.sistemaincidencias.service.ParentStudentService;
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
class ParentStudentControllerTest {

    @Mock
    private ParentStudentService parentStudentService;

    @Mock
    private ParentStudentMapper parentStudentMapper;

    @InjectMocks
    private ParentStudentController parentStudentController;

    private ParentStudent createParentStudent(Long id) {
        ParentStudent ps = new ParentStudent();
        ps.setId(id);
        return ps;
    }

    private ParentStudentResponseDTO createResponseDTO(Long id) {
        LocalDateTime now = LocalDateTime.now();
        return new ParentStudentResponseDTO(id, 1L, 2L, now);
    }

    @Test
    void testGetAllParentStudents() {
        ParentStudent ps1 = createParentStudent(1L);
        ParentStudent ps2 = createParentStudent(2L);
        ParentStudentResponseDTO dto1 = createResponseDTO(1L);
        ParentStudentResponseDTO dto2 = createResponseDTO(2L);

        when(parentStudentService.getAllParentStudents()).thenReturn(Arrays.asList(ps1, ps2));
        when(parentStudentMapper.toResponseDTOList(Arrays.asList(ps1, ps2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<ParentStudentResponseDTO>> response =
                parentStudentController.getAllParentStudents();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetParentStudentByIdFound() {
        ParentStudent ps = createParentStudent(1L);
        ParentStudentResponseDTO dto = createResponseDTO(1L);

        when(parentStudentService.getParentStudentById(1L)).thenReturn(Optional.of(ps));
        when(parentStudentMapper.toResponseDTO(ps)).thenReturn(dto);

        ResponseEntity<ParentStudentResponseDTO> response =
                parentStudentController.getParentStudentById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testGetParentStudentByIdNotFound() {
        when(parentStudentService.getParentStudentById(99L)).thenReturn(Optional.empty());

        ResponseEntity<ParentStudentResponseDTO> response =
                parentStudentController.getParentStudentById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetByParentId() {
        ParentStudent ps = createParentStudent(1L);
        ParentStudentResponseDTO dto = createResponseDTO(1L);

        when(parentStudentService.getByParentId(5L)).thenReturn(List.of(ps));
        when(parentStudentMapper.toResponseDTOList(List.of(ps))).thenReturn(List.of(dto));

        ResponseEntity<List<ParentStudentResponseDTO>> response =
                parentStudentController.getByParentId(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetByStudentId() {
        ParentStudent ps = createParentStudent(1L);
        ParentStudentResponseDTO dto = createResponseDTO(1L);

        when(parentStudentService.getByStudentId(3L)).thenReturn(List.of(ps));
        when(parentStudentMapper.toResponseDTOList(List.of(ps))).thenReturn(List.of(dto));

        ResponseEntity<List<ParentStudentResponseDTO>> response =
                parentStudentController.getByStudentId(3L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testCreateParentStudent() {
        ParentStudentRequestDTO requestDTO = new ParentStudentRequestDTO(1L, 2L);
        ParentStudent created = createParentStudent(1L);
        ParentStudentResponseDTO responseDTO = createResponseDTO(1L);

        when(parentStudentService.createParentStudent(requestDTO)).thenReturn(created);
        when(parentStudentMapper.toResponseDTO(created)).thenReturn(responseDTO);

        ResponseEntity<ParentStudentResponseDTO> response =
                parentStudentController.createParentStudent(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testDeleteParentStudent() {
        doNothing().when(parentStudentService).deleteParentStudent(1L);

        ResponseEntity<Void> response = parentStudentController.deleteParentStudent(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(parentStudentService, times(1)).deleteParentStudent(1L);
    }
}
