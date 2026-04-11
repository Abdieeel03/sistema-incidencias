package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.StudentRequestDTO;
import com.utp.sistemaincidencias.dto.StudentResponseDTO;
import com.utp.sistemaincidencias.mapper.StudentMapper;
import com.utp.sistemaincidencias.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final StudentMapper studentMapper;

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        List<StudentResponseDTO> students = studentMapper.toResponseDTOList(studentService.getAllStudents());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(student -> ResponseEntity.ok(studentMapper.toResponseDTO(student)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<StudentResponseDTO> getStudentByCode(@PathVariable String code) {
        return studentService.getStudentByCode(code)
                .map(student -> ResponseEntity.ok(studentMapper.toResponseDTO(student)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentRequestDTO dto) {
        StudentResponseDTO response = studentMapper.toResponseDTO(studentService.createStudent(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(@PathVariable Long id, @RequestBody StudentRequestDTO dto) {
        StudentResponseDTO response = studentMapper.toResponseDTO(studentService.updateStudent(id, dto));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
