let modal;

document.addEventListener("DOMContentLoaded", () => {
    modal = new bootstrap.Modal(document.getElementById("receiptModal"));

    loadReceipts();
    loadIncidents();
    loadParents();
});

async function loadReceipts() {
    const receipts = await getData("incident-receipts");
    const table = document.getElementById("receiptTable");

    table.innerHTML = "";

    receipts.forEach(r => {
        table.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${r.incident?.title || "N/A"}</td>
                <td>${r.parent?.name || "N/A"}</td>
                <td>${r.readAt}</td>
                <td>
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
    const select = document.getElementById("incidentId");

    select.innerHTML = "";

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
    const select = document.getElementById("parentId");

    select.innerHTML = "";

    users
        .filter(u => u.role === "PADRE")
        .forEach(u => {
            select.innerHTML += `<option value="${u.id}">${u.name}</option>`;
        });
}

function openCreateModal() {
    document.getElementById("receiptForm").reset();
    modal.show();
}

async function saveReceipt() {
    const data = {
        incidentId: document.getElementById("incidentId").value,
        parentId: document.getElementById("parentId").value
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