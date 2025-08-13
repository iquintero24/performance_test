/*is responsible for loading the invoices into the database*/
import fs from "fs"; // It is the one that allows me to read files
import path from "path"; // This shows the current route
import csv from "csv-parser"; // CSV parsing
import { pool } from "../conexion_bd.js"; //database connection pool

export async function uploadInvoicesToTheDatabase() {
  const filepath = path.resolve("server/data/02_invoices.csv");
  const invoices = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (fila) => {
        invoices.push([
          fila.numero_de_factura,
          fila.periodo_de_facturacion,
          fila.monto_facturado,
          fila.monto_pagado,
          fila.id_client,
        ]);
      })
      .on("end", async () => {
        try {
          const sql =
            "INSERT INTO invoices (invoice_number,invoice_period,invoice_amount,amount_paid,id_client) VALUES ?";
          const [result] = await pool.query(sql, [invoices]);

          console.log(`✅ were inserted ${result.affectedRows} invoices.`);
          resolve(); // Termina exitosamente
        } catch (error) {
          console.error("❌ Error inserting invoices:", error.message);
          reject(error);
        }
      })
      .on("error", (err) => {
        console.error("❌ Error reading CSV file from invoices:", err.message);
        reject(err);
      });
  });
}
