import express from "express"; //Express library to raise the endpoints
import cors from "cors";
import { pool } from "./conexion_bd.js";

const app = express(); // This allows the backend application to be consumed by a frontend application.

app.use(express.json()); //middleware allows Express to automatically interpret the body in JSON when you receive a POST or PUT request.

const apiClients = "/clients";

app.get(apiClients, async (req, res) => {
  //get all clients
  try {
    const [rows] = await pool.query(
      `SELECT name_client,address,phone_number,email FROM clients`
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

// get a user by id
app.get(`${apiClients}/:id_client`, async (req, res) => {
  try {
    const { id_client } = req.params;

    const [rows] = await pool.query(
      `
        SELECT name_client,address,phone_number,email FROM clients where id_client = ?; 
    `,
      [id_client]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//add clients
app.post(apiClients, async (req, res) => {
  try {
    const {
      id_client,
      name_client,
      identification_number,
      address,
      phone_number,
      email,
    } = req.body;

    const query = `
        INSERT INTO clients 
        (id_client,name_client,identification_number,address,phone_number,email)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    const values = [
      id_client,
      name_client,
      identification_number,
      address,
      phone_number,
      email,
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({
      mensaje: `client created successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//putclients

// get a user by id
app.put(`${apiClients}/:id_client`, async (req, res) => {
  try {
    const { id_client } = req.params;

    const { name_client, identification_number, address, phone_number, email } =
      req.body;

    const query = `
        UPDATE clients SET 
            name_client = ?,
            identification_number = ?,
            address = ?,
            phone_number = ?,
            email = ?
        WHERE id_client = ?
        `;
    const values = [
      name_client,
      identification_number,
      address,
      phone_number,
      email,
      id_client,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ mensaje: "clients update" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//delete clients
app.delete(`${apiClients}/:id_client`, async (req, res) => {
  try {
    const { id_client } = req.params;

    const query = `
        DELETE FROM clients WHERE id_client = ?
        `;
    const values = [id_client];

    const [result] = await pool.query(query, values);

    if (result.affectedRows != 0) {
      return res.json({ mensaje: "clients delete" });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//contain the total paid per customer
app.get(`${apiClients}/total/:id_client`, async (req, res) => {
  try {
    const { id_client } = req.params;

    const [rows] = await pool.query(
      `
        SELECT
          c.name_client,
          SUM(i.amount_paid) AS total_pagado
        FROM
          clients c
        JOIN
          invoices i ON c.id_client = i.id_client
        where c.id_client = ?; 
    `,
      [id_client]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

app.get("/transactions", async (req, res) => {
  //get all clients
  try {
    const [rows] = await pool.query(
      `SELECT
   *
FROM
    transactions t
JOIN
    invoices i ON t.invoice_number = i.invoice_number
JOIN 
	clients c on c.id_client = i.id_client
where t.id_transaction_statu = 1;
`
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      status: "error",
      endpoint: req.originalUrl,
      method: req.method,
      message: error.message,
    });
  }
});

//Inicio del servidor cuando este todo listo
app.listen(3000, () => {
  console.log("servidor prepado correctamente en http://localhost:3000");
});
