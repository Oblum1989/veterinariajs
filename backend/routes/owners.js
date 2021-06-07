module.exports = function ownersHandler(owners) {
  return{
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (owners[data.indice]) {
          return callback(200, owners[data.indice]);
        }
        return callback(404, {
          message: `elemento con indice ${data.indice} no encontrado`,
        });
      }
      callback(200, owners);
    },
    post: (data, callback) => {
      let newOwner = data.payload;
      newOwner.created_at = new Date();
      newOwner.updated_at = null;
      owners = [...owners, newOwner];
      return callback(201, newOwner);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (owners[data.indice]) {
          const {created_at} = owners[data.indice]
          owners[data.indice] = {
            ...data.payload,
            created_at,
            updated_at: new Date()
          };
          return callback(200, owners[data.indice]);
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
        if (owners[data.indice]) {
          owners = owners.filter(
            (_owner, indice) => indice != data.indice
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