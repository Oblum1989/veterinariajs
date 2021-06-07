module.exports = function veterinariansHandler(veterinarians) {
  return{
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (veterinarians[data.indice]) {
          return callback(200, veterinarians[data.indice]);
        }
        return callback(404, {
          message: `elemento con indice ${data.indice} no encontrado`,
        });
      }
      callback(200, veterinarians);
    },
    post: (data, callback) => {
      let newVeterinarian = data.payload;
      newVeterinarian.created_at = new Date();
      newVeterinarian.updated_at = null;
      veterinarians = [...veterinarians, newVeterinarian];
      return callback(201, newVeterinarian);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (veterinarians[data.indice]) {
          const {created_at} = veterinarians[data.indice]
          veterinarians[data.indice] = {
            ...data.payload,
            created_at,
            updated_at: new Date()
          };
          return callback(200, veterinarians[data.indice]);
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
        if (veterinarians[data.indice]) {
          veterinarians = veterinarians.filter(
            (_veterinarian, indice) => indice != data.indice
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