-- ============================================================================
-- 🌿 NUTRICENTER PERÚ - DATOS INICIALES Y SEED DATA EMPRESARIAL (DML)
-- Población completa para E-Commerce, Punto de Venta (POS), Kárdex y Dashboard
-- ============================================================================

USE nutricenter_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ROLES
INSERT INTO roles (id, nombre, descripcion, permisos) VALUES
(1, 'Admin', 'Administrador General con acceso total al sistema', '["dashboard", "productos", "ventas", "usuarios", "reportes", "pedidos_web", "cajas", "compras"]'),
(2, 'Vendedor', 'Vendedor de tienda física con acceso a POS, Caja y Catálogo', '["ventas", "cajas", "productos_ver", "clientes"]'),
(3, 'Almacenero', 'Encargado de inventario, kárdex y despacho de pedidos web', '["productos", "kardex", "pedidos_web", "compras"]'),
(4, 'Cliente', 'Cliente registrado en la tienda virtual', '["tienda", "mis_pedidos", "perfil", "deseos"]')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), descripcion=VALUES(descripcion), permisos=VALUES(permisos);

-- 2. USUARIOS (Contraseña por defecto: 123456 -> hash bcrypt)
INSERT INTO usuarios (id, nombre, email, password, telefono, rol_id, estado) VALUES
(1, 'Administrador General', 'admin@nutricenter.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8F4WjO02n7vK5bXmGgT9iYtTqjW.y', '+51 936 396 907', 1, 1),
(2, 'Vendedor Principal POS', 'vendedor@nutricenter.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8F4WjO02n7vK5bXmGgT9iYtTqjW.y', '+51 988 777 666', 2, 1),
(3, 'Almacén & Despachos', 'almacen@nutricenter.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8F4WjO02n7vK5bXmGgT9iYtTqjW.y', '+51 955 444 333', 3, 1),
(4, 'Carlos Mendoza Silva', 'cliente@gmail.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe1e8F4WjO02n7vK5bXmGgT9iYtTqjW.y', '+51 987 654 321', 4, 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), telefono=VALUES(telefono);

