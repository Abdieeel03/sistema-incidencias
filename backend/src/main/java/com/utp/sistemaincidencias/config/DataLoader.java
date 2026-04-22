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

        // ── Coordinadores ──
        List<User> coordinadores = createUsers(List.of(
                new String[]{"Carlos Mendoza López", "carlos.mendoza@colegio.edu.pe"},
                new String[]{"María Elena Quispe", "maria.quispe@colegio.edu.pe"},
                new String[]{"Roberto Sánchez Díaz", "roberto.sanchez@colegio.edu.pe"}
        ), UserRole.coordinador);
        log.info("✅ {} coordinadores creados", coordinadores.size());

        // ── Profesores ──
        List<User> profesores = createUsers(List.of(
                new String[]{"Ana García Flores", "ana.garcia@colegio.edu.pe"},
                new String[]{"Luis Torres Vargas", "luis.torres@colegio.edu.pe"},
                new String[]{"Carmen Ruiz Paredes", "carmen.ruiz@colegio.edu.pe"},
                new String[]{"Jorge Castillo Ramos", "jorge.castillo@colegio.edu.pe"},
                new String[]{"Patricia Herrera Luna", "patricia.herrera@colegio.edu.pe"},
                new String[]{"Miguel Ángel Rojas", "miguel.rojas@colegio.edu.pe"},
                new String[]{"Sofía Delgado Vega", "sofia.delgado@colegio.edu.pe"},
                new String[]{"Fernando Morales Cruz", "fernando.morales@colegio.edu.pe"},
                new String[]{"Isabel Navarro Pinto", "isabel.navarro@colegio.edu.pe"},
                new String[]{"Ricardo Campos Silva", "ricardo.campos@colegio.edu.pe"}
        ), UserRole.profesor);
        log.info("✅ {} profesores creados", profesores.size());

        // ── Padres ──
        List<User> padres = createUsers(List.of(
                new String[]{"Pedro Ramírez Huamán", "pedro.ramirez@gmail.com"},
                new String[]{"Rosa Martínez Cáceres", "rosa.martinez@gmail.com"},
                new String[]{"Juan Pablo Fernández", "juan.fernandez@gmail.com"},
                new String[]{"Lucía Espinoza Ríos", "lucia.espinoza@gmail.com"},
                new String[]{"Andrés Gutiérrez Peña", "andres.gutierrez@gmail.com"},
                new String[]{"Diana Salazar Ochoa", "diana.salazar@gmail.com"},
                new String[]{"Óscar Chávez Medina", "oscar.chavez@gmail.com"},
                new String[]{"Elena Vargas Tapia", "elena.vargas@gmail.com"},
                new String[]{"Héctor Núñez Castro", "hector.nunez@gmail.com"},
                new String[]{"Claudia Ortiz Zamora", "claudia.ortiz@gmail.com"},
                new String[]{"Manuel Flores Aguilar", "manuel.flores@gmail.com"},
                new String[]{"Verónica Díaz Romero", "veronica.diaz@gmail.com"},
                new String[]{"Raúl Paredes Benítez", "raul.paredes@gmail.com"},
                new String[]{"Gabriela Jiménez Soto", "gabriela.jimenez@gmail.com"},
                new String[]{"Alberto Reyes Lara", "alberto.reyes@gmail.com"},
                new String[]{"Mónica Castro Mejía", "monica.castro@gmail.com"},
                new String[]{"Enrique Peña Valdivia", "enrique.pena@gmail.com"},
                new String[]{"Sandra López Miranda", "sandra.lopez@gmail.com"},
                new String[]{"Julio Acosta Fuentes", "julio.acosta@gmail.com"},
                new String[]{"Teresa Ríos Cornejo", "teresa.rios@gmail.com"}
        ), UserRole.padre);
        log.info("✅ {} padres creados", padres.size());

        // ── Estudiantes (40) ──
        List<Student> estudiantes = createStudents();
        log.info("✅ {} estudiantes creados", estudiantes.size());

        // ── Secciones ──
        List<Section> secciones = List.of(
                createSection("A", "1° Secundaria", (short) 30, coordinadores.get(0)),
                createSection("B", "1° Secundaria", (short) 30, coordinadores.get(0)),
                createSection("A", "2° Secundaria", (short) 30, coordinadores.get(1)),
                createSection("B", "2° Secundaria", (short) 30, coordinadores.get(1)),
                createSection("A", "3° Secundaria", (short) 28, coordinadores.get(2)),
                createSection("B", "3° Secundaria", (short) 28, coordinadores.get(2)),
                createSection("A", "4° Secundaria", (short) 25, coordinadores.get(0)),
                createSection("A", "5° Secundaria", (short) 25, coordinadores.get(1))
        );
        log.info("✅ {} secciones creadas", secciones.size());

        // ── Clases (materias por sección) ──
        String[] materias = {"Matemáticas", "Comunicación", "Ciencias Naturales", "Historia", "Inglés"};
        int profIdx = 0;
        int classCount = 0;
        for (Section seccion : secciones) {
            for (String materia : materias) {
                User prof = profesores.get(profIdx % profesores.size());
                createSchoolClass(materia + " - " + seccion.getGrade() + " " + seccion.getName(),
                        "Curso de " + materia + " para " + seccion.getGrade() + " sección " + seccion.getName(),
                        prof, seccion);
                profIdx++;
                classCount++;
            }
        }
        log.info("✅ {} clases creadas", classCount);

        // ── Relaciones Padre-Estudiante ──
        int psCount = 0;
        for (int i = 0; i < estudiantes.size(); i++) {
            // Cada estudiante tiene al menos 1 padre, algunos tienen 2
            User padre1 = padres.get(i % padres.size());
            createParentStudent(padre1, estudiantes.get(i));
            psCount++;

            if (i % 3 == 0) { // ~1 de cada 3 tiene segundo padre
                User padre2 = padres.get((i + 10) % padres.size());
                if (!padre1.getId().equals(padre2.getId())) {
                    createParentStudent(padre2, estudiantes.get(i));
                    psCount++;
                }
            }
        }
        log.info("✅ {} relaciones padre-estudiante creadas", psCount);

        log.info("🎉 Carga de datos completada exitosamente.");
    }

    // ── Métodos auxiliares ──

    private List<User> createUsers(List<String[]> data, UserRole role) {
        List<User> users = new ArrayList<>();
        for (String[] d : data) {
            User user = new User();
            user.setName(d[0]);
            user.setEmail(d[1]);
            user.setPasswordHash("password123");
            user.setRole(role);
            user.setIsActive(true);
            users.add(userRepository.save(user));
        }
        return users;
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

    private Section createSection(String name, String grade, short capacity, User coordinator) {
        Section section = new Section();
        section.setName(name);
        section.setGrade(grade);
        section.setCapacity(capacity);
        section.setCoordinator(coordinator);
        return sectionRepository.save(section);
    }

    private void createSchoolClass(String name, String description, User teacher, Section section) {
        SchoolClass sc = new SchoolClass();
        sc.setName(name);
        sc.setDescription(description);
        sc.setTeacher(teacher);
        sc.setSection(section);
        schoolClassRepository.save(sc);
    }

    private void createParentStudent(User parent, Student student) {
        ParentStudent ps = new ParentStudent();
        ps.setParent(parent);
        ps.setStudent(student);
        parentStudentRepository.save(ps);
    }
}
