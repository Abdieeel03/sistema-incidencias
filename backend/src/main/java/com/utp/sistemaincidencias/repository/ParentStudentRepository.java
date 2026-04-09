package com.utp.sistemaincidencias.repository;

import com.utp.sistemaincidencias.model.ParentStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentStudentRepository extends JpaRepository<ParentStudent, Long> {
    List<ParentStudent> findByParentId(Long parentId);
    List<ParentStudent> findByStudentId(Long studentId);
}
