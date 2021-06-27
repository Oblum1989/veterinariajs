const listConsults = document.getElementById("list-consults");
const id = document.getElementById("id");
const pet = document.getElementById("mascota");
const veterinarian = document.getElementById("veterinario");
const diagnosis = document.getElementById("diagnostico");
const history = document.getElementById("historia");
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
    }else{
      pet.innerHTML += `<option>sin mascotas</option>`
    }
  } catch (error) {
    alertNode.classList.toggle("hide");
    alertNode.classList.toggle("show");
  }
}

async function showVeterinarian() {
  const entity = "veterinarians"
  try {
    const response = await fetch(`${URL}/${entity}`)
    const veterinarianServer = await response.json()
    if (Array.isArray(veterinarianServer)) {
      veterinarians = veterinarianServer
    }
    if (veterinarians.length > 0) {
      const htmlVeterinarians = veterinarians
        .map(
          (veterinarian, key) => `
        <option value="${key}">${veterinarian.name}</option>`
        )
        .join("");
        veterinarian.innerHTML += htmlVeterinarians;
    }else{
      veterinarian.innerHTML += `<option>sin mascotas</option>`
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
      mascota: pet.value,
      veterinarian: veterinarian.value,
      log: history.value,
      diagnosis: diagnosis.value,
    };
    if (validate(data) === true){
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
      return
    }
    alert('Formulario incompleto')
  } catch (error) {
    alertNode.classList.toggle("hide");
    alertNode.classList.toggle("show");
  }
}

function edit(key) {
  return function handler() {
    btnSave.innerText = "Editar";
    const consulta = consults[key];
    inputId.value = key;
    pet.value = consulta.pet.id
    veterinarian.value = consulta.veterinarian.id
    history.value = consulta.log
    diagnosis.value = consulta.diagnosis
  }
};

function resetData() {
  pet.value = "";
  veterinarian.value = "";
  history.value = "";
  diagnosis.value = "";
  inputId.value = "";
  btnSave.innerHTML = "Crear";
}

function validate(data) {
  if (typeof data !== 'object') return false
  for (const key in data) {
    if (data[key].length === 0) return false
  }
  return true
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
showVeterinarian()

form.onsubmit = sendData;
btnSave.onclick = sendData;
