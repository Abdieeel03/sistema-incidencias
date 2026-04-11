package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.SectionAssignmentRequestDTO;
import com.utp.sistemaincidencias.mapper.SectionAssignmentMapper;
import com.utp.sistemaincidencias.model.SectionAssignment;
import com.utp.sistemaincidencias.repository.SchoolClassRepository;
import com.utp.sistemaincidencias.repository.SectionAssignmentRepository;
import com.utp.sistemaincidencias.repository.SectionRepository;
import com.utp.sistemaincidencias.repository.StudentRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import com.utp.sistemaincidencias.service.SectionAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SectionAssignmentServiceImpl implements SectionAssignmentService {

    private final SectionAssignmentRepository sectionAssignmentRepository;
    private final StudentRepository studentRepository;
    private final SectionRepository sectionRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final UserRepository userRepository;
    private final SectionAssignmentMapper sectionAssignmentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SectionAssignment> getAllAssignments() {
        return sectionAssignmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SectionAssignment> getAssignmentById(Long id) {
        return sectionAssignmentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionAssignment> getByStudentId(Long studentId) {
        return sectionAssignmentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SectionAssignment> getBySectionId(Long sectionId) {
        return sectionAssignmentRepository.findBySectionId(sectionId);
    }

    @Override
    @Transactional
    public SectionAssignment createAssignment(SectionAssignmentRequestDTO dto) {
        if (!studentRepository.existsById(dto.getStudentId())) {
            throw new RuntimeException("El estudiante con ID " + dto.getStudentId() + " no existe");
        }
        if (!sectionRepository.existsById(dto.getSectionId())) {
            throw new RuntimeException("La sección con ID " + dto.getSectionId() + " no existe");
        }
        if (!schoolClassRepository.existsById(dto.getClassId())) {
            throw new RuntimeException("La clase con ID " + dto.getClassId() + " no existe");
        }
        if (!userRepository.existsById(dto.getAssignedById())) {
            throw new RuntimeException("El usuario asignador con ID " + dto.getAssignedById() + " no existe");
        }

        SectionAssignment assignment = sectionAssignmentMapper.toEntity(dto);
        return sectionAssignmentRepository.save(assignment);
    }

    @Override
    @Transactional
    public void deleteAssignment(Long id) {
        sectionAssignmentRepository.deleteById(id);
    }
}
