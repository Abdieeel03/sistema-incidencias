package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.SectionRequestDTO;
import com.utp.sistemaincidencias.model.Section;
import java.util.List;
import java.util.Optional;

public interface SectionService {
    List<Section> getAllSections();
    Optional<Section> getSectionById(Long id);
    Section createSection(SectionRequestDTO dto);
    Section updateSection(Long id, SectionRequestDTO dto);
    void deleteSection(Long id);
}
