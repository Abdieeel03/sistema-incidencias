const API_URL = "http://localhost:8080/api/v1"

async function getData(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`);
    return await response.json();
}

async function postData(endpoint, data) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
        "content-Type": "application/json"
    },
    body: JSON.stringify(data)
    });
    return await response.json();
}

async function putData(endpoint, data) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "PUT",
    headers: {
        "Content-type": "application/json"
    },
    body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteData(endpoint){
    await fetch(`${API_URL}/${endpoint}`,{
        method: "DELETE"
    });
}


