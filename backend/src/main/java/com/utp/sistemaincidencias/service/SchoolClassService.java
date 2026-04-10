package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.model.SchoolClass;
import java.util.List;
import java.util.Optional;

public interface SchoolClassService {
    List<SchoolClass> getAllClasses();
    Optional<SchoolClass> getClassById(Long id);
    List<SchoolClass> getClassesByTeacher(Long teacherId);
    SchoolClass createClass(SchoolClass schoolClass);
    SchoolClass updateClass(Long id, SchoolClass schoolClass);
    void deleteClass(Long id);
}
