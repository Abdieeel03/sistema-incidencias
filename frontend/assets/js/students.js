let modal;
let editing = false;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("studentModal"));
    loadStudents();
});

async function loadStudents(){
    try {
        const students = await getData("students");
        const table = document.getElementById("studentTable")
        table.innerHTML = "";

        students.forEach(student => {
            table.innerHTML += `
                <tr>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.birthDate}</td>
                    <td>${student.studentCode}</td>
                    <td>${student.isActive ? "Activo" : "Inactivo"}</td>
                    <td class="text-center">
                        <button class="btn btn-warning btn-sm" onclick="openEditModal(${student.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando estudiantes:", error);
    }
}

function openCreateModal() {
    editing = false;
    document.getElementById("studentForm").reset();
    document.getElementById("studentId").value = "";
    document.getElementById("modalTitle").innerText = "Crear Estudiante";
    modal.show();
}

async function openEditModal(id){

    editing = true;
    const student = await getData(`students/${id}`);

    document.getElementById("studentId").value = student.id;
    document.getElementById("firstName").value = student.firstName;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("birthDate").value = student.birthDate;
    document.getElementById("studentCode").value = student.studentCode;
    document.getElementById("modalTitle").innerText = "Editar Estudiante";

    modal.show();
}

async function saveStudent() {
    const id = document.getElementById("studentId").value;
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const birthDate = document.getElementById("birthDate").value.trim();
    const studentCode = document.getElementById("studentCode").value.trim();

    if (!firstName || !lastName || !birthDate || !studentCode) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const data = {
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        studentCode: studentCode,
        isActive: true
    };

    try {
        if (editing) {
            await putData(`students/${id}`, data);
        } else {
            await postData("students", data);
        }
        modal.hide();
        loadStudents();
    } catch (error) {
        console.error(error);
        alert("Error al guardar estudiante")
    }
}

async function deleteStudent(id) {
    if (confirm("¿Seguro que deseas eliminar este estudiante?")) {
        await deleteData(`students/${id}`);
        loadStudents();
    }
}

