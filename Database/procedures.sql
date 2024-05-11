DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addNewProduct` (IN `name` VARCHAR(80), IN `description` VARCHAR(255), IN `price` DOUBLE, IN `category` VARCHAR(30)) BEGIN
    DECLARE _intIdCategoria INT;
    SET @_intIdCategoria = NULL;
    
    SELECT idCategoria INTO @_intIdCategoria FROM categoria WHERE Nombre = category;
    
    IF @_intIdCategoria IS NOT NULL THEN
        INSERT INTO producto (Nombre, Descripcion, Precio, IdCategoria, enStock) VALUES (name, description, price, 0, @_intIdCategoria);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la categoría especificada.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getBestProductsByCategory` (IN `category` VARCHAR(30)) SELECT
    P.Nombre,
    SUM(DV.Cantidad) AS Cantidad
FROM 
	venta V JOIN 
    detalledeventa DV ON V.IdVenta = DV.IdVenta JOIN 
    producto P ON P.IdProducto = DV.IdProducto JOIN
    categoria C ON C.IdCategoria = P.IdCategoria
WHERE 
	C.Nombre = category
GROUP BY 
	P.Nombre
ORDER BY
	SUM(DV.Cantidad) DESC
LIMIT 10$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductByID` (IN `id` INT) SELECT 
    P.IdProducto, 
    P.Nombre, 
    P.Descripcion, 
    P.Precio, 
    C.Nombre AS Categoria,
    CASE 
        WHEN P.enStock = 1 THEN "Disponible"
        ELSE "No Disponible"
    END AS enStock,
0 AS Cantidad
FROM 
    producto P 
    JOIN categoria C ON P.IdCategoria = C.IdCategoria
WHERE 
    P.IdProducto = id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductsByCategory` (IN `category` VARCHAR(30)) SELECT 
	P.IdProducto, 
    P.Nombre AS Nombre, 
    P.Descripcion, 
    P.Precio, 
    C.Nombre AS Categoria, 
    CASE 
        WHEN P.enStock = 1 THEN "Disponible" 
        ELSE "No disponible" 
    END AS enStock,
0 AS Cantidad
FROM 
	producto P JOIN 
    categoria C ON P.IdCategoria = C.IdCategoria
WHERE 
	C.Nombre = category AND P.enStock = 1$$
DELIMITER ;