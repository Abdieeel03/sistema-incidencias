package com.utp.sistemaincidencias.repository;

import com.utp.sistemaincidencias.model.IncidentReadReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentReadReceiptRepository extends JpaRepository<IncidentReadReceipt, Long> {
    List<IncidentReadReceipt> findByIncidentId(Long incidentId);
    List<IncidentReadReceipt> findByParentId(Long parentId);
}
