CREATE TABLE Categoria(
    IdCategoria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL
);

CREATE TABLE Producto(
    IdProducto INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(80) NOT NULL,
    Descripcion VARCHAR(255) NOT NULL,
    Precio DOUBLE NOT NULL,
    IdCategoria INT, 
    FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria)
);

CREATE TABLE Cliente(
    IdCliente INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    ApellidoPaterno VARCHAR(30) NOT NULL,
    ApellidoMaterno VARCHAR(30) NOT NULL,
    Email VARCHAR(30) NOT NULL,
    Telefono VARCHAR(12) NOT NULL
);

CREATE TABLE Venta(
    IdVenta INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    IdCliente INT,
    Fecha DATE,
    Hora TIME
    FOREIGN KEY (IdCliente) REFERENCES Cliente(IdCliente)
);

CREATE TABLE DetalleDeVenta(
    IdProducto INT NOT NULL,
    IdVenta INT NOT NULL,
    Cantidad INT NOT NULL,
    PRIMARY KEY (IdVenta, IdProducto),
    FOREIGN KEY (IdProducto) REFERENCES Producto(IdProducto),
    FOREIGN KEY (IdVenta) REFERENCES Venta(IdVenta)
);