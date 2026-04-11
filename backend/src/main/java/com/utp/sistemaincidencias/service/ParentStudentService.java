package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.ParentStudentRequestDTO;
import com.utp.sistemaincidencias.model.ParentStudent;
import java.util.List;
import java.util.Optional;

public interface ParentStudentService {
    List<ParentStudent> getAllParentStudents();
    Optional<ParentStudent> getParentStudentById(Long id);
    List<ParentStudent> getByParentId(Long parentId);
    List<ParentStudent> getByStudentId(Long studentId);
    ParentStudent createParentStudent(ParentStudentRequestDTO dto);
    void deleteParentStudent(Long id);
}
