package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.SchoolClassRequestDTO;
import com.utp.sistemaincidencias.mapper.SchoolClassMapper;
import com.utp.sistemaincidencias.model.SchoolClass;
import com.utp.sistemaincidencias.repository.SchoolClassRepository;
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
class SchoolClassServiceImplTest {

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private SchoolClassMapper schoolClassMapper;

    @InjectMocks
    private SchoolClassServiceImpl schoolClassService;

    @Test
    void testGetAllClasses() {
        SchoolClass c1 = new SchoolClass();
        c1.setId(1L);
        SchoolClass c2 = new SchoolClass();
        c2.setId(2L);

        when(schoolClassRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        List<SchoolClass> result = schoolClassService.getAllClasses();

        assertEquals(2, result.size());
        verify(schoolClassRepository, times(1)).findAll();
    }

    @Test
    void testGetClassByIdFound() {
        SchoolClass sc = new SchoolClass();
        sc.setId(1L);
        sc.setName("Matemáticas");

        when(schoolClassRepository.findById(1L)).thenReturn(Optional.of(sc));

        Optional<SchoolClass> result = schoolClassService.getClassById(1L);

        assertTrue(result.isPresent());
        assertEquals("Matemáticas", result.get().getName());
    }

    @Test
    void testGetClassByIdNotFound() {
        when(schoolClassRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<SchoolClass> result = schoolClassService.getClassById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetClassesByTeacher() {
        SchoolClass sc = new SchoolClass();
        sc.setId(1L);

        when(schoolClassRepository.findByTeacherId(5L)).thenReturn(List.of(sc));

        List<SchoolClass> result = schoolClassService.getClassesByTeacher(5L);

        assertEquals(1, result.size());
        verify(schoolClassRepository, times(1)).findByTeacherId(5L);
    }

    @Test
    void testCreateClassSuccess() {
        SchoolClassRequestDTO dto = new SchoolClassRequestDTO("Matemáticas",
                "Curso de mate", 1L, 2L);
        SchoolClass mappedClass = new SchoolClass();
        SchoolClass savedClass = new SchoolClass();
        savedClass.setId(1L);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(sectionRepository.existsById(2L)).thenReturn(true);
        when(schoolClassMapper.toEntity(dto)).thenReturn(mappedClass);
        when(schoolClassRepository.save(any(SchoolClass.class))).thenReturn(savedClass);

        SchoolClass result = schoolClassService.createClass(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testCreateClassTeacherNotExists() {
        SchoolClassRequestDTO dto = new SchoolClassRequestDTO("Matemáticas",
                "Curso de mate", 1L, 2L);

        when(userRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> schoolClassService.createClass(dto));

        assertTrue(exception.getMessage().contains("profesor"));
        verify(schoolClassRepository, never()).save(any(SchoolClass.class));
    }

    @Test
    void testCreateClassSectionNotExists() {
        SchoolClassRequestDTO dto = new SchoolClassRequestDTO("Matemáticas",
                "Curso de mate", 1L, 2L);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(sectionRepository.existsById(2L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> schoolClassService.createClass(dto));

        assertTrue(exception.getMessage().contains("sección"));
        verify(schoolClassRepository, never()).save(any(SchoolClass.class));
    }

    @Test
    void testUpdateClassSuccess() {
        SchoolClassRequestDTO dto = new SchoolClassRequestDTO("Actualizado",
                "Nueva desc", 1L, 2L);
        SchoolClass existingClass = new SchoolClass();
        existingClass.setId(1L);
        SchoolClass savedClass = new SchoolClass();
        savedClass.setId(1L);
        savedClass.setName("Actualizado");

        when(schoolClassRepository.findById(1L)).thenReturn(Optional.of(existingClass));
        doNothing().when(schoolClassMapper).updateEntity(dto, existingClass);
        when(schoolClassRepository.save(existingClass)).thenReturn(savedClass);

        SchoolClass result = schoolClassService.updateClass(1L, dto);

        assertNotNull(result);
        assertEquals("Actualizado", result.getName());
    }

    @Test
    void testUpdateClassNotFound() {
        SchoolClassRequestDTO dto = new SchoolClassRequestDTO("Test", "Test", 1L, 2L);

        when(schoolClassRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> schoolClassService.updateClass(99L, dto));

        assertTrue(exception.getMessage().contains("Clase no encontrada"));
    }

    @Test
    void testDeleteClass() {
        doNothing().when(schoolClassRepository).deleteById(1L);

        schoolClassService.deleteClass(1L);

        verify(schoolClassRepository, times(1)).deleteById(1L);
    }
}
