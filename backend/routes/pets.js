module.exports = function petsHandler(pets) {
  return{
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (pets[data.indice]) {
          return callback(200, pets[data.indice]);
        }
        return callback(404, {
          message: `elemento con indice ${data.indice} no encontrado`,
        });
      }
      callback(200, pets);
    },
    post: (data, callback) => {
      let newPet = data.payload;
      newPet.created_at = new Date();
      newPet.updated_at = null;
      pets = [...pets, newPet];
      return callback(201, newPet);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (pets[data.indice]) {
          const {created_at} = pets[data.indice]
          pets[data.indice] = {
            ...data.payload,
            created_at,
            updated_at: new Date()
          };
          return callback(200, pets[data.indice]);
        }
        return callback(404, {
          message: `elemento con indice ${data.indice} no encontrado`,
        });
      }
      callback(400, { message: `indice no enviado` });
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        console.log("entre", data.indice)
        if (pets[data.indice]) {
          pets = pets.filter(
            (_pet, indice) => indice != data.indice
          );
        }
        return callback(204, {
          message: `elemento con indice ${data.indice} eliminado`,
        });
      }
      callback(400, { message: `indice no enviado` });
    },
  }
}