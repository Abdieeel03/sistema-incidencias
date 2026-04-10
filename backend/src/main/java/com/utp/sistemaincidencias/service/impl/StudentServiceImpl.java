package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.model.Student;
import com.utp.sistemaincidencias.repository.StudentRepository;
import com.utp.sistemaincidencias.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Student> getStudentByCode(String code) {
        return studentRepository.findByStudentCode(code);
    }

    @Override
    @Transactional
    public Student createStudent(Student student) {
        if (studentRepository.existsByStudentCode(student.getStudentCode())) {
            throw new RuntimeException("El código de estudiante ya existe");
        }
        return studentRepository.save(student);
    }

    @Override
    @Transactional
    public Student updateStudent(Long id, Student studentDetails) {
        return studentRepository.findById(id).map(student -> {
            student.setFirstName(studentDetails.getFirstName());
            student.setLastName(studentDetails.getLastName());
            student.setBirthDate(studentDetails.getBirthDate());
            student.setStudentCode(studentDetails.getStudentCode());
            student.setIsActive(studentDetails.getIsActive());
            return studentRepository.save(student);
        }).orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}
