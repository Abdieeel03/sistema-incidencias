let modal;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("parentStudentModal"));

    loadParentStudents();
    loadParents();
    loadStudents();
});

async function loadParentStudents() {
    const list = await getData("parent-students");
    const table = document.getElementById("parentStudentTable");

    table.innerHTML = "";

    list.forEach(ps => {
        table.innerHTML += `
            <tr>
                <td>${ps.id}</td>
                <td>${ps.parent?.name || "N/A"}</td>
                <td>${ps.student?.firstName} ${ps.student?.lastName}</td>
                <td>${ps.createdAt}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteParentStudent(${ps.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

async function loadParents() {
    const users = await getData("users");
    const select = document.getElementById("parentId");

    select.innerHTML = "";

    users
        .filter(u => u.role === "PADRE")
        .forEach(u => {
            select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
        });
}

async function loadStudents() {
    const students = await getData("students");
    const select = document.getElementById("studentId");

    select.innerHTML = "";

    students.forEach(s => {
        select.innerHTML += `
            <option value="${s.id}">
                ${s.firstName} ${s.lastName}
            </option>
        `;
    });
}

function openCreateModal() {
    document.getElementById("parentStudentForm").reset();
    modal.show();
}

async function saveParentStudent() {
    const data = {
        parentId: document.getElementById("parentId").value,
        studentId: document.getElementById("studentId").value
    };

    try {
        await postData("parent-students", data);

        modal.hide();
        loadParentStudents();
    } catch (error) {
        console.error(error);
        alert("Error al asignar");
    }
}

async function deleteParentStudent(id) {
    if (confirm("¿Eliminar relación?")) {
        await deleteData(`parent-students/${id}`);
        loadParentStudents();
    }
}


