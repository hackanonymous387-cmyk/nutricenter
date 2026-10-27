<?php
/**
 * NUTRICENTER - Central REST API Router Dispatcher (Hardened Security & Full CRUD POS)
 */

// 1. Strict Security Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Type: application/json; charset=UTF-8");

// 2. CORS Handling
$http_origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: " . ($http_origin ?: '*'));
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/Storage.php';
require_once __DIR__ . '/../controllers/UsuarioController.php';
require_once __DIR__ . '/../controllers/ProductoController.php';
require_once __DIR__ . '/../controllers/VentaController.php';
require_once __DIR__ . '/../controllers/CajaController.php';
require_once __DIR__ . '/../controllers/ClienteController.php';

// Initialize storage seed data if needed
Storage::init();

$database = new Database();
$db = $database->getConnection();

$action = filter_input(INPUT_GET, 'action', FILTER_SANITIZE_SPECIAL_CHARS) ?? '';
$raw_input = file_get_contents("php://input");
$input = !empty($raw_input) ? json_decode($raw_input, true) : $_POST;

if (!is_array($input)) {
    $input = [];
}

$method = $_SERVER['REQUEST_METHOD'];

$usuarioController = new UsuarioController($db);
$productoController = new ProductoController($db);
$ventaController = new VentaController($db);
$cajaController = new CajaController($db);
$clienteController = new ClienteController($db);

$response = ["status" => "error", "message" => "Acción no válida"];

switch ($action) {
    // ==========================================
    // 1. AUTENTICACIÓN & GESTIÓN DE USUARIOS
    // ==========================================
    case 'login':
        $response = $usuarioController->login($input);
        break;

    case 'registro':
        $response = $usuarioController->registro($input);
        break;

    case 'usuarios':
        if ($method === 'POST') {
            $response = $usuarioController->crear($input);
        } elseif ($method === 'PUT') {
            $response = $usuarioController->actualizar($input);
        } elseif ($method === 'DELETE') {
            $id = intval($_GET['id'] ?? $input['id'] ?? 0);
            $response = $usuarioController->eliminar($id);
        } else {
            $response = $usuarioController->listar();
        }
        break;

    case 'usuario_crear':
        $response = $usuarioController->crear($input);
        break;

    case 'usuario_actualizar':
        $response = $usuarioController->actualizar($input);
        break;

    case 'usuario_eliminar':
        $id = intval($_GET['id'] ?? $input['id'] ?? 0);
        $response = $usuarioController->eliminar($id);
        break;

    case 'usuario_obtener':
        $id = intval($_GET['id'] ?? $input['id'] ?? 0);
        $response = $usuarioController->obtener($id);
        break;

    // ==========================================
    // 2. PRODUCTOS & INVENTARIO CRUD
    // ==========================================
    case 'productos':
        if ($method === 'POST') {
            $response = $productoController->crear($input);
        } elseif ($method === 'PUT') {
            $response = $productoController->actualizar($input);
        } elseif ($method === 'DELETE') {
            $id = intval($_GET['id'] ?? $input['id'] ?? 0);
            $response = $productoController->eliminar($id);
        } else {
            $response = $productoController->listar();
        }
        break;

    case 'producto_crear':
        $response = $productoController->crear($input);
        break;

    case 'producto_actualizar':
        $response = $productoController->actualizar($input);
        break;

    case 'producto_eliminar':
        $id = intval($_GET['id'] ?? $input['id'] ?? 0);
        $response = $productoController->eliminar($id);
        break;

    case 'buscar_codigo':
        $response = $productoController->buscarPorCodigo();
        break;

    case 'ajustar_stock':
        $response = $productoController->ajustarStock($input);
        break;

    // ==========================================
    // 3. VENTAS, POS & CHECKOUT
    // ==========================================
    case 'ventas':
        if ($method === 'POST') {
            $response = $ventaController->registrarVenta($input);
        } else {
            $response = $ventaController->listar();
        }
        break;

    case 'dashboard_stats':
        $response = $ventaController->dashboardStats();
        break;

    // ==========================================
    // 4. CONTROL DE CAJA (APERTURA & CIERRE)
    // ==========================================
    case 'caja_estado':
        $stats = Storage::getDashboardStats();
        $response = [
            "status" => "success",
            "caja_abierta" => $stats['caja_abierta'],
            "caja" => $stats['caja_info'] ?? ["id" => 1, "estado" => "cerrada", "total_ventas" => 0]
        ];
        break;

    case 'caja_abrir':
        $response = $cajaController->abrir($input);
        break;

    case 'caja_cerrar':
        $response = $cajaController->cerrar($input);
        break;

    // ==========================================
    // 5. CLIENTES (CRM POS & BÚSQUEDA)
    // ==========================================
    case 'clientes':
    case 'cliente_buscar':
        $doc = trim($_GET['documento'] ?? '');
        $data = Storage::getAll();
        $clientes = $data['clientes'] ?? [];
        if (!empty($doc)) {
            $found = null;
            foreach ($clientes as $c) {
                if ($c['numero_documento'] === $doc) {
                    $found = $c;
                    break;
                }
            }
            if ($found) {
                $response = ["status" => "success", "data" => $found];
            } else {
                $response = ["status" => "error", "message" => "Cliente no encontrado"];
            }
        } else {
            $response = ["status" => "success", "data" => $clientes];
        }
        break;

    default:
        http_response_code(400);
        $response = ["status" => "error", "message" => "Endpoint o acción no reconocida"];
        break;
}

echo json_encode($response);
exit();
?>
