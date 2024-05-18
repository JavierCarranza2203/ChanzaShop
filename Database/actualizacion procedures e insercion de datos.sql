-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-05-2024 a las 18:29:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `chanza_db`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `addNewProduct` (IN `name` VARCHAR(80), IN `description` VARCHAR(255), IN `price` DOUBLE, IN `category` VARCHAR(30))   BEGIN
    DECLARE _intIdCategoria INT;
    SET @_intIdCategoria = NULL;
    
    SELECT idCategoria INTO @_intIdCategoria FROM categoria WHERE Nombre = category;
    
    IF @_intIdCategoria IS NOT NULL THEN
        INSERT INTO producto (Nombre, Descripcion, Precio, IdCategoria, enStock) VALUES (name, description, price, 0, @_intIdCategoria);
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se encontró la categoría especificada.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getBestProductsByCategory` (IN `category` VARCHAR(30))   SELECT
    P.Nombre,
    P.nombreImg,
    SUM(DV.Cantidad) AS Cantidad
FROM 
	venta V JOIN 
    detalledeventa DV ON V.IdVenta = DV.IdVenta JOIN 
    producto P ON P.IdProducto = DV.IdProducto JOIN
    categoria C ON C.IdCategoria = P.IdCategoria
WHERE 
	C.Nombre = 'calzado'
GROUP BY 
	P.Nombre
ORDER BY
	SUM(DV.Cantidad) DESC
LIMIT 10$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductByID` (IN `id` INT)   SELECT 
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductsByCategory` (IN `category` VARCHAR(30))   SELECT 
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

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `allproducts`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `allproducts` (
`IdProducto` int(11)
,`Nombre` varchar(80)
,`Descripcion` varchar(255)
,`Precio` double
,`EnStock` varchar(13)
,`Categoria` varchar(30)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `IdCategoria` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`IdCategoria`, `Nombre`) VALUES
(1, 'vapes'),
(2, 'calzado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `IdCliente` int(11) NOT NULL,
  `Nombre` varchar(30) NOT NULL,
  `ApellidoPaterno` varchar(30) NOT NULL,
  `ApellidoMaterno` varchar(30) NOT NULL,
  `Email` varchar(30) NOT NULL,
  `Telefono` varchar(12) NOT NULL,
  `Usuario` varchar(30) NOT NULL,
  `Password` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`IdCliente`, `Nombre`, `ApellidoPaterno`, `ApellidoMaterno`, `Email`, `Telefono`, `Usuario`, `Password`) VALUES
(1, 'Javier Armando', 'Carranza', 'Garcia', 'javierarmandocg23@gmail.com', '8671184778', 'Javier Carranza', '1123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalledeventa`
--

CREATE TABLE `detalledeventa` (
  `IdProducto` int(11) NOT NULL,
  `IdVenta` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalledeventa`
--

INSERT INTO `detalledeventa` (`IdProducto`, `IdVenta`, `Cantidad`) VALUES
(1, 1, 3),
(3, 1, 1),
(4, 1, 7),
(7, 1, 6),
(2, 2, 7),
(5, 2, 3),
(6, 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `IdProducto` int(11) NOT NULL,
  `Nombre` varchar(80) NOT NULL,
  `Descripcion` varchar(255) NOT NULL,
  `Precio` double NOT NULL,
  `IdCategoria` int(11) DEFAULT NULL,
  `enStock` tinyint(1) NOT NULL,
  `nombreImg` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`IdProducto`, `Nombre`, `Descripcion`, `Precio`, `IdCategoria`, `enStock`, `nombreImg`) VALUES
(1, 'Vape de fresa', 'descripcion', 100, 1, 1, ''),
(2, 'Vapes de sandia', 'descripcion2', 150, 1, 1, ''),
(3, 'Vape de mango', 'descripcion3', 120, 1, 0, ''),
(4, 'Tenis nike 1', 'Tenis nike 1', 2000, 2, 1, '1'),
(5, 'Tenis nike 2', 'Tenis nike 2', 2500, 2, 1, '2'),
(6, 'Tenis nike 3', 'Tenis nike 3', 2400, 2, 1, '3'),
(7, 'Tenis nike 4', 'Tenis nike 4', 1900, 2, 1, '4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `IdVenta` int(11) NOT NULL,
  `IdCliente` int(11) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Hora` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`IdVenta`, `IdCliente`, `Fecha`, `Hora`) VALUES
(1, 1, '2024-04-22', '15:11:23'),
(2, 1, '2024-04-22', '17:13:48');

-- --------------------------------------------------------

--
-- Estructura para la vista `allproducts`
--
DROP TABLE IF EXISTS `allproducts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `allproducts`  AS SELECT `p`.`IdProducto` AS `IdProducto`, `p`.`Nombre` AS `Nombre`, `p`.`Descripcion` AS `Descripcion`, `p`.`Precio` AS `Precio`, CASE WHEN `p`.`enStock` = 1 THEN 'Disponible' ELSE 'No disponible' END AS `EnStock`, `c`.`Nombre` AS `Categoria` FROM (`producto` `p` join `categoria` `c` on(`p`.`IdCategoria` = `c`.`IdCategoria`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`IdCategoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`IdCliente`);

--
-- Indices de la tabla `detalledeventa`
--
ALTER TABLE `detalledeventa`
  ADD PRIMARY KEY (`IdVenta`,`IdProducto`),
  ADD KEY `IdProducto` (`IdProducto`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`IdProducto`),
  ADD KEY `IdCategoria` (`IdCategoria`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`IdVenta`),
  ADD KEY `IdCliente` (`IdCliente`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `IdCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `IdCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `IdProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `IdVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalledeventa`
--
ALTER TABLE `detalledeventa`
  ADD CONSTRAINT `detalledeventa_ibfk_1` FOREIGN KEY (`IdProducto`) REFERENCES `producto` (`IdProducto`),
  ADD CONSTRAINT `detalledeventa_ibfk_2` FOREIGN KEY (`IdVenta`) REFERENCES `venta` (`IdVenta`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`IdCategoria`) REFERENCES `categoria` (`IdCategoria`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`IdCliente`) REFERENCES `cliente` (`IdCliente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
