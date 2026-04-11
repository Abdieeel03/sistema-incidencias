package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.SectionRequestDTO;
import com.utp.sistemaincidencias.mapper.SectionMapper;
import com.utp.sistemaincidencias.model.Section;
import com.utp.sistemaincidencias.repository.SectionRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import com.utp.sistemaincidencias.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final UserRepository userRepository;
    private final SectionMapper sectionMapper;

    @Override
    @Transactional(readOnly = true)
    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Section> getSectionById(Long id) {
        return sectionRepository.findById(id);
    }

    @Override
    @Transactional
    public Section createSection(SectionRequestDTO dto) {
        if (!userRepository.existsById(dto.getCoordinatorId())) {
            throw new RuntimeException("El coordinador con ID " + dto.getCoordinatorId() + " no existe");
        }

        Section section = sectionMapper.toEntity(dto);
        return sectionRepository.save(section);
    }

    @Override
    @Transactional
    public Section updateSection(Long id, SectionRequestDTO dto) {
        return sectionRepository.findById(id).map(section -> {
            sectionMapper.updateEntity(dto, section);
            return sectionRepository.save(section);
        }).orElseThrow(() -> new RuntimeException("Sección no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }
}
