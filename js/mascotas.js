const listPets = document.getElementById("list-pets")
let pets = [
  {
    tipo: "Gato",
    name: "Manchas",
    owner: "Juan",
  },
  {
    tipo: "Perro",
    name: "firulais",
    owner: "Jose",
  },
  {
    tipo: "Perro",
    name: "Furia",
    owner: "Sandra",
  },
];

function showPets() {
  const htmlPets = pets.map(
    (pet, key) => `
    <tr>
      <th scope="row">${key}</th>
      <td>${pet.tipo}</td>
      <td>${pet.name}</td>
      <td>${pet.owner}</td>
      <td>
        <button type="button" class="btn btn-success"><i class="far fa-edit"></i></button>
        <button type="button" class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
      </td>
    </tr>`).join("")
    listPets.innerHTML = htmlPets
}

showPets()