let modal;
let editing = false;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("incidentModal"));

    loadIncidents();
    loadStudents();
    loadClasses();
    loadUsers();
});

async function loadIncidents() {
    const incidents = await getData("incidents");
    const table = document.getElementById("incidentTable");

    table.innerHTML = "";

    incidents.forEach(i => {
        table.innerHTML += `
            <tr>
                <td>${i.id}</td>
                <td>${i.title}</td>
                <td>${i.student?.firstName} ${i.student?.lastName}</td>
                <td>${i.schoolClass?.name}</td>
                <td>${i.reportedBy?.name}</td>
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
    const select = document.getElementById("studentId");

    select.innerHTML = "";
    students.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.firstName} ${s.lastName}</option>`;
    });
}

async function loadClasses() {
    const classes = await getData("classes");
    const select = document.getElementById("classId");

    select.innerHTML = "";
    classes.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

async function loadUsers() {
    const users = await getData("users");
    const select = document.getElementById("reportedBy");

    select.innerHTML = "";
    users.forEach(u => {
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

    const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        studentId: document.getElementById("studentId").value,
        classId: document.getElementById("classId").value,
        reportedBy: document.getElementById("reportedBy").value,
        status: document.getElementById("status").value,
        incidentDate: document.getElementById("incidentDate").value
    };

    if (editing) {
        await putData(`incidents/${id}`, data);
    } else {
        await postData("incidents", data);
    }

    modal.hide();
    loadIncidents();
}

async function deleteIncident(id) {
    if (confirm("¿Eliminar incidencia?")) {
        await deleteData(`incidents/${id}`);
        loadIncidents();
    }
}