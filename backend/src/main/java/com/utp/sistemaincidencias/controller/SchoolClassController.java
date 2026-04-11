package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.SchoolClassRequestDTO;
import com.utp.sistemaincidencias.dto.SchoolClassResponseDTO;
import com.utp.sistemaincidencias.mapper.SchoolClassMapper;
import com.utp.sistemaincidencias.service.SchoolClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
public class SchoolClassController {

    private final SchoolClassService schoolClassService;
    private final SchoolClassMapper schoolClassMapper;

    @GetMapping
    public ResponseEntity<List<SchoolClassResponseDTO>> getAllClasses() {
        List<SchoolClassResponseDTO> classes = schoolClassMapper.toResponseDTOList(schoolClassService.getAllClasses());
        return ResponseEntity.ok(classes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClassResponseDTO> getClassById(@PathVariable Long id) {
        return schoolClassService.getClassById(id)
                .map(sc -> ResponseEntity.ok(schoolClassMapper.toResponseDTO(sc)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<SchoolClassResponseDTO>> getClassesByTeacher(@PathVariable Long teacherId) {
        List<SchoolClassResponseDTO> classes = schoolClassMapper.toResponseDTOList(
                schoolClassService.getClassesByTeacher(teacherId));
        return ResponseEntity.ok(classes);
    }

    @PostMapping
    public ResponseEntity<SchoolClassResponseDTO> createClass(@RequestBody SchoolClassRequestDTO dto) {
        SchoolClassResponseDTO response = schoolClassMapper.toResponseDTO(schoolClassService.createClass(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchoolClassResponseDTO> updateClass(@PathVariable Long id, @RequestBody SchoolClassRequestDTO dto) {
        SchoolClassResponseDTO response = schoolClassMapper.toResponseDTO(schoolClassService.updateClass(id, dto));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        schoolClassService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}
