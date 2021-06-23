module.exports = function consultsHandler({consults, veterinarians, pets}) {
  return {
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (consults[data.indice]) {
          return callback(200, consults[data.indice]);
        }
        return callback(404, {
          message: `elemento con indice ${data.indice} no encontrado`,
        });
      }
      const consultsRelations = consults.map((consult)=>(
        {...consult, pet: pets[consult.mascota], veterinarian: veterinarians[consult.veterinarian]}
      ))
      callback(200, consultsRelations);
    },
    post: (data, callback) => {
      let newConsult = data.payload;
      newConsult.created_at = new Date();
      newConsult.updated_at = null;
      consults = [...consults, newConsult];
      return callback(201, newConsult);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (consults[data.indice]) {
          const {created_at} = consults[data.indice]
          consults[data.indice] = {
            ...data.payload,
            created_at,
            updated_at: new Date()
          };
          return callback(200, consults[data.indice]);
        }
        return callback(404, {
          message: `elemento con indice ${data.indice} no encontrado`,
        });
      }
      callback(400, { message: `indice no enviado` });
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        console.log("entre", data.indice);
        if (consults[data.indice]) {
          consults = consults.filter(
            (_consult, indice) => indice != data.indice
          );
        }
        return callback(204, {
          message: `elemento con indice ${data.indice} eliminado`,
        });
      }
      callback(400, { message: `indice no enviado` });
    },
  };
};
