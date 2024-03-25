const express = require("express");
const app = express();
const Pool = require("pg").Pool;
const port = 3000;

app.use(express.json());

const pool = new Pool({
  host: "localhost",
  database: "realestate",
  user: "postgres",
  password: "postgres",
  port: 5432,
});

// Listing all resources
app.get("/houses", async (req, res) => {
  try {
    let houses = await pool.query("SELECT * FROM houses");
    res.send(houses.rows);
    console.info("berhasil mengambil semua data houses");
  } catch (err) {
    console.error("Gagal mengambil semua data houses", err);
  }
});

// Getting a resource
app.get("/houses/:id", async (req, res) => {
  let housesId = req.params.id;
  try {
    let houses = await pool.query("SELECT * FROM houses WHERE id = $1", [
      housesId,
    ]);
    res.send(houses.rows);
    console.info("berhasil mengambil data houses");
  } catch (error) {
    console.error("Gagal mengambil data houses:", error);
  }
});

// Creating a resource
app.post("/houses", async (req, res) => {
  let address = req.body.address;
  let owner_name = req.body.owner_name;
  let num_rooms = req.body.num_rooms;
  let has_garden = req.body.has_garden;
  try {
    let houses = await pool.query(
      "INSERT INTO houses(address, owner_name, num_rooms, has_garden) values ($1, $2, $3, $4)",
      [address, owner_name, num_rooms, has_garden]
    );
    res.json({ data: houses.rowCount });
    console.info("berhasil membuat data houses");
  } catch (error) {
    console.error("Gagal membuat data houses: ", error);
  }
});

// Updating a resource
app.put("/houses/:id", async (req, res) => {
  let housesId = req.params.id;
  let address = req.body.address;
  let owner_name = req.body.owner_name;
  let num_rooms = req.body.num_rooms;
  let has_garden = req.body.has_garden;
  try {
    let result = await pool.query(
      "UPDATE houses SET address = $1, owner_name = $2, num_rooms = $3, has_garden = $4 WHERE id = $5",
      [address, owner_name, num_rooms, has_garden, housesId]
    );
    res.json({ data: result.rowCount });
    console.info("berhasil memperbarui data houses");
  } catch (error) {
    console.error("Gagal memperbarui data houses: ", error);
  }
});

// Deleting a resource
app.delete("/houses/:id", async (req, res) => {
  const houses = req.params.id;

  try {
    const query = "DELETE FROM houses WHERE id = $1";
    await pool.query(query, [houses]);
    res.send("berasil menghapus data house");
  } catch (error) {
    console.error("Gagal menghapus data houses:", error);
  }
});

// 500 Internal Server Error
app.use((err, req, res, next) => {
  res.status(500).json({ err: err.message });
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ err: `are you lost? ${req.url} is not registered!` });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
