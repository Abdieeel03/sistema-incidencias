package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.SchoolClassRequestDTO;
import com.utp.sistemaincidencias.dto.SchoolClassResponseDTO;
import com.utp.sistemaincidencias.mapper.SchoolClassMapper;
import com.utp.sistemaincidencias.model.SchoolClass;
import com.utp.sistemaincidencias.service.SchoolClassService;
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
class SchoolClassControllerTest {

    @Mock
    private SchoolClassService schoolClassService;

    @Mock
    private SchoolClassMapper schoolClassMapper;

    @InjectMocks
    private SchoolClassController schoolClassController;

    private SchoolClass createSchoolClass(Long id, String name) {
        SchoolClass sc = new SchoolClass();
        sc.setId(id);
        sc.setName(name);
        return sc;
    }

    private SchoolClassResponseDTO createResponseDTO(Long id, String name) {
        LocalDateTime now = LocalDateTime.now();
        return new SchoolClassResponseDTO(id, name, "Descripción", 1L, 2L, now, now);
    }

    @Test
    void testGetAllClasses() {
        SchoolClass c1 = createSchoolClass(1L, "Matemáticas");
        SchoolClass c2 = createSchoolClass(2L, "Ciencias");
        SchoolClassResponseDTO dto1 = createResponseDTO(1L, "Matemáticas");
        SchoolClassResponseDTO dto2 = createResponseDTO(2L, "Ciencias");

        when(schoolClassService.getAllClasses()).thenReturn(Arrays.asList(c1, c2));
        when(schoolClassMapper.toResponseDTOList(Arrays.asList(c1, c2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<SchoolClassResponseDTO>> response = schoolClassController.getAllClasses();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetClassByIdFound() {
        SchoolClass sc = createSchoolClass(1L, "Matemáticas");
        SchoolClassResponseDTO dto = createResponseDTO(1L, "Matemáticas");

        when(schoolClassService.getClassById(1L)).thenReturn(Optional.of(sc));
        when(schoolClassMapper.toResponseDTO(sc)).thenReturn(dto);

        ResponseEntity<SchoolClassResponseDTO> response = schoolClassController.getClassById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Matemáticas", response.getBody().getName());
    }

    @Test
    void testGetClassByIdNotFound() {
        when(schoolClassService.getClassById(99L)).thenReturn(Optional.empty());

        ResponseEntity<SchoolClassResponseDTO> response = schoolClassController.getClassById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetClassesByTeacher() {
        SchoolClass sc = createSchoolClass(1L, "Matemáticas");
        SchoolClassResponseDTO dto = createResponseDTO(1L, "Matemáticas");

        when(schoolClassService.getClassesByTeacher(5L)).thenReturn(List.of(sc));
        when(schoolClassMapper.toResponseDTOList(List.of(sc))).thenReturn(List.of(dto));

        ResponseEntity<List<SchoolClassResponseDTO>> response =
                schoolClassController.getClassesByTeacher(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testCreateClass() {
        SchoolClassRequestDTO requestDTO = new SchoolClassRequestDTO("Matemáticas",
                "Descripción", 1L, 2L);
        SchoolClass createdClass = createSchoolClass(1L, "Matemáticas");
        SchoolClassResponseDTO responseDTO = createResponseDTO(1L, "Matemáticas");

        when(schoolClassService.createClass(requestDTO)).thenReturn(createdClass);
        when(schoolClassMapper.toResponseDTO(createdClass)).thenReturn(responseDTO);

        ResponseEntity<SchoolClassResponseDTO> response =
                schoolClassController.createClass(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testUpdateClass() {
        SchoolClassRequestDTO requestDTO = new SchoolClassRequestDTO("Actualizado",
                "Nueva desc", 1L, 2L);
        SchoolClass updatedClass = createSchoolClass(1L, "Actualizado");
        SchoolClassResponseDTO responseDTO = createResponseDTO(1L, "Actualizado");

        when(schoolClassService.updateClass(1L, requestDTO)).thenReturn(updatedClass);
        when(schoolClassMapper.toResponseDTO(updatedClass)).thenReturn(responseDTO);

        ResponseEntity<SchoolClassResponseDTO> response =
                schoolClassController.updateClass(1L, requestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteClass() {
        doNothing().when(schoolClassService).deleteClass(1L);

        ResponseEntity<Void> response = schoolClassController.deleteClass(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(schoolClassService, times(1)).deleteClass(1L);
    }
}
