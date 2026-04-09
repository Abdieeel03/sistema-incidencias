package com.utp.sistemaincidencias.repository;

import com.utp.sistemaincidencias.model.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    List<SchoolClass> findByTeacherId(Long teacherId);
    List<SchoolClass> findBySectionId(Long sectionId);
}
