CREATE DATABASE pd_isaac_quintero_clanCienaga;
USE pd_isaac_quintero_clanCienaga;

CREATE TABLE clients(
	id_client INT auto_increment PRIMARY KEY,
    name_client VARCHAR(50) NOT NULL,
    identification_number INT UNIQUE NOT NULL,
    address VARCHAR(100),
    phone_number VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE invoices(
	invoice_number VARCHAR(50) PRIMARY KEY,
    invoice_period VARCHAR(50),
    invoice_amount INT NOT NULL,
    amount_paid INT NOT NULL,
    id_client INT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_client) REFERENCES clients(id_client) on delete set null on update cascade
);

CREATE TABLE platforms(
	id_platform INT auto_increment PRIMARY KEY,
    platform_name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE trasaction_status(
	id_transaction_statu INT auto_increment PRIMARY KEY,
    transaction_statu_name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE trasaction_types(
	id_transaction_type INT auto_increment PRIMARY KEY,
    transaction_type_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions(
	id_transaction VARCHAR(50) PRIMARY KEY,
	id_transaction_statu INT, #foreign key
    id_transaction_type INT, #foreign key
    invoice_number INT, #foreign key
	id_platform INT, #foreign key
    date_and_time DATETIME NOT NULL, # child fields of this table
    transaction_amount INT  NOT NULL, # child fields of this table
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
	FOREIGN KEY(id_transaction_statu) REFERENCES trasaction_status(id_transaction_statu)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    
    FOREIGN KEY(id_transaction_type) REFERENCES trasaction_types(id_transaction_type)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    
	FOREIGN KEY(invoice_number) REFERENCES invoices(invoice_number)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
    
    FOREIGN KEY(id_platform) REFERENCES platforms(id_platform)
    ON UPDATE CASCADE
    ON DELETE SET NULL
    
);

INSERT INTO  trasaction_status (transaction_statu_name) VALUES ('pediente'),('fallida'),('completada');
INSERT INTO  trasaction_types (transaction_type_name ) VALUES ('pago de factura');
INSERT INTO  platforms (platform_name) VALUES ('nequi'),('daviplata');



SELECT name_client,address,phone_number,email FROM clients where id_client = 1;

SELECT
    c.name_client,
    SUM(i.invoice_paid) AS total_pagado
FROM
    clients c
JOIN
    invoices i ON c.id_client = i.id_client
where c.id_client = 1

