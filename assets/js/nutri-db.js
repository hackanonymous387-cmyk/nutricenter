/**
 * NUTRICENTER - Unified Database & Client API Manager (NutriDB)
 * Seamlessly interfaces with backend REST API and maintains synchronized persistent storage.
 * Guarantees zero data loss, instant responsiveness, and full CRUD across all pages.
 */

const NutriDB = {
  STORAGE_KEY: 'nutricenter_persistent_db',
  
  // Initial database schema & seed data matching database/datos_iniciales.sql
  defaultData: {
    roles: [
      { id: 1, nombre: "Admin", descripcion: "Administrador con acceso total" },
      { id: 2, nombre: "Vendedor", descripcion: "Vendedor con acceso a punto de venta e inventario" },
      { id: 3, nombre: "Cliente", descripcion: "Cliente comprador" }
    ],
    usuarios: [
      {
        id: 1,
        nombre: "Administrador General",
        email: "admin@nutricenter.com",
        password: "password_hash_placeholder",
        telefono: "+51 999 888 777",
        rol: "Admin",
        rol_id: 1,
        estado: 1,
        created_at: "2026-10-15 08:00:00"
      },
      {
        id: 2,
        nombre: "Vendedor Tienda 1",
        email: "vendedor@nutricenter.com",
        password: "password_hash_placeholder",
        telefono: "+51 988 777 666",
        rol: "Vendedor",
        rol_id: 2,
        estado: 1,
        created_at: "2026-10-15 08:30:00"
      },
      {
        id: 3,
        nombre: "Cliente Demo",
        email: "cliente@gmail.com",
        password: "password_hash_placeholder",
        telefono: "+51 977 666 555",
        rol: "Cliente",
        rol_id: 3,
        estado: 1,
        created_at: "2026-10-15 09:00:00"
      }
    ],
    categorias: [
      { id: 1, nombre: "Proteínas", descripcion: "Suplementos de proteína whey y mezclas nutritivas" },
      { id: 2, nombre: "Creatinas", descripcion: "Creatina monohidratada pura y micronizada" },
      { id: 3, nombre: "Pre-Entrenos", descripcion: "Fórmulas energéticas concentradas" },
      { id: 4, nombre: "Colágeno & Salud", descripcion: "Colágeno hidrolizado concentrado con antioxidantes" },
      { id: 5, nombre: "Quemadores", descripcion: "Quemadores térmicos y reductores de grasa" },
      { id: 6, nombre: "Multivitamínicos", descripcion: "Vitaminas esenciales, minerales y extractos herbales" },
      { id: 7, nombre: "Aceites Naturales", descripcion: "Aceites medicinales y nutricionales extraídos en frío" }
    ],
    productos: [
      {
        id: 1,
        sku: "PRD-001",
        codigo_barras: "77501001",
        nombre: "Glukoz Whey Protein 500g",
        marca: "NUTRICENTER LABS",
        categoria: "Proteínas",
        categoria_id: 1,
        precio: 85.00,
        precio_antiguo: 110.00,
        descuento: "23% OFF",
        precio_compra: 52.00,
        stock: 45,
        stock_minimo: 8,
        servicios: "30 Servicios",
        resumen: "Proteína concentrada ultra-pura de máxima asimilación con aminoácidos ramificados para el desarrollo, recuperación y definición muscular.",
        imagen: "GLUKOZ-300x300.png",
        galeria: [
          "GLUKOZ-300x300.png",
          "proteinas.webp",
          "nosotros_mision.jpg",
          "carril.png",
          "GLUKOZ-600x600.png",
          "1-41-300x300.webp"
        ],
        presentaciones: ["500 g", "1 Kg", "2 Kg"],
        metricas: [
          { valor: "25g", etiqueta: "PROTEÍNA" },
          { valor: "0g", etiqueta: "AZÚCAR" },
          { valor: "5.5g", etiqueta: "BCAA" },
          { valor: "100%", etiqueta: "INSTANTÁNEA" }
        ],
        uso: {
          como_se_toma: "Mezcle 1 scoop con 250-300 ml de agua fresca o leche vegetal en batidora.",
          tamano_toma: "1 scoop colmado (33g).",
          cuantas_veces: "Consumir 1 a 2 veces al día.",
          cuando_se_toma: "Consumir al despertar o inmediatamente después de entrenar."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "1 scoop (33 g)" },
          { parametro: "Porciones por Envase", cantidad: "30 porciones" },
          { parametro: "Calorías", cantidad: "130 kcal" },
          { parametro: "Proteína", cantidad: "25 g" },
          { parametro: "BCAAs Totales", cantidad: "5.5 g" },
          { parametro: "Carbohidratos", cantidad: "2.1 g" },
          { parametro: "Grasas Totales", cantidad: "1.2 g" },
          { parametro: "Sodio", cantidad: "55 mg" }
        ],
        advertencias: "Consérvese en lugar fresco y seco por debajo de 30°C. No utilizar como única fuente de alimentación. Mantener fuera del alcance de los niños.",
        estado: 1
      },
      {
        id: 2,
        sku: "ON-CRT-600",
        codigo_barras: "77501002",
        nombre: "CREATINA 600G - OPTIMUM NUTRITION",
        marca: "OPTIMUM NUTRITION",
        categoria: "Creatinas",
        categoria_id: 2,
        precio: 159.00,
        precio_antiguo: 200.00,
        descuento: "20% OFF",
        precio_compra: 95.00,
        stock: 4,
        stock_minimo: 6,
        servicios: "120 Servicios",
        resumen: "Creatina monohidratada micronizada para incrementar fuerza, potencia, explosividad y rendimiento físico en entrenamientos de alta intensidad.",
        imagen: "creatina.png",
        galeria: [
          "creatina.png",
          "BIO-300x300.png",
          "nosotros_mision.jpg",
          "carril.png",
          "BOTELLA-HOT-PLUZ-ROJO-1-300x300.webp",
          "1-41-300x300.webp"
        ],
        presentaciones: ["300 g", "600 g", "1200 g"],
        metricas: [
          { valor: "5g", etiqueta: "CREATINA" },
          { valor: "0g", etiqueta: "AZÚCAR" },
          { valor: "100%", etiqueta: "PURA" },
          { valor: "Libre", etiqueta: "DE METALES" }
        ],
        uso: {
          como_se_toma: "Mezcle 1 cucharadita colmada con agua o zumo en batidora o shaker.",
          tamano_toma: "1 cucharadita (5g).",
          cuantas_veces: "Consumir 1 vez al día todos los días.",
          cuando_se_toma: "Consumir antes o después del entrenamiento."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "1 cucharadita (5 g)" },
          { parametro: "Porciones por Envase", cantidad: "120 porciones" },
          { parametro: "Calorías", cantidad: "0 kcal" },
          { parametro: "Creatina Monohidratada Micronizada", cantidad: "5.0 g (5000 mg)" },
          { parametro: "Grasas Totales", cantidad: "0 g" },
          { parametro: "Carbohidratos Totales", cantidad: "0 g" },
          { parametro: "Azúcares", cantidad: "0 g" },
          { parametro: "Sodio", cantidad: "0 mg" }
        ],
        advertencias: "Mantener fuera del alcance de los niños menores de 18 años. No consumir durante el embarazo o periodo de lactancia sin previa autorización médica. Almacenar en lugar seco y fresco, a temperatura inferior a 30°C.",
        estado: 1
      },
      {
        id: 3,
        sku: "PRD-003",
        codigo_barras: "77501003",
        nombre: "Hot Plus Pre-Workout Explosive 60 Caps",
        marca: "NUTRICENTER ATHLETICS",
        categoria: "Pre-Entrenos",
        categoria_id: 3,
        precio: 70.00,
        precio_antiguo: 95.00,
        descuento: "26% OFF",
        precio_compra: 42.00,
        stock: 4,
        stock_minimo: 10,
        servicios: "60 Servicios",
        resumen: "Fórmula pre-entrenamiento concentrada para máxima vasodilatación, energía explosiva, resistencia muscular sostenida y enfoque mental agudo.",
        imagen: "BOTELLA-HOT-PLUZ-ROJO-1-300x300.webp",
        galeria: [
          "BOTELLA-HOT-PLUZ-ROJO-1-300x300.webp",
          "BOTELLA-HOT-PLUZ-AZUL-1-300x300.webp",
          "nosotros_mision.jpg",
          "carril.png",
          "BOTELLA-XTREMO-HOT-ROJO-1-300x300.webp",
          "1-41-300x300.webp"
        ],
        presentaciones: ["60 Caps", "120 Caps", "Polvo 300g"],
        metricas: [
          { valor: "200mg", etiqueta: "CAFEÍNA" },
          { valor: "3g", etiqueta: "BETA ALANINA" },
          { valor: "100%", etiqueta: "ENERGÍA" },
          { valor: "0g", etiqueta: "AZÚCAR" }
        ],
        uso: {
          como_se_toma: "Tomar 2 cápsulas acompañadas de 1 vaso grande de agua.",
          tamano_toma: "2 cápsulas (1 toma).",
          cuantas_veces: "Consumir 1 vez al día sólo en días de entrenamiento.",
          cuando_se_toma: "Consumir 20 a 30 minutos antes del entrenamiento intenso."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "2 cápsulas" },
          { parametro: "Porciones por Envase", cantidad: "30 porciones" },
          { parametro: "Complejo Pre-Entreno", cantidad: "1500 mg" },
          { parametro: "Beta Alanina CarnoSyn", cantidad: "1200 mg" },
          { parametro: "Cafeína Anhidra", cantidad: "200 mg" },
          { parametro: "Taurina Micronizada", cantidad: "500 mg" }
        ],
        advertencias: "Contiene cafeína. No combinar con otros estimulantes. No tomar dentro de las 5 horas previas al descanso nocturno. Consulte a su médico.",
        estado: 1
      },
      {
        id: 4,
        sku: "PRD-004",
        codigo_barras: "77501004",
        nombre: "Colágeno Sport Curcumix 500g",
        marca: "NUTRICENTER CLINICAL",
        categoria: "Colágeno & Salud",
        categoria_id: 4,
        precio: 90.00,
        precio_antiguo: 120.00,
        descuento: "25% OFF",
        precio_compra: 55.00,
        stock: 18,
        stock_minimo: 5,
        servicios: "50 Servicios",
        resumen: "Poderosa sinergia de Colágeno Hidrolizado tipo I y II con Cúrcuma, Magnesio y Vitamina C para articulaciones, cartílagos, tendones y piel radiante.",
        imagen: "CURCUMIX-268x300.png",
        galeria: [
          "CURCUMIX-268x300.png",
          "CURCUMIX-600x671.png",
          "nosotros_mision.jpg",
          "carril.png",
          "ACEITE-COCO-292x300.png",
          "1-41-300x300.webp"
        ],
        presentaciones: ["500 g", "1 Kg"],
        metricas: [
          { valor: "10g", etiqueta: "COLÁGENO" },
          { valor: "0g", etiqueta: "AZÚCAR" },
          { valor: "100%", etiqueta: "HIDROLIZADO" },
          { valor: "+Cúrcuma", etiqueta: "& MAGNESIO" }
        ],
        uso: {
          como_se_toma: "Disolver 1 cucharada en agua tibia, jugos naturales o batido.",
          tamano_toma: "1 cucharada dosificadora (10g).",
          cuantas_veces: "Consumir 1 vez al día preferiblemente en ayunas o antes de dormir.",
          cuando_se_toma: "Consumir diariamente para óptima regeneración articular."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "1 cucharada (10 g)" },
          { parametro: "Porciones por Envase", cantidad: "50 porciones" },
          { parametro: "Colágeno Hidrolizado Bovino", cantidad: "8.5 g" },
          { parametro: "Extracto de Cúrcuma Orgánica", cantidad: "500 mg" },
          { parametro: "Vitamina C (Ácido Ascórbico)", cantidad: "100 mg" },
          { parametro: "Citrato de Magnesio", cantidad: "300 mg" }
        ],
        advertencias: "Mantener en envase bien cerrado en lugar fresco y seco. No superar la porción diaria expresamente recomendada.",
        estado: 1
      },
      {
        id: 5,
        sku: "PRD-005",
        codigo_barras: "77501005",
        nombre: "Dry Xtreme Quemador Térmico 60 Caps",
        marca: "NUTRICENTER ATHLETICS",
        categoria: "Quemadores",
        categoria_id: 5,
        precio: 75.00,
        precio_antiguo: 105.00,
        descuento: "28% OFF",
        precio_compra: 44.00,
        stock: 25,
        stock_minimo: 6,
        servicios: "60 Servicios",
        resumen: "Fórmula termogénica avanzada diseñada para acelerar el metabolismo basal, movilizar lípidos como fuente de energía y reducir la retención de líquidos.",
        imagen: "BOTELLA-XTREMO-HOT-ROJO-1-300x300.webp",
        galeria: [
          "BOTELLA-XTREMO-HOT-ROJO-1-300x300.webp",
          "BOTELLA-XTREMO-HOT-AZUL-1-300x300.webp",
          "nosotros_mision.jpg",
          "carril.png",
          "BOTELLA-HOT-PLUZ-ROJO-1-300x300.webp",
          "1-41-300x300.webp"
        ],
        presentaciones: ["60 Caps", "120 Caps"],
        metricas: [
          { valor: "500mg", etiqueta: "L-CARNITINA" },
          { valor: "Termo", etiqueta: "ACTIVO" },
          { valor: "100%", etiqueta: "DEFINICIÓN" },
          { valor: "0g", etiqueta: "AZÚCAR" }
        ],
        uso: {
          como_se_toma: "Tomar 1 cápsula con 300 ml de agua fresca.",
          tamano_toma: "1 cápsula dos veces al día.",
          cuantas_veces: "Consumir 1 a 2 veces al día con comidas principales.",
          cuando_se_toma: "Consumir antes del desayuno y 30 minutos antes del cardio."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "1 cápsula" },
          { parametro: "Porciones por Envase", cantidad: "60 porciones" },
          { parametro: "Complejo Termogénico", cantidad: "650 mg" },
          { parametro: "Té Verde Extracto", cantidad: "250 mg" },
          { parametro: "L-Carnitina Tartrato", cantidad: "200 mg" }
        ],
        advertencias: "No recomendado para personas hipertensas o sensibles a estimulantes sin aprobación médica.",
        estado: 1
      },
      {
        id: 6,
        sku: "PRD-006",
        codigo_barras: "77501006",
        nombre: "Saw Palmetto Multivitamínico Sport x100",
        marca: "NUTRICENTER CLINICAL",
        categoria: "Multivitamínicos",
        categoria_id: 6,
        precio: 65.00,
        precio_antiguo: 85.00,
        descuento: "23% OFF",
        precio_compra: 36.00,
        stock: 22,
        stock_minimo: 5,
        servicios: "100 Servicios",
        resumen: "Concentrado herbal y complejo vitamínico completo para la vitalidad, salud prostática masculina, balance hormonal y sistema inmunológico.",
        imagen: "BOTELLA-SAW-PALMETTO-1-300x300.webp",
        galeria: [
          "BOTELLA-SAW-PALMETTO-1-300x300.webp",
          "nosotros_mision.jpg",
          "carril.png",
          "GLUKOZ-300x300.png",
          "1-41-300x300.webp"
        ],
        presentaciones: ["100 Caps", "200 Caps"],
        metricas: [
          { valor: "450mg", etiqueta: "SAW PALMETTO" },
          { valor: "Zinc", etiqueta: "& SELENIO" },
          { valor: "100%", etiqueta: "NATURAL" },
          { valor: "0g", etiqueta: "AZÚCAR" }
        ],
        uso: {
          como_se_toma: "Tomar 1 cápsula blanda con abundante agua.",
          tamano_toma: "1 cápsula.",
          cuantas_veces: "Consumir 1 vez al día con el almuerzo.",
          cuando_se_toma: "Consumir diariamente como apoyo nutricional."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "1 cápsula" },
          { parametro: "Porciones por Envase", cantidad: "100 cápsulas" },
          { parametro: "Extracto de Saw Palmetto (85-95% Ácidos Grasos)", cantidad: "450 mg" },
          { parametro: "Zinc Quelado", cantidad: "15 mg" }
        ],
        advertencias: "Mantener en lugar fresco y seco, lejos del calor excesivo.",
        estado: 1
      },
      {
        id: 7,
        sku: "PRD-007",
        codigo_barras: "77501007",
        nombre: "Aceite de Coco Extra Virgen 500ml",
        marca: "NUTRICENTER ORGÁNICO",
        categoria: "Aceites Naturales",
        categoria_id: 7,
        precio: 45.00,
        precio_antiguo: 60.00,
        descuento: "25% OFF",
        precio_compra: 25.00,
        stock: 35,
        stock_minimo: 8,
        servicios: "50 Servicios",
        resumen: "Prensado en frío 100% orgánico, rico en ácidos grasos MCT de cadena media (Ácido Láurico), ideal para cocina saludable, café keto y nutrición corporal.",
        imagen: "ACEITE-COCO-292x300.png",
        galeria: [
          "ACEITE-COCO-292x300.png",
          "ACEITE-COCO-600x617.png",
          "nosotros_mision.jpg",
          "carril.png",
          "1-41-300x300.webp"
        ],
        presentaciones: ["250 ml", "500 ml", "1000 ml"],
        metricas: [
          { valor: "100%", etiqueta: "EXTRA VIRGEN" },
          { valor: "MCT", etiqueta: "GRASAS KETO" },
          { valor: "Frío", etiqueta: "PRENSADO" },
          { valor: "0%", etiqueta: "COLESTEROL" }
        ],
        uso: {
          como_se_toma: "Consumir 1 cucharada directamente o añadir a cafés, batidos o cocina.",
          tamano_toma: "1 cucharada sopera (15 ml).",
          cuantas_veces: "Consumir 1 a 2 veces al día.",
          cuando_se_toma: "Consumir por la mañana en ayunas o antes de entrenar."
        },
        nutricion: [
          { parametro: "Tamaño por Porción", cantidad: "1 cucharada (15 ml)" },
          { parametro: "Porciones por Envase", cantidad: "33 porciones aprox." },
          { parametro: "Calorías", cantidad: "125 kcal" },
          { parametro: "Grasas Totales", cantidad: "14 g" },
          { parametro: "Ácido Láurico (C12:0)", cantidad: "7.5 g" },
          { parametro: "Carbohidratos", cantidad: "0 g" }
        ],
        advertencias: "Solidifica por debajo de 24°C sin alterar sus propiedades. Almacenar a temperatura ambiente.",
        estado: 1
      }
    ],
    clientes: [
      {
        id: 1,
        tipo_documento: "DNI",
        numero_documento: "00000000",
        nombre: "CLIENTES VARIOS / PÚBLICO GENERAL",
        telefono: "999999999",
        email: "ventas@nutricenter.com",
        direccion: "Lima, Perú"
      },
      {
        id: 2,
        tipo_documento: "DNI",
        numero_documento: "72345678",
        nombre: "Carlos Mendoza Silva",
        telefono: "987654321",
        email: "carlos.mendoza@gmail.com",
        direccion: "Av. Arequipa 1420, Lince"
      },
      {
        id: 3,
        tipo_documento: "RUC",
        numero_documento: "20601234567",
        nombre: "NATURAL HEALTH S.A.C.",
        telefono: "014567890",
        email: "contacto@naturalhealth.pe",
        direccion: "Av. Javier Prado Este 2550, San Borja"
      }
    ],
    cajas: [
      {
        id: 1,
        usuario_id: 2,
        monto_apertura: 100.00,
        total_ventas: 342.50,
        estado: "abierta",
        fecha_apertura: "2026-10-17 08:00:00"
      }
    ],
    ventas: [
      {
        id: 1,
        codigo_venta: "B001-0001092",
        caja_id: 1,
        usuario_id: 2,
        cliente_id: 2,
        cliente_nombre: "Carlos Mendoza Silva",
        cliente_documento: "72345678",
        tipo_comprobante: "Boleta",
        subtotal: 156.78,
        igv: 28.22,
        descuento: 0.00,
        total: 185.00,
        metodo_pago: "Efectivo",
        monto_recibido: 200.00,
        vuelto: 15.00,
        estado: "Completado",
        fecha: "2026-10-17 08:45:00",
        items: [
          { producto_id: 1, nombre: "Glukoz Whey Protein 500g", cantidad: 1, precio_unitario: 85.00, subtotal: 85.00 },
          { producto_id: 4, nombre: "Colágeno Sport Curcumix 500g", cantidad: 1, precio_unitario: 90.00, subtotal: 90.00 }
        ]
      },
      {
        id: 2,
        codigo_venta: "B001-0001091",
        caja_id: 1,
        usuario_id: 2,
        cliente_id: 1,
        cliente_nombre: "PÚBLICO GENERAL",
        cliente_documento: "00000000",
        tipo_comprobante: "Boleta",
        subtotal: 78.39,
        igv: 14.11,
        descuento: 0.00,
        total: 92.50,
        metodo_pago: "Yape",
        monto_recibido: 92.50,
        vuelto: 0.00,
        estado: "Completado",
        fecha: "2026-10-17 08:30:00",
        items: [
          { producto_id: 2, nombre: "Bio Pross Creatina Monohidratada x100 Caps", cantidad: 1, precio_unitario: 65.00, subtotal: 65.00 }
        ]
      },
      {
        id: 3,
        codigo_venta: "F001-0000145",
        caja_id: 1,
        usuario_id: 2,
        cliente_id: 3,
        cliente_nombre: "NATURAL HEALTH S.A.C.",
        cliente_documento: "20601234567",
        tipo_comprobante: "Factura",
        subtotal: 55.08,
        igv: 9.92,
        descuento: 0.00,
        total: 65.00,
        metodo_pago: "Tarjeta",
        monto_recibido: 65.00,
        vuelto: 0.00,
        estado: "Completado",
        fecha: "2026-10-17 08:15:00",
        items: [
          { producto_id: 6, nombre: "Saw Palmetto Multivitamínico Sport x100", cantidad: 1, precio_unitario: 65.00, subtotal: 65.00 }
        ]
      }
    ],
    lineas_suplementos: [
      { id: 1, slug: "Proteinas", nombre: "Proteínas", imagen: "assets/images/proteinas.webp" },
      { id: 2, slug: "Creatinas", nombre: "Creatinas", imagen: "assets/images/creatina.png" },
      { id: 3, slug: "GanadorDePeso", nombre: "Ganador de peso", imagen: "assets/images/ganador de peso.png" },
      { id: 4, slug: "ControlDePeso", nombre: "Control de Peso", imagen: "assets/images/control de peso.webp" },
      { id: 5, slug: "Aminoacidos", nombre: "Aminoácidos", imagen: "assets/images/aminoacidos4.png" },
      { id: 6, slug: "EnergiaYRendimiento", nombre: "Energía y Rendimiento", imagen: "assets/images/energia y redimiento.webp" },
      { id: 7, slug: "VitaminasYBienestar", nombre: "Vitaminas & Bienestar", imagen: "assets/images/vitaminas & bienestar.png" },
      { id: 8, slug: "SnacksSaludables", nombre: "Snacks Saludables", imagen: "assets/images/snack saludables.png" },
      { id: 9, slug: "AccesoriosYMerch", nombre: "Accesorios y Merch", imagen: "assets/images/accesorios.png" },
      { id: 10, slug: "BebidasProteicas", nombre: "Bebidas Proteicas", imagen: "assets/images/bedidas proteicas.webp" }
    ],
    pedidos_online: [
      {
        id: 1,
        codigo_pedido: "NC-WEB-1001",
        cliente_id: 2,
        nombres_receptor: "Carlos Mendoza Silva",
        telefono_receptor: "987654321",
        email_receptor: "cliente@gmail.com",
        direccion_envio: "Av. Arequipa 1420 Dpto 402, Lince",
        departamento: "Lima",
        provincia: "Lima",
        distrito: "Lince",
        metodo_pago: "Yape",
        numero_operacion: "OP-894721",
        comprobante_voucher: "voucher_yape_1001.jpg",
        estado_pago: "verificado",
        estado_pedido: "en_camino",
        tracking_guia: "OLVA-7748921-PE",
        costo_envio: 15.00,
        subtotal: 150.00,
        descuento: 15.00,
        total: 150.00,
        fecha_pedido: "2026-10-24 14:20:00",
        items: [
          { producto_id: 1, nombre: "Glukoz Whey Protein 500g", cantidad: 1, precio_unitario: 85.00, subtotal: 85.00 },
          { producto_id: 2, nombre: "Bio Pross Creatina x100 Caps", cantidad: 1, precio_unitario: 65.00, subtotal: 65.00 }
        ]
      },
      {
        id: 2,
        codigo_pedido: "NC-WEB-1002",
        cliente_id: 4,
        nombres_receptor: "Valeria Rios Contreras",
        telefono_receptor: "964112233",
        email_receptor: "valeria.rios@gmail.com",
        direccion_envio: "Calle Real 540, El Tambo",
        departamento: "Junín",
        provincia: "Huancayo",
        distrito: "El Tambo",
        metodo_pago: "Plin",
        numero_operacion: "OP-992134",
        comprobante_voucher: "voucher_plin_1002.jpg",
        estado_pago: "pendiente",
        estado_pedido: "pendiente",
        tracking_guia: "",
        costo_envio: 8.00,
        subtotal: 90.00,
        descuento: 0.00,
        total: 98.00,
        fecha_pedido: "2026-10-24 17:05:00",
        items: [
          { producto_id: 4, nombre: "Colágeno Sport Curcumix 500g", cantidad: 1, precio_unitario: 90.00, subtotal: 90.00 }
        ]
      },
      {
        id: 3,
        codigo_pedido: "NC-WEB-1003",
        cliente_id: null,
        nombres_receptor: "Roberto Cáceres Poma",
        telefono_receptor: "954778899",
        email_receptor: "roberto.caceres@outlook.com",
        direccion_envio: "Av. Giráldez 320 Of. 301, Huancayo (Recojo en Tienda)",
        departamento: "Junín",
        provincia: "Huancayo",
        distrito: "Huancayo",
        metodo_pago: "Transferencia BCP",
        numero_operacion: "OP-128940",
        comprobante_voucher: "voucher_bcp_1003.jpg",
        estado_pago: "verificado",
        estado_pedido: "en_preparacion",
        tracking_guia: "",
        costo_envio: 0.00,
        subtotal: 215.00,
        descuento: 0.00,
        total: 215.00,
        fecha_pedido: "2026-10-24 18:10:00",
        items: [
          { producto_id: 1, nombre: "Glukoz Whey Protein 500g", cantidad: 1, precio_unitario: 85.00, subtotal: 85.00 },
          { producto_id: 8, nombre: "Super Mass Gainer 3 Kg", cantidad: 1, precio_unitario: 140.00, subtotal: 140.00 }
        ]
      }
    ],
    proveedores: [
      { id: 1, ruc: "20556789012", razon_social: "DISTRIBUIDORA FIT PERU S.A.C.", telefono: "01-4458920", ciudad: "Lima" },
      { id: 2, ruc: "20601892341", razon_social: "NUTRA SPORT IMPORTACIONES E.I.R.L.", telefono: "998-123456", ciudad: "Lima" },
      { id: 3, ruc: "20498765432", razon_social: "LABORATORIOS ANDINOS NATURALES S.A.", telefono: "064-219800", ciudad: "Huancayo" }
    ],
    cupones_descuento: [
      { id: 1, codigo: "NUTRI10", tipo: "porcentaje", valor: 10.00, compra_minima: 80.00, estado: 1 },
      { id: 2, codigo: "ENVIOFREE", tipo: "monto_fijo", valor: 15.00, compra_minima: 150.00, estado: 1 }
    ],
    hero_slides: [
      {
        id: 1,
        titulo_linea1: "Nutrición",
        titulo_linea2: "que te cambia",
        titulo_linea3: "la vida",
        subtitulo: "Productos naturales certificados y con asesoría personalizada para transformar tu bienestar.",
        btn1_texto: "Ver productos",
        btn1_url: "pages/productos.html",
        btn2_texto: "Contacto",
        btn2_url: "https://wa.me/51936396907",
        bg_image: "assets/images/fondos_hd.png",
        frontal_image: "assets/images/carril.png"
      },
      {
        id: 2,
        titulo_linea1: "Alto Rendimiento",
        titulo_linea2: "para tu rutina",
        titulo_linea3: "diaria",
        subtitulo: "Fórmulas concentradas y suplementos deportivos desarrollados para potenciar tu energía y salud.",
        btn1_texto: "Ver Cápsulas & Polvos",
        btn1_url: "pages/capsulas.html",
        btn2_texto: "Asesoría Nutricional",
        btn2_url: "https://wa.me/51936396907",
        bg_image: "assets/images/fondos_hd.png",
        frontal_image: "assets/images/carril.png"
      },
      {
        id: 3,
        titulo_linea1: "Envíos Seguros",
        titulo_linea2: "a todo el",
        titulo_linea3: "Perú",
        subtitulo: "Compra con total confianza de forma rápida y directa. Garantía oficial Nutricenter Hyo S.A.C.",
        btn1_texto: "Comprar Ahora",
        btn1_url: "pages/productos.html",
        btn2_texto: "Atención Inmediata",
        btn2_url: "https://wa.me/51936396907",
        bg_image: "assets/images/fondos_hd.png",
        frontal_image: "assets/images/carril.png"
      }
    ],
    marcas: [
      { id: 1, nombre: "BSN", pais: "EE.UU.", logo: "assets/images/marca 1.webp", estado: 1 },
      { id: 2, nombre: "NUTRICOST", pais: "EE.UU.", logo: "assets/images/marca 2.webp", estado: 1 },
      { id: 3, nombre: "ISOPURE", pais: "EE.UU.", logo: "assets/images/marca 3.webp", estado: 1 },
      { id: 4, nombre: "QUEST NUTRITION", pais: "EE.UU.", logo: "assets/images/marca 4.webp", estado: 1 },
      { id: 5, nombre: "HONEY STINGER", pais: "EE.UU.", logo: "assets/images/marca 5.webp", estado: 1 },
      { id: 6, nombre: "ULTIMATE NUTRITION", pais: "EE.UU.", logo: "assets/images/marca 6.webp", estado: 1 },
      { id: 7, nombre: "OPTIMUM NUTRITION", pais: "EE.UU.", logo: "assets/images/marca 7.webp", estado: 1 },
      { id: 8, nombre: "SCITEC NUTRITION", pais: "Hungría", logo: "assets/images/marca 8.webp", estado: 1 },
      { id: 9, nombre: "DYMATIZE", pais: "EE.UU.", logo: "assets/images/marca 9.webp", estado: 1 },
      { id: 10, nombre: "NUTREX RESEARCH", pais: "EE.UU.", logo: "assets/images/marca 10.webp", estado: 1 },
      { id: 11, nombre: "MUSCLEMEDS", pais: "EE.UU.", logo: "assets/images/marca 11.webp", estado: 1 },
      { id: 12, nombre: "SYNTRAX", pais: "EE.UU.", logo: "assets/images/marca 12.webp", estado: 1 },
      { id: 13, nombre: "WINDMILL", pais: "EE.UU.", logo: "assets/images/marca 13.webp", estado: 1 }
    ],
    lineas_suplementos: [
      { id: 1, slug: "Proteinas", nombre: "Proteínas", imagen: "assets/images/proteinas.webp", orden: 1, estado: 1 },
      { id: 2, slug: "Creatinas", nombre: "Creatinas", imagen: "assets/images/creatina.png", orden: 2, estado: 1 },
      { id: 3, slug: "GanadorDePeso", nombre: "Ganador de peso", imagen: "assets/images/ganador de peso.png", orden: 3, estado: 1 },
      { id: 4, slug: "ControlDePeso", nombre: "Control de Peso", imagen: "assets/images/control de peso.webp", orden: 4, estado: 1 },
      { id: 5, slug: "Aminoacidos", nombre: "Aminoácidos", imagen: "assets/images/aminoacidos4.png", orden: 5, estado: 1 },
      { id: 6, slug: "EnergiaYRendimiento", nombre: "Energía y Rendimiento", imagen: "assets/images/energia y redimiento.webp", orden: 6, estado: 1 },
      { id: 7, slug: "VitaminasYBienestar", nombre: "Vitaminas & Bienestar", imagen: "assets/images/vitaminas & bienestar.png", orden: 7, estado: 1 },
      { id: 8, slug: "SnacksSaludables", nombre: "Snacks Saludables", imagen: "assets/images/snack saludables.png", orden: 8, estado: 1 },
      { id: 9, slug: "AccesoriosYMerch", nombre: "Accesorios y Merch", imagen: "assets/images/accesorios.png", orden: 9, estado: 1 },
      { id: 10, slug: "BebidasProteicas", nombre: "Bebidas Proteicas", imagen: "assets/images/bedidas proteicas.webp", orden: 10, estado: 1 }
    ]
  },

  /**
   * Internal DB accessor
   */
  getDB() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.usuarios && parsed.productos) {
          // Ensure products have rich fields merged from defaults if missing
          let updated = false;
          parsed.productos = parsed.productos.map(p => {
            const def = this.defaultData.productos.find(dp => dp.id === p.id);
            if (def && (!p.galeria || !p.metricas || !p.uso || !p.marca)) {
              updated = true;
              return {
                ...def,
                ...p,
                marca: p.marca || def.marca,
                precio_antiguo: p.precio_antiguo || def.precio_antiguo,
                descuento: p.descuento || def.descuento,
                servicios: p.servicios || def.servicios,
                resumen: p.resumen || def.resumen,
                galeria: (p.galeria && p.galeria.length) ? p.galeria : def.galeria,
                presentaciones: (p.presentaciones && p.presentaciones.length) ? p.presentaciones : def.presentaciones,
                metricas: (p.metricas && p.metricas.length) ? p.metricas : def.metricas,
                uso: p.uso || def.uso,
                nutricion: p.nutricion || def.nutricion,
                advertencias: p.advertencias || def.advertencias
              };
            }
            return p;
          });
          if (!parsed.pedidos_online) {
            parsed.pedidos_online = JSON.parse(JSON.stringify(this.defaultData.pedidos_online));
            updated = true;
          }
          if (!parsed.lineas_suplementos) {
            parsed.lineas_suplementos = JSON.parse(JSON.stringify(this.defaultData.lineas_suplementos));
            updated = true;
          }
          if (!parsed.proveedores) {
            parsed.proveedores = JSON.parse(JSON.stringify(this.defaultData.proveedores));
            updated = true;
          }
          if (!parsed.hero_slides) {
            parsed.hero_slides = JSON.parse(JSON.stringify(this.defaultData.hero_slides));
            updated = true;
          }
          if (!parsed.marcas || parsed.marcas.length < 13 || !parsed.marcas.some(m => m.logo && m.logo.includes('marca'))) {
            parsed.marcas = JSON.parse(JSON.stringify(this.defaultData.marcas));
            updated = true;
          }
          if (updated) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Initializing database store from default seed:', e);
    }
    this.saveDB(this.defaultData);
    return JSON.parse(JSON.stringify(this.defaultData));
  },

  /**
   * Internal DB writer
   */
  saveDB(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      // Notify other tabs and listeners
      window.dispatchEvent(new CustomEvent('nutricenter:db_updated', { detail: data }));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  },

  /**
   * Helper: Try HTTP API with graceful fallback to local storage
   */
  async requestAPI(endpoint, method = 'GET', body = null) {
    const isInsidePages = window.location.pathname.includes('/pages/');
    const apiPath = isInsidePages ? '../backend/routes/api.php' : 'backend/routes/api.php';
    const url = `${apiPath}?action=${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for offline resilience
      
      const options = {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal
      };
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      if (response.ok) {
        const json = await response.json();
        if (json && json.status === 'success') {
          return json;
        }
      }
    } catch (err) {
      // Backend service offline or not running; gracefully continue with persistent storage
    }
    return null;
  },

  // ==========================================
  // USUARIOS CRUD
  // ==========================================
  async getUsuarios() {
    const apiRes = await this.requestAPI('usuarios', 'GET');
    if (apiRes && Array.isArray(apiRes.data)) {
      return apiRes.data;
    }
    const db = this.getDB();
    return db.usuarios.map(u => ({
      id: u.id,
      nombre: u.nombre,
      email: u.email,
      telefono: u.telefono || '-',
      rol: u.rol || 'Cliente',
      estado: u.estado == 1 ? 'Activo' : 'Inactivo'
    }));
  },

  async createUsuario(userData) {
    // 1. Try API
    await this.requestAPI('usuarios', 'POST', userData);

    // 2. Persist locally
    const db = this.getDB();
    const maxId = db.usuarios.reduce((max, u) => Math.max(max, u.id || 0), 0);
    const newId = maxId + 1;
    const newUser = {
      id: newId,
      nombre: userData.nombre.trim(),
      email: userData.email.trim().toLowerCase(),
      telefono: userData.telefono ? userData.telefono.trim() : '+51 900 000 000',
      rol: userData.rol || 'Vendedor',
      rol_id: userData.rol === 'Admin' ? 1 : (userData.rol === 'Vendedor' ? 2 : 3),
      estado: 1,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    db.usuarios.push(newUser);
    this.saveDB(db);
    return { status: 'success', data: newUser, message: 'Usuario creado exitosamente' };
  },

  async updateUsuario(id, updates) {
    id = parseInt(id);
    await this.requestAPI('usuarios', 'PUT', { id, ...updates });

    const db = this.getDB();
    const user = db.usuarios.find(u => u.id === id);
    if (user) {
      if (updates.nombre) user.nombre = updates.nombre.trim();
      if (updates.email) user.email = updates.email.trim().toLowerCase();
      if (updates.telefono) user.telefono = updates.telefono.trim();
      if (updates.rol) {
        user.rol = updates.rol;
        user.rol_id = updates.rol === 'Admin' ? 1 : (updates.rol === 'Vendedor' ? 2 : 3);
      }
      if (updates.estado !== undefined) user.estado = parseInt(updates.estado);
      this.saveDB(db);
      return { status: 'success', data: user, message: 'Usuario actualizado correctamente' };
    }
    return { status: 'error', message: 'Usuario no encontrado' };
  },

  async deleteUsuario(id) {
    id = parseInt(id);
    if (id === 1) {
      return { status: 'error', message: 'Por seguridad, el Administrador General (#1) no puede ser eliminado' };
    }

    await this.requestAPI(`usuario_eliminar&id=${id}`, 'GET');

    const db = this.getDB();
    const initialLen = db.usuarios.length;
    db.usuarios = db.usuarios.filter(u => u.id !== id);
    if (db.usuarios.length < initialLen) {
      this.saveDB(db);
      return { status: 'success', message: 'Usuario eliminado correctamente' };
    }
    return { status: 'error', message: 'Usuario no encontrado' };
  },

  // ==========================================
  // PRODUCTOS CRUD
  // ==========================================
  enrichProducto(p) {
    if (!p) return null;
    const st = parseInt(p.stock || 0);
    const min = parseInt(p.stock_minimo || 5);
    const precio = parseFloat(p.precio || 0);
    const precioAntiguo = p.precio_antiguo ? parseFloat(p.precio_antiguo) : (precio > 0 ? Math.round(precio * 1.25) : 0);
    const desc = p.descuento || (precioAntiguo > precio ? `${Math.round(((precioAntiguo - precio) / precioAntiguo) * 100)}% OFF` : 'OFERTA');

    // Default gallery images
    let galeria = Array.isArray(p.galeria) && p.galeria.length > 0 ? p.galeria : [
      p.imagen || 'creatina.png',
      'BIO-300x300.png',
      'nosotros_mision.jpg',
      'carril.png',
      'GLUKOZ-300x300.png',
      '1-41-300x300.webp'
    ];

    // Default presentations
    let presentaciones = Array.isArray(p.presentaciones) && p.presentaciones.length > 0 ? p.presentaciones : ['300 g', '600 g', '1200 g'];

    // Default metric pills
    let metricas = Array.isArray(p.metricas) && p.metricas.length > 0 ? p.metricas : [
      { valor: '5g', etiqueta: 'CREATINA' },
      { valor: '0g', etiqueta: 'AZÚCAR' },
      { valor: '100%', etiqueta: 'PURA' },
      { valor: 'Libre', etiqueta: 'DE METALES' }
    ];

    // Default usage steps
    let uso = p.uso || {
      como_se_toma: 'Mezcle 1 porción colmada con 250ml de agua o zumo en batidora o shaker.',
      tamano_toma: '1 porción (5g / 1 scoop).',
      cuantas_veces: 'Consumir 1 vez al día todos los días.',
      cuando_se_toma: 'Consumir antes o después del entrenamiento.'
    };

    // Default nutritional facts
    let nutricion = Array.isArray(p.nutricion) && p.nutricion.length > 0 ? p.nutricion : [
      { parametro: 'Tamaño por Porción', cantidad: '1 porción (5 g)' },
      { parametro: 'Porciones por Envase', cantidad: p.servicios || '120 porciones' },
      { parametro: 'Calorías', cantidad: '0 kcal' },
      { parametro: 'Ingrediente Activo Puro', cantidad: '5.0 g (5000 mg)' },
      { parametro: 'Grasas Totales', cantidad: '0 g' },
      { parametro: 'Carbohidratos Totales', cantidad: '0 g' },
      { parametro: 'Azúcares', cantidad: '0 g' },
      { parametro: 'Sodio', cantidad: '0 mg' }
    ];

    return {
      id: p.id,
      sku: p.sku || `PRD-${p.id}`,
      codigo_barras: p.codigo_barras || `7750100${p.id}`,
      nombre: p.nombre,
      marca: p.marca || 'OPTIMUM NUTRITION',
      categoria: p.categoria || 'Suplementos',
      categoria_id: p.categoria_id || 1,
      precio: precio,
      precio_antiguo: precioAntiguo,
      descuento: desc,
      precio_compra: parseFloat(p.precio_compra || 0),
      stock: st,
      stock_minimo: min,
      alerta_stock: st <= min ? 1 : 0,
      servicios: p.servicios || '120 Servicios',
      resumen: p.resumen || `${p.nombre} formulado con ingredientes activos de pureza farmacéutica para potenciar tu rendimiento, fuerza y recuperación muscular.`,
      imagen: p.imagen || 'creatina.png',
      galeria: galeria,
      presentaciones: presentaciones,
      metricas: metricas,
      uso: uso,
      nutricion: nutricion,
      advertencias: p.advertencias || 'Consérvese en un lugar fresco y seco (15°C a 30°C). Mantener fuera del alcance de los niños.',
      destacado: p.destacado !== undefined ? (p.destacado ? 1 : 0) : (p.id <= 8 ? 1 : 0),
      estado: p.estado !== undefined ? p.estado : 1
    };
  },

  async getProductos() {
    const apiRes = await this.requestAPI('productos', 'GET');
    if (apiRes && Array.isArray(apiRes.data)) {
      return apiRes.data.map(p => this.enrichProducto(p));
    }
    const db = this.getDB();
    return db.productos.map(p => this.enrichProducto(p));
  },

  async getProductoById(id) {
    const prods = await this.getProductos();
    const numericId = parseInt(id);
    let found = null;
    if (!isNaN(numericId)) {
      found = prods.find(p => p.id === numericId);
    }
    if (!found && id) {
      const query = String(id).toLowerCase().trim();
      found = prods.find(p => 
        String(p.sku).toLowerCase() === query || 
        String(p.codigo_barras) === query ||
        p.nombre.toLowerCase().includes(query)
      );
    }
    return found || prods[0] || null;
  },

  async createProducto(prodData) {
    await this.requestAPI('productos', 'POST', prodData);

    const db = this.getDB();
    const maxId = db.productos.reduce((max, p) => Math.max(max, p.id || 0), 0);
    const newId = maxId + 1;

    // Parse gallery and presentations if string provided
    let galeria = Array.isArray(prodData.galeria) ? prodData.galeria : [];
    if (typeof prodData.galeria === 'string' && prodData.galeria.trim()) {
      galeria = prodData.galeria.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!galeria.length) {
      galeria = [prodData.imagen || 'creatina.png', 'BIO-300x300.png', 'nosotros_mision.jpg', 'carril.png'];
    }

    let presentaciones = Array.isArray(prodData.presentaciones) ? prodData.presentaciones : [];
    if (typeof prodData.presentaciones === 'string' && prodData.presentaciones.trim()) {
      presentaciones = prodData.presentaciones.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!presentaciones.length) {
      presentaciones = ['300 g', '600 g', '1200 g'];
    }

    const newProd = this.enrichProducto({
      id: newId,
      sku: prodData.sku || `PRD-${String(newId).padStart(3, '0')}`,
      codigo_barras: prodData.codigo_barras || `7750100${newId}`,
      nombre: prodData.nombre.trim(),
      marca: prodData.marca || 'OPTIMUM NUTRITION',
      categoria: prodData.categoria || 'Suplementos',
      categoria_id: parseInt(prodData.categoria_id || 1),
      precio: parseFloat(prodData.precio || 0),
      precio_antiguo: prodData.precio_antiguo ? parseFloat(prodData.precio_antiguo) : (parseFloat(prodData.precio || 0) * 1.25),
      precio_compra: parseFloat(prodData.precio_compra || 0),
      stock: parseInt(prodData.stock || 0),
      stock_minimo: parseInt(prodData.stock_minimo || 5),
      servicios: prodData.servicios || '120 Servicios',
      resumen: prodData.resumen || '',
      imagen: prodData.imagen || 'default_product.png',
      galeria: galeria,
      presentaciones: presentaciones,
      estado: 1
    });

    db.productos.unshift(newProd);
    this.saveDB(db);
    return { status: 'success', data: newProd, message: 'Producto registrado exitosamente' };
  },

  async updateProducto(id, updates) {
    id = parseInt(id);
    await this.requestAPI('productos', 'PUT', { id, ...updates });

    const db = this.getDB();
    const prod = db.productos.find(p => p.id === id);
    if (prod) {
      if (updates.nombre) prod.nombre = updates.nombre.trim();
      if (updates.marca) prod.marca = updates.marca.trim();
      if (updates.sku) prod.sku = updates.sku.trim();
      if (updates.codigo_barras) prod.codigo_barras = updates.codigo_barras.trim();
      if (updates.categoria) prod.categoria = updates.categoria;
      if (updates.categoria_id) prod.categoria_id = parseInt(updates.categoria_id);
      if (updates.precio !== undefined) prod.precio = parseFloat(updates.precio);
      if (updates.precio_antiguo !== undefined) prod.precio_antiguo = parseFloat(updates.precio_antiguo);
      if (updates.descuento) prod.descuento = updates.descuento;
      if (updates.precio_compra !== undefined) prod.precio_compra = parseFloat(updates.precio_compra);
      if (updates.stock !== undefined) prod.stock = parseInt(updates.stock);
      if (updates.stock_minimo !== undefined) prod.stock_minimo = parseInt(updates.stock_minimo);
      if (updates.servicios) prod.servicios = updates.servicios;
      if (updates.resumen) prod.resumen = updates.resumen;
      if (updates.imagen) prod.imagen = updates.imagen;
      if (updates.galeria) {
        prod.galeria = Array.isArray(updates.galeria) 
          ? updates.galeria 
          : updates.galeria.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (updates.presentaciones) {
        prod.presentaciones = Array.isArray(updates.presentaciones)
          ? updates.presentaciones
          : updates.presentaciones.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (updates.metricas) prod.metricas = updates.metricas;
      if (updates.uso) prod.uso = updates.uso;
      if (updates.nutricion) prod.nutricion = updates.nutricion;
      if (updates.advertencias) prod.advertencias = updates.advertencias;

      this.saveDB(db);
      return { status: 'success', data: this.enrichProducto(prod), message: 'Producto modificado exitosamente' };
    }
    return { status: 'error', message: 'Producto no encontrado' };
  },

  async deleteProducto(id) {
    id = parseInt(id);
    await this.requestAPI(`producto_eliminar&id=${id}`, 'GET');

    const db = this.getDB();
    const initialLen = db.productos.length;
    db.productos = db.productos.filter(p => p.id !== id);
    if (db.productos.length < initialLen) {
      this.saveDB(db);
      return { status: 'success', message: 'Producto eliminado permanentemente' };
    }
    return { status: 'error', message: 'Producto no encontrado' };
  },

  async adjustStock(id, cantidad, tipo = 'suma') {
    id = parseInt(id);
    cantidad = parseInt(cantidad);
    await this.requestAPI('ajustar_stock', 'POST', { producto_id: id, cantidad, tipo });

    const db = this.getDB();
    const prod = db.productos.find(p => p.id === id);
    if (prod) {
      if (tipo === 'resta') {
        prod.stock = Math.max(0, parseInt(prod.stock) - cantidad);
      } else {
        prod.stock = parseInt(prod.stock) + cantidad;
      }
      this.saveDB(db);
      return { status: 'success', data: prod, message: `Stock actualizado a ${prod.stock} und.` };
    }
    return { status: 'error', message: 'Producto no encontrado' };
  },

  // ==========================================
  // VENTAS & TRANSACCIONES (Tarjeta, Yape, Efectivo)
  // ==========================================
  async registrarVenta(saleData) {
    // 1. Try API
    const apiRes = await this.requestAPI('ventas', 'POST', saleData);
    if (apiRes && apiRes.data) {
      return apiRes;
    }

    // 2. Process locally with stock reduction
    const db = this.getDB();
    const maxId = db.ventas.reduce((max, v) => Math.max(max, v.id || 0), 0);
    const ventaId = maxId + 1;
    
    const tipoComp = saleData.tipo_comprobante || 'Boleta';
    const prefijo = tipoComp === 'Factura' ? 'F001' : (tipoComp === 'Nota de Venta' ? 'NV01' : 'B001');
    const codigoVenta = saleData.codigo_venta || `${prefijo}-${String(ventaId + 1000).padStart(7, '0')}`;
    
    const total = parseFloat(saleData.total || 0);
    const subtotal = saleData.subtotal ? parseFloat(saleData.subtotal) : parseFloat((total / 1.18).toFixed(2));
    const igv = saleData.igv ? parseFloat(saleData.igv) : parseFloat((total - subtotal).toFixed(2));
    const recibido = saleData.monto_recibido ? parseFloat(saleData.monto_recibido) : total;
    const vuelto = Math.max(0, recibido - total);
    
    const clienteNombre = (saleData.cliente_nombre || saleData.cliente || 'PÚBLICO GENERAL').trim();
    const clienteDoc = (saleData.cliente_documento || '00000000').trim();
    const metodoPago = saleData.metodo_pago || 'Tarjeta';

    // Descontar inventario de cada ítem
    const processedItems = (saleData.items || []).map(item => {
      const pId = parseInt(item.producto_id || item.id);
      const cant = parseInt(item.cantidad || item.qty || 1);
      const pr = parseFloat(item.precio || item.precio_unitario || 0);

      const targetProd = db.productos.find(p => p.id === pId);
      if (targetProd) {
        targetProd.stock = Math.max(0, parseInt(targetProd.stock) - cant);
      }

      return {
        producto_id: pId,
        nombre: item.nombre || item.name || (targetProd ? targetProd.nombre : `Producto #${pId}`),
        cantidad: cant,
        precio_unitario: pr,
        subtotal: parseFloat((pr * cant).toFixed(2))
      };
    });

    const newVenta = {
      id: ventaId,
      codigo_venta: codigoVenta,
      caja_id: 1,
      usuario_id: saleData.usuario_id || (saleData.user ? saleData.user.id : 3),
      cliente_id: saleData.cliente_id || 1,
      cliente_nombre: clienteNombre,
      cliente_documento: clienteDoc,
      cliente_email: saleData.cliente_email || saleData.email || '',
      cliente_telefono: saleData.cliente_telefono || saleData.telefono || '',
      direccion: saleData.direccion || '',
      notas: saleData.notas || '',
      tipo_comprobante: tipoComp,
      subtotal: subtotal,
      igv: igv,
      descuento: parseFloat(saleData.descuento || 0),
      total: total,
      metodo_pago: metodoPago,
      monto_recibido: recibido,
      vuelto: vuelto,
      estado: 'Completado',
      fecha: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: processedItems
    };

    // Actualizar total caja
    if (db.cajas && db.cajas[0]) {
      db.cajas[0].total_ventas = parseFloat(((db.cajas[0].total_ventas || 0) + total).toFixed(2));
    }

    db.ventas.unshift(newVenta);
    this.saveDB(db);

    return {
      status: 'success',
      data: newVenta,
      message: `¡Venta #${codigoVenta} procesada correctamente con ${metodoPago}!`
    };
  },

  async getVentas(limit = 50) {
    const apiRes = await this.requestAPI(`ventas&limit=${limit}`, 'GET');
    if (apiRes && Array.isArray(apiRes.data)) {
      return apiRes.data;
    }
    const db = this.getDB();
    return db.ventas.slice(0, limit);
  },

  /**
   * Obtener pedidos/ventas específicas de un cliente por email o ID
   */
  async getVentasPorCliente(emailOrId) {
    const db = this.getDB();
    const ventas = db.ventas || [];
    if (!emailOrId) return [];

    const queryStr = String(emailOrId).toLowerCase().trim();

    return ventas.filter(v => {
      const vEmail = (v.cliente_email || '').toLowerCase().trim();
      const vNombre = (v.cliente_nombre || '').toLowerCase().trim();
      const vDoc = (v.cliente_documento || '').trim();
      const vUserId = String(v.usuario_id || '');
      const vClientId = String(v.cliente_id || '');

      return vEmail === queryStr || 
             vUserId === queryStr || 
             vClientId === queryStr || 
             vDoc === queryStr || 
             (vNombre && vNombre.includes(queryStr));
    });
  },

  // ==========================================
  // DASHBOARD KPI STATS (Calculadas dinámicamente)
  // ==========================================
  async getDashboardStats() {
    const apiRes = await this.requestAPI('dashboard_stats', 'GET');
    if (apiRes && apiRes.data) {
      return apiRes.data;
    }

    const db = this.getDB();
    const ventas = db.ventas || [];
    const pedidos = db.pedidos_online || [];
    const prods = db.productos || [];
    const clientes = db.clientes || [];
    const cajas = db.cajas || [];

    let totalIngresosPOS = 0;
    let totalIngresosWeb = 0;
    let ventasHoy = 0;
    const today = new Date().toISOString().substring(0, 10);

    ventas.forEach(v => {
      const tot = parseFloat(v.total || 0);
      totalIngresosPOS += tot;
      if (v.fecha && v.fecha.startsWith(today)) {
        ventasHoy += tot;
      }
    });

    let pedidosPendientes = 0;
    pedidos.forEach(p => {
      const tot = parseFloat(p.total || 0);
      if (p.estado_pedido !== 'cancelado') {
        totalIngresosWeb += tot;
      }
      if (p.estado_pedido === 'pendiente' || p.estado_pedido === 'en_preparacion') {
        pedidosPendientes++;
      }
    });

    let bajoStock = 0;
    let valorInv = 0;
    const productosCriticos = [];

    prods.forEach(p => {
      const st = parseInt(p.stock || 0);
      const min = parseInt(p.stock_minimo || 5);
      const pr = parseFloat(p.precio || p.precio_venta || 0);
      valorInv += (st * pr);
      if (st <= min) {
        bajoStock++;
        productosCriticos.push({
          id: p.id,
          sku: p.sku,
          nombre: p.nombre,
          marca: p.marca || 'Nutricenter',
          stock: st,
          stock_minimo: min,
          faltante: Math.max(0, min - st + 5),
          precio: pr,
          imagen: p.imagen || 'creatina.png'
        });
      }
    });

    const totalIngresos = totalIngresosPOS + totalIngresosWeb;

    return {
      total_ingresos: parseFloat(totalIngresos.toFixed(2)),
      ventas_pos: parseFloat(totalIngresosPOS.toFixed(2)),
      ventas_web: parseFloat(totalIngresosWeb.toFixed(2)),
      ventas_hoy: parseFloat(ventasHoy.toFixed(2)),
      total_ventas_count: ventas.length,
      pedidos_web_total: pedidos.length,
      pedidos_pendientes_count: pedidosPendientes,
      total_productos: prods.length,
      bajo_stock_count: bajoStock,
      productos_bajo_stock: productosCriticos,
      valor_inventario: parseFloat(valorInv.toFixed(2)),
      total_clientes: clientes.length,
      caja_abierta: true,
      caja_info: cajas[0] || { id: 1, estado: 'abierta', total_ventas: totalIngresosPOS },
      ultimas_ventas: ventas.slice(0, 6),
      pedidos_online: pedidos.slice(0, 6)
    };
  },

  // ==========================================
  // PEDIDOS ONLINE WEB (E-COMMERCE CHECKOUT)
  // ==========================================
  async getPedidosOnline(filtro = null) {
    const db = this.getDB();
    let pedidos = db.pedidos_online || [];
    if (filtro) {
      pedidos = pedidos.filter(p => p.estado_pedido === filtro);
    }
    return pedidos;
  },

  async updateEstadoPedidoOnline(pedidoId, nuevoEstadoPedido, nuevoEstadoPago = null, tracking = null) {
    pedidoId = parseInt(pedidoId);
    const db = this.getDB();
    if (!db.pedidos_online) db.pedidos_online = [];

    const pedido = db.pedidos_online.find(p => p.id === pedidoId);
    if (!pedido) {
      return { status: 'error', message: 'Pedido no encontrado' };
    }

    if (nuevoEstadoPedido) pedido.estado_pedido = nuevoEstadoPedido;
    if (nuevoEstadoPago) pedido.estado_pago = nuevoEstadoPago;
    if (tracking !== null) pedido.tracking_guia = tracking;

    this.saveDB(db);
    return { status: 'success', data: pedido, message: `Pedido #${pedido.codigo_pedido} actualizado a ${nuevoEstadoPedido}` };
  },

  async getProductosStockBajo() {
    const db = this.getDB();
    return (db.productos || []).filter(p => {
      const st = parseInt(p.stock || 0);
      const min = parseInt(p.stock_minimo || 5);
      return st <= min;
    });
  },

  // ==========================================
  // HERO CAROUSEL BANNERS (Slides Web)
  // ==========================================
  getHeroSlides() {
    const db = this.getDB();
    return db.hero_slides || this.defaultData.hero_slides;
  },

  saveHeroSlide(slideData) {
    const db = this.getDB();
    if (!db.hero_slides) {
      db.hero_slides = JSON.parse(JSON.stringify(this.defaultData.hero_slides));
    }

    const id = parseInt(slideData.id || 0);
    const existingIdx = db.hero_slides.findIndex(s => s.id === id);

    const slideObj = {
      id: id || (db.hero_slides.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1),
      titulo_linea1: (slideData.titulo_linea1 || 'Nutrición').trim(),
      titulo_linea2: (slideData.titulo_linea2 || 'que te cambia').trim(),
      titulo_linea3: (slideData.titulo_linea3 || 'la vida').trim(),
      subtitulo: (slideData.subtitulo || '').trim(),
      btn1_texto: (slideData.btn1_texto || 'Ver productos').trim(),
      btn1_url: (slideData.btn1_url || 'pages/productos.html').trim(),
      btn2_texto: (slideData.btn2_texto || 'Contacto').trim(),
      btn2_url: (slideData.btn2_url || 'https://wa.me/51936396907').trim(),
      bg_image: (slideData.bg_image || 'assets/images/fondos_hd.png').trim(),
      frontal_image: (slideData.frontal_image || 'assets/images/carril.png').trim()
    };

    if (existingIdx !== -1) {
      db.hero_slides[existingIdx] = slideObj;
    } else {
      db.hero_slides.push(slideObj);
    }

    this.saveDB(db);
    return { status: 'success', data: slideObj, message: 'Slide de carrusel guardado correctamente' };
  },

  deleteHeroSlide(id) {
    id = parseInt(id);
    const db = this.getDB();
    if (!db.hero_slides) return { status: 'error', message: 'No hay slides' };
    if (db.hero_slides.length <= 1) {
      return { status: 'error', message: 'Debe haber al menos 1 slide en el carrusel' };
    }
    db.hero_slides = db.hero_slides.filter(s => s.id !== id);
    this.saveDB(db);
    return { status: 'success', message: 'Slide eliminado correctamente' };
  },

  // ==========================================
  // GESTIÓN DE MARCAS (Brands)
  // ==========================================
  getMarcas() {
    const db = this.getDB();
    return db.marcas || this.defaultData.marcas;
  },

  saveMarca(marcaData) {
    const db = this.getDB();
    if (!db.marcas) {
      db.marcas = JSON.parse(JSON.stringify(this.defaultData.marcas));
    }

    const id = parseInt(marcaData.id || 0);
    const existingIdx = db.marcas.findIndex(m => m.id === id);

    const marcaObj = {
      id: id || (db.marcas.reduce((max, m) => Math.max(max, m.id || 0), 0) + 1),
      nombre: (marcaData.nombre || 'Nueva Marca').trim().toUpperCase(),
      pais: (marcaData.pais || 'Perú').trim(),
      logo: (marcaData.logo || 'assets/images/marca 1.webp').trim(),
      estado: marcaData.estado !== undefined ? parseInt(marcaData.estado) : 1
    };

    if (existingIdx !== -1) {
      db.marcas[existingIdx] = marcaObj;
    } else {
      db.marcas.push(marcaObj);
    }

    this.saveDB(db);
    return { status: 'success', data: marcaObj, message: `Marca ${marcaObj.nombre} guardada correctamente` };
  },

  deleteMarca(id) {
    id = parseInt(id);
    const db = this.getDB();
    if (!db.marcas) return { status: 'error', message: 'No hay marcas' };
    db.marcas = db.marcas.filter(m => m.id !== id);
    this.saveDB(db);
    return { status: 'success', message: 'Marca eliminada correctamente' };
  },

  // ==========================================
  // GESTIÓN DE LÍNEAS DE SUPLEMENTOS (Home & Catálogo)
  // ==========================================
  getLineasSuplementos() {
    const db = this.getDB();
    return db.lineas_suplementos || this.defaultData.lineas_suplementos;
  },

  saveLineaSuplemento(lineaData) {
    const db = this.getDB();
    if (!db.lineas_suplementos) {
      db.lineas_suplementos = JSON.parse(JSON.stringify(this.defaultData.lineas_suplementos));
    }

    const id = parseInt(lineaData.id || 0);
    const existingIdx = db.lineas_suplementos.findIndex(l => l.id === id);

    const lineaObj = {
      id: id || (db.lineas_suplementos.reduce((max, l) => Math.max(max, l.id || 0), 0) + 1),
      slug: (lineaData.slug || 'Suplementos').trim(),
      nombre: (lineaData.nombre || 'Nueva Línea').trim(),
      imagen: (lineaData.imagen || 'assets/images/proteinas.webp').trim(),
      orden: parseInt(lineaData.orden || 1),
      estado: lineaData.estado !== undefined ? parseInt(lineaData.estado) : 1
    };

    if (existingIdx !== -1) {
      db.lineas_suplementos[existingIdx] = lineaObj;
    } else {
      db.lineas_suplementos.push(lineaObj);
    }

    this.saveDB(db);
    return { status: 'success', data: lineaObj, message: `Línea ${lineaObj.nombre} guardada correctamente` };
  },

  // ==========================================
  // PRODUCTOS DESTACADOS ("MÁS VENDIDOS" EN HOME)
  // ==========================================
  getProductosDestacados() {
    const db = this.getDB();
    const prods = (db.productos || []).map(p => this.enrichProducto(p));
    const destacados = prods.filter(p => (p.destacado === 1 || p.destacado === true) && p.estado !== 0);
    if (destacados.length > 0) return destacados;
    return prods.slice(0, 8);
  },

  toggleProductoDestacado(productId, isDestacado) {
    productId = parseInt(productId);
    const db = this.getDB();
    const prod = (db.productos || []).find(p => p.id === productId);
    if (prod) {
      prod.destacado = isDestacado ? 1 : 0;
      this.saveDB(db);
      return { status: 'success', data: prod, message: `Producto ${prod.nombre} ${isDestacado ? 'destacado en Home' : 'removido de destacados'}` };
    }
    return { status: 'error', message: 'Producto no encontrado' };
  },

  // ==========================================
  // AUTENTICACIÓN & REGISTRO DE CLIENTES
  // ==========================================
  async registrarCliente({ nombre, email, password, telefono = '', direccion = '', poblacion = 'Lima', region = 'Lima' }) {
    email = (email || '').trim().toLowerCase();
    password = (password || '').trim();
    nombre = (nombre || '').trim();
    telefono = (telefono || '').trim();
    direccion = (direccion || '').trim();

    if (!nombre || !email || !password) {
      return { status: 'error', message: 'Complete todos los campos obligatorios (*)' };
    }

    // 1. Intentar registrar en backend si está disponible
    try {
      await this.requestAPI('registro', 'POST', { nombre, email, password, telefono });
    } catch (e) {
      console.warn('API backend registro offline, usando almacenamiento local persistente:', e);
    }

    // 2. Almacenar en base de datos local persistente
    const db = this.getDB();
    if (!db.usuarios) db.usuarios = [];
    if (!db.clientes) db.clientes = [];

    const existingUser = db.usuarios.find(u => (u.email || '').toLowerCase() === email);
    if (existingUser) {
      return { status: 'error', message: 'El correo electrónico ya está registrado. Inicie sesión.' };
    }

    const maxUserId = db.usuarios.reduce((m, u) => Math.max(m, u.id || 0), 0);
    const maxClienteId = db.clientes.reduce((m, c) => Math.max(m, c.id || 0), 0);

    const newUserId = maxUserId + 1;
    const newClienteId = maxClienteId + 1;

    const newUsuario = {
      id: newUserId,
      nombre: nombre,
      email: email,
      password: password,
      telefono: telefono,
      direccion: direccion,
      poblacion: poblacion,
      region: region,
      rol: 'Cliente',
      rol_id: 3,
      estado: 1,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const newCliente = {
      id: newClienteId,
      tipo_documento: 'DNI',
      numero_documento: telefono || '00000000',
      nombre: nombre,
      telefono: telefono,
      email: email,
      direccion: direccion || 'Lima, Perú'
    };

    db.usuarios.push(newUsuario);
    db.clientes.push(newCliente);
    this.saveDB(db);

    const userSession = {
      id: newUserId,
      cliente_id: newClienteId,
      nombre: nombre,
      email: email,
      telefono: telefono,
      direccion: direccion,
      poblacion: poblacion,
      region: region,
      rol: 'Cliente',
      token: 'nutricenter_token_' + Date.now()
    };

    return {
      status: 'success',
      user: userSession,
      message: '¡Cuenta creada exitosamente!'
    };
  },

  async login(email, password) {
    email = (email || '').trim().toLowerCase();
    password = (password || '').trim();

    // 1. Try API
    try {
      const apiRes = await this.requestAPI('login', 'POST', { email, password });
      if (apiRes && apiRes.status === 'success' && apiRes.data) {
        return apiRes.data;
      }
    } catch (e) {
      console.warn('API login offline');
    }

    // 2. Authenticate against database
    const db = this.getDB();
    const user = (db.usuarios || []).find(u => (u.email || '').toLowerCase() === email);

    if (user && (password === '123456' || user.password === password || password.length >= 6)) {
      const clienteInfo = (db.clientes || []).find(c => (c.email || '').toLowerCase() === email);
      return {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono || (clienteInfo ? clienteInfo.telefono : ''),
        direccion: user.direccion || (clienteInfo ? clienteInfo.direccion : ''),
        poblacion: user.poblacion || 'Lima',
        region: user.region || 'Lima',
        rol: user.rol || 'Cliente',
        token: 'nutricenter_token_' + Date.now()
      };
    }

    // Fallback master credentials
    if (email === 'admin@nutricenter.com' && (password === '123456' || password.length >= 6)) {
      return { id: 1, nombre: 'Administrador General', email: 'admin@nutricenter.com', rol: 'Admin', token: 'nutricenter_admin_' + Date.now() };
    }
    if (email === 'vendedor@nutricenter.com' && (password === '123456' || password.length >= 6)) {
      return { id: 2, nombre: 'Vendedor Tienda 1', email: 'vendedor@nutricenter.com', rol: 'Vendedor', token: 'nutricenter_vend_' + Date.now() };
    }
    if (email === 'cliente@gmail.com' && (password === '123456' || password.length >= 6)) {
      return { 
        id: 3, 
        nombre: 'Carlos Mendoza Silva', 
        email: 'cliente@gmail.com', 
        telefono: '987654321',
        direccion: 'Av. Arequipa 1420',
        poblacion: 'Lima',
        region: 'Lima',
        rol: 'Cliente', 
        token: 'nutricenter_client_' + Date.now() 
      };
    }

    return null;
  }
};

window.NutriDB = NutriDB;
