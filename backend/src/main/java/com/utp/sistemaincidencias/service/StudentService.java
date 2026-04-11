package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.StudentRequestDTO;
import com.utp.sistemaincidencias.model.Student;
import java.util.List;
import java.util.Optional;

public interface StudentService {
    List<Student> getAllStudents();
    Optional<Student> getStudentById(Long id);
    Optional<Student> getStudentByCode(String code);
    Student createStudent(StudentRequestDTO dto);
    Student updateStudent(Long id, StudentRequestDTO dto);
    void deleteStudent(Long id);
}
