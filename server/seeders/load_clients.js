/*is responsible for loading the clients into the database*/
import fs from "fs"; // It is the one that allows me to read files
import path from "path"; // This shows the current route
import csv from "csv-parser"; // CSV parsing
import { pool } from "../conexion_bd.js"; //database connection pool

export async function uploadClientsToTheDatabase() {
  const filepath = path.resolve("server/data/01_clients.csv");
  const clients = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (fila) => {
        clients.push([
          fila.Nombre_del_Cliente,
          fila.Numero_de_Identificacion.trim(),
          fila.Direccion,
          fila.Telefono,
          fila.Correo_Electronico,
        ]);
      })
      .on("end", async () => {
        try {
          const sql =
            "INSERT INTO clients (name_client,identification_number,address,phone_number,email) VALUES ?";
          const [result] = await pool.query(sql, [clients]);

          console.log(`✅ were inserted ${result.affectedRows} clients.`);
          resolve(); // Termina exitosamente
        } catch (error) {
          console.error("❌ Error inserting clients:", error.message);
          reject(error);
        }
      })
      .on("error", (err) => {
        console.error("❌ Error reading CSV file from clients:", err.message);
        reject(err);
      });
  });
}
