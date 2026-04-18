let modal;
let editing = false;
let usersCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    modal = new bootstrap.Modal(document.getElementById("sectionModal"));
    await loadUsers();
    await loadSections();
});

async function loadSections() {
    const sections = await getData("sections");
    const table = document.getElementById("sectionTable");
    table.innerHTML = "";

    sections.forEach(s => {
        const coordinator = usersCache.find(u => u.id === s.coordinatorId);
        table.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.grade}</td>
                <td>${s.capacity}</td>
                <td>${coordinator ? coordinator.name : "N/A"}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${s.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSection(${s.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function loadUsers() {
    const users = await getData("users");
    usersCache = users;

    const select = document.getElementById("coordinatorId");
    select.innerHTML = "";

    users.filter(u => u.role === "coordinador")
    .forEach(u => {
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
    document.getElementById("coordinatorId").value = s.coordinatorId;

    document.getElementById("modalTitle").innerText = "Editar Sección";
    modal.show();
}

async function saveSection() {
    const id = document.getElementById("sectionId").value;
    const name = document.getElementById("name").value.trim();
    const grade = document.getElementById("grade").value.trim();
    const capacity = document.getElementById("capacity").value.trim();
    const coordinatorId = document.getElementById("coordinatorId").value;

    if (!name || !grade || !capacity || !coordinatorId) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const data = {
        name: name,
        grade: grade,
        capacity: parseInt(capacity),
        coordinatorId: coordinatorId
    };
    try {
        if (editing) {
            await putData(`sections/${id}`, data);
        } else {
            await postData("sections", data);
        }

        modal.hide();
        loadSections();
        } catch (error) {
            console.error(error);
            alert("Error al guardar usuario");
        }
}

async function deleteSection(id) {
    if (confirm("¿Eliminar sección?")) {
        await deleteData(`sections/${id}`);
        loadSections();
    }
}