package com.utp.sistemaincidencias.config;

import com.utp.sistemaincidencias.model.*;
import com.utp.sistemaincidencias.model.enums.UserRole;
import com.utp.sistemaincidencias.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final SectionRepository sectionRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final ParentStudentRepository parentStudentRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("📦 Base de datos ya contiene datos. Saltando DataLoader.");
            return;
        }

        log.info("🚀 Iniciando carga de datos base...");

        // ── Estudiantes (40) ──
        List<Student> estudiantes = createStudents();
        log.info("✅ {} estudiantes creados", estudiantes.size());

    }

    private List<Student> createStudents() {
        String[][] data = {
                {"Alejandro", "Ramírez García", "2011-03-15", "EST-001"},
                {"Valentina", "Martínez López", "2011-07-22", "EST-002"},
                {"Sebastián", "Fernández Quispe", "2010-11-08", "EST-003"},
                {"Camila", "Espinoza Torres", "2011-01-30", "EST-004"},
                {"Mateo", "Gutiérrez Flores", "2010-05-14", "EST-005"},
                {"Isabella", "Salazar Ruiz", "2011-09-03", "EST-006"},
                {"Daniel", "Chávez Castillo", "2010-12-19", "EST-007"},
                {"Luciana", "Vargas Herrera", "2011-04-25", "EST-008"},
                {"Santiago", "Núñez Rojas", "2010-08-11", "EST-009"},
                {"Sofía", "Ortiz Delgado", "2011-06-07", "EST-010"},
                {"Leonardo", "Flores Morales", "2012-02-28", "EST-011"},
                {"Antonella", "Díaz Navarro", "2012-10-16", "EST-012"},
                {"Thiago", "Paredes Campos", "2012-05-09", "EST-013"},
                {"Renata", "Jiménez Silva", "2012-08-21", "EST-014"},
                {"Emiliano", "Reyes Huamán", "2012-01-04", "EST-015"},
                {"Ariana", "Castro Cáceres", "2012-11-30", "EST-016"},
                {"Joaquín", "Peña Ríos", "2013-03-17", "EST-017"},
                {"Valeria", "López Peña", "2013-07-08", "EST-018"},
                {"Nicolás", "Acosta Ochoa", "2013-09-25", "EST-019"},
                {"Mariana", "Ríos Medina", "2013-04-12", "EST-020"},
                {"Facundo", "Ramírez Tapia", "2010-06-20", "EST-021"},
                {"Catalina", "Martínez Castro", "2010-02-14", "EST-022"},
                {"Benjamín", "Torres Zamora", "2011-10-31", "EST-023"},
                {"Emma", "García Aguilar", "2011-12-05", "EST-024"},
                {"Lucas", "Ruiz Romero", "2012-07-18", "EST-025"},
                {"Mía", "Castillo Benítez", "2012-03-22", "EST-026"},
                {"Tomás", "Herrera Soto", "2013-01-09", "EST-027"},
                {"Abril", "Rojas Lara", "2013-11-14", "EST-028"},
                {"Maximiliano", "Delgado Mejía", "2010-04-03", "EST-029"},
                {"Julieta", "Morales Valdivia", "2010-09-27", "EST-030"},
                {"Ian", "Navarro Miranda", "2011-05-16", "EST-031"},
                {"Bianca", "Campos Fuentes", "2011-08-09", "EST-032"},
                {"Dylan", "Silva Cornejo", "2012-06-24", "EST-033"},
                {"Luana", "Huamán Reyes", "2012-12-01", "EST-034"},
                {"Gael", "Cáceres Ortiz", "2013-02-18", "EST-035"},
                {"Alma", "Ríos Chávez", "2013-10-07", "EST-036"},
                {"Bruno", "Ochoa Núñez", "2010-07-13", "EST-037"},
                {"Zoe", "Medina Vargas", "2011-11-22", "EST-038"},
                {"Dante", "Tapia Flores", "2012-04-06", "EST-039"},
                {"Luna", "Zamora Díaz", "2013-06-30", "EST-040"}
        };

        List<Student> students = new ArrayList<>();
        for (String[] d : data) {
            Student s = new Student();
            s.setFirstName(d[0]);
            s.setLastName(d[1]);
            s.setBirthDate(LocalDate.parse(d[2]));
            s.setStudentCode(d[3]);
            s.setIsActive(true);
            students.add(studentRepository.save(s));
        }
        return students;
    }
}
