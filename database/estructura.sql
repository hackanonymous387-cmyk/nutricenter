-- ============================================================================
-- 🌿 NUTRICENTER PERÚ - SISTEMA INTEGRAL WEB E-COMMERCE & PUNTO DE VENTA (POS)
-- BASE DE DATOS EMPRESARIAL (DDL) - MySQL / MariaDB 8.x / InnoDB / utf8mb4
-- ============================================================================

CREATE DATABASE IF NOT EXISTS nutricenter_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutricenter_db;

-- Desactivar temporalmente revisión de foreign keys para inicialización limpia
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS auditoria_logs;
DROP TABLE IF EXISTS resenas_productos;
DROP TABLE IF EXISTS lista_deseos;
DROP TABLE IF EXISTS cupones_descuento;
DROP TABLE IF EXISTS detalle_pedidos_online;
DROP TABLE IF EXISTS pedidos_online;
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS movimientos_caja;
DROP TABLE IF EXISTS cajas;
DROP TABLE IF EXISTS detalle_compras;
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS kardex_movimientos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS marcas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS lineas_suplementos;
DROP TABLE IF EXISTS sucursales;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. SEGURIDAD, ROLES Y ACCESOS
-- ============================================================================

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    permisos JSON NULL COMMENT 'Array de permisos: productos, ventas, usuarios, reportes, pedidos_web',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(25) NULL,
    rol_id INT NOT NULL,
    avatar VARCHAR(255) DEFAULT 'default_avatar.png',
    estado TINYINT(1) DEFAULT 1 COMMENT '1: Activo, 0: Inactivo / Bloqueado',
    ultimo_acceso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_usuarios_email (email),
    INDEX idx_usuarios_rol (rol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. SUCURSALES Y PUNTOS DE VENTA (MULTI-TIENDA)
-- ============================================================================

CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100) DEFAULT 'Huancayo',
    telefono VARCHAR(25) NULL,
    es_almacen_principal TINYINT(1) DEFAULT 0,
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. CATÁLOGO DE PRODUCTOS (LÍNEAS, CATEGORÍAS, MARCAS Y PROVEEDORES)
-- ============================================================================

