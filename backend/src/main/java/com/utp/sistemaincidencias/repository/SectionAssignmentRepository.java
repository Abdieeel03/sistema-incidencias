package com.utp.sistemaincidencias.repository;

import com.utp.sistemaincidencias.model.SectionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionAssignmentRepository extends JpaRepository<SectionAssignment, Long> {
    List<SectionAssignment> findByStudentId(Long studentId);
    List<SectionAssignment> findBySectionId(Long sectionId);
}
