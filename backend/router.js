const resources = require("./resources")
const pets = require("./routes/pets")
const owners = require("./routes/owners")
const veterinarians = require("./routes/veterinarians")
const consults = require("./routes/consults")

module.exports = {
  path: (data, callback) => {
    callback(200, { message: "esta es /path" });
  },
  pets: pets(resources.pets),
  owners: owners(resources.owners),
  veterinarians: veterinarians(resources.veterinarians),
  consults: consults(resources.consults),
  noFound: (data, callback) => {
    callback(404, { message: "no encontrado" });
  },
};
