-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: mysql:3306
-- Tiempo de generación: 09-04-2022 a las 20:04:42
-- Versión del servidor: 8.0.28
-- Versión de PHP: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `demiles`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acuerdos`
--

CREATE TABLE `acuerdos` (
  `id` int NOT NULL,
  `dcto` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `monto` decimal(11,2) NOT NULL DEFAULT '0.00',
  `descripcion` text,
  `producto` int NOT NULL,
  `autoriza` char(100) NOT NULL,
  `creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `limite` char(50) NOT NULL,
  `estado` int NOT NULL DEFAULT '9',
  `tipo` char(50) NOT NULL DEFAULT 'DCTO',
  `stop` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alzas`
--

CREATE TABLE `alzas` (
  `id` int NOT NULL,
  `monto` char(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `proyecto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bancos`
--

CREATE TABLE `bancos` (
  `id_banco` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `banco` char(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tiempodeposito` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id` int NOT NULL,
  `categoria` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id`, `categoria`) VALUES
(1, 'usuario'),
(2, 'cajero'),
(3, 'cliente'),
(4, 'otros'),
(5, 'iux');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `idc` int NOT NULL,
  `tipo` char(50) DEFAULT NULL,
  `documento` char(50) DEFAULT NULL,
  `lugarexpedicion` char(70) DEFAULT NULL,
  `fechaexpedicion` char(20) DEFAULT NULL,
  `nombre` char(50) NOT NULL,
  `fechanacimiento` char(20) DEFAULT NULL,
  `estadocivil` char(20) DEFAULT NULL,
  `movil` char(15) NOT NULL,
  `email` char(50) DEFAULT NULL,
  `direccion` char(100) DEFAULT NULL,
  `parentesco` char(20) DEFAULT NULL,
  `google` char(100) DEFAULT NULL,
  `acsor` char(100) DEFAULT NULL,
  `paseo` int NOT NULL DEFAULT '0',
  `agendado` int NOT NULL DEFAULT '0',
  `venta` int NOT NULL DEFAULT '0',
  `code` char(20) DEFAULT NULL,
  `tiempo` char(20) DEFAULT NULL,
  `imags` text,
  `bank` char(50) DEFAULT NULL,
  `tipocta` char(5) DEFAULT NULL,
  `numerocuenta` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuotas`
--

CREATE TABLE `cuotas` (
  `id` int NOT NULL,
  `separacion` int NOT NULL,
  `tipo` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ncuota` int NOT NULL,
  `fechs` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuota` int NOT NULL,
  `estado` int NOT NULL,
  `fechapago` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `abono` int DEFAULT '0',
  `mora` int DEFAULT '0',
  `proyeccion` int NOT NULL DEFAULT '0',
  `extraord` int NOT NULL DEFAULT '0',
  `diasmora` int NOT NULL DEFAULT '0',
  `diaspagados` decimal(11,2) DEFAULT '0.00',
  `tasa` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `acuerdo` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupones`
--

