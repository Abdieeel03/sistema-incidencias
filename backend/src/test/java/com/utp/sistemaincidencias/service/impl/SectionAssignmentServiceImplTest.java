package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.SectionAssignmentRequestDTO;
import com.utp.sistemaincidencias.mapper.SectionAssignmentMapper;
import com.utp.sistemaincidencias.model.SectionAssignment;
import com.utp.sistemaincidencias.repository.*;
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
class SectionAssignmentServiceImplTest {

    @Mock
    private SectionAssignmentRepository sectionAssignmentRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private SectionRepository sectionRepository;

    @Mock
    private SchoolClassRepository schoolClassRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SectionAssignmentMapper sectionAssignmentMapper;

    @InjectMocks
    private SectionAssignmentServiceImpl assignmentService;

    @Test
    void testGetAllAssignments() {
        SectionAssignment a1 = new SectionAssignment();
        a1.setId(1L);
        SectionAssignment a2 = new SectionAssignment();
        a2.setId(2L);

        when(sectionAssignmentRepository.findAll()).thenReturn(Arrays.asList(a1, a2));

        List<SectionAssignment> result = assignmentService.getAllAssignments();

        assertEquals(2, result.size());
        verify(sectionAssignmentRepository, times(1)).findAll();
    }

    @Test
    void testGetAssignmentByIdFound() {
        SectionAssignment assignment = new SectionAssignment();
        assignment.setId(1L);

        when(sectionAssignmentRepository.findById(1L)).thenReturn(Optional.of(assignment));

        Optional<SectionAssignment> result = assignmentService.getAssignmentById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testGetAssignmentByIdNotFound() {
        when(sectionAssignmentRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<SectionAssignment> result = assignmentService.getAssignmentById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetByStudentId() {
        SectionAssignment assignment = new SectionAssignment();
        assignment.setId(1L);

        when(sectionAssignmentRepository.findByStudentId(5L)).thenReturn(List.of(assignment));

        List<SectionAssignment> result = assignmentService.getByStudentId(5L);

        assertEquals(1, result.size());
    }

    @Test
    void testGetBySectionId() {
        SectionAssignment assignment = new SectionAssignment();
        assignment.setId(1L);

        when(sectionAssignmentRepository.findBySectionId(3L)).thenReturn(List.of(assignment));

        List<SectionAssignment> result = assignmentService.getBySectionId(3L);

        assertEquals(1, result.size());
    }

    @Test
    void testCreateAssignmentSuccess() {
        SectionAssignmentRequestDTO dto = new SectionAssignmentRequestDTO(1L, 2L, 3L, 4L);
        SectionAssignment mappedAssignment = new SectionAssignment();
        SectionAssignment savedAssignment = new SectionAssignment();
        savedAssignment.setId(1L);

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(sectionRepository.existsById(2L)).thenReturn(true);
        when(schoolClassRepository.existsById(3L)).thenReturn(true);
        when(userRepository.existsById(4L)).thenReturn(true);
        when(sectionAssignmentMapper.toEntity(dto)).thenReturn(mappedAssignment);
        when(sectionAssignmentRepository.save(any(SectionAssignment.class))).thenReturn(savedAssignment);

        SectionAssignment result = assignmentService.createAssignment(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testCreateAssignmentStudentNotExists() {
        SectionAssignmentRequestDTO dto = new SectionAssignmentRequestDTO(1L, 2L, 3L, 4L);

        when(studentRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> assignmentService.createAssignment(dto));

        assertTrue(exception.getMessage().contains("estudiante"));
    }

    @Test
    void testCreateAssignmentSectionNotExists() {
        SectionAssignmentRequestDTO dto = new SectionAssignmentRequestDTO(1L, 2L, 3L, 4L);

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(sectionRepository.existsById(2L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> assignmentService.createAssignment(dto));

        assertTrue(exception.getMessage().contains("sección"));
    }

    @Test
    void testCreateAssignmentClassNotExists() {
        SectionAssignmentRequestDTO dto = new SectionAssignmentRequestDTO(1L, 2L, 3L, 4L);

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(sectionRepository.existsById(2L)).thenReturn(true);
        when(schoolClassRepository.existsById(3L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> assignmentService.createAssignment(dto));

        assertTrue(exception.getMessage().contains("clase"));
    }

    @Test
    void testCreateAssignmentUserNotExists() {
        SectionAssignmentRequestDTO dto = new SectionAssignmentRequestDTO(1L, 2L, 3L, 4L);

        when(studentRepository.existsById(1L)).thenReturn(true);
        when(sectionRepository.existsById(2L)).thenReturn(true);
        when(schoolClassRepository.existsById(3L)).thenReturn(true);
        when(userRepository.existsById(4L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> assignmentService.createAssignment(dto));

        assertTrue(exception.getMessage().contains("asignador"));
    }

    @Test
    void testDeleteAssignment() {
        doNothing().when(sectionAssignmentRepository).deleteById(1L);

        assignmentService.deleteAssignment(1L);

        verify(sectionAssignmentRepository, times(1)).deleteById(1L);
    }
}
