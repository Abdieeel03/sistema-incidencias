package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.ParentStudentRequestDTO;
import com.utp.sistemaincidencias.mapper.ParentStudentMapper;
import com.utp.sistemaincidencias.model.ParentStudent;
import com.utp.sistemaincidencias.repository.ParentStudentRepository;
import com.utp.sistemaincidencias.repository.StudentRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import com.utp.sistemaincidencias.service.ParentStudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParentStudentServiceImpl implements ParentStudentService {

    private final ParentStudentRepository parentStudentRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ParentStudentMapper parentStudentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ParentStudent> getAllParentStudents() {
        return parentStudentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ParentStudent> getParentStudentById(Long id) {
        return parentStudentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParentStudent> getByParentId(Long parentId) {
        return parentStudentRepository.findByParentId(parentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ParentStudent> getByStudentId(Long studentId) {
        return parentStudentRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional
    public ParentStudent createParentStudent(ParentStudentRequestDTO dto) {
        if (!userRepository.existsById(dto.getParentId())) {
            throw new RuntimeException("El padre con ID " + dto.getParentId() + " no existe");
        }
        if (!studentRepository.existsById(dto.getStudentId())) {
            throw new RuntimeException("El estudiante con ID " + dto.getStudentId() + " no existe");
        }

        ParentStudent parentStudent = parentStudentMapper.toEntity(dto);
        return parentStudentRepository.save(parentStudent);
    }

    @Override
    @Transactional
    public void deleteParentStudent(Long id) {
        parentStudentRepository.deleteById(id);
    }
}
