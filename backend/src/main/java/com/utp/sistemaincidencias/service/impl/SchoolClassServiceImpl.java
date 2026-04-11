package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.SchoolClassRequestDTO;
import com.utp.sistemaincidencias.mapper.SchoolClassMapper;
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
    private final SchoolClassMapper schoolClassMapper;

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
    public SchoolClass createClass(SchoolClassRequestDTO dto) {
        if (!userRepository.existsById(dto.getTeacherId())) {
            throw new RuntimeException("El profesor con ID " + dto.getTeacherId() + " no existe");
        }
        if (!sectionRepository.existsById(dto.getSectionId())) {
            throw new RuntimeException("La sección con ID " + dto.getSectionId() + " no existe");
        }

        SchoolClass schoolClass = schoolClassMapper.toEntity(dto);
        return schoolClassRepository.save(schoolClass);
    }

    @Override
    @Transactional
    public SchoolClass updateClass(Long id, SchoolClassRequestDTO dto) {
        return schoolClassRepository.findById(id).map(schoolClass -> {
            schoolClassMapper.updateEntity(dto, schoolClass);
            return schoolClassRepository.save(schoolClass);
        }).orElseThrow(() -> new RuntimeException("Clase no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public void deleteClass(Long id) {
        schoolClassRepository.deleteById(id);
    }
}
