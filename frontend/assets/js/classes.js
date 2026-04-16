let modal;
let editing = false;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("classModal"));

    loadClasses();
    loadUsers();
    loadSections();
});

async function loadClasses() {
    const classes = await getData("classes");

    const table = document.getElementById("classTable");
    table.innerHTML = "";

    classes.forEach(c => {
        table.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.description || ""}</td>
                <td>${c.teacher?.name || "N/A"}</td>
                <td>${c.section?.name || "N/A"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${c.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClass(${c.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function loadUsers() {
    const users = await getData("users");
    const select = document.getElementById("teacherId");

    select.innerHTML = "";
    users.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });
}

async function loadSections() {
    const sections = await getData("sections");
    const select = document.getElementById("sectionId");

    select.innerHTML = "";
    sections.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
}

function openCreateModal() {
    editing = false;
    document.getElementById("classForm").reset();
    document.getElementById("classId").value = "";
    document.getElementById("modalTitle").innerText = "Crear Clase";
    modal.show();
}

async function openEditModal(id) {
    editing = true;

    const c = await getData(`classes/${id}`);

    document.getElementById("classId").value = c.id;
    document.getElementById("name").value = c.name;
    document.getElementById("description").value = c.description;
    document.getElementById("teacherId").value = c.teacher?.id;
    document.getElementById("sectionId").value = c.section?.id;

    document.getElementById("modalTitle").innerText = "Editar Clase";
    modal.show();
}

async function saveClass() {
    const id = document.getElementById("classId").value;

    const data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        teacherId: document.getElementById("teacherId").value,
        sectionId: document.getElementById("sectionId").value
    };

    if (editing) {
        await putData(`classes/${id}`, data);
    } else {
        await postData("classes", data);
    }

    modal.hide();
    loadClasses();
}

async function deleteClass(id) {
    if (confirm("¿Eliminar clase?")) {
        await deleteData(`classes/${id}`);
        loadClasses();
    }
}