package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.SectionRequestDTO;
import com.utp.sistemaincidencias.mapper.SectionMapper;
import com.utp.sistemaincidencias.model.Section;
import com.utp.sistemaincidencias.repository.SectionRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SectionServiceImplTest {

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SectionMapper sectionMapper;

    @InjectMocks
    private SectionServiceImpl sectionService;

    @Test
    void testGetAllSections() {
        Section s1 = new Section();
        s1.setId(1L);
        Section s2 = new Section();
        s2.setId(2L);

        when(sectionRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<Section> result = sectionService.getAllSections();

        assertEquals(2, result.size());
        verify(sectionRepository, times(1)).findAll();
    }

    @Test
    void testGetSectionByIdFound() {
        Section section = new Section();
        section.setId(1L);
        section.setName("A");

        when(sectionRepository.findById(1L)).thenReturn(Optional.of(section));

        Optional<Section> result = sectionService.getSectionById(1L);

        assertTrue(result.isPresent());
        assertEquals("A", result.get().getName());
    }

    @Test
    void testGetSectionByIdNotFound() {
        when(sectionRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Section> result = sectionService.getSectionById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testCreateSectionSuccess() {
        SectionRequestDTO dto = new SectionRequestDTO("A", "Primero", (short) 30, 1L);
        Section mappedSection = new Section();
        Section savedSection = new Section();
        savedSection.setId(1L);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(sectionMapper.toEntity(dto)).thenReturn(mappedSection);
        when(sectionRepository.save(any(Section.class))).thenReturn(savedSection);

        Section result = sectionService.createSection(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testCreateSectionCoordinatorNotExists() {
        SectionRequestDTO dto = new SectionRequestDTO("A", "Primero", (short) 30, 1L);

        when(userRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> sectionService.createSection(dto));

        assertTrue(exception.getMessage().contains("coordinador"));
        verify(sectionRepository, never()).save(any(Section.class));
    }

    @Test
    void testUpdateSectionSuccess() {
        SectionRequestDTO dto = new SectionRequestDTO("B", "Segundo", (short) 25, 2L);
        Section existingSection = new Section();
        existingSection.setId(1L);
        Section savedSection = new Section();
        savedSection.setId(1L);
        savedSection.setName("B");

        when(sectionRepository.findById(1L)).thenReturn(Optional.of(existingSection));
        doNothing().when(sectionMapper).updateEntity(dto, existingSection);
        when(sectionRepository.save(existingSection)).thenReturn(savedSection);

        Section result = sectionService.updateSection(1L, dto);

        assertNotNull(result);
        assertEquals("B", result.getName());
    }

    @Test
    void testUpdateSectionNotFound() {
        SectionRequestDTO dto = new SectionRequestDTO("Test", "Test", (short) 20, 1L);

        when(sectionRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> sectionService.updateSection(99L, dto));

        assertTrue(exception.getMessage().contains("Sección no encontrada"));
    }

    @Test
    void testDeleteSection() {
        doNothing().when(sectionRepository).deleteById(1L);

        sectionService.deleteSection(1L);

        verify(sectionRepository, times(1)).deleteById(1L);
    }
}
