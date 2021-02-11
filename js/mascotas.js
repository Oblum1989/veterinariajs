const listPets = document.getElementById("list-pets")
const type = document.getElementById("tipo")
const name = document.getElementById("nombre")
const owner = document.getElementById("dueno")
const inputId = document.getElementById("inputId")
const form = document.getElementById("form")
const btnSave = document.getElementById("btnSave")
let pets = [
  {
    type: "Gato",
    name: "Manchas",
    owner: "Juan",
  },
  {
    type: "Perro",
    name: "firulais",
    owner: "Jose",
  },
  {
    type: "Perro",
    name: "Furia",
    owner: "Sandra",
  },
];

function showPets() {
  const htmlPets = pets.map(
    (pet, key) => `
    <tr>
      <th scope="row">${key}</th>
      <td>${pet.type}</td>
      <td>${pet.name}</td>
      <td>${pet.owner}</td>
      <td>
        <button type="button" class="btn btn-success edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="far fa-edit"></i></button>
        <button type="button" class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
      </td>
    </tr>`).join("")
  listPets.innerHTML = htmlPets
  Array.from(document.getElementsByClassName("edit")).forEach((btnEdit, key)=>btnEdit.onclick = edit(key))
}

function sendData(e) {
  e.preventDefault()
  const data = {
    type: type.value,
    name: name.value,
    owner: owner.value
  }
  const action = btnSave.innerHTML
  switch (action) {
    case 'Editar':
      pets[inputId.value] = data
      break;
    default:
      pets.push(data)
      break;
  }
  showPets()
  resetData()
}

function edit(key){
  return function handler() {
    btnSave.innerText = "Editar"
    mascota = pets[key]
    name.value = mascota.name
    owner.value = mascota.owner
    type.value = mascota.type
    inputId.value = key
    console.log(mascota)
  }
}

function resetData() {
  name.value = ''
  owner.value = ''
  type.value = ''
  inputId.value = ''
  btnSave.innerHTML = 'Crear'
}
showPets()
form.onsubmit = sendData
btnSave.onclick = sendData