package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.StudentRequestDTO;
import com.utp.sistemaincidencias.mapper.StudentMapper;
import com.utp.sistemaincidencias.model.Student;
import com.utp.sistemaincidencias.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private StudentServiceImpl studentService;

    @Test
    void testGetAllStudents() {
        Student s1 = new Student();
        s1.setId(1L);
        Student s2 = new Student();
        s2.setId(2L);

        when(studentRepository.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<Student> result = studentService.getAllStudents();

        assertEquals(2, result.size());
        verify(studentRepository, times(1)).findAll();
    }

    @Test
    void testGetAllStudentsEmpty() {
        when(studentRepository.findAll()).thenReturn(List.of());

        List<Student> result = studentService.getAllStudents();

        assertTrue(result.isEmpty());
    }

    @Test
    void testGetStudentByIdFound() {
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("Carlos");

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        Optional<Student> result = studentService.getStudentById(1L);

        assertTrue(result.isPresent());
        assertEquals("Carlos", result.get().getFirstName());
        verify(studentRepository, times(1)).findById(1L);
    }

    @Test
    void testGetStudentByIdNotFound() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<Student> result = studentService.getStudentById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetStudentByCodeFound() {
        Student student = new Student();
        student.setStudentCode("STU001");

        when(studentRepository.findByStudentCode("STU001")).thenReturn(Optional.of(student));

        Optional<Student> result = studentService.getStudentByCode("STU001");

        assertTrue(result.isPresent());
        assertEquals("STU001", result.get().getStudentCode());
    }

    @Test
    void testGetStudentByCodeNotFound() {
        when(studentRepository.findByStudentCode("NOEXISTE")).thenReturn(Optional.empty());

        Optional<Student> result = studentService.getStudentByCode("NOEXISTE");

        assertFalse(result.isPresent());
    }

    @Test
    void testCreateStudentSuccess() {
        StudentRequestDTO dto = new StudentRequestDTO("Carlos", "Pérez",
                LocalDate.of(2010, 5, 15), "STU001", true);
        Student mappedStudent = new Student();
        mappedStudent.setFirstName("Carlos");
        Student savedStudent = new Student();
        savedStudent.setId(1L);
        savedStudent.setFirstName("Carlos");

        when(studentRepository.existsByStudentCode("STU001")).thenReturn(false);
        when(studentMapper.toEntity(dto)).thenReturn(mappedStudent);
        when(studentRepository.save(any(Student.class))).thenReturn(savedStudent);

        Student result = studentService.createStudent(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(studentRepository, times(1)).existsByStudentCode("STU001");
        verify(studentMapper, times(1)).toEntity(dto);
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testCreateStudentDuplicateCode() {
        StudentRequestDTO dto = new StudentRequestDTO("Carlos", "Pérez",
                LocalDate.of(2010, 5, 15), "STU001", true);

        when(studentRepository.existsByStudentCode("STU001")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> studentService.createStudent(dto));

        assertEquals("El código de estudiante ya existe", exception.getMessage());
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void testUpdateStudentSuccess() {
        StudentRequestDTO dto = new StudentRequestDTO("Actualizado", "López",
                LocalDate.of(2010, 5, 15), "STU001", true);
        Student existingStudent = new Student();
        existingStudent.setId(1L);
        Student savedStudent = new Student();
        savedStudent.setId(1L);
        savedStudent.setFirstName("Actualizado");

        when(studentRepository.findById(1L)).thenReturn(Optional.of(existingStudent));
        doNothing().when(studentMapper).updateEntity(dto, existingStudent);
        when(studentRepository.save(existingStudent)).thenReturn(savedStudent);

        Student result = studentService.updateStudent(1L, dto);

        assertNotNull(result);
        assertEquals("Actualizado", result.getFirstName());
        verify(studentRepository, times(1)).findById(1L);
        verify(studentMapper, times(1)).updateEntity(dto, existingStudent);
    }

    @Test
    void testUpdateStudentNotFound() {
        StudentRequestDTO dto = new StudentRequestDTO("Test", "Test",
                LocalDate.of(2010, 1, 1), "STU999", true);

        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> studentService.updateStudent(99L, dto));

        assertTrue(exception.getMessage().contains("Estudiante no encontrado"));
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void testDeleteStudent() {
        doNothing().when(studentRepository).deleteById(1L);

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).deleteById(1L);
    }
}
