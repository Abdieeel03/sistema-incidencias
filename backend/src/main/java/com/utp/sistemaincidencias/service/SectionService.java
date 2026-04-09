package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.model.Section;
import java.util.List;
import java.util.Optional;

public interface SectionService {
    List<Section> getAllSections();
    Optional<Section> getSectionById(Long id);
    Section createSection(Section section);
    Section updateSection(Long id, Section section);
    void deleteSection(Long id);
}
