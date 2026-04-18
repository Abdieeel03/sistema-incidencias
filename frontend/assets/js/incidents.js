let modal;
let editing = false;
let studentsCache = [];
let classesCache = [];
let usersCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    modal = new bootstrap.Modal(document.getElementById("incidentModal"));

    await loadStudents();
    await loadClasses();
    await loadUsers();
    await loadIncidents();
});

async function loadIncidents() {
    const incidents = await getData("incidents");
    const table = document.getElementById("incidentTable");
    table.innerHTML = "";
    incidents.forEach(i => {
        const student = studentsCache.find(s => s.id === i.studentId);
        const schoolClass = classesCache.find(c => c.id === i.classId);
        const user = usersCache.find(u => u.id === i.reportedById);
        table.innerHTML += `
            <tr>
                <td>${i.title}</td>
                <td>${i.description}</td>
                <td>${student ? student.firstName + " " + student.lastName : "N/A"}</td>
                <td>${schoolClass ? schoolClass.name : "N/A"}</td>
                <td>${user ? user.name : "N/A"}</td>
                <td>${i.status}</td>
                <td>${i.incidentDate}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${i.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteIncident(${i.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function loadStudents() {
    const students = await getData("students");
    studentsCache = students;
    const select = document.getElementById("studentId");
    select.innerHTML = "";
    students.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.firstName} ${s.lastName}</option>`;
    });
}

async function loadClasses() {
    const classes = await getData("classes");
    classesCache = classes;
    const select = document.getElementById("classId");
    select.innerHTML = "";
    classes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

async function loadUsers() {
    const users = await getData("users");
    usersCache = users.filter(u => u.role === "profesor" || u.role === "coordinador");
    const select = document.getElementById("reportedBy");
    select.innerHTML = "";
    usersCache.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });
}

function openCreateModal() {
    editing = false;
    document.getElementById("incidentForm").reset();
    document.getElementById("incidentId").value = "";
    document.getElementById("modalTitle").innerText = "Crear Incidencia";
    modal.show();
}

async function openEditModal(id) {
    editing = true;
    const i = await getData(`incidents/${id}`);

    document.getElementById("incidentId").value = i.id;
    document.getElementById("title").value = i.title;
    document.getElementById("description").value = i.description;
    document.getElementById("studentId").value = i.student?.id;
    document.getElementById("classId").value = i.schoolClass?.id;
    document.getElementById("reportedBy").value = i.reportedBy?.id;
    document.getElementById("status").value = i.status;
    document.getElementById("incidentDate").value = i.incidentDate?.slice(0,16);

    document.getElementById("modalTitle").innerText = "Editar Incidencia";
    modal.show();
}

async function saveIncident() {

    const id = document.getElementById("incidentId").value;
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const studentId = document.getElementById("studentId").value;
    const classId = document.getElementById("classId").value;
    const reportedById = document.getElementById("reportedBy").value;
    const incidentDate = document.getElementById("incidentDate").value;
    if (!title || !description || !studentId || !classId || !reportedById || !incidentDate) {
        alert("Todos los campos son obligatorios");
        return;
    }
    const data = {
        title,
        description,
        studentId,
        classId,
        reportedById,
        status: document.getElementById("status").value,
        incidentDate
    };
    try {
        if (editing) {
            await putData(`incidents/${id}`, data);
        } else {
            await postData("incidents", data);
        }
        modal.hide();
        loadIncidents();
    } catch (error) {
        console.error(error);
        alert("Error al guardar incidencia");
    }
}

async function deleteIncident(id) {
    if (confirm("¿Eliminar incidencia?")) {
        await deleteData(`incidents/${id}`);
        loadIncidents();
    }
}