CREATE TABLE `cupones` (
  `id` int NOT NULL,
  `pin` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descuento` int NOT NULL,
  `producto` int DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` int NOT NULL,
  `clients` int DEFAULT NULL,
  `tip` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUPON',
  `monto` int DEFAULT NULL,
  `motivo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `concept` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `responsable` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soporte` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id` int NOT NULL,
  `titulo` char(100) NOT NULL,
  `logo` char(100) NOT NULL,
  `nit` char(50) DEFAULT NULL,
  `descripcion` text,
  `contacto` char(50) DEFAULT NULL,
  `email` char(50) DEFAULT NULL,
  `url` char(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `encargos`
--

CREATE TABLE `encargos` (
  `ide` int NOT NULL,
  `cargo` char(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` char(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `dscrip` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id` int NOT NULL,
  `estado` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id`, `estado`) VALUES
(1, 'Procesando'),
(2, 'Cancelada'),
(3, 'Pendiente'),
(4, 'Aprobada'),
(5, 'Expirada'),
(6, 'Declinada'),
(7, 'Activo'),
(8, 'Compensado'),
(9, 'Disponible'),
(10, 'Vendido'),
(11, 'Agotado'),
(12, 'Apartado'),
(13, 'Pagado'),
(14, 'Usado'),
(15, 'Inactiva');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `externos`
--

CREATE TABLE `externos` (
  `id` int NOT NULL,
  `usuario` char(20) NOT NULL,
  `producto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extrabanco`
--

CREATE TABLE `extrabanco` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lugar` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `concpt1` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `concpt2` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otro` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `consignado` int NOT NULL,
  `xcdnt` int NOT NULL DEFAULT '0',
  `cuenta` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fechaingreso` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resposable` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extratos`
--

CREATE TABLE `extratos` (
  `id` int NOT NULL,
  `xtrabank` int NOT NULL,
  `pagos` int DEFAULT NULL,
  `idrcb` int DEFAULT NULL,
  `otro` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `intereses`
--

CREATE TABLE `intereses` (
  `id` int NOT NULL,
  `teano` decimal(11,4) NOT NULL,
  `temes` decimal(11,4) DEFAULT NULL,
  `tedia` decimal(11,4) DEFAULT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `intereses`
--

INSERT INTO `intereses` (`id`, `teano`, `temes`, `tedia`, `fecha`) VALUES
(1, '0.2598', '0.0192', '0.0006', '2021-01-01'),
(2, '0.2631', '0.0197', '0.0006', '2021-02-01'),
(3, '0.2612', '0.0195', '0.0006', '2021-03-01'),
(4, '0.2597', '0.0194', '0.0006', '2021-04-01'),
(5, '0.2583', '0.0193', '0.0006', '2021-05-01'),
(6, '0.2582', '0.0193', '0.0006', '2021-06-01'),
(7, '0.2577', '0.0193', '0.0006', '2021-07-01'),
(8, '0.2586', '0.0194', '0.0006', '2021-08-01'),
(9, '0.2234', NULL, NULL, '2017-01-01'),
(10, '0.2234', NULL, NULL, '2017-02-01'),
(11, '0.2233', NULL, NULL, '2017-06-01'),
(12, '0.2198', NULL, NULL, '2017-08-01'),
(13, '0.2233', NULL, NULL, '2017-05-01'),
(14, '0.2044', NULL, NULL, '2018-05-01'),
(15, '0.2148', NULL, NULL, '2017-09-01'),
(16, '0.2048', NULL, NULL, '2018-04-01'),
(17, '0.1949', NULL, NULL, '2018-11-01'),
(18, '0.1970', NULL, NULL, '2019-02-01'),
(19, '0.1812', NULL, NULL, '2020-07-01'),
(20, '0.2003', NULL, NULL, '2018-07-01'),
(21, '0.1934', NULL, NULL, '2019-05-01'),
(22, '0.2096', NULL, NULL, '2017-11-01'),
(23, '0.2069', NULL, NULL, '2018-01-01'),
(24, '0.2233', NULL, NULL, '2017-04-01'),
(25, '0.2115', NULL, NULL, '2017-10-01'),
(26, '0.2198', NULL, NULL, '2017-07-01'),
(27, '0.2068', NULL, NULL, '2018-03-01'),
(28, '0.2028', NULL, NULL, '2018-06-01'),
(29, '0.1746', NULL, NULL, '2020-12-01'),
(30, '0.1903', NULL, NULL, '2019-11-01'),
(31, '0.1809', NULL, NULL, '2020-10-01'),
(32, '0.1835', NULL, NULL, '2020-09-01'),
(33, '0.2077', NULL, NULL, '2017-12-01'),
(34, '0.2234', NULL, NULL, '2017-03-01'),
(35, '0.1928', NULL, NULL, '2019-07-01'),
(36, '0.1981', NULL, NULL, '2018-09-01'),
(37, '0.1932', NULL, NULL, '2019-04-01'),
(38, '0.1932', NULL, NULL, '2019-09-01'),
(39, '0.2101', NULL, NULL, '2018-02-01'),
(40, '0.1994', NULL, NULL, '2018-08-01'),
(41, '0.1932', NULL, NULL, '2019-08-01'),
(42, '0.1877', NULL, NULL, '2020-01-01'),
(43, '0.1895', NULL, NULL, '2020-03-01'),
(44, '0.1819', NULL, NULL, '2020-05-01'),
(45, '0.1930', NULL, NULL, '2019-06-01'),
(46, '0.1891', NULL, NULL, '2019-12-01'),
(47, '0.1937', NULL, NULL, '2019-03-01'),
(48, '0.1829', NULL, NULL, '2020-08-01'),
(49, '0.1869', NULL, NULL, '2020-04-01'),
(50, '0.1940', NULL, NULL, '2018-12-01'),
(51, '0.1784', NULL, NULL, '2020-11-01'),
(52, '0.1812', NULL, NULL, '2020-06-01'),
(53, '0.1910', NULL, NULL, '2019-10-01'),
(54, '0.1916', NULL, NULL, '2019-01-01'),
(55, '0.1963', NULL, NULL, '2018-10-01'),
(56, '0.1906', NULL, NULL, '2020-02-01'),
(57, '0.2579', NULL, NULL, '2021-09-01'),
(58, '0.2562', NULL, NULL, '2021-10-01'),
(59, '0.2591', NULL, NULL, '2021-11-01'),
(60, '0.2619', NULL, NULL, '2021-12-01'),
(61, '0.2649', NULL, NULL, '2022-01-01'),
(62, '0.2745', NULL, NULL, '2022-02-01'),
(63, '0.2771', NULL, NULL, '2022-03-01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodosdepago`
--

CREATE TABLE `metodosdepago` (
  `id` int NOT NULL,
  `metodop` char(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `metodosdepago`
--

INSERT INTO `metodosdepago` (`id`, `metodop`, `descripcion`) VALUES
(2, 'CREDIT_CARD', 'Tarjetas de Crédito\r\n'),
(4, 'PSE', 'Transferencias bancarias PSE'),
(5, 'ACH', 'Débitos ACH'),
(6, 'DEBIT_CARD', 'Tarjetas débito'),
(7, 'CASH', 'Pago en efectivo\r\n'),
(8, 'REFERENCED', 'Pago referenciado\r\n'),
(10, 'BANK_REFERENCED', 'Pago en bancos\r\n'),
(14, 'SPEI', 'Transferencias bancarias SPEI\r\n');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int NOT NULL,
  `deudor` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acredor` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deuda` int NOT NULL,
  `fechas` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descuentos` int DEFAULT NULL,
  `cuentacobro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rcbs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `stads` int NOT NULL DEFAULT '3',
  `rbc` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto` int DEFAULT NULL,
  `drive` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payu`
--

CREATE TABLE `payu` (
  `id` int NOT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `reference_sale` char(20) DEFAULT NULL,
  `cliente` int DEFAULT NULL,
  `response_message_pol` varchar(255) DEFAULT NULL,
  `state_pol` int DEFAULT NULL,
  `payment_method_name` varchar(255) DEFAULT NULL,
  `payment_method_type` int DEFAULT NULL,
  `value` char(50) DEFAULT NULL,
  `pse_bank` varchar(255) DEFAULT NULL,
  `reference_pol` varchar(255) DEFAULT NULL,
  `ip` char(40) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `cc_number` char(255) DEFAULT NULL,
  `cc_holder` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `transaction_bank_id` varchar(255) DEFAULT NULL,
  `currency` char(3) DEFAULT NULL,
  `error_message_bank` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pines`
--

CREATE TABLE `pines` (
  `id` char(20) NOT NULL,
  `categoria` int DEFAULT NULL,
  `estado` int NOT NULL DEFAULT '3',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario` char(100) DEFAULT NULL,
  `acreedor` char(100) DEFAULT NULL,
  `fechactivacion` date DEFAULT NULL,
  `fechavencimiento` date DEFAULT NULL,
  `celular` char(20) DEFAULT NULL,
  `admin` int DEFAULT NULL,
  `subadmin` int DEFAULT NULL,
  `contador` int DEFAULT NULL,
  `financiero` int DEFAULT NULL,
  `auxicontbl` int DEFAULT NULL,
  `asistente` int DEFAULT NULL,
  `externo` int DEFAULT NULL,
  `sucursal` decimal(11,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pines`
--

INSERT INTO `pines` (`id`, `categoria`, `estado`, `fecha`, `usuario`, `acreedor`, `fechactivacion`, `fechavencimiento`, `celular`, `admin`, `subadmin`, `contador`, `financiero`, `auxicontbl`, `asistente`, `externo`, `sucursal`) VALUES
('ABCDE12345678', 5, 7, '2019-09-12 00:00:00', NULL, '15', '2019-09-23', NULL, NULL, 1, 1, 1, 1, 1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preventa`
--

CREATE TABLE `preventa` (
  `id` int NOT NULL,
  `lote` int NOT NULL,
  `cliente` int NOT NULL,
  `cliente2` int DEFAULT NULL,
  `cliente3` int DEFAULT NULL,
  `cliente4` int DEFAULT NULL,
  `asesor` char(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `numerocuotaspryecto` int NOT NULL,
  `extraordinariameses` int NOT NULL DEFAULT '0',
  `cuotaextraordinaria` int NOT NULL DEFAULT '0',
  `extran` int NOT NULL DEFAULT '0',
  `separar` int NOT NULL,
  `vrmt2` int NOT NULL,
  `iniciar` int NOT NULL,
  `inicialdiferida` int NOT NULL DEFAULT '0',
  `cupon` int DEFAULT NULL,
  `ahorro` int NOT NULL DEFAULT '0',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `obsevacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tipobsevacion` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cuot` double NOT NULL DEFAULT '0',
  `descrip` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `promesa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autoriza` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int DEFAULT NULL,
  `drive` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dto` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NINGUNO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prodrecauds`
--

CREATE TABLE `prodrecauds` (
  `id` int NOT NULL,
  `producto` int NOT NULL,
  `recaudador` int NOT NULL,
  `stado` int NOT NULL DEFAULT '7'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int NOT NULL,
  `proveedor` int DEFAULT NULL,
  `socio` int DEFAULT NULL,
  `categoria` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `proyect` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `porcentage` int NOT NULL,
  `totalmtr2` decimal(11,3) NOT NULL,
  `valmtr2` int DEFAULT NULL,
  `valproyect` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mzs` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `disponibles` int DEFAULT NULL,
  `estados` int NOT NULL,
  `fechaini` date NOT NULL,
  `fechafin` date NOT NULL,
  `separaciones` int NOT NULL,
  `incentivo` int DEFAULT '0',
  `comision` decimal(11,4) DEFAULT '0.0000',
  `linea1` decimal(11,4) DEFAULT '0.0000',
  `linea2` decimal(11,4) DEFAULT '0.0000',
  `linea3` decimal(11,4) DEFAULT '0.0000',
  `maxcomis` decimal(11,4) DEFAULT '0.0000',
  `bextra` int NOT NULL DEFAULT '0',
  `imagenes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `videos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `renders` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `planos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ubicacion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drive` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external` char(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `sistema` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `cobrosistema` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `moras` tinyint(1) NOT NULL DEFAULT '0',
  `descuento` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productosd`
--

CREATE TABLE `productosd` (
  `id` int NOT NULL,
  `producto` int NOT NULL,
  `mz` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `n` int NOT NULL,
  `mtr2` decimal(11,3) NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `estado` int NOT NULL,
  `mtr` int DEFAULT NULL,
  `inicial` int NOT NULL,
  `valor` int NOT NULL,
  `fechar` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uno` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dos` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tres` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `directa` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tramitando` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ediitado` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drive` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comiempresa` int NOT NULL DEFAULT '0',
  `comisistema` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int NOT NULL,
  `empresa` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `representante` int DEFAULT NULL,
  `matricula` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nit` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `banco` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cta` char(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mail` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` char(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `web` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rangos`
--

CREATE TABLE `rangos` (
  `id` int NOT NULL,
  `rango` char(20) NOT NULL,
  `comi` decimal(11,2) NOT NULL,
  `ventas` double NOT NULL,
  `venta` int NOT NULL,
  `bono` decimal(11,4) NOT NULL,
  `nivel1` int NOT NULL DEFAULT '0',
  `nivel2` int NOT NULL DEFAULT '0',
  `nivel3` int NOT NULL DEFAULT '0',
  `premio` int NOT NULL,
  `extra` int DEFAULT NULL,
  `incntivo` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `rangos`
--

INSERT INTO `rangos` (`id`, `rango`, `comi`, `ventas`, `venta`, `bono`, `nivel1`, `nivel2`, `nivel3`, `premio`, `extra`, `incntivo`) VALUES
(1, 'Presidente', '0.03', 10000000000, 50000000, '0.0200', 0, 0, 0, 10000000, NULL, 0),
(2, 'Vicepresidente', '0.03', 7000000000, 50000000, '0.0100', 2000, 2000, 2000, 5000000, NULL, 0),
(3, 'Gerente Elite', '0.03', 4000000000, 50000000, '0.0050', 1000, 1000, 1000, 3500000, NULL, 0),
(4, 'Gerente', '0.03', 2000000000, 70000000, '0.0050', 600, 600, 600, 3000000, NULL, 0),
(5, 'Director', '0.03', 1000000000, 100000000, '0.0000', 300, 300, 300, 1000000, NULL, 1),
(6, 'Inversionista', '0.03', 500000000, 500000000, '0.0000', 150, 150, 150, 0, NULL, 1),
(7, 'Independiente', '0.00', 0, 0, '0.0000', 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recaudadores`
--

CREATE TABLE `recaudadores` (
  `id` int NOT NULL,
  `entidad` char(50) NOT NULL,
  `tipo` char(50) NOT NULL,
  `code1` char(50) NOT NULL,
  `code2` char(50) NOT NULL,
  `code3` char(50) NOT NULL,
  `code4` char(50) NOT NULL,
  `grupo` char(100) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibos`
--

CREATE TABLE `recibos` (
  `id` int NOT NULL,
  `registro` int DEFAULT NULL,
  `date` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `formapg` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rcb` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `monto` int NOT NULL,
  `observacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `baucher` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/img/bonos.png',
  `bono` int DEFAULT NULL,
  `excdnt` int NOT NULL DEFAULT '0',
  `extrato` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `relacioncuotas`
--

CREATE TABLE `relacioncuotas` (
  `id` int UNSIGNED NOT NULL,
  `pago` int NOT NULL,
  `cuota` int NOT NULL,
  `dias` int NOT NULL DEFAULT '0',
  `mora` int NOT NULL DEFAULT '0',
  `dcto` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `diaspagados` decimal(11,2) NOT NULL DEFAULT '0.00',
  `totalmora` int NOT NULL DEFAULT '0',
  `pagoaprobado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `montocuota` int NOT NULL DEFAULT '0',
  `morapaga` int NOT NULL DEFAULT '0',
  `saldocuota` int NOT NULL DEFAULT '0',
  `stdcuota` int NOT NULL DEFAULT '3',
  `tasa` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `fechaLMT` date DEFAULT NULL,
  `saldomora` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(123) NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `ids` int NOT NULL,
  `fech` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pago` int DEFAULT NULL,
  `monto` int NOT NULL,
  `recibo` char(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facturasvenc` int DEFAULT NULL,
  `concepto` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `stado` int NOT NULL,
  `img` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `descp` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `asesor` char(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `porciento` decimal(11,4) DEFAULT '0.0000',
  `total` int DEFAULT '0',
  `lt` int DEFAULT NULL,
  `retefuente` int DEFAULT NULL,
  `reteica` int DEFAULT NULL,
  `pagar` int DEFAULT NULL,
  `formap` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bono` int DEFAULT NULL,
  `acumulado` int DEFAULT NULL,
  `pdf` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transfer` int DEFAULT NULL,
  `aprueba` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `excdnt` int NOT NULL DEFAULT '0' COMMENT 'excedentes de recibos y para reinstituir en caso de anulación ',
  `rcbexcdnt` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'excedentes de recibos y para reinstituir en caso de anulación ',
  `motorecibos` int DEFAULT '0' COMMENT 'excedentes de recibos y para reinstituir en caso de anulación ',
  `bonoanular` int DEFAULT NULL,
  `cuentadecobro` int DEFAULT NULL,
  `moras` int NOT NULL DEFAULT '0',
  `orden` int DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `drive` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecharcb` date DEFAULT NULL,
  `extrato` int DEFAULT NULL,
  `aprobado` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acuerdo` int DEFAULT NULL,
  `mora` decimal(11,2) DEFAULT NULL,
  `dias` decimal(11,2) DEFAULT NULL,
  `dcto` decimal(11,4) DEFAULT NULL,
  `totalmora` decimal(11,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` char(100) NOT NULL,
  `pin` char(20) DEFAULT NULL,
  `fullname` char(50) DEFAULT NULL,
  `document` char(50) DEFAULT NULL,
  `cel` char(20) DEFAULT NULL,
  `username` char(50) DEFAULT NULL,
  `password` char(60) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nrango` int NOT NULL DEFAULT '6',
  `cli` int DEFAULT NULL,
  `sucursal` decimal(11,3) DEFAULT NULL,
  `cortep` bigint NOT NULL DEFAULT '0',
  `corte1` bigint NOT NULL DEFAULT '0',
  `corte2` bigint NOT NULL DEFAULT '0',
  `corte3` bigint NOT NULL DEFAULT '0',
  `totalcorte` bigint NOT NULL DEFAULT '0',
  `totalcortep` bigint NOT NULL DEFAULT '0',
  `rangoabajo` int NOT NULL DEFAULT '0',
  `pagobono` tinyint(1) NOT NULL DEFAULT '0',
  `bonoextra` decimal(11,4) NOT NULL DEFAULT '0.0000',
  `daterange` date DEFAULT NULL,
  `newrange` int NOT NULL DEFAULT '0' COMMENT '1 para red 2 para sucursal'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `pin`, `fullname`, `document`, `cel`, `username`, `password`, `imagen`, `nrango`, `cli`, `sucursal`, `cortep`, `corte1`, `corte2`, `corte3`, `totalcorte`, `totalcortep`, `rangoabajo`, `pagobono`, `bonoextra`, `daterange`, `newrange`) VALUES
('15', 'ABCDE12345678', 'ADMIN', NULL, '3002851046', 'admin@admin.com', '$2a$10$trUaSA7qlNWPPDF/9oA0jO7hpaw.EHD9f3ElL1RBxKQ1X2sEf63lO', '/img/avatars/avatar.svg', 1, NULL, NULL, 0, 234436230, 405027075, 277041765, 1578911880, 0, 7, 0, '0.0000', NULL, 0);

--
-- Disparadores `users`
--
DELIMITER $$
CREATE TRIGGER `Acreedor` AFTER INSERT ON `users` FOR EACH ROW UPDATE pines SET acreedor = NEW.id WHERE id = NEW.pin
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `sacar de la red` AFTER UPDATE ON `users` FOR EACH ROW UPDATE pines SET sucursal = NEW.sucursal WHERE usuario = NEW.id
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acuerdos`
--
ALTER TABLE `acuerdos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `alzas`
--
ALTER TABLE `alzas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proyecto` (`proyecto`);

--
-- Indices de la tabla `bancos`
--
ALTER TABLE `bancos`
  ADD PRIMARY KEY (`id_banco`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`idc`),
  ADD KEY `acsor` (`acsor`);

--
-- Indices de la tabla `cuotas`
--
ALTER TABLE `cuotas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado` (`estado`),
  ADD KEY `separacion` (`separacion`);

--
-- Indices de la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado` (`estado`),
  ADD KEY `producto` (`producto`),
  ADD KEY `clients` (`clients`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `encargos`
--
ALTER TABLE `encargos`
  ADD PRIMARY KEY (`ide`),
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `externos`
--
ALTER TABLE `externos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario` (`usuario`),
  ADD KEY `producto` (`producto`);

--
-- Indices de la tabla `extrabanco`
--
ALTER TABLE `extrabanco`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `extratos`
--
ALTER TABLE `extratos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `xtrabank` (`xtrabank`),
  ADD KEY `pagos` (`pagos`);

--
-- Indices de la tabla `intereses`
--
ALTER TABLE `intereses`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `metodosdepago`
--
ALTER TABLE `metodosdepago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stads` (`stads`);

--
-- Indices de la tabla `payu`
--
ALTER TABLE `payu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_method_type` (`payment_method_type`),
  ADD KEY `state_pol` (`state_pol`),
  ADD KEY `cliente` (`cliente`);

--
-- Indices de la tabla `pines`
--
ALTER TABLE `pines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proposito` (`categoria`),
  ADD KEY `id_estado` (`estado`),
  ADD KEY `generador` (`usuario`),
  ADD KEY `acreedor` (`acreedor`);

--
-- Indices de la tabla `preventa`
--
ALTER TABLE `preventa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lote` (`lote`),
  ADD KEY `cliente` (`cliente`),
  ADD KEY `cliente2` (`cliente2`),
  ADD KEY `asesor` (`asesor`),
  ADD KEY `cupon` (`cupon`),
  ADD KEY `cliente3` (`cliente3`),
  ADD KEY `cliente4` (`cliente4`);

--
-- Indices de la tabla `prodrecauds`
--
ALTER TABLE `prodrecauds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto` (`producto`),
  ADD KEY `recaudador` (`recaudador`),
  ADD KEY `stado` (`stado`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `estado` (`estados`),
  ADD KEY `proveedor` (`proveedor`),
  ADD KEY `external` (`external`);

--
-- Indices de la tabla `productosd`
--
ALTER TABLE `productosd`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto` (`producto`),
  ADD KEY `estado` (`estado`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `representante` (`representante`);

--
-- Indices de la tabla `rangos`
--
ALTER TABLE `rangos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `extra` (`extra`);

--
-- Indices de la tabla `recaudadores`
--
ALTER TABLE `recaudadores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `registro` (`registro`),
  ADD KEY `bono` (`bono`),
  ADD KEY `extrato` (`extrato`);

--
-- Indices de la tabla `relacioncuotas`
--
ALTER TABLE `relacioncuotas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pago` (`pago`),
  ADD KEY `cuota` (`cuota`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`ids`),
  ADD KEY `pago` (`pago`),
  ADD KEY `asesor` (`asesor`),
  ADD KEY `lt` (`lt`),
  ADD KEY `bono` (`bono`),
  ADD KEY `transfer` (`transfer`),
  ADD KEY `cuentadecobro` (`cuentadecobro`),
  ADD KEY `orden` (`orden`),
  ADD KEY `extrato` (`extrato`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pin` (`pin`),
  ADD KEY `nrango` (`nrango`),
  ADD KEY `cli` (`cli`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acuerdos`
--
ALTER TABLE `acuerdos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `alzas`
--
ALTER TABLE `alzas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `idc` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3293;

--
-- AUTO_INCREMENT de la tabla `cuotas`
--
ALTER TABLE `cuotas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT de la tabla `cupones`
--
ALTER TABLE `cupones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `encargos`
--
ALTER TABLE `encargos`
  MODIFY `ide` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `externos`
--
ALTER TABLE `externos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `extrabanco`
--
ALTER TABLE `extrabanco`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13835;

--
-- AUTO_INCREMENT de la tabla `extratos`
--
ALTER TABLE `extratos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `intereses`
--
ALTER TABLE `intereses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `metodosdepago`
--
ALTER TABLE `metodosdepago`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `payu`
--
ALTER TABLE `payu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preventa`
--
ALTER TABLE `preventa`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `prodrecauds`
--
ALTER TABLE `prodrecauds`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT de la tabla `productosd`
--
ALTER TABLE `productosd`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4245;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `rangos`
--
ALTER TABLE `rangos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `recaudadores`
--
ALTER TABLE `recaudadores`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `recibos`
--
ALTER TABLE `recibos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `relacioncuotas`
--
ALTER TABLE `relacioncuotas`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `ids` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alzas`
--
ALTER TABLE `alzas`
  ADD CONSTRAINT `alzas_ibfk_1` FOREIGN KEY (`proyecto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`acsor`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `cuotas`
--
ALTER TABLE `cuotas`
  ADD CONSTRAINT `cuotas_ibfk_1` FOREIGN KEY (`estado`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `cuotas_ibfk_3` FOREIGN KEY (`separacion`) REFERENCES `preventa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD CONSTRAINT `cupones_ibfk_2` FOREIGN KEY (`producto`) REFERENCES `preventa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cupones_ibfk_3` FOREIGN KEY (`clients`) REFERENCES `clientes` (`idc`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `cupones_ibfk_4` FOREIGN KEY (`estado`) REFERENCES `estados` (`id`);

--
-- Filtros para la tabla `encargos`
--
ALTER TABLE `encargos`
  ADD CONSTRAINT `encargos_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `externos`
--
ALTER TABLE `externos`
  ADD CONSTRAINT `externos_ibfk_2` FOREIGN KEY (`producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `externos_ibfk_3` FOREIGN KEY (`usuario`) REFERENCES `pines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `extratos`
--
ALTER TABLE `extratos`
  ADD CONSTRAINT `extratos_ibfk_1` FOREIGN KEY (`xtrabank`) REFERENCES `extrabanco` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `extratos_ibfk_2` FOREIGN KEY (`pagos`) REFERENCES `solicitudes` (`ids`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`stads`) REFERENCES `estados` (`id`);

--
-- Filtros para la tabla `payu`
--
ALTER TABLE `payu`
  ADD CONSTRAINT `payu_ibfk_1` FOREIGN KEY (`state_pol`) REFERENCES `estados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payu_ibfk_4` FOREIGN KEY (`payment_method_type`) REFERENCES `metodosdepago` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payu_ibfk_6` FOREIGN KEY (`cliente`) REFERENCES `clientes` (`idc`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pines`
--
ALTER TABLE `pines`
  ADD CONSTRAINT `pines_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estados` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pines_ibfk_4` FOREIGN KEY (`categoria`) REFERENCES `categoria` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pines_ibfk_5` FOREIGN KEY (`acreedor`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pines_ibfk_6` FOREIGN KEY (`usuario`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `preventa`
--
ALTER TABLE `preventa`
  ADD CONSTRAINT `preventa_ibfk_1` FOREIGN KEY (`lote`) REFERENCES `productosd` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `preventa_ibfk_2` FOREIGN KEY (`cliente`) REFERENCES `clientes` (`idc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `preventa_ibfk_3` FOREIGN KEY (`cliente2`) REFERENCES `clientes` (`idc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `preventa_ibfk_5` FOREIGN KEY (`cupon`) REFERENCES `cupones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `preventa_ibfk_6` FOREIGN KEY (`cliente3`) REFERENCES `clientes` (`idc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `preventa_ibfk_7` FOREIGN KEY (`cliente4`) REFERENCES `clientes` (`idc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `preventa_ibfk_8` FOREIGN KEY (`asesor`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `prodrecauds`
--
ALTER TABLE `prodrecauds`
  ADD CONSTRAINT `prodrecauds_ibfk_1` FOREIGN KEY (`producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `prodrecauds_ibfk_2` FOREIGN KEY (`recaudador`) REFERENCES `recaudadores` (`id`),
  ADD CONSTRAINT `prodrecauds_ibfk_3` FOREIGN KEY (`stado`) REFERENCES `estados` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`estados`) REFERENCES `estados` (`id`),
  ADD CONSTRAINT `productos_ibfk_4` FOREIGN KEY (`proveedor`) REFERENCES `proveedores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `productos_ibfk_5` FOREIGN KEY (`external`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `productosd`
--
ALTER TABLE `productosd`
  ADD CONSTRAINT `productosd_ibfk_1` FOREIGN KEY (`producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productosd_ibfk_2` FOREIGN KEY (`estado`) REFERENCES `estados` (`id`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`representante`) REFERENCES `clientes` (`idc`);

--
-- Filtros para la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD CONSTRAINT `recibos_ibfk_1` FOREIGN KEY (`registro`) REFERENCES `solicitudes` (`ids`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recibos_ibfk_2` FOREIGN KEY (`bono`) REFERENCES `cupones` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `recibos_ibfk_3` FOREIGN KEY (`extrato`) REFERENCES `extrabanco` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `relacioncuotas`
--
ALTER TABLE `relacioncuotas`
  ADD CONSTRAINT `relacioncuotas_ibfk_1` FOREIGN KEY (`cuota`) REFERENCES `cuotas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `relacioncuotas_ibfk_2` FOREIGN KEY (`pago`) REFERENCES `solicitudes` (`ids`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `solicitudes_ibfk_1` FOREIGN KEY (`pago`) REFERENCES `cuotas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_2` FOREIGN KEY (`lt`) REFERENCES `productosd` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_3` FOREIGN KEY (`asesor`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_4` FOREIGN KEY (`bono`) REFERENCES `cupones` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_5` FOREIGN KEY (`transfer`) REFERENCES `payu` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_6` FOREIGN KEY (`orden`) REFERENCES `preventa` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitudes_ibfk_7` FOREIGN KEY (`extrato`) REFERENCES `extrabanco` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`pin`) REFERENCES `pines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`nrango`) REFERENCES `rangos` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_6` FOREIGN KEY (`cli`) REFERENCES `clientes` (`idc`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
