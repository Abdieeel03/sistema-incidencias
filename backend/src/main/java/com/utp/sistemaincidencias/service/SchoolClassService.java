package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.SchoolClassRequestDTO;
import com.utp.sistemaincidencias.model.SchoolClass;
import java.util.List;
import java.util.Optional;

public interface SchoolClassService {
    List<SchoolClass> getAllClasses();
    Optional<SchoolClass> getClassById(Long id);
    List<SchoolClass> getClassesByTeacher(Long teacherId);
    SchoolClass createClass(SchoolClassRequestDTO dto);
    SchoolClass updateClass(Long id, SchoolClassRequestDTO dto);
    void deleteClass(Long id);
}