-- Líneas oficiales de la landing page (Proteínas, Creatinas, Ganadores, etc.)
CREATE TABLE lineas_suplementos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(60) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    icono VARCHAR(100) NULL,
    imagen VARCHAR(255) NULL,
    descripcion TEXT NULL,
    orden INT DEFAULT 0,
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Formato / Presentación (Cápsulas, Potes, Sobres, Aceites, etc.)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(60) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT NULL,
    imagen VARCHAR(255) NULL,
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    pais_origen VARCHAR(60) DEFAULT 'Perú',
    logo VARCHAR(255) NULL,
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    contacto VARCHAR(100) NULL,
    telefono VARCHAR(30) NULL,
    email VARCHAR(120) NULL,
    direccion VARCHAR(255) NULL,
    ciudad VARCHAR(100) DEFAULT 'Lima',
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(60) NOT NULL UNIQUE,
    codigo_barras VARCHAR(100) NULL UNIQUE,
    nombre VARCHAR(180) NOT NULL,
    linea_id INT NULL,
    categoria_id INT NOT NULL,
    marca_id INT NULL,
    proveedor_id INT NULL,
    descripcion TEXT NULL,
    resumen VARCHAR(255) NULL,
    precio_venta DECIMAL(10,2) NOT NULL,
    precio_antiguo DECIMAL(10,2) NULL,
    descuento_porcentaje INT DEFAULT 0,
    precio_compra DECIMAL(10,2) DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 6 COMMENT 'Umbral para alertas de reposición',
    servicios VARCHAR(50) NULL COMMENT 'Ej. 30 Servicios, 100 Cápsulas',
    presentaciones JSON NULL COMMENT '["500g", "1Kg", "2Kg"]',
    tabla_nutricional JSON NULL,
    modo_uso JSON NULL,
    imagen_principal VARCHAR(255) DEFAULT 'default_product.png',
    galeria_imagenes JSON NULL,
    destacado TINYINT(1) DEFAULT 0 COMMENT '1: Mostrar en Lo Más Vendido',
    es_nuevo TINYINT(1) DEFAULT 0,
    estado TINYINT(1) DEFAULT 1 COMMENT '1: Disponible, 0: Oculto/Descontinuado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_prod_linea FOREIGN KEY (linea_id) REFERENCES lineas_suplementos(id) ON DELETE SET NULL,
    CONSTRAINT fk_prod_cat FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    CONSTRAINT fk_prod_marca FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL,
    CONSTRAINT fk_prod_prov FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
    INDEX idx_productos_sku (sku),
    INDEX idx_productos_barcode (codigo_barras),
    INDEX idx_productos_stock (stock, stock_minimo),
    INDEX idx_productos_linea (linea_id),
    INDEX idx_productos_categoria (categoria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. KÁRDEX E HISTORIAL DE MOVIMIENTOS DE INVENTARIO
-- ============================================================================

CREATE TABLE kardex_movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    sucursal_id INT NULL,
    tipo_movimiento ENUM(
        'ENTRADA_COMPRA',
        'SALIDA_VENTA_POS',
        'SALIDA_PEDIDO_WEB',
        'AJUSTE_POSITIVO',
        'AJUSTE_NEGATIVO',
        'DEVOLUCION_CLIENTE'
    ) NOT NULL,
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_actual INT NOT NULL,
    costo_unitario DECIMAL(10,2) DEFAULT 0.00,
    referencia_documento VARCHAR(80) NULL COMMENT 'Nro Boleta, Factura u Orden Web',
    usuario_id INT NULL,
    observaciones VARCHAR(255) NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_kardex_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT fk_kardex_suc FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE SET NULL,
    CONSTRAINT fk_kardex_usr FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_kardex_producto_fecha (producto_id, fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. COMPRAS Y REABASTECIMIENTO CON PROVEEDORES
-- ============================================================================

CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_compra VARCHAR(50) NOT NULL UNIQUE,
    proveedor_id INT NOT NULL,
    usuario_id INT NOT NULL,
    sucursal_id INT NULL,
    tipo_comprobante VARCHAR(30) DEFAULT 'Factura',
    numero_comprobante VARCHAR(60) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Completado' COMMENT 'Completado, Pendiente, Cancelado',
    fecha_emision DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_compras_prov FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,
    CONSTRAINT fk_compras_usr FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_compra DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detcomp_compra FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE,
    CONSTRAINT fk_detcomp_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. CLIENTES (CRM INTEGRADO WEB & POS)
-- ============================================================================

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL UNIQUE COMMENT 'Vinculado a usuario si tiene cuenta web',
    tipo_documento VARCHAR(20) DEFAULT 'DNI' COMMENT 'DNI, RUC, CE, Pasaporte',
    numero_documento VARCHAR(25) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NULL,
    telefono VARCHAR(30) NULL,
    email VARCHAR(120) NULL,
    direccion VARCHAR(255) NULL,
    departamento VARCHAR(80) DEFAULT 'Junín',
    provincia VARCHAR(80) DEFAULT 'Huancayo',
    distrito VARCHAR(80) DEFAULT 'Huancayo',
    puntos_fidelidad INT DEFAULT 0,
    notas TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_clientes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_clientes_doc (numero_documento),
    INDEX idx_clientes_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. CAJAS Y ARQUEOS DE TURNO (PUNTO DE VENTA / POS)
-- ============================================================================

CREATE TABLE cajas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    sucursal_id INT NULL,
    monto_apertura DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monto_cierre DECIMAL(10,2) NULL,
    total_ventas_efectivo DECIMAL(10,2) DEFAULT 0.00,
    total_ventas_digital DECIMAL(10,2) DEFAULT 0.00,
    diferencia DECIMAL(10,2) DEFAULT 0.00,
    estado VARCHAR(20) DEFAULT 'abierta' COMMENT 'abierta, cerrada',
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    observaciones TEXT NULL,
    CONSTRAINT fk_cajas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    CONSTRAINT fk_cajas_sucursal FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE movimientos_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    caja_id INT NOT NULL,
    tipo ENUM('ingreso', 'egreso') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_movcaja_caja FOREIGN KEY (caja_id) REFERENCES cajas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. VENTAS EN TIENDA FÍSICA (PUNTO DE VENTA / POS)
-- ============================================================================

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_venta VARCHAR(60) NOT NULL UNIQUE,
    caja_id INT NULL,
    usuario_id INT NULL,
    cliente_id INT NULL,
    sucursal_id INT NULL,
    cliente_nombre VARCHAR(150) DEFAULT 'PÚBLICO GENERAL',
    cliente_documento VARCHAR(25) DEFAULT '00000000',
    tipo_comprobante VARCHAR(30) DEFAULT 'Boleta' COMMENT 'Boleta, Factura, Nota de Venta',
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'Efectivo' COMMENT 'Efectivo, Yape, Plin, Tarjeta, Mixto',
    monto_recibido DECIMAL(10,2) DEFAULT 0.00,
    vuelto DECIMAL(10,2) DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'Completado' COMMENT 'Completado, Anulado',
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ventas_caja FOREIGN KEY (caja_id) REFERENCES cajas(id) ON DELETE SET NULL,
    CONSTRAINT fk_ventas_usr FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT fk_ventas_cli FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    CONSTRAINT fk_ventas_suc FOREIGN KEY (sucursal_id) REFERENCES sucursales(id) ON DELETE SET NULL,
    INDEX idx_ventas_fecha (fecha),
    INDEX idx_ventas_comprobante (codigo_venta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detvent_venta FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    CONSTRAINT fk_detvent_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. PEDIDOS DE LA TIENDA ONLINE (E-COMMERCE / CHECKOUT WEB)
-- ============================================================================

CREATE TABLE pedidos_online (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_pedido VARCHAR(60) NOT NULL UNIQUE COMMENT 'Ej. NC-2026-1045',
    cliente_id INT NULL,
    nombres_receptor VARCHAR(150) NOT NULL,
    apellidos_receptor VARCHAR(150) NULL,
    telefono_receptor VARCHAR(30) NOT NULL,
    email_receptor VARCHAR(120) NOT NULL,
    direccion_envio VARCHAR(255) NOT NULL,
    departamento VARCHAR(80) NOT NULL DEFAULT 'Junín',
    provincia VARCHAR(80) NOT NULL DEFAULT 'Huancayo',
    distrito VARCHAR(80) NOT NULL DEFAULT 'Huancayo',
    referencia_envio VARCHAR(255) NULL,
    metodo_pago VARCHAR(50) NOT NULL COMMENT 'Yape, Plin, Transferencia BCP, Tarjeta, Contraentrega',
    comprobante_pago_voucher VARCHAR(255) NULL COMMENT 'Captura de pantalla o código de operación',
    numero_operacion VARCHAR(80) NULL,
    estado_pago ENUM('pendiente', 'verificado', 'rechazado') DEFAULT 'pendiente',
    estado_pedido ENUM('pendiente', 'en_preparacion', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
    costo_envio DECIMAL(10,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    cupon_aplicado VARCHAR(50) NULL,
    tracking_guia VARCHAR(100) NULL COMMENT 'Código de seguimiento courier (Olva, Shalom)',
    notas_cliente TEXT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NULL,
    CONSTRAINT fk_pedidos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    INDEX idx_pedidos_estado (estado_pedido, estado_pago),
    INDEX idx_pedidos_codigo (codigo_pedido),
    INDEX idx_pedidos_fecha (fecha_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE detalle_pedidos_online (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_detped_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos_online(id) ON DELETE CASCADE,
    CONSTRAINT fk_detped_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. MARKETING, CUPONES, WISHLIST Y RESEÑAS WEB
-- ============================================================================

CREATE TABLE cupones_descuento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    tipo ENUM('porcentaje', 'monto_fijo') DEFAULT 'porcentaje',
    valor DECIMAL(10,2) NOT NULL COMMENT 'Ej. 10.00 para 10% o S/10',
    compra_minima DECIMAL(10,2) DEFAULT 0.00,
    usos_maximos INT DEFAULT 100,
    usos_actuales INT DEFAULT 0,
    fecha_inicio DATE NOT NULL,
    fecha_expiracion DATE NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lista_deseos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_deseo_cliente_prod (cliente_id, producto_id),
    CONSTRAINT fk_deseo_cli FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_deseo_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE resenas_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cliente_id INT NULL,
    autor_nombre VARCHAR(120) NOT NULL,
    puntuacion TINYINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    titulo VARCHAR(150) NULL,
    comentario TEXT NOT NULL,
    estado ENUM('aprobado', 'pendiente', 'rechazado') DEFAULT 'aprobado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resena_prod FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    CONSTRAINT fk_resena_cli FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hero_slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_linea1 VARCHAR(100) NOT NULL,
    titulo_linea2 VARCHAR(100) NOT NULL,
    titulo_linea3 VARCHAR(100) NOT NULL,
    subtitulo TEXT NOT NULL,
    btn1_texto VARCHAR(60) NOT NULL DEFAULT 'Ver productos',
    btn1_url VARCHAR(255) NOT NULL DEFAULT 'pages/productos.html',
    btn2_texto VARCHAR(60) NOT NULL DEFAULT 'Contacto',
    btn2_url VARCHAR(255) NOT NULL DEFAULT 'https://wa.me/51936396907',
    bg_image VARCHAR(255) NOT NULL DEFAULT 'assets/images/fondos_hd.png',
    frontal_image VARCHAR(255) NOT NULL DEFAULT 'assets/images/carril.png',
    orden INT DEFAULT 1,
    estado TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. AUDITORÍA Y TRAZABILIDAD DEL SISTEMA
-- ============================================================================

CREATE TABLE auditoria_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(60) NOT NULL,
    detalles TEXT NULL,
    ip_origen VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usr FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_auditoria_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. VISTAS ANALÍTICAS PARA EL DASHBOARD EN TIEMPO REAL
-- ============================================================================

-- Vista 1: Alertas de reposición de inventario (Stock Crítico)
CREATE OR REPLACE VIEW v_alertas_stock AS
SELECT 
    p.id,
    p.sku,
    p.nombre,
    ls.nombre AS linea,
    c.nombre AS categoria,
    p.stock AS stock_actual,
    p.stock_minimo,
    (p.stock_minimo - p.stock) AS unidades_faltantes,
    p.precio_compra,
    p.imagen_principal
FROM productos p
LEFT JOIN lineas_suplementos ls ON p.linea_id = ls.id
LEFT JOIN categorias c ON p.categoria_id = c.id
WHERE p.stock <= p.stock_minimo AND p.estado = 1
ORDER BY p.stock ASC;

-- Vista 2: Pedidos Web Pendientes de Despacho
CREATE OR REPLACE VIEW v_pedidos_web_pendientes AS
SELECT 
    po.id,
    po.codigo_pedido,
    po.nombres_receptor,
    po.telefono_receptor,
    po.email_receptor,
    CONCAT(po.direccion_envio, ', ', po.distrito, ', ', po.provincia) AS direccion_completa,
    po.metodo_pago,
    po.estado_pago,
    po.estado_pedido,
    po.total,
    po.fecha_pedido,
    COUNT(dp.id) AS total_items
FROM pedidos_online po
LEFT JOIN detalle_pedidos_online dp ON po.id = dp.pedido_id
WHERE po.estado_pedido IN ('pendiente', 'en_preparacion')
GROUP BY po.id
ORDER BY po.fecha_pedido DESC;

-- Vista 3: Métricas Globales del Dashboard (KPIs en vivo)
CREATE OR REPLACE VIEW v_metricas_dashboard AS
SELECT 
    (SELECT COALESCE(SUM(total), 0) FROM ventas WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE()) AND estado = 'Completado') AS ventas_pos_mes,
    (SELECT COALESCE(SUM(total), 0) FROM pedidos_online WHERE MONTH(fecha_pedido) = MONTH(CURRENT_DATE()) AND YEAR(fecha_pedido) = YEAR(CURRENT_DATE()) AND estado_pedido != 'cancelado') AS ventas_web_mes,
    (SELECT COUNT(*) FROM pedidos_online WHERE estado_pedido = 'pendiente') AS pedidos_web_pendientes,
    (SELECT COUNT(*) FROM productos WHERE estado = 1) AS total_productos_activos,
    (SELECT COUNT(*) FROM productos WHERE stock <= stock_minimo AND estado = 1) AS productos_stock_bajo,
    (SELECT COUNT(*) FROM clientes) AS total_clientes_crm,
    (SELECT COUNT(*) FROM cajas WHERE estado = 'abierta') AS cajas_activas;