-- 3. SUCURSALES (MULTI-TIENDA)
INSERT INTO sucursales (id, codigo, nombre, direccion, ciudad, telefono, es_almacen_principal, estado) VALUES
(1, 'SUC-01', 'Tienda Central Huancayo', 'Jr. Ayacucho 231, Huancayo', 'Huancayo', '(064) 234-567', 1, 1),
(2, 'SUC-WEB', 'Canal Digital / Tienda Online', 'Av. Ferrocarril 850 (Centro de Distribución)', 'Huancayo', '+51 936 396 907', 0, 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 4. LÍNEAS DE SUPLEMENTOS OFICIALES (10 LÍNEAS DE LA WEB)
INSERT INTO lineas_suplementos (id, slug, nombre, icono, imagen, descripcion, orden, estado) VALUES
(1, 'Proteinas', 'Proteínas', 'bi-cup-hot-fill', 'assets/images/proteinas.webp', 'Proteínas concentradas, aisladas e hidrolizadas para ganancia muscular', 1, 1),
(2, 'Creatinas', 'Creatinas', 'bi-lightning-charge-fill', 'assets/images/creatina.png', 'Creatina monohidratada pura y micronizada para fuerza y explosión', 2, 1),
(3, 'GanadorDePeso', 'Ganador de peso', 'bi-trophy-fill', 'assets/images/ganador de peso.png', 'Fórmulas hipercalóricas y carbohidratos complejos para volumen', 3, 1),
(4, 'ControlDePeso', 'Control de Peso', 'bi-heart-pulse-fill', 'assets/images/control de peso.webp', 'L-Carnitinas, termogénicos y bloqueadores de grasa', 4, 1),
(5, 'Aminoacidos', 'Aminoácidos', 'bi-capsule-pill', 'assets/images/aminoacidos4.png', 'BCAAs, EAAs y Glutamina para recuperación muscular acelerada', 5, 1),
(6, 'EnergiaYRendimiento', 'Energía y Rendimiento', 'bi-fire', 'assets/images/energia y redimiento.webp', 'Pre-entrenos estimulantes y nootrópicos de máxima potencia', 6, 1),
(7, 'VitaminasYBienestar', 'Vitaminas & Bienestar', 'bi-shield-plus', 'assets/images/vitaminas & bienestar.png', 'Multivitamínicos diarios, omega 3, magnesio y zinc', 7, 1),
(8, 'SnacksSaludables', 'Snacks Saludables', 'bi-bag-heart-fill', 'assets/images/snack saludables.png', 'Barras proteicas, galletas funcionales y mantequillas de maní', 8, 1),
(9, 'AccesoriosYMerch', 'Accesorios y Merch', 'bi-bag-check-fill', 'assets/images/accesorios.png', 'Shakers térmicos, cinturones, muñequeras y accesorios de entrenamiento', 9, 1),
(10, 'BebidasProteicas', 'Bebidas Proteicas', 'bi-water', 'assets/images/bedidas proteicas.webp', 'Batidos RTD listos para tomar con 20g a 30g de proteína pura', 10, 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), imagen=VALUES(imagen);

-- 5. CATEGORÍAS POR FORMATO
INSERT INTO categorias (id, slug, nombre, descripcion, estado) VALUES
(1, 'potes', 'Potes y Polvos', 'Suplementos en polvo con dosificador y bote hermético', 1),
(2, 'capsulas', 'Cápsulas y Tabletas', 'Presentaciones concentradas en cápsulas blandas y vegetales', 1),
(3, 'sobres', 'Sobres y Sachets', 'Dosis individuales portátiles de rápida disolución', 1),
(4, 'aceites', 'Aceites Naturales', 'Aceites orgánicos prensados en frío (Coco, Copaiba, Linaza)', 1),
(5, 'bebidas', 'Bebidas Funcionales', 'Líquidos listos para consumir y shots energéticos', 1),
(6, 'accesorios', 'Accesorios de Gym', 'Shakers, correas, guantes y termos deportivos', 1),
(7, 'otros', 'Otros Suplementos', 'Extractos puros, harinas funcionales y superfoods', 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 6. MARCAS
INSERT INTO marcas (id, nombre, pais_origen, estado) VALUES
(1, 'BSN', 'EE.UU.', 1),
(2, 'NUTRICOST', 'EE.UU.', 1),
(3, 'ISOPURE', 'EE.UU.', 1),
(4, 'QUEST NUTRITION', 'EE.UU.', 1),
(5, 'HONEY STINGER', 'EE.UU.', 1),
(6, 'ULTIMATE NUTRITION', 'EE.UU.', 1),
(7, 'OPTIMUM NUTRITION', 'EE.UU.', 1),
(8, 'SCITEC NUTRITION', 'Hungría', 1),
(9, 'DYMATIZE', 'EE.UU.', 1),
(10, 'NUTREX RESEARCH', 'EE.UU.', 1),
(11, 'MUSCLEMEDS', 'EE.UU.', 1),
(12, 'SYNTRAX', 'EE.UU.', 1),
(13, 'WINDMILL', 'EE.UU.', 1)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 7. PROVEEDORES
INSERT INTO proveedores (id, ruc, razon_social, contacto, telefono, email, direccion, ciudad, estado) VALUES
(1, '20556789012', 'DISTRIBUIDORA FIT PERU S.A.C.', 'Ing. Jorge Ramírez', '01-4458920', 'ventas@fitperu.com', 'Av. Materiales 3045, Callao', 'Lima', 1),
(2, '20601892341', 'NUTRA SPORT IMPORTACIONES E.I.R.L.', 'Lic. Mariana Gómez', '998-123456', 'contacto@nutrasport.pe', 'Av. Javier Prado Este 1850, San Borja', 'Lima', 1),
(3, '20498765432', 'LABORATORIOS ANDINOS NATURALES S.A.', 'Quím. Farm. Luis Prado', '064-219800', 'pedidos@labandinos.com', 'Av. Mariscal Castilla 1120, El Tambo', 'Huancayo', 1)
ON DUPLICATE KEY UPDATE razon_social=VALUES(razon_social);

-- 8. PRODUCTOS CONECTADOS CON LA WEB & PUNTO DE VENTA
INSERT INTO productos (id, sku, codigo_barras, nombre, linea_id, categoria_id, marca_id, proveedor_id, descripcion, resumen, precio_venta, precio_antiguo, descuento_porcentaje, precio_compra, stock, stock_minimo, servicios, presentaciones, imagen_principal, destacado, es_nuevo, estado) VALUES
(1, 'PRD-001', '77501001', 'Glukoz Whey Protein 500g', 1, 1, 1, 1, 'Proteína concentrada ultra-pura de máxima asimilación con aminoácidos ramificados para el desarrollo, recuperación y definición muscular.', 'Pote 500g - 100% Proteína Concentrada', 85.00, 110.00, 23, 52.00, 45, 8, '30 Servicios', '["500 g", "1 Kg", "2 Kg"]', 'GLUKOZ-300x300.png', 1, 0, 1),
(2, 'PRD-002', '77501002', 'Bio Pross Creatina Monohidratada x100 Caps', 2, 2, 3, 2, 'Creatina pura micronizada de máxima absorción para potencia muscular, aumento de fuerza e hipertrofia.', '100 Cápsulas - Creatina Monohidratada Pura', 65.00, 85.00, 24, 38.00, 30, 6, '100 Servicios', '["100 Caps", "200 Caps"]', 'BIO-300x300.png', 1, 0, 1),
(3, 'PRD-003', '77501003', 'Hot Plus Pre-Workout Explosivo 60 Caps', 6, 2, 1, 1, 'Fórmula energizante con cafeína anhidra, beta-alanina y óxido nítrico para entrenamientos de máxima intensidad.', '60 Cápsulas - Energía & Vasodilatación', 70.00, 95.00, 26, 42.00, 4, 10, '60 Servicios', '["60 Caps"]', 'BOTELLA-HOT-PLUZ-ROJO-1-300x300.webp', 1, 1, 1),
(4, 'PRD-004', '77501004', 'Colágeno Sport Curcumix 500g', 7, 1, 1, 3, 'Colágeno hidrolizado bovino tipo I y III reforzado con cúrcuma orgánica, camu camu y citrato de magnesio.', 'Pote 500g - Regenerador Articular con Cúrcuma', 90.00, 120.00, 25, 55.00, 18, 5, '50 Servicios', '["500 g", "1 Kg"]', 'CURCUMIX-268x300.png', 1, 0, 1),
(5, 'PRD-005', '77501005', 'Dry Xtreme Quemador Térmico 60 Caps', 4, 2, 1, 1, 'Fórmula termogénica lipotrópica para acelerar la quema de grasa y eliminar retención de líquidos.', '60 Cápsulas - Termogénico & Control de Peso', 75.00, 105.00, 28, 44.00, 25, 6, '60 Servicios', '["60 Caps", "120 Caps"]', 'BOTELLA-XTREMO-HOT-ROJO-1-300x300.webp', 1, 0, 1),
(6, 'PRD-006', '77501006', 'Saw Palmetto Multivitamínico Sport x100', 7, 2, 1, 3, 'Complejo de salud masculina con extracto estandarizado de Saw Palmetto, zinc quelado y selenio.', '100 Cápsulas - Vitalidad & Balance Hormonal', 65.00, 85.00, 23, 36.00, 22, 5, '100 Servicios', '["100 Caps"]', 'BOTELLA-SAW-PALMETTO-1-300x300.webp', 1, 0, 1),
(7, 'PRD-007', '77501007', 'Aceite de Coco Extra Virgen 500ml', 7, 4, 1, 3, 'Aceite 100% orgánico prensado en frío, rico en triglicéridos de cadena media (MCT) para energía rápida.', 'Botella 500ml - 100% Orgánico Prensado en Frío', 45.00, 60.00, 25, 25.00, 35, 8, '33 Servicios', '["250 ml", "500 ml", "1000 ml"]', 'ACEITE-COCO-292x300.png', 1, 0, 1),
(8, 'PRD-008', '77501008', 'Super Mass Gainer 3 Kg Chocolate', 3, 1, 4, 2, 'Ganador de masa muscular con 1200 calorías y 50g de proteína por toma.', 'Bolsa 3 Kg - Alto Aporte Calórico', 140.00, 175.00, 20, 92.00, 12, 5, '20 Servicios', '["3 Kg", "5 Kg"]', 'ganador de peso.png', 1, 1, 1)
ON DUPLICATE KEY UPDATE 
    nombre=VALUES(nombre), 
    precio_venta=VALUES(precio_venta), 
    stock=VALUES(stock), 
    stock_minimo=VALUES(stock_minimo), 
    imagen_principal=VALUES(imagen_principal);

-- 9. CLIENTES CRM (CONECTADOS AL CHECKOUT Y POS)
INSERT INTO clientes (id, usuario_id, tipo_documento, numero_documento, nombre, apellidos, telefono, email, direccion, departamento, provincia, distrito, puntos_fidelidad) VALUES
(1, NULL, 'DNI', '00000000', 'CLIENTES VARIOS', 'PÚBLICO GENERAL', '999999999', 'ventas@nutricenter.com', 'Jr. Ayacucho 231, Huancayo', 'Junín', 'Huancayo', 'Huancayo', 0),
(2, 4, 'DNI', '72345678', 'Carlos', 'Mendoza Silva', '987654321', 'cliente@gmail.com', 'Av. Arequipa 1420 Dpto 402', 'Lima', 'Lima', 'Lince', 45),
(3, NULL, 'RUC', '20601234567', 'NATURAL HEALTH S.A.C.', '', '01-4567890', 'contacto@naturalhealth.pe', 'Av. Javier Prado Este 2550', 'Lima', 'Lima', 'San Borja', 120),
(4, NULL, 'DNI', '45892103', 'Valeria', 'Rios Contreras', '964112233', 'valeria.rios@gmail.com', 'Calle Real 540', 'Junín', 'Huancayo', 'El Tambo', 30)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), telefono=VALUES(telefono);

-- 10. CAJA REGISTRADORA POS
INSERT INTO cajas (id, usuario_id, sucursal_id, monto_apertura, monto_cierre, total_ventas_efectivo, total_ventas_digital, diferencia, estado, fecha_apertura) VALUES
(1, 2, 1, 100.00, NULL, 185.00, 157.50, 0.00, 'abierta', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE estado=VALUES(estado);

-- 11. VENTAS POS EN TIENDA FÍSICA
INSERT INTO ventas (id, codigo_venta, caja_id, usuario_id, cliente_id, sucursal_id, cliente_nombre, cliente_documento, tipo_comprobante, subtotal, igv, descuento, total, metodo_pago, monto_recibido, vuelto, estado, fecha) VALUES
(1, 'B001-0001092', 1, 2, 2, 1, 'Carlos Mendoza Silva', '72345678', 'Boleta', 156.78, 28.22, 0.00, 185.00, 'Efectivo', 200.00, 15.00, 'Completado', '2026-10-24 10:15:00'),
(2, 'B001-0001091', 1, 2, 1, 1, 'PÚBLICO GENERAL', '00000000', 'Boleta', 78.39, 14.11, 0.00, 92.50, 'Yape', 92.50, 0.00, 'Completado', '2026-10-24 11:30:00'),
(3, 'F001-0000145', 1, 2, 3, 1, 'NATURAL HEALTH S.A.C.', '20601234567', 'Factura', 55.08, 9.92, 0.00, 65.00, 'Tarjeta', 65.00, 0.00, 'Completado', '2026-10-24 12:45:00')
ON DUPLICATE KEY UPDATE total=VALUES(total);

INSERT INTO detalle_ventas (id, venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 1, 85.00, 85.00),
(2, 1, 4, 1, 90.00, 90.00),
(3, 2, 2, 1, 65.00, 65.00),
(4, 3, 6, 1, 65.00, 65.00)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);

-- 12. PEDIDOS DE LA TIENDA ONLINE (E-COMMERCE / CHECKOUT WEB)
INSERT INTO pedidos_online (id, codigo_pedido, cliente_id, nombres_receptor, apellidos_receptor, telefono_receptor, email_receptor, direccion_envio, departamento, provincia, distrito, referencia_envio, metodo_pago, comprobante_pago_voucher, numero_operacion, estado_pago, estado_pedido, costo_envio, subtotal, descuento, total, cupon_aplicado, tracking_guia, notas_cliente, fecha_pedido) VALUES
(1, 'NC-WEB-1001', 2, 'Carlos', 'Mendoza Silva', '987654321', 'cliente@gmail.com', 'Av. Arequipa 1420 Dpto 402', 'Lima', 'Lima', 'Lince', 'Frente al parque Pedro Ruiz Gallo', 'Yape', 'voucher_yape_1001.jpg', 'OP-894721', 'verificado', 'en_camino', 15.00, 150.00, 15.00, 150.00, 'NUTRI10', 'OLVA-7748921-PE', 'Por favor llamar antes de entregar', '2026-10-24 14:20:00'),
(2, 'NC-WEB-1002', 4, 'Valeria', 'Rios Contreras', '964112233', 'valeria.rios@gmail.com', 'Calle Real 540', 'Junín', 'Huancayo', 'El Tambo', 'A dos cuadras del Parque Bolognesi', 'Plin', 'voucher_plin_1002.jpg', 'OP-992134', 'pendiente', 'pendiente', 8.00, 90.00, 0.00, 98.00, NULL, NULL, 'Entregar por la tarde después de las 3pm', '2026-10-24 17:05:00'),
(3, 'NC-WEB-1003', NULL, 'Roberto', 'Cáceres Poma', '954778899', 'roberto.caceres@outlook.com', 'Av. Giráldez 320', 'Junín', 'Huancayo', 'Huancayo', 'Edificio Torres de Huancayo Of. 301', 'Transferencia BCP', 'voucher_bcp_1003.jpg', 'OP-128940', 'verificado', 'en_preparacion', 0.00, 215.00, 0.00, 215.00, NULL, NULL, 'Recojo en tienda Jr. Ayacucho', '2026-10-24 18:10:00')
ON DUPLICATE KEY UPDATE total=VALUES(total), estado_pedido=VALUES(estado_pedido);

INSERT INTO detalle_pedidos_online (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1, 1, 85.00, 85.00),
(2, 1, 2, 1, 65.00, 65.00),
(3, 2, 4, 1, 90.00, 90.00),
(4, 3, 1, 1, 85.00, 85.00),
(5, 3, 8, 1, 140.00, 140.00)
ON DUPLICATE KEY UPDATE subtotal=VALUES(subtotal);

-- 13. CUPONES DE DESCUENTO WEB
INSERT INTO cupones_descuento (id, codigo, descripcion, tipo, valor, compra_minima, usos_maximos, usos_actuales, fecha_inicio, fecha_expiracion, estado) VALUES
(1, 'NUTRI10', '10% de descuento en tu primera compra web', 'porcentaje', 10.00, 80.00, 500, 34, '2026-01-01', '2026-12-31', 1),
(2, 'ENVIOFREE', 'Envío gratis a todo el Perú en compras mayores a S/ 150', 'monto_fijo', 15.00, 150.00, 200, 18, '2026-01-01', '2026-12-31', 1),
(3, 'VERANO2026', 'Descuento especial de S/ 20 en packs seleccionados', 'monto_fijo', 20.00, 180.00, 100, 12, '2026-10-01', '2026-11-30', 1)
ON DUPLICATE KEY UPDATE valor=VALUES(valor);

-- 14. LISTA DE DESEOS (WISHLIST)
INSERT INTO lista_deseos (id, cliente_id, producto_id) VALUES
(1, 2, 1),
(2, 2, 3),
(3, 4, 4)
ON DUPLICATE KEY UPDATE created_at=CURRENT_TIMESTAMP;

-- 15. RESEÑAS DE PRODUCTOS DE LA WEB
INSERT INTO resenas_productos (id, producto_id, cliente_id, autor_nombre, puntuacion, titulo, comentario, estado) VALUES
(1, 1, 2, 'Carlos Mendoza', 5, 'Excelente disolución y sabor', 'La tomo después de mis entrenamientos en Huancayo y el sabor vainilla es 10/10. Muy recomendada.', 'aprobado'),
(2, 2, 4, 'Valeria Rios', 5, 'Gran resultado en fuerza', 'Creatina de altísima pureza, no genera pesadez estomacal y me ayudó a subir mis marcas.', 'aprobado'),
(3, 4, NULL, 'Dr. Marco Antonio', 5, 'Excelente fórmula con cúrcuma', 'El colágeno hidrolizado junto con cúrcuma y camu camu tiene una absorción superior para las articulaciones.', 'aprobado')
ON DUPLICATE KEY UPDATE puntuacion=VALUES(puntuacion);

-- 16. KÁRDEX INICIAL DE MOVIMIENTOS
INSERT INTO kardex_movimientos (producto_id, sucursal_id, tipo_movimiento, cantidad, stock_anterior, stock_actual, costo_unitario, referencia_documento, usuario_id, observaciones) VALUES
(1, 1, 'ENTRADA_COMPRA', 50, 0, 50, 52.00, 'FAC-001-9842', 1, 'Ingreso inicial por compra a Distribuidora Fit Perú'),
(1, 1, 'SALIDA_VENTA_POS', 1, 50, 49, 52.00, 'B001-0001092', 2, 'Venta en mostrador POS'),
(1, 2, 'SALIDA_PEDIDO_WEB', 1, 49, 48, 52.00, 'NC-WEB-1001', 3, 'Despacho de pedido web'),
(3, 1, 'SALIDA_VENTA_POS', 6, 10, 4, 42.00, 'B001-0000950', 2, 'Venta POS - Alerta de Stock Bajo Activada')
ON DUPLICATE KEY UPDATE cantidad=VALUES(cantidad);

-- 17. SLIDES DEL CARRUSEL DE PORTADA (HOME)
INSERT INTO hero_slides (id, titulo_linea1, titulo_linea2, titulo_linea3, subtitulo, btn1_texto, btn1_url, btn2_texto, btn2_url, bg_image, frontal_image, orden, estado) VALUES
(1, 'Nutrición', 'que te cambia', 'la vida', 'Productos naturales certificados y con asesoría personalizada para transformar tu bienestar.', 'Ver productos', 'pages/productos.html', 'Contacto', 'https://wa.me/51936396907', 'assets/images/fondos_hd.png', 'assets/images/carril.png', 1, 1),
(2, 'Alto Rendimiento', 'para tu rutina', 'diaria', 'Fórmulas concentradas y suplementos deportivos desarrollados para potenciar tu energía y salud.', 'Ver Cápsulas & Polvos', 'pages/capsulas.html', 'Asesoría Nutricional', 'https://wa.me/51936396907', 'assets/images/fondos_hd.png', 'assets/images/carril.png', 2, 1),
(3, 'Envíos Seguros', 'a todo el', 'Perú', 'Compra con total confianza de forma rápida y directa. Garantía oficial Nutricenter Hyo S.A.C.', 'Comprar Ahora', 'pages/productos.html', 'Atención Inmediata', 'https://wa.me/51936396907', 'assets/images/fondos_hd.png', 'assets/images/carril.png', 3, 1)
ON DUPLICATE KEY UPDATE titulo_linea1=VALUES(titulo_linea1), subtitulo=VALUES(subtitulo);

SET FOREIGN_KEY_CHECKS = 1;
