let modal;
let editing = false;
let usersCache = [];
let sectionsCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    modal = new bootstrap.Modal(document.getElementById("classModal"));

    await loadUsers();
    await loadSections();
    await loadClasses();
});

async function loadClasses() {
    const classes = await getData("classes");

    const table = document.getElementById("classTable");
    table.innerHTML = "";

    classes.forEach(c => {

        const teacher = usersCache.find(u => u.id === c.teacherId);
        const section = sectionsCache.find(s => s.id === c.sectionId);

        table.innerHTML += `
            <tr>
                <td>${c.name}</td>
                <td>${c.description || ""}</td>
                <td>${teacher ? teacher.name : "N/A"}</td>
                <td>${section ? section.grade + " - " + section.name : "N/A"}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${c.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteClass(${c.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function loadUsers() {
    const users = await getData("users");
    usersCache = users;
    const select = document.getElementById("teacherId");
    select.innerHTML = "";

    users.filter(u => u.role === "profesor")
        .forEach(u => {
            select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
        });
}

async function loadSections() {
    const sections = await getData("sections");
    sectionsCache = sections;
    const select = document.getElementById("sectionId");
    select.innerHTML = "";

    sections.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.grade} - ${s.name}</option>`;
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
    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const teacherId = document.getElementById("teacherId").value;
    const sectionId = document.getElementById("sectionId").value;
    if (!name || !teacherId || !sectionId) {
        alert("Todos los campos son obligatorios");
        return;
    }
    const data = {
        name: name,
        description: description,
        teacherId: teacherId,
        sectionId: sectionId
    };
    try {
        if (editing) {
            await putData(`classes/${id}`, data);
        } else {
            await postData("classes", data);
        }
        modal.hide();
        loadClasses();
    } catch (error) {
        console.error(error);
        alert("Error al guardar clase");
    }
}

async function deleteClass(id) {
    if (confirm("¿Eliminar clase?")) {
        await deleteData(`classes/${id}`);
        loadClasses();
    }
}