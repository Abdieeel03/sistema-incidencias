package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.SectionAssignmentRequestDTO;
import com.utp.sistemaincidencias.model.SectionAssignment;
import java.util.List;
import java.util.Optional;

public interface SectionAssignmentService {
    List<SectionAssignment> getAllAssignments();
    Optional<SectionAssignment> getAssignmentById(Long id);
    List<SectionAssignment> getByStudentId(Long studentId);
    List<SectionAssignment> getBySectionId(Long sectionId);
    SectionAssignment createAssignment(SectionAssignmentRequestDTO dto);
    void deleteAssignment(Long id);
}
