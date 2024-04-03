const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const file = fs.readFileSync("./api-docs.yaml", "utf-8");
const swaggerDocument = YAML.parse(file);

app.use("/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const v1 = require("./routes/v1/index");
app.use("/v1", v1);

// 500 Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).json({ err: err.message });
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ err: `are you lost? ${req.url} is not registered!` });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
