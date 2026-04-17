package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.StudentRequestDTO;
import com.utp.sistemaincidencias.dto.StudentResponseDTO;
import com.utp.sistemaincidencias.mapper.StudentMapper;
import com.utp.sistemaincidencias.model.Student;
import com.utp.sistemaincidencias.service.StudentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private StudentService studentService;

    @Mock
    private StudentMapper studentMapper;

    @InjectMocks
    private StudentController studentController;

    private Student createStudent(Long id, String firstName, String code) {
        Student student = new Student();
        student.setId(id);
        student.setFirstName(firstName);
        student.setLastName("Test");
        student.setStudentCode(code);
        student.setIsActive(true);
        return student;
    }

    private StudentResponseDTO createResponseDTO(Long id, String firstName, String code) {
        LocalDateTime now = LocalDateTime.now();
        return new StudentResponseDTO(id, firstName, "Test",
                LocalDate.of(2010, 1, 1), code, true, now, now);
    }

    @Test
    void testGetAllStudents() {
        Student s1 = createStudent(1L, "Carlos", "STU001");
        Student s2 = createStudent(2L, "Ana", "STU002");
        StudentResponseDTO dto1 = createResponseDTO(1L, "Carlos", "STU001");
        StudentResponseDTO dto2 = createResponseDTO(2L, "Ana", "STU002");

        when(studentService.getAllStudents()).thenReturn(Arrays.asList(s1, s2));
        when(studentMapper.toResponseDTOList(Arrays.asList(s1, s2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<StudentResponseDTO>> response = studentController.getAllStudents();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetStudentByIdFound() {
        Student student = createStudent(1L, "Carlos", "STU001");
        StudentResponseDTO dto = createResponseDTO(1L, "Carlos", "STU001");

        when(studentService.getStudentById(1L)).thenReturn(Optional.of(student));
        when(studentMapper.toResponseDTO(student)).thenReturn(dto);

        ResponseEntity<StudentResponseDTO> response = studentController.getStudentById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Carlos", response.getBody().getFirstName());
    }

    @Test
    void testGetStudentByIdNotFound() {
        when(studentService.getStudentById(99L)).thenReturn(Optional.empty());

        ResponseEntity<StudentResponseDTO> response = studentController.getStudentById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetStudentByCodeFound() {
        Student student = createStudent(1L, "Carlos", "STU001");
        StudentResponseDTO dto = createResponseDTO(1L, "Carlos", "STU001");

        when(studentService.getStudentByCode("STU001")).thenReturn(Optional.of(student));
        when(studentMapper.toResponseDTO(student)).thenReturn(dto);

        ResponseEntity<StudentResponseDTO> response = studentController.getStudentByCode("STU001");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("STU001", response.getBody().getStudentCode());
    }

    @Test
    void testGetStudentByCodeNotFound() {
        when(studentService.getStudentByCode("NOEXISTE")).thenReturn(Optional.empty());

        ResponseEntity<StudentResponseDTO> response = studentController.getStudentByCode("NOEXISTE");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateStudent() {
        StudentRequestDTO requestDTO = new StudentRequestDTO("Carlos", "Pérez",
                LocalDate.of(2010, 5, 15), "STU001", true);
        Student createdStudent = createStudent(1L, "Carlos", "STU001");
        StudentResponseDTO responseDTO = createResponseDTO(1L, "Carlos", "STU001");

        when(studentService.createStudent(requestDTO)).thenReturn(createdStudent);
        when(studentMapper.toResponseDTO(createdStudent)).thenReturn(responseDTO);

        ResponseEntity<StudentResponseDTO> response = studentController.createStudent(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testUpdateStudent() {
        StudentRequestDTO requestDTO = new StudentRequestDTO("Actualizado", "López",
                LocalDate.of(2010, 5, 15), "STU001", true);
        Student updatedStudent = createStudent(1L, "Actualizado", "STU001");
        StudentResponseDTO responseDTO = createResponseDTO(1L, "Actualizado", "STU001");

        when(studentService.updateStudent(1L, requestDTO)).thenReturn(updatedStudent);
        when(studentMapper.toResponseDTO(updatedStudent)).thenReturn(responseDTO);

        ResponseEntity<StudentResponseDTO> response = studentController.updateStudent(1L, requestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Actualizado", response.getBody().getFirstName());
    }

    @Test
    void testDeleteStudent() {
        doNothing().when(studentService).deleteStudent(1L);

        ResponseEntity<Void> response = studentController.deleteStudent(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(studentService, times(1)).deleteStudent(1L);
    }
}
