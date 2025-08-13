/*is responsible for loading the transactions into the database*/
import fs from "fs"; // It is the one that allows me to read files
import path from "path"; // This shows the current route
import csv from "csv-parser"; // CSV parsing
import { pool } from "../conexion_bd.js"; //database connection pool

export async function uploadtransactionsToTheDatabase() {
  const filepath = path.resolve("server/data/03_transactions.csv");
  const transactions = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (fila) => {
        transactions.push([
          fila.id_transaccion,
          fila.fecha_y_hora,
          fila.monto_transaccion,
          fila.estado_transaccion,
          fila.tipo_transaccion,
          fila.plataforma_utilizada,
          fila.numero_factura,
        ]);
      })
      .on("end", async () => {
        try {
          const sql =
            "INSERT INTO transactions (id_transaction,date_and_time,transaction_amount,id_transaction_statu,id_transaction_type,id_platform,invoice_number) VALUES ?";
          const [result] = await pool.query(sql, [transactions]);

          console.log(`✅ were inserted ${result.affectedRows} transactions.`);
          resolve(); // Termina exitosamente
        } catch (error) {
          console.error("❌ Error inserting transactions:", error.message);
          reject(error);
        }
      })
      .on("error", (err) => {
        console.error("❌ Error reading CSV file from transactions:", err.message);
        reject(err);
      });
  });
}
