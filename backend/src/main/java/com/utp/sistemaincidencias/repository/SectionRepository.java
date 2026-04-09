package com.utp.sistemaincidencias.repository;

import com.utp.sistemaincidencias.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByGrade(String grade);
    List<Section> findByCoordinatorId(Long coordinatorId);
}
