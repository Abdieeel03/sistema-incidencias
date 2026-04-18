let modal;
let studentsCache = [];
let sectionsCache = [];
let classesCache = [];
let usersCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    modal = new bootstrap.Modal(document.getElementById("assignmentModal"));
    await loadStudents();
    await loadSections();
    await loadClasses();
    await loadUsers();
    await loadAssignments();
});

async function loadAssignments() {
    try {
        const data = await getData("section-assignments");
        const table = document.getElementById("assignmentTable");
        let html = "";

        data.forEach(a => {
            const student = studentsCache.find(s => s.id == a.studentId);
            const section = sectionsCache.find(s => s.id == a.sectionId);
            const schoolClass = classesCache.find(c => c.id == a.classId);
            const user = usersCache.find(u => u.id == a.assignedById);

            html += `
                <tr>
                    <td>${student ? student.firstName + " " + student.lastName : "N/A"}</td>
                    <td>${section ? section.grade + " - " + section.name : "N/A"}</td>
                    <td>${schoolClass ? schoolClass.name : "N/A"}</td>
                    <td>${user ? user.name : "N/A"}</td>
                    <td class="text-center">
                        <button class="btn btn-danger btn-sm" onclick="deleteAssignment(${a.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        table.innerHTML = html;

    } catch (error) {
        console.error("Error cargando asignaciones:", error);
    }
}

async function loadStudents() {
    try {
        const data = await getData("students");
        studentsCache = data;
        const select = document.getElementById("studentId");
        select.innerHTML = "";
        data.forEach(s => {
            select.innerHTML += `
                <option value="${s.id}">
                    ${s.firstName} ${s.lastName}
                </option>
            `;
        });
    } catch (error) {
        console.error("Error cargando estudiantes:", error);
    }
}

async function loadSections() {
    try {
        const data = await getData("sections");
        sectionsCache = data;
        const select = document.getElementById("sectionId");
        select.innerHTML = "";
        data.forEach(s => {
            select.innerHTML += `
                <option value="${s.id}">
                    ${s.grade} - ${s.name}
                </option>
            `;
        });
    } catch (error) {
        console.error("Error cargando secciones:", error);
    }
}

async function loadClasses() {
    try {
        const data = await getData("classes");
        classesCache = data;
        const select = document.getElementById("classId");
        select.innerHTML = "";
        data.forEach(c => {
            select.innerHTML += `
                <option value="${c.id}">
                    ${c.name}
                </option>
            `;
        });
    } catch (error) {
        console.error("Error cargando clases:", error);
    }
}

async function loadUsers() {
    try {
        const data = await getData("users");
        usersCache = data;
        const select = document.getElementById("assignedById");
        select.innerHTML = "";
        data.forEach(u => {
            select.innerHTML += `
                <option value="${u.id}">
                    ${u.name}
                </option>
            `;
        });
    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

function openCreateModal() {
    document.getElementById("assignmentForm").reset();
    document.getElementById("studentId").selectedIndex = 0;
    document.getElementById("sectionId").selectedIndex = 0;
    document.getElementById("classId").selectedIndex = 0;
    document.getElementById("assignedById").selectedIndex = 0;
    modal.show();
}

async function saveAssignment() {
    const studentId = document.getElementById("studentId").value;
    const sectionId = document.getElementById("sectionId").value;
    const classId = document.getElementById("classId").value;
    const assignedById = document.getElementById("assignedById").value;
    if (!studentId || !sectionId || !classId || !assignedById) {
        alert("Todos los campos son obligatorios");
        return;
    }
    const data = {
        studentId: Number(studentId),
        sectionId: Number(sectionId),
        classId: Number(classId),
        assignedById: Number(assignedById)
    };
    try {
        await postData("section-assignments", data);
        modal.hide();
        await loadAssignments();
    } catch (error) {
        console.error(error);
        alert("Error al crear asignación");
    }
}

async function deleteAssignment(id) {
    if (confirm("¿Eliminar asignación?")) {
        try {
            await deleteData(`section-assignments/${id}`);
            await loadAssignments();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar asignación");
        }
    }
}