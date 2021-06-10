const listPets = document.getElementById("list-pets");
const type = document.getElementById("tipo");
const name = document.getElementById("nombre");
const owner = document.getElementById("dueno");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
const URL = "http://localhost:5000/pets"

let pets = [];

async function showPets() {
  try {
    const response = await fetch(URL)
    const petsServer = await response.json()
    if(Array.isArray(petsServer) && petsServer.length > 0){
      pets = petsServer
    }
    const htmlPets = pets
      .map(
        (pet, key) => `
      <tr>
        <th scope="row">${key}</th>
        <td>${pet.type}</td>
        <td>${pet.name}</td>
        <td>${pet.owner}</td>
        <td>
          <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="far fa-edit"></i></button>
          <button type="button" class="btn btn-danger delete"><i class="far fa-trash-alt"></i></button>
        </td>
      </tr>`
      )
      .join("");
    listPets.innerHTML = htmlPets;
    Array.from(document.getElementsByClassName("edit")).forEach(
      (btnEdit, key) => (btnEdit.onclick = edit(key))
    );
    Array.from(document.getElementsByClassName("delete")).forEach(
      (btnDelete, key) => (btnDelete.onclick = deletePet(key))
    );
  } catch (error) {
    throw error
  }
}

async function sendData(e) {
  e.preventDefault();
  try {
    const data = {
      type: type.value,
      name: name.value,
      owner: owner.value,
    };
    let method = "POST"
    let urlSend = URL
    const action = btnSave.innerHTML;
    console.log(action)
    if(action === "Editar"){
      method = "PUT"
      console.log(method)
      pets[inputId.value] = data;
      urlSend = `${URL}/${inputId.value}`
    }
    console.log(method)
    const response = await fetch(urlSend, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      showPets();
      resetData();
    }
  } catch (error) {
    throw error
  }

}

function edit(key) {
  return function handler() {
    btnSave.innerText = "Editar";
    mascota = pets[key];
    name.value = mascota.name;
    owner.value = mascota.owner;
    type.value = mascota.type;
    inputId.value = key;
  };
}

function resetData() {
  name.value = "";
  owner.value = "";
  type.value = "";
  inputId.value = "";
  btnSave.innerHTML = "Crear";
}

function deletePet(key) {
  return function clickDelete() {
    pets = pets.filter((mascota, keyMascota) => keyMascota !== key);
    showPets();
  };
}
showPets();

form.onsubmit = sendData;
btnSave.onclick = sendData;
