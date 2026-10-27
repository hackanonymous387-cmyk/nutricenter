# 🌿 Nutricenter Perú - Sistema Web de Gestión & Punto de Venta

Sistema web modular para el comercio de productos naturales, gestión de inventario, punto de venta (POS), administración de usuarios y analítica financiera.

---

## 📁 Estructura del Proyecto

```text
nutricenter/
│
├── index.html                           # Página Principal (Landing Page)
│
├── assets/                              # Recursos Estáticos
│   ├── css/
│   │   ├── style.css                    # Sistema de diseño principal y componentes
│   │   └── responsive.css               # Reglas de diseño responsivo (mobile, tablet, desktop)
│   │
│   ├── js/
│   │   ├── main.js                      # Cargas dinámicas, componentes y utilidades API
│   │   ├── auth.js                      # Manejo de sesiones y autenticación
│   │   └── validation.js                # Validación de formularios en cliente
│   │
│   ├── images/ (o img/)                 # Logotipos e imágenes de productos
│   └── fonts/                           # Tipografías e iconos
│
├── pages/                               # Páginas de la Aplicación
│   ├── login.html                       # Inicio de sesión
│   ├── registro.html                    # Registro de nuevos usuarios
│   ├── dashboard.html                   # Panel de control administrativo
│   ├── usuarios.html                    # Gestión CRUD de usuarios
│   ├── productos.html                   # Gestión CRUD de catálogo e inventario
│   ├── ventas.html                      # Módulo Punto de Venta (POS)
│   └── reportes.html                    # Reportes y analítica de ventas
│
├── components/                          # Componentes UI Reutilizables
│   ├── navbar.html                      # Barra de navegación principal
│   ├── sidebar.html                     # Menú lateral del panel administrativo
│   ├── footer.html                      # Pie de página modular
│   └── modal.html                       # Ventanas modales dinámicas
│
├── backend/                             # Backend PHP (Patrón MVC)
│   ├── config/
│   │   └── database.php                 # Conexión PDO Singleton a la Base de Datos
│   │
│   ├── controllers/                     # Controladores del Sistema
│   │   ├── UsuarioController.php        # Lógica de autenticación y usuarios
│   │   ├── ProductoController.php       # Lógica de inventario y productos
│   │   ├── VentaController.php          # Lógica de transacciones e historial
│   │   ├── CajaController.php           # Control de apertura, cierre y arqueo de caja (POS)
│   │   └── ClienteController.php        # Búsqueda y gestión de clientes con DNI / RUC (CRM)
│   │
│   ├── models/                          # Modelos de Datos (Entidades PDO)
│   │   ├── Usuario.php                  # Modelo de Usuario
│   │   ├── Producto.php                 # Modelo de Producto (Stock mínimo, código de barras)
│   │   ├── Venta.php                    # Modelo de Venta, Detalle y Ticket Térmico
│   │   ├── Caja.php                     # Modelo de Caja Registradora y Arqueo
│   │   └── Cliente.php                  # Modelo de Clientes DNI / RUC
│   │
│   └── routes/
│       └── api.php                      # Enrutador REST API Central
│
├── database/                            # Scripts SQL
│   ├── estructura.sql                   # Definición de Tablas DDL
│   └── datos_iniciales.sql              # Datos iniciales DML (Seed Data)
│
├── docs/                                # Documentación Técnica
│   ├── requerimientos.md                # Requerimientos del Sistema y especificación API
│   ├── diagrama_bd.svg                  # Diagrama Entidad-Relación de la base de datos
│   └── guia_colaboracion.md             # Guía paso a paso para trabajar en equipo
│
├── .env.example                         # Plantilla de variables de entorno
├── .gitignore                           # Archivos ignorados por Git
└── README.md                            # Guía y documentación del proyecto
```

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Servidor Web (Apache / Nginx con soporte para PHP 7.4+ u 8.x)
- MySQL / MariaDB

### 2. Configuración de Base de Datos
1. Crear una base de datos nombrada `nutricenter_db`.
2. Importar la estructura desde `database/estructura.sql`.
3. Importar los datos iniciales desde `database/datos_iniciales.sql`.

### 3. Credenciales por Defecto (Entorno Demo)
- **Administrador:** `admin@nutricenter.com` / `123456`
- **Vendedor:** `vendedor@nutricenter.com` / `123456`
- **Cliente:** `cliente@gmail.com` / `123456`

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 Semantic, CSS3 Vanilla (Custom Properties, Flexbox, Grid), JavaScript ES6+.
- **Backend:** PHP Pure (MVC Architecture, PDO Singleton, Clean Code).
- **Base de Datos:** MySQL / MariaDB.
- **Arquitectura:** Component-driven modular architecture via Fetch API.
 
---

## 👥 Colaboración y Trabajo en Equipo

Para compartir este repositorio con tu equipo, configurar GitHub o programar en tiempo real con Live Share, consulta la [Guía de Colaboración](docs/guia_colaboracion.md).
