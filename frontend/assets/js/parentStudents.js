let modal;
let parentsCache = [];
let studentsCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    modal = new bootstrap.Modal(document.getElementById("parentStudentModal"));
    await loadParents();
    await loadStudents();
    await loadParentStudents();
});

async function loadParentStudents() {
    const list = await getData("parent-students");
    const table = document.getElementById("parentStudentTable");
    table.innerHTML = "";
    list.forEach(ps => {
        const parent = parentsCache.find(p => p.id === ps.parentId);
        const student = studentsCache.find(s => s.id === ps.studentId);
        table.innerHTML += `
            <tr>
                <td>${parent ? parent.name : "N/A"}</td>
                <td>${student ? student.firstName + " " + student.lastName : "N/A"}</td>
                <td class="text-center">
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
    parentsCache = users.filter(u => u.role === "padre");
    const select = document.getElementById("parentId");
    select.innerHTML = "";
    parentsCache.forEach(u => {
        select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
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

function openCreateModal() {
    document.getElementById("parentStudentForm").reset();
    modal.show();
}

async function saveParentStudent() {
    const parentId = document.getElementById("parentId").value;
    const studentId = document.getElementById("studentId").value;
    if (!parentId || !studentId) {
        alert("Todos los campos son obligatorios");
        return;
    }
    const data = { parentId, studentId };
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


