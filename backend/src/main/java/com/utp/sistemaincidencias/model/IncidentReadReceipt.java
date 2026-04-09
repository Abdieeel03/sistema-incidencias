package com.utp.sistemaincidencias.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "incident_read_receipts",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_incident_parent_receipt",
                columnNames = {"incident_id", "parent_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncidentReadReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "incident_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_receipt_incident"))
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_receipt_parent"))
    private User parent;

    // read_at actúa como timestamp de creación inmutable
    @CreationTimestamp
    @Column(name = "read_at", nullable = false, updatable = false)
    private LocalDateTime readAt;
}
