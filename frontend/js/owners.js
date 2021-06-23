const listOwners = document.getElementById("list-owners");
const id = document.getElementById("id");
const name = document.getElementById("nombre");
const lastName = document.getElementById("apellido");
const country = document.getElementById("pais");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
const alertNode = document.getElementById('alert')
const URL = "http://localhost:5000/owners"

let owners = [];

async function showOwners() {
  try {
    const response = await fetch(URL)
    const ownerServer = await response.json()
    if (Array.isArray(ownerServer)) {
      owners = ownerServer
    }
    if (owners.length > 0) {
      const htmlOwners = owners
        .map(
          (owner, key) => `
        <tr>
          <th scope="row">${key}</th>
          <td>${owner.identification}</td>
          <td>${owner.name}</td>
          <td>${owner.lastname}</td>
          <td>${owner.country}</td>
          <td>
            <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="far fa-edit"></i></button>
            <button type="button" class="btn btn-danger delete"><i class="far fa-trash-alt"></i></button>
          </td>
        </tr>`
        )
        .join("");
      listOwners.innerHTML = htmlOwners;
      Array.from(document.getElementsByClassName("edit")).forEach(
        (btnEdit, key) => (btnEdit.onclick = edit(key))
      );
      Array.from(document.getElementsByClassName("delete")).forEach(
        (btnDelete, key) => (btnDelete.onclick = deleteOwner(key))
      );
    }else{
      listOwners.innerHTML = `<tr>
        <td colspan="5">No tienes dueños </td>
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
      owners[inputId.value] = data
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
      showOwners()
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
    dueno = owners[key];
    name.value = dueno.name;
    lastName.value = dueno.lastname;
    id.value = dueno.identification;
    country.value = dueno.country
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

function deleteOwner(key) {
  const urlSend = `${URL}/${key}`
  return async function clickDelete() {
    try {
      const response = await fetch(urlSend, {
        method: "DELETE",
      })
      if (response.ok) {
        showOwners()
        resetData();
      }
    } catch (error) {
      alertNode.classList.toggle("hide");
      alertNode.classList.toggle("show");
    }
  };
}

showOwners();

form.onsubmit = sendData;
btnSave.onclick = sendData;
