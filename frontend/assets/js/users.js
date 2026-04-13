let modal;
let editing = false;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("userModal"));
    loadUsers();
});


async function loadUsers() {
    const users = await getData("users");
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach(user => {
        table.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.isActive}</td>
                <td>${user.createdAt}</td>
                <td>${user.updatedAt}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal(${user.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function openCreateModal() {
    editing = false;
    document.getElementById("userForm").reset();
    document.getElementById("userId").value = "";
    document.getElementById("modalTitle").innerText = "Crear Usuario";
    modal.show();
}

async function openEditModal(id) {
    editing = true;

    const user = await getData(`users/${id}`);
    document.getElementById("userId").value = user.id;
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("role").value = user.role;
    document.getElementById("modalTitle").innerText = "Editar Usuario";
    modal.show();
}

async function saveUser() {
    const id = document.getElementById("userId").value;
    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value,
        isActive: true
    };
    try {
        if (editing) {
            await putData(`users/${id}`, data);
        } else {
            await postData("users", data);
        }
        modal.hide();
        loadUsers();
    } catch (error) {
        console.error(error);
        alert("Error al guardar usuario");
    }
}

async function deleteUser(id) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        await deleteData(`users/${id}`);
        loadUsers();
    }
}