package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.ParentStudentRequestDTO;
import com.utp.sistemaincidencias.mapper.ParentStudentMapper;
import com.utp.sistemaincidencias.model.ParentStudent;
import com.utp.sistemaincidencias.repository.ParentStudentRepository;
import com.utp.sistemaincidencias.repository.StudentRepository;
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
class ParentStudentServiceImplTest {

    @Mock
    private ParentStudentRepository parentStudentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private ParentStudentMapper parentStudentMapper;

    @InjectMocks
    private ParentStudentServiceImpl parentStudentService;

    @Test
    void testGetAllParentStudents() {
        ParentStudent ps1 = new ParentStudent();
        ps1.setId(1L);
        ParentStudent ps2 = new ParentStudent();
        ps2.setId(2L);

        when(parentStudentRepository.findAll()).thenReturn(Arrays.asList(ps1, ps2));

        List<ParentStudent> result = parentStudentService.getAllParentStudents();

        assertEquals(2, result.size());
        verify(parentStudentRepository, times(1)).findAll();
    }

    @Test
    void testGetParentStudentByIdFound() {
        ParentStudent ps = new ParentStudent();
        ps.setId(1L);

        when(parentStudentRepository.findById(1L)).thenReturn(Optional.of(ps));

        Optional<ParentStudent> result = parentStudentService.getParentStudentById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testGetParentStudentByIdNotFound() {
        when(parentStudentRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<ParentStudent> result = parentStudentService.getParentStudentById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetByParentId() {
        ParentStudent ps = new ParentStudent();
        ps.setId(1L);

        when(parentStudentRepository.findByParentId(5L)).thenReturn(List.of(ps));

        List<ParentStudent> result = parentStudentService.getByParentId(5L);

        assertEquals(1, result.size());
    }

    @Test
    void testGetByStudentId() {
        ParentStudent ps = new ParentStudent();
        ps.setId(1L);

        when(parentStudentRepository.findByStudentId(3L)).thenReturn(List.of(ps));

        List<ParentStudent> result = parentStudentService.getByStudentId(3L);

        assertEquals(1, result.size());
    }

    @Test
    void testCreateParentStudentSuccess() {
        ParentStudentRequestDTO dto = new ParentStudentRequestDTO(1L, 2L);
        ParentStudent mappedPS = new ParentStudent();
        ParentStudent savedPS = new ParentStudent();
        savedPS.setId(1L);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(studentRepository.existsById(2L)).thenReturn(true);
        when(parentStudentMapper.toEntity(dto)).thenReturn(mappedPS);
        when(parentStudentRepository.save(any(ParentStudent.class))).thenReturn(savedPS);

        ParentStudent result = parentStudentService.createParentStudent(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testCreateParentStudentParentNotExists() {
        ParentStudentRequestDTO dto = new ParentStudentRequestDTO(1L, 2L);

        when(userRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> parentStudentService.createParentStudent(dto));

        assertTrue(exception.getMessage().contains("padre"));
    }

    @Test
    void testCreateParentStudentStudentNotExists() {
        ParentStudentRequestDTO dto = new ParentStudentRequestDTO(1L, 2L);

        when(userRepository.existsById(1L)).thenReturn(true);
        when(studentRepository.existsById(2L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> parentStudentService.createParentStudent(dto));

        assertTrue(exception.getMessage().contains("estudiante"));
    }

    @Test
    void testDeleteParentStudent() {
        doNothing().when(parentStudentRepository).deleteById(1L);

        parentStudentService.deleteParentStudent(1L);

        verify(parentStudentRepository, times(1)).deleteById(1L);
    }
}
