package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.SectionRequestDTO;
import com.utp.sistemaincidencias.dto.SectionResponseDTO;
import com.utp.sistemaincidencias.mapper.SectionMapper;
import com.utp.sistemaincidencias.model.Section;
import com.utp.sistemaincidencias.service.SectionService;
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
class SectionControllerTest {

    @Mock
    private SectionService sectionService;

    @Mock
    private SectionMapper sectionMapper;

    @InjectMocks
    private SectionController sectionController;

    private Section createSection(Long id, String name) {
        Section section = new Section();
        section.setId(id);
        section.setName(name);
        section.setGrade("Primero");
        section.setCapacity((short) 30);
        return section;
    }

    private SectionResponseDTO createResponseDTO(Long id, String name) {
        LocalDateTime now = LocalDateTime.now();
        return new SectionResponseDTO(id, name, "Primero", (short) 30, 1L, now, now);
    }

    @Test
    void testGetAllSections() {
        Section s1 = createSection(1L, "A");
        Section s2 = createSection(2L, "B");
        SectionResponseDTO dto1 = createResponseDTO(1L, "A");
        SectionResponseDTO dto2 = createResponseDTO(2L, "B");

        when(sectionService.getAllSections()).thenReturn(Arrays.asList(s1, s2));
        when(sectionMapper.toResponseDTOList(Arrays.asList(s1, s2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<SectionResponseDTO>> response = sectionController.getAllSections();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetSectionByIdFound() {
        Section section = createSection(1L, "A");
        SectionResponseDTO dto = createResponseDTO(1L, "A");

        when(sectionService.getSectionById(1L)).thenReturn(Optional.of(section));
        when(sectionMapper.toResponseDTO(section)).thenReturn(dto);

        ResponseEntity<SectionResponseDTO> response = sectionController.getSectionById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("A", response.getBody().getName());
    }

    @Test
    void testGetSectionByIdNotFound() {
        when(sectionService.getSectionById(99L)).thenReturn(Optional.empty());

        ResponseEntity<SectionResponseDTO> response = sectionController.getSectionById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateSection() {
        SectionRequestDTO requestDTO = new SectionRequestDTO("A", "Primero", (short) 30, 1L);
        Section createdSection = createSection(1L, "A");
        SectionResponseDTO responseDTO = createResponseDTO(1L, "A");

        when(sectionService.createSection(requestDTO)).thenReturn(createdSection);
        when(sectionMapper.toResponseDTO(createdSection)).thenReturn(responseDTO);

        ResponseEntity<SectionResponseDTO> response = sectionController.createSection(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testUpdateSection() {
        SectionRequestDTO requestDTO = new SectionRequestDTO("B", "Segundo", (short) 25, 2L);
        Section updatedSection = createSection(1L, "B");
        SectionResponseDTO responseDTO = createResponseDTO(1L, "B");

        when(sectionService.updateSection(1L, requestDTO)).thenReturn(updatedSection);
        when(sectionMapper.toResponseDTO(updatedSection)).thenReturn(responseDTO);

        ResponseEntity<SectionResponseDTO> response =
                sectionController.updateSection(1L, requestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteSection() {
        doNothing().when(sectionService).deleteSection(1L);

        ResponseEntity<Void> response = sectionController.deleteSection(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(sectionService, times(1)).deleteSection(1L);
    }
}
