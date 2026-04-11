package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.SectionRequestDTO;
import com.utp.sistemaincidencias.dto.SectionResponseDTO;
import com.utp.sistemaincidencias.mapper.SectionMapper;
import com.utp.sistemaincidencias.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;
    private final SectionMapper sectionMapper;

    @GetMapping
    public ResponseEntity<List<SectionResponseDTO>> getAllSections() {
        List<SectionResponseDTO> sections = sectionMapper.toResponseDTOList(sectionService.getAllSections());
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectionResponseDTO> getSectionById(@PathVariable Long id) {
        return sectionService.getSectionById(id)
                .map(section -> ResponseEntity.ok(sectionMapper.toResponseDTO(section)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SectionResponseDTO> createSection(@RequestBody SectionRequestDTO dto) {
        SectionResponseDTO response = sectionMapper.toResponseDTO(sectionService.createSection(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SectionResponseDTO> updateSection(@PathVariable Long id, @RequestBody SectionRequestDTO dto) {
        SectionResponseDTO response = sectionMapper.toResponseDTO(sectionService.updateSection(id, dto));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
