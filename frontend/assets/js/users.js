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

                    <button onclick="Editar(${user.id})">Editar</button>
                    <button onclick="Eliminar(${user.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function viewUser(id){
    window.location.href = `detail.html?id=${id}`;
}

function editUser(id) {
    window.location.href = `edit.html?id=${id}`;
}

async function deleteUser(id) {
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        await deleteData(`users/${id}`);
        loadUsers();
    }
}

loadUsers();