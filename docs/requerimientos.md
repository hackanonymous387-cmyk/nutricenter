# Documento de Requerimientos y Especificación del Sistema - Nutricenter

## 1. Visión General del Proyecto
**Nutricenter Perú** es un sistema web integral de comercio, gestión de inventario, punto de venta (POS), administración de usuarios y analítica financiera para productos naturales y suplementos alimenticios.

---

## 2. Requerimientos Funcionales (RF)

### 2.1 Autenticación y Seguridad (RF-01)
- **RF-01.1**: El sistema debe permitir el inicio de sesión con correo electrónico y contraseña.
- **RF-01.2**: Validación en tiempo real del formato de datos en formularios.
- **RF-01.3**: Manejo de roles del sistema: `Admin`, `Vendedor`, y `Cliente`.
- **RF-01.4**: Protección de rutas administrativas redirigiendo a usuarios no autenticados.

### 2.2 Gestión de Catálogo e Inventario (RF-02)
- **RF-02.1**: Listado de productos por categorías (Aceites, Cápsulas, Potes, Sobres, Otros).
- **RF-02.2**: Registro, actualización y baja lógica de productos (CRUD).
- **RF-02.3**: Control automático de stock e indicadores de alerta de stock bajo.

### 2.3 Punto de Venta y Transacciones (RF-03)
- **RF-03.1**: Interfaz POS responsiva para selección rápida de productos y carrito de compras.
- **RF-03.2**: Cálculo dinámico de subtotal, IGV (18%) y monto total a pagar.
- **RF-03.3**: Registro de métodos de pago (Efectivo, Yape/Plin, Tarjeta de Crédito/Débito).
- **RF-03.4**: Descuento automático de inventario al procesar una venta.

### 2.4 Panel de Control y Analítica (RF-04)
- **RF-04.1**: Métricas KPI en tiempo real (Ventas del mes, Productos en stock, Usuarios registrados, Ordenes procesadas).
- **RF-04.2**: Reportes de ventas por rango de fechas y categorías.
- **RF-04.3**: Ranking de productos más vendidos y exportación de datos.

---

## 3. Requerimientos No Funcionales (RNF)

- **RNF-01**: **Aesthetic & Usability**: Diseño responsivo, paleta cromática verde esmeralda (#10b981) alineada a la marca de nutrición y salud natural.
- **RNF-02**: **Performance**: Carga modular de componentes (Navbar, Sidebar, Footer, Modal) mediante Fetch API sin recargas completas.
- **RNF-03**: **Arquitectura Backend**: Implementación del patrón MVC en PHP puro con consultas seguras PDO (evitando inyecciones SQL).
- **RNF-04**: **Compatibilidad**: Funcionalidad multisistema en navegadores modernos (Chrome, Firefox, Edge, Safari).

---

## 4. Endpoints de la API REST (`backend/routes/api.php`)

| Acción / Endpoint | Método | Descripción |
| :--- | :--- | :--- |
| `?action=login` | POST | Iniciar sesión y obtener token/datos de usuario |
| `?action=registro` | POST | Registrar nuevo usuario cliente |
| `?action=usuarios` | GET | Listar todos los usuarios del sistema |
| `?action=productos` | GET / POST | Consultar catálogo o agregar un nuevo producto |
| `?action=ventas` | GET / POST | Listar historial de ventas o procesar nueva transacción POS |
