-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-05-2024 a las 04:00:57
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `addNewProduct` (IN `name` VARCHAR(80), IN `description` VARCHAR(255), IN `price` DOUBLE, IN `category` VARCHAR(30), IN `quantity` INT)   BEGIN
    DECLARE _intIdCategoria INT;
    SET @_intIdCategoria = NULL;
    
    SELECT idCategoria INTO @_intIdCategoria FROM categoria WHERE Nombre = category;
    
    IF @_intIdCategoria IS NOT NULL THEN
        INSERT INTO producto (Nombre, Descripcion, Precio, IdCategoria, enStock) VALUES (name, description, price, @_intIdCategoria, quantity);
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
	C.Nombre = category AND P.enStock > 0
GROUP BY 
	P.Nombre, P.nombreImg
ORDER BY
	SUM(DV.Cantidad) DESC
LIMIT 4$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductByID` (IN `id` INT)   SELECT 
    P.IdProducto, 
    P.nombreImg,
    P.Nombre, 
    P.Descripcion, 
    P.Precio, 
    C.Nombre AS Categoria,
    CASE 
        WHEN P.enStock >= 1 THEN "Disponible"
        ELSE "No Disponible"
    END AS enStock,
P.enStock AS Cantidad
FROM 
    producto P 
    JOIN categoria C ON P.IdCategoria = C.IdCategoria
WHERE 
   P.IdProducto = id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getProductsByCategory` (IN `category` VARCHAR(30))   SELECT 
	P.IdProducto, 
    P.nombreImg,
    P.Nombre AS Nombre, 
    P.Descripcion, 
    P.Precio, 
    C.Nombre AS Categoria, 
    CASE 
    	WHEN P.enStock >= 1 THEN "Disponible" 
        ELSE "No disponible" 
    END AS enStock,
P.enStock AS Cantidad
FROM 
	producto P JOIN 
    categoria C ON P.IdCategoria = C.IdCategoria
WHERE 
	C.Nombre = category AND P.enStock >= 1$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRegisteredUsersData` ()   SELECT 
        DATE(FechaRegistro) AS FechaRegistro,
        COUNT(*) AS CantidadUsuariosRegistrados
    FROM 
        cliente
    GROUP BY 
        DATE(FechaRegistro)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getRegisteredUsersDataByDateRange` (IN `fechainicio` DATE, IN `fechafinal` DATE)   SELECT 
        DATE(FechaRegistro) AS FechaRegistro,
        COUNT(*) AS CantidadUsuariosRegistrados
    FROM 
        cliente
        WHERE
        	FechaRegistro BETWEEN fechainicio and fechafinal
    GROUP BY 
        DATE(FechaRegistro)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getSalesByDateRange` (IN `fechainicio` DATE, IN `fechafinal` DATE)   SELECT 
        DATE(Fecha) AS Fecha,
        COUNT(*) AS CantidadVentas
    FROM 
        venta
        WHERE Fecha BETWEEN fechainicio and fechafinal
    GROUP BY 
        DATE(Fecha)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarDetalleVenta` (IN `p_IdProducto` INT, IN `p_IdVenta` INT, IN `p_Cantidad` INT)   BEGIN
    DECLARE v_StockActual INT;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Obtener la cantidad actual en stock del producto
    SELECT EnStock INTO v_StockActual
    FROM producto
    WHERE IdProducto = p_IdProducto;

    -- Verificar si hay suficiente stock
    IF v_StockActual < p_Cantidad THEN
        -- Si no hay suficiente stock, eliminar la venta y cualquier detalle de venta relacionado
        DELETE FROM detalledeventa WHERE IdVenta = p_IdVenta;
        DELETE FROM venta WHERE IdVenta = p_IdVenta;

        -- Terminar la transacción
        ROLLBACK;
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cantidad en stock insuficiente. Venta cancelada.';
    ELSE
        -- Insertar el registro en la tabla detalledeventa
        INSERT INTO detalledeventa (IdProducto, IdVenta, Cantidad) 
        VALUES (p_IdProducto, p_IdVenta, p_Cantidad);
        
        -- Reducir la cantidad en stock del producto
        UPDATE producto
        SET EnStock = EnStock - p_Cantidad
        WHERE IdProducto = p_IdProducto;

        -- Confirmar la transacción
        COMMIT;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarVenta` (IN `p_Usuario` VARCHAR(255))   BEGIN
    DECLARE v_IdCliente INT;
    DECLARE v_FechaHora DATETIME;

    -- Obtener el ID del cliente basado en el nombre de usuario
    SELECT IdCliente INTO v_IdCliente
    FROM cliente
    WHERE Usuario = p_Usuario
    LIMIT 1;
    
    -- Verificar si el cliente existe
    IF v_IdCliente IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cliente no encontrado';
    ELSE
        -- Obtener la fecha y hora del sistema
        SET v_FechaHora = NOW();
        
        -- Insertar el registro en la tabla venta
        INSERT INTO venta (IdCliente, Fecha, Hora) VALUES (v_IdCliente, DATE(v_FechaHora), TIME(v_FechaHora));
        
        -- Devolver el ID de la venta recién insertada
        SELECT LAST_INSERT_ID() AS IdVenta;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `MostrasVentas` ()   SELECT 
        c.Nombre AS NombreCliente,
        v.IdVenta,
        p.Nombre AS NombreProducto,
        dv.Cantidad AS CantidadPendiente
    FROM venta v
    INNER JOIN detalledeventa dv ON v.IdVenta = dv.IdVenta
    INNER JOIN producto p ON dv.IdProducto = p.IdProducto
    INNER JOIN cliente c ON v.IdCliente = c.IdCliente
    ORDER BY c.Nombre, v.IdVenta$$

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
  `Password` varchar(10) NOT NULL,
  `FechaRegistro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`IdCliente`, `Nombre`, `ApellidoPaterno`, `ApellidoMaterno`, `Email`, `Telefono`, `Usuario`, `Password`, `FechaRegistro`) VALUES
