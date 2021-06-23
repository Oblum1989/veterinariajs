const listConsults = document.getElementById("list-consults");
const id = document.getElementById("id");
const pet = document.getElementById("mascota");
const veterinarian = document.getElementById("veterinario");
const diagnosis = document.getElementById("diagnostico");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
const alertNode = document.getElementById('alert')
const URL = "http://localhost:5000"

let consults = [];
let pets = [];

async function showConsults() {
  const entity = "consults"
  try {
    const response = await fetch(`${URL}/${entity}`)
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
          <td>${consult.pet.name}</td>
          <td>${consult.veterinarian.name} ${consult.veterinarian.lastname}</td>
          <td>${consult.diagnosis}</td>
          <td>${consult.created_at}</td>
          <td>${consult.updated_at}</td>
          <td>
            <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="far fa-edit"></i></button>
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

async function showPets() {
  const entity = "pets"
  try {
    const response = await fetch(`${URL}/${entity}`)
    const petServer = await response.json()
    if (Array.isArray(petServer)) {
      pets = petServer
    }
    if (pets.length > 0) {
      const htmlPets = pets
        .map(
          (pet, key) => `
        <option value="${key}">${pet.name}</option>`
        )
        .join("");
      pet.innerHTML += htmlPets;
      Array.from(document.getElementsByClassName("edit")).forEach(
        (btnEdit, key) => (btnEdit.onclick = edit(key))
      );
      Array.from(document.getElementsByClassName("delete")).forEach(
        (btnDelete, key) => (btnDelete.onclick = deleteConsult(key))
      );
    }else{
      pet.innerHTML += `<option>sin mascotas</option>`
    }
  } catch (error) {
    alertNode.classList.toggle("hide");
    alertNode.classList.toggle("show");
  }
}

async function sendData(e) {
  e.preventDefault();
  const entity = "consults"
  try {
    const data = {
      identification: id.value,
      name: name.value,
      lastname: lastName.value,
      country: country.value,
    };
    let method = "POST"
    let urlSend = `${URL}/${entity}`
    const action = btnSave.innerHTML
    if (action === "Editar") {
      method = "PUT"
      consults[inputId.value] = data
      urlSend = `${URL}/${entity}/${inputId.value}`
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
  const entity = "consults"
  const urlSend = `${URL}/${entity}/${key}`
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
showPets()

form.onsubmit = sendData;
btnSave.onclick = sendData;
