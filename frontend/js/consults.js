const listConsults = document.getElementById("list-consults");
const id = document.getElementById("id");
const name = document.getElementById("nombre");
const lastName = document.getElementById("apellido");
const country = document.getElementById("pais");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
const alertNode = document.getElementById('alert')
const URL = "http://localhost:5000/consults"

let consults = [];

async function showConsults() {
  try {
    const response = await fetch(URL)
    const consultServer = await response.json()
    if (Array.isArray(consultServer)) {
      consults = consultServer
    }
    if (consults.length > 0) {
      const htmlConsults = consults
        .map(
          (consult, key) => `
        <tr>
          <th scope="row">${key}</th>
          <td>${consult.mascota}</td>
          <td>${consult.veterinarian}</td>
          <td>${consult.log}</td>
          <td>${consult.diagnosis}</td>
          <td>
            <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="far fa-edit"></i></button>
            <button type="button" class="btn btn-danger delete"><i class="far fa-trash-alt"></i></button>
          </td>
        </tr>`
        )
        .join("");
      listConsults.innerHTML = htmlConsults;
      Array.from(document.getElementsByClassName("edit")).forEach(
        (btnEdit, key) => (btnEdit.onclick = edit(key))
      );
      Array.from(document.getElementsByClassName("delete")).forEach(
        (btnDelete, key) => (btnDelete.onclick = deleteConsult(key))
      );
    }else{
      listConsults.innerHTML = `<tr>
        <td colspan="5">No tienes mascotas </td>
      </tr>`
    }
  } catch (error) {
    alertNode.classList.toggle("hide");
    alertNode.classList.toggle("show");
  }
}

async function sendData(e) {
  e.preventDefault();
  try {
    const data = {
      identification: id.value,
      name: name.value,
      lastname: lastName.value,
      country: country.value,
    };
    let method = "POST"
    let urlSend = URL
    const action = btnSave.innerHTML
    if (action === "Editar") {
      method = "PUT"
      consults[inputId.value] = data
      urlSend = `${URL}/${inputId.value}`
    }
    const response = await fetch(urlSend, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      showConsults()
      resetData()
    }
  } catch (error) {
    alertNode.classList.toggle("hide");
    alertNode.classList.toggle("show");
  }
}

function edit(key) {
  return function handler() {
    btnSave.innerText = "Editar";
    consulta = consults[key];
    name.value = consulta.name;
    lastName.value = consulta.lastname;
    id.value = consulta.identification;
    country.value = consulta.country
    inputId.value = key;
  };
}

function resetData() {
  name.value = "";
  lastName.value = "";
  country.value = "";
  id.value = "";
  inputId.value = "";
  btnSave.innerHTML = "Crear";
}

function deleteConsult(key) {
  const urlSend = `${URL}/${key}`
  return async function clickDelete() {
    try {
      const response = await fetch(urlSend, {
        method: "DELETE",
      })
      if (response.ok) {
        showConsults()
        resetData();
      }
    } catch (error) {
      alertNode.classList.toggle("hide");
      alertNode.classList.toggle("show");
    }
  };
}

showConsults();

form.onsubmit = sendData;
btnSave.onclick = sendData;
