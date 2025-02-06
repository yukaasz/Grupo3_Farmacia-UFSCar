CREATE TABLE Usuario (
	CPF			  		VARCHAR(11) PRIMARY KEY, CONSTRAINT cpf_valido CHECK (CPF ~ '^[0-9]{11}$'),
    nome		  		varchar(100) NOT NULL,
    cargo	            varchar(100) NOT NULL,
	senha				varchar(50)
);

CREATE TABLE Produto (
	ID_Produto			 SERIAL PRIMARY KEY,
    nome		  		 varchar(100) NOT NULL,
	quantidade			 int NOT NULL,
    preco_unitario	     NUMERIC(10, 2) NOT NULL,
	validade			 date NOT NULL
);

CREATE TABLE Medicamento (
    dosagem		  		 varchar(100) NOT NULL,
	composto_ativo		 varchar(100) NOT NULL
) INHERITS (Produto);

CREATE TABLE Venda (
	ID_Venda			 SERIAL PRIMARY KEY,
    produto		  		 int NOT NULL,
	quantidade			 int NOT NULL,
    preco_total	         NUMERIC(10, 2),
	date_hora			 TIMESTAMP
);

CREATE TABLE Historico (
	ID_Transacao		 SERIAL PRIMARY KEY,
    produto		  		 int NOT NULL,
	quantidade			 int NOT NULL,
	date_hora			 TIMESTAMP,
    tipo				 varchar(100) NOT NULL
);

