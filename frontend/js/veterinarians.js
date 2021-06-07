const listVeterinarians = document.getElementById("list-veterinarians");
const id = document.getElementById("id");
const name = document.getElementById("nombre");
const lastName = document.getElementById("apellido");
const country = document.getElementById("pais");
const inputId = document.getElementById("inputId");
const form = document.getElementById("form");
const btnSave = document.getElementById("btnSave");
let veterinarians = [
  {
    id: "63138513",
    name: "Manchas",
    lastName: "Perez",
    country: "Colombia",
  },
  {
    id: "15618613",
    name: "firulais",
    lastName: "Gomez",
    country: "Perú",
  },
  {
    id: "168515218",
    name: "Furia",
    lastName: "Soler",
    country: "Perú",
  },
];

function showVeterinarians() {
  const htmlVeterinarians = veterinarians
    .map(
      (veterinarian, key) => `
    <tr>
      <th scope="row">${key}</th>
      <td>${veterinarian.id}</td>
      <td>${veterinarian.name}</td>
      <td>${veterinarian.lastName}</td>
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
}

function sendData(e) {
  e.preventDefault();
  const data = {
    id: id.value,
    name: name.value,
    lastName: lastName.value,
    country: country.value,
  };
  const action = btnSave.innerHTML;
  switch (action) {
    case "Editar":
      veterinarians[inputId.value] = data;
      break;
    default:
      veterinarians.push(data);
      break;
  }
  showVeterinarians();
  resetData();
}

function edit(key) {
  return function handler() {
    btnSave.innerText = "Editar";
    mascota = veterinarians[key];
    name.value = mascota.name;
    lastName.value = mascota.lastName;
    id.value = mascota.id;
    country.value = mascota.country
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
  return function clickDelete() {
    veterinarians = veterinarians.filter((mascota, keyMascota) => keyMascota !== key);
    showVeterinarians();
  };
}
showVeterinarians();
form.onsubmit = sendData;
btnSave.onclick = sendData;
