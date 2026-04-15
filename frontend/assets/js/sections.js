let modal;
let editing = false;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("sectionModal"));
    loadSections();
    loadUsers();
});

async function loadSections() {
    const sections = await getData("sections");

    const table = document.getElementById("sectionTable");
    table.innerHTML = "";

    sections.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.grade}</td>
                <td>${s.capacity}</td>
                <td>${s.coordinator?.name || "N/A"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${s.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSection(${s.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function loadUsers() {
    const users = await getData("users");

    const select = document.getElementById("coordinatorId");
    select.innerHTML = "";

    users.forEach(u => {
        select.innerHTML += `
            <option value="${u.id}">${u.name}</option>
        `;
    });
}

function openCreateModal() {
    editing = false;
    document.getElementById("sectionForm").reset();
    document.getElementById("sectionId").value = "";
    document.getElementById("modalTitle").innerText = "Crear Sección";
    modal.show();
}

async function openEditModal(id) {
    editing = true;

    const s = await getData(`sections/${id}`);

    document.getElementById("sectionId").value = s.id;
    document.getElementById("name").value = s.name;
    document.getElementById("grade").value = s.grade;
    document.getElementById("capacity").value = s.capacity;
    document.getElementById("coordinatorId").value = s.coordinator?.id;

    document.getElementById("modalTitle").innerText = "Editar Sección";
    modal.show();
}

async function saveSection() {
    const id = document.getElementById("sectionId").value;

    const data = {
        name: document.getElementById("name").value,
        grade: document.getElementById("grade").value,
        capacity: parseInt(document.getElementById("capacity").value),
        coordinatorId: document.getElementById("coordinatorId").value
    };

    if (editing) {
        await putData(`sections/${id}`, data);
    } else {
        await postData("sections", data);
    }

    modal.hide();
    loadSections();
}

async function deleteSection(id) {
    if (confirm("¿Eliminar sección?")) {
        await deleteData(`sections/${id}`);
        loadSections();
    }
}