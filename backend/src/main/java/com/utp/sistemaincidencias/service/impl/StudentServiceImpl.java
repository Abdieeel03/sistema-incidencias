package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.StudentRequestDTO;
import com.utp.sistemaincidencias.mapper.StudentMapper;
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
    private final StudentMapper studentMapper;

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
    public Student createStudent(StudentRequestDTO dto) {
        if (studentRepository.existsByStudentCode(dto.getStudentCode())) {
            throw new RuntimeException("El código de estudiante ya existe");
        }

        Student student = studentMapper.toEntity(dto);
        return studentRepository.save(student);
    }

    @Override
    @Transactional
    public Student updateStudent(Long id, StudentRequestDTO dto) {
        return studentRepository.findById(id).map(student -> {
            studentMapper.updateEntity(dto, student);
            return studentRepository.save(student);
        }).orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}
