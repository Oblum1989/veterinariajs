const listPets = document.getElementById("list-pets");
const type = document.getElementById("tipo");
const name = document.getElementById("nombre");
const owner = document.getElementById("dueno");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
const alertNode = document.getElementById('alert')
const URL = "http://localhost:5000/pets"

let pets = [];

async function showPets() {
  try {
    const response = await fetch(URL)
    const petsServer = await response.json()
    if(Array.isArray(petsServer)){
      pets = petsServer
    }
    if (pets.length > 0) {
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
    }else{
      listPets.innerHTML = `<tr>
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
      type: type.value,
      name: name.value,
      owner: owner.value,
    };
    let method = "POST"
    let urlSend = URL
    const action = btnSave.innerHTML;
    if(action === "Editar"){
      method = "PUT"
      pets[inputId.value] = data;
      urlSend = `${URL}/${inputId.value}`
    }
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
    alertNode.classList.toggle("hide");
    alertNode.classList.toggle("show");
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
  const urlSend = `${URL}/${key}`
  return async function clickDelete() {
    try {
      const response = await fetch(urlSend, {
        method: "DELETE",
      })
      if (response.ok) {
        showPets();
        resetData();
      }
    } catch (error) {
      alertNode.classList.toggle("hide");
      alertNode.classList.toggle("show");
    }
  };
}
showPets();

form.onsubmit = sendData;
btnSave.onclick = sendData;