(1, 'Javier Armando', 'Carranza', 'Garcia', 'javierarmandocg23@gmail.com', '8671184778', 'Javier Carranza', '1123', '2024-05-01'),
(2, 'Cristobal', 'Gonzalez', 'Martinez', 'l21100214@nlaredo.tecnm.mx', '8671234567', 'Tobal', '31416', '2024-05-07'),
(3, 'Ramses', 'Reyero', 'Garcia', 'l21100275@nlaredo.tecnm.mx', '8677654321', 'Chenzn', '123123', '2024-05-14');

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
(11, 1, 2),
(14, 1, 1),
(2, 2, 7),
(5, 2, 3),
(6, 2, 3),
(12, 2, 1),
(15, 2, 2),
(7, 3, 6),
(8, 3, 5),
(13, 3, 1),
(16, 3, 2),
(14, 6, 1),
(14, 7, 1),
(14, 8, 1),
(14, 9, 1),
(14, 10, 1),
(14, 11, 1),
(14, 12, 1),
(14, 13, 1),
(14, 14, 1),
(14, 15, 1),
(11, 16, 3);

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
(1, 'Nike Court Royale\r\n', 'Calzado para mujer\r\n', 749, 2, 5, '1'),
(2, 'Nike City Rep TR\r\n', 'Calzado de entrenamiento para mujer\r\n', 824, 2, 6, '2'),
(3, 'Nike SB Alleyoop\r\n', 'Tenis de skateboarding para niños talla grande\r\n', 799, 2, 11, '3'),
(4, 'Nike Air Max Axis\r\n', 'Calzado para niños talla pequeña\r\n', 899, 2, 15, '4'),
(5, 'Nike Air Max Axis\r\n', 'Calzado para niños talla grande\r\n', 949, 2, 3, '5'),
(6, 'Nike Ebernon Low', 'Calzado para hombre\r\n', 799, 2, 8, '6'),
(7, 'Nike Ebernon Low Premium\r\n', 'Calzado para hombre\r\n', 849, 2, 5, '7'),
(8, 'Nike Air Force 1 \'07\r\n', 'Calzado para hombre\r\n', 2599, 2, 20, '8'),
(9, 'Nike Court Royale AC\r\n', 'Calzado para mujer\r\n', 799, 2, 5, '9'),
(10, 'Nike SB Zoom Blazer Mid\r\n', 'Tenis de skateboarding\r\n', 1224, 2, 3, '10'),
(11, 'MASKKING TURBO II\r\n', 'Maskking Turbo II 2: Disfruta de una Experiencia de Vapeo Personalizada\r\n\r\n', 400, 1, 22, '11'),
(12, 'MASKKING TURBO\r\n', 'Maskking Turbo: Disfruta de más de 10,000 Caladas de Vapeo Intenso\r\n\r\n', 299, 1, 10, '12'),
(13, 'MASKKING LUX\r\n', 'Maskking Lux: Disfruta de una Experiencia de Vapeo de Lujo\r\n\r\n', 350, 1, 18, '13'),
(14, 'MASKKING LUX ZERO\r\n', 'Maskking Lux Zero: Disfruta de una Experiencia de Vapeo Sin Nicotina\r\n\r\n', 350, 1, 7, '14'),
(15, 'MASKKING HIGH GTS\r\n', 'Vape Desechable Maskking High GTS: Disfruta de 3000+ Caladas de Vapeo\r\n\r\n', 299, 1, 22, '15'),
(16, 'MASKKING GTS ZERO\r\n', 'Experimenta una amplia gama de sabores exquisitos con el Vape Desechable nuevo Maskking GTS ZERO.', 299, 1, 52, '16'),
(17, 'MASKKING PRO PLUS\r\n', 'Maskking Pro Plus: Disfruta de una Experiencia de Vapeo de Lujo\r\n\r\n', 198, 1, 30, '17'),
(18, 'MASKKING HIGH GT\r\n', 'Maskking High GT: Disfruta de la Conveniencia del Vapeo Desechable\r\n\r\n', 149, 1, 10, '18'),
(19, 'MASKKING HIGH BOX\r\n', 'Nuevo Maskking High Box \r\n\r\n', 149, 1, 22, '19'),
(20, 'MASKKING JAM MINI\r\n', 'Disfruta de tu vape Maskking JAM MINI, un vape COMPACTO que ofrece una experiencia de vapeo satisfactoria.', 169, 1, 1, '20'),
(21, 'Prueba1', 'prueba1', 10, 1, 10, '');

