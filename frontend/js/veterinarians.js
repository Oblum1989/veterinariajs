const listVeterinarians = document.getElementById("list-veterinarians");
const id = document.getElementById("id");
const name = document.getElementById("nombre");
const lastName = document.getElementById("apellido");
const country = document.getElementById("pais");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
const alertNode = document.getElementById('alert')
const URL = "http://localhost:5000/veterinarians"

let veterinarians = [];

async function showVeterinarians() {
  try {
    const response = await fetch(URL)
    const veterinarianServer = await response.json()
    if (Array.isArray(veterinarianServer)) {
      veterinarians = veterinarianServer
    }
    if (veterinarians.length > 0) {
      const htmlVeterinarians = veterinarians
        .map(
          (veterinarian, key) => `
        <tr>
          <th scope="row">${key}</th>
          <td>${veterinarian.identification}</td>
          <td>${veterinarian.name}</td>
          <td>${veterinarian.lastname}</td>
          <td>${veterinarian.country}</td>
          <td>
            <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="far fa-edit"></i></button>
            <button type="button" class="btn btn-danger delete"><i class="far fa-trash-alt"></i></button>
          </td>
        </tr>`
        )
        .join("");
      listVeterinarians.innerHTML = htmlVeterinarians;
      Array.from(document.getElementsByClassName("edit")).forEach(
        (btnEdit, key) => (btnEdit.onclick = edit(key))
      );
      Array.from(document.getElementsByClassName("delete")).forEach(
        (btnDelete, key) => (btnDelete.onclick = deleteVeterinarian(key))
      );
    }else{
      listVeterinarians.innerHTML = `<tr>
        <td colspan="5">No tienes veterinari@s </td>
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
      veterinarians[inputId.value] = data
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
      showVeterinarians()
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
    veterinario = veterinarians[key];
    name.value = veterinario.name;
    lastName.value = veterinario.lastname;
    id.value = veterinario.identification;
    country.value = veterinario.country
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

function deleteVeterinarian(key) {
  const urlSend = `${URL}/${key}`
  return async function clickDelete() {
    try {
      const response = await fetch(urlSend, {
        method: "DELETE",
      })
      if (response.ok) {
        showVeterinarians()
        resetData();
      }
    } catch (error) {
      alertNode.classList.toggle("hide");
      alertNode.classList.toggle("show");
    }
  };
}

showVeterinarians();

form.onsubmit = sendData;
btnSave.onclick = sendData;
