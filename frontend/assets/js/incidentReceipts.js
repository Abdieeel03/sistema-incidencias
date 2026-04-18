let modal;
let incidentsCache = [];
let usersCache = [];

document.addEventListener("DOMContentLoaded", async () => {
    modal = new bootstrap.Modal(document.getElementById("receiptModal"));
    await loadIncidents();
    await loadParents();
    await loadReceipts();
});

async function loadReceipts() {
    const receipts = await getData("incident-receipts");
    const table = document.getElementById("receiptTable");
    table.innerHTML = "";
    receipts.forEach(r => {
        const incident = incidentsCache.find(i => i.id === r.incidentId);
        const parent = usersCache.find(u => u.id === r.parentId);
        table.innerHTML += `
            <tr>
                <td>${incident ? incident.title : "N/A"}</td>
                <td>${parent ? parent.name : "N/A"}</td>
                <td>${r.readAt || ""}</td>
                <td class"text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteReceipt(${r.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

async function loadIncidents() {
    const incidents = await getData("incidents");
    incidentsCache = incidents;
    const select = document.getElementById("incidentId");
    select.innerHTML = `<option value="">Seleccione incidencia</option>`;
    incidents.forEach(i => {
        select.innerHTML += `
            <option value="${i.id}">
                ${i.title}
            </option>
        `;
    });
}

async function loadParents() {
    const users = await getData("users");
    usersCache = users;
    const select = document.getElementById("parentId");
    select.innerHTML = `<option value="">Seleccione padre</option>`;
    users
        .filter(u => u.role === "padre")
        .forEach(u => {
            select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
        });
}

function openCreateModal() {
    document.getElementById("receiptForm").reset();
    modal.show();
}

async function saveReceipt() {
    const incidentId = document.getElementById("incidentId").value;
    const parentId = document.getElementById("parentId").value;

    if (!incidentId || !parentId) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const data = {
        incidentId: parseInt(incidentId),
        parentId: parseInt(parentId)
    };

    try {
        await postData("incident-receipts", data);

        modal.hide();
        loadReceipts();
    } catch (error) {
        console.error(error);
        alert("Error al registrar lectura");
    }
}

async function deleteReceipt(id) {
    if (confirm("¿Eliminar registro?")) {
        await deleteData(`incident-receipts/${id}`);
        loadReceipts();
    }
}