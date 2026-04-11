package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.ParentStudentRequestDTO;
import com.utp.sistemaincidencias.dto.ParentStudentResponseDTO;
import com.utp.sistemaincidencias.mapper.ParentStudentMapper;
import com.utp.sistemaincidencias.service.ParentStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/parent-students")
@RequiredArgsConstructor
public class ParentStudentController {

    private final ParentStudentService parentStudentService;
    private final ParentStudentMapper parentStudentMapper;

    @GetMapping
    public ResponseEntity<List<ParentStudentResponseDTO>> getAllParentStudents() {
        List<ParentStudentResponseDTO> list = parentStudentMapper.toResponseDTOList(
                parentStudentService.getAllParentStudents());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParentStudentResponseDTO> getParentStudentById(@PathVariable Long id) {
        return parentStudentService.getParentStudentById(id)
                .map(ps -> ResponseEntity.ok(parentStudentMapper.toResponseDTO(ps)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<ParentStudentResponseDTO>> getByParentId(@PathVariable Long parentId) {
        List<ParentStudentResponseDTO> list = parentStudentMapper.toResponseDTOList(
                parentStudentService.getByParentId(parentId));
        return ResponseEntity.ok(list);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ParentStudentResponseDTO>> getByStudentId(@PathVariable Long studentId) {
        List<ParentStudentResponseDTO> list = parentStudentMapper.toResponseDTOList(
                parentStudentService.getByStudentId(studentId));
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ParentStudentResponseDTO> createParentStudent(@RequestBody ParentStudentRequestDTO dto) {
        ParentStudentResponseDTO response = parentStudentMapper.toResponseDTO(
                parentStudentService.createParentStudent(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParentStudent(@PathVariable Long id) {
        parentStudentService.deleteParentStudent(id);
        return ResponseEntity.noContent().build();
    }
}
