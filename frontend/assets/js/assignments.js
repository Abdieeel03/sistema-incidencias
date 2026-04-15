let modal;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("assignmentModal"));

    loadAssignments();
    loadStudents();
    loadSections();
    loadClasses();
    loadUsers();
});

async function loadAssignments() {
    const data = await getData("section-assignments");

    const table = document.getElementById("assignmentTable");
    table.innerHTML = "";

    data.forEach(a => {
        table.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${a.student?.firstName} ${a.student?.lastName}</td>
                <td>${a.section?.name}</td>
                <td>${a.schoolClass?.name}</td>
                <td>${a.assignedById?.name}</td>
                <td>${a.createdAt}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteAssignment(${a.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

async function loadStudents() {
    const data = await getData("students");
    const select = document.getElementById("studentId");

    select.innerHTML = "";
    data.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.firstName} ${s.lastName}</option>`;
    });
}

async function loadSections() {
    const data = await getData("sections");
    const select = document.getElementById("sectionId");

    select.innerHTML = "";
    data.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
}

async function loadClasses() {
    const data = await getData("classes");
    const select = document.getElementById("classId");

    select.innerHTML = "";
    data.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

async function loadUsers() {
    const data = await getData("users");
    const select = document.getElementById("assignedById");

    select.innerHTML = "";
    data.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });
}

function openCreateModal() {
    document.getElementById("assignmentForm").reset();
    modal.show();
}

async function saveAssignment() {
    const data = {
        studentId: document.getElementById("studentId").value,
        sectionId: document.getElementById("sectionId").value,
        classId: document.getElementById("classId").value,
        assignedById: document.getElementById("assignedById").value
    };

    try {
        await postData("section-assignments", data);
        modal.hide();
        loadAssignments();
    } catch (error) {
        console.error(error);
        alert("Error al crear asignación");
    }
}

async function deleteAssignment(id) {
    if (confirm("¿Eliminar asignación?")) {
        await deleteData(`section-assignments/${id}`);
        loadAssignments();
    }
}