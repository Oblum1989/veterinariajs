const url = require("url");
const { StringDecoder } = require("string_decoder");
const router = require("./router");

module.exports = (req, res) => {
  const currentUrl = req.url;
  const parseUrl = url.parse(currentUrl, true);

  const path = parseUrl.pathname;

  const pathClean = path.replace(/^\/+|\/+$/g, "");

  const method = req.method.toLowerCase();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,PUT,DELETE,POST"
  );
  res.setHeader(
    "Access-Control-Request-Methods",
    "OPTIONS,GET,PUT,DELETE,POST"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (method === "options") {
    res.writeHead(200);
    res.end();
    return;
  }

  const { query = {} } = parseUrl;

  const { headers = {} } = req;

  const decoder = new StringDecoder("utf8");
  let buffer = "";
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();

    if (headers["content-type"] === "application/json") {
      buffer = JSON.parse(buffer);
    }

    if (pathClean.indexOf("/") > -1) {
      var [principalPath, indice] = pathClean.split("/");
    }

    const data = {
      indice,
      path: principalPath || pathClean,
      query,
      method,
      headers,
      payload: buffer,
    };

    console.log({ data });

    let handler;
    if (data.path && router[data.path] && router[data.path][method]) {
      handler = router[data.path][method];
    } else {
      handler = router.noFound;
    }

    if (typeof handler === "function") {
      handler(data, (statusCode = 200, message) => {
        const response = JSON.stringify(message);
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(response);
      });
    }
  });
};
