package com.utp.sistemaincidencias.service.impl;

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
    public Section createSection(Section section) {
        if (!userRepository.existsById(section.getCoordinator().getId())) {
            throw new RuntimeException("El coordinador con ID " + section.getCoordinator().getId() + " no existe");
        }
        return sectionRepository.save(section);
    }

    @Override
    @Transactional
    public Section updateSection(Long id, Section sectionDetails) {
        return sectionRepository.findById(id).map(section -> {
            section.setName(sectionDetails.getName());
            section.setGrade(sectionDetails.getGrade());
            section.setCapacity(sectionDetails.getCapacity());
            section.setCoordinator(sectionDetails.getCoordinator());
            return sectionRepository.save(section);
        }).orElseThrow(() -> new RuntimeException("Sección no encontrada con id: " + id));
    }

    @Override
    @Transactional
    public void deleteSection(Long id) {
        sectionRepository.deleteById(id);
    }
}