--
-- Disparadores `producto`
--
DELIMITER $$
CREATE TRIGGER `before_insert_producto` BEFORE INSERT ON `producto` FOR EACH ROW BEGIN
    -- Validar que la categoría sea 'vapes' o 'calzado'
    IF NEW.IdCategoria NOT IN (1, 2) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Categoría no válida. Debe ser "vapes" o "calzado".';
    END IF;

    -- Asegurarse de que EnStock sea mayor que 1
    IF NEW.EnStock <= 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El valor de EnStock debe ser mayor que 1.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_update_producto` BEFORE UPDATE ON `producto` FOR EACH ROW BEGIN
    -- Validar que la categoría sea 'vapes' o 'calzado'
    IF NEW.IdCategoria NOT IN (1, 2) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Categoría no válida. Debe ser "vapes" o "calzado".';
    END IF;

    -- Asegurarse de que EnStock sea mayor que 1
    IF NEW.EnStock < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El valor de EnStock debe ser mayor que 0.';
    END IF;
END
$$
DELIMITER ;

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
(2, 2, '2024-04-30', '13:50:00'),
(3, 3, '2024-05-06', '08:00:00'),
(4, 1, '2024-05-27', '08:01:03'),
(5, 1, '2024-05-27', '08:27:03'),
(6, 1, '2024-05-27', '08:27:36'),
(7, 1, '2024-05-27', '08:28:07'),
(8, 1, '2024-05-27', '08:28:41'),
(9, 1, '2024-05-27', '08:29:26'),
(10, 1, '2024-05-27', '08:29:32'),
(11, 1, '2024-05-27', '08:29:55'),
(12, 1, '2024-05-27', '08:30:49'),
(13, 1, '2024-05-30', '20:13:22'),
(14, 1, '2024-05-30', '20:13:41'),
(15, 1, '2024-05-30', '20:14:10'),
(16, 1, '2024-05-30', '20:20:00'),
(17, 1, '2024-05-30', '20:23:23'),
(18, 1, '2024-05-30', '20:28:46'),
(19, 1, '2024-05-30', '20:32:07'),
(20, 1, '2024-05-30', '20:34:44'),
(21, 1, '2024-05-30', '20:35:30'),
(22, 1, '2024-05-30', '20:37:42'),
(23, 1, '2024-05-30', '20:40:28'),
(24, 1, '2024-05-30', '20:40:54'),
(25, 1, '2024-05-30', '20:45:11'),
(26, 1, '2024-05-30', '20:45:19'),
(27, 1, '2024-05-30', '20:46:13'),
(28, 1, '2024-05-30', '20:47:23'),
(29, 1, '2024-05-30', '20:47:37'),
(30, 1, '2024-05-30', '20:49:39'),
(31, 1, '2024-05-30', '20:50:12'),
(32, 1, '2024-05-30', '20:50:24'),
(33, 1, '2024-05-30', '20:51:04'),
(34, 1, '2024-05-30', '20:51:28'),
(35, 1, '2024-05-30', '20:52:17'),
(36, 1, '2024-05-30', '20:52:34'),
(37, 1, '2024-05-30', '20:55:14'),
(38, 1, '2024-05-30', '20:56:36'),
(39, 1, '2024-05-30', '20:57:09');

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
  MODIFY `IdCliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `IdProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `IdVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

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
