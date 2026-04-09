package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.model.SchoolClass;
import com.utp.sistemaincidencias.repository.SchoolClassRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import com.utp.sistemaincidencias.repository.SectionRepository;
import com.utp.sistemaincidencias.service.SchoolClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SchoolClassServiceImpl implements SchoolClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final UserRepository userRepository;
    private final SectionRepository sectionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SchoolClass> getAllClasses() {
        return schoolClassRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SchoolClass> getClassById(Long id) {
        return schoolClassRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SchoolClass> getClassesByTeacher(Long teacherId) {
        return schoolClassRepository.findByTeacherId(teacherId);
    }

    @Override
    @Transactional
    public SchoolClass createClass(SchoolClass schoolClass) {
        if (!userRepository.existsById(schoolClass.getTeacher().getId())) {
            throw new RuntimeException("El profesor con ID " + schoolClass.getTeacher().getId() + " no existe");
        }
        if (!sectionRepository.existsById(schoolClass.getSection().getId())) {
            throw new RuntimeException("La sección con ID " + schoolClass.getSection().getId() + " no existe");
        }
        return schoolClassRepository.save(schoolClass);
    }

    @Override
    @Transactional
    public SchoolClass updateClass(Long id, SchoolClass classDetails) {
        return schoolClassRepository.findById(id).map(schoolClass -> {
            schoolClass.setName(classDetails.getName());
            schoolClass.setDescription(classDetails.getDescription());
            schoolClass.setTeacher(classDetails.getTeacher());
            schoolClass.setSection(classDetails.getSection());
            return schoolClassRepository.save(schoolClass);
        }).orElseThrow(() -> new RuntimeException("Clase no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        schoolClassRepository.deleteById(id);
    }
}
