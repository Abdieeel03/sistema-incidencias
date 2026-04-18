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
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.isActive ? "Activo" : "Inactivo"}</td>
                <td class="text-center">
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
    document.getElementById("passwordGroup").style.display = "block";
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
    document.getElementById("passwordGroup").style.display = "none";
    modal.show();
}

async function saveUser() {

    const id = document.getElementById("userId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !role) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (!editing && !password) {
        alert("La contraseña es obligatoria");
        return;
    }

    const data = {
        name: name,
        email: email,
        role: role,
        isActive: true
    };

    if (!editing) {
        data.password = password;
    }

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