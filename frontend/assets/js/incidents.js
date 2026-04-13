async function loadIncidents() {
    const incidents = await getData("incidents");

    const table = document.getElementaryById("incidentTable");
    table.innerHTML = "";

    incidents.forEach(inc => {
        table.innerHTML += `
            <tr>
                <td>${inc.id}</td>
                <td>${inc.description}</td>
                <td>${inc.status}</td>
            <tr>
        `;
    });
}

loadIncidents();