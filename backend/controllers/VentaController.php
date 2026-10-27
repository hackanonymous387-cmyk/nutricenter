<?php
/**
 * NUTRICENTER - Venta Controller
 * Adaptado para ventas POS y compras tienda web (Tarjeta, Yape, Efectivo)
 */

require_once __DIR__ . '/../models/Venta.php';

class VentaController {
    private $ventaModel;

    public function __construct($db) {
        $this->ventaModel = new Venta($db);
    }

    public function registrarVenta($data) {
        if (empty($data['total']) || empty($data['items'])) {
            http_response_code(400);
            return ["status" => "error", "message" => "Detalles de venta incompletos o carrito vacío"];
        }

        // Compatibilidad retroactiva
        if (isset($data['cliente']) && !isset($data['cliente_nombre'])) {
            $data['cliente_nombre'] = $data['cliente'];
        }

        $res = $this->ventaModel->registrarVenta($data);
        if ($res && isset($res['status']) && $res['status'] === 'success') {
            return [
                "status" => "success",
                "data" => $res,
                "message" => "Venta #" . $res['codigo_venta'] . " registrada exitosamente"
            ];
        }
        
        $msg = is_array($res) && isset($res['message']) ? $res['message'] : "Error al procesar la transacción";
        http_response_code(400);
        return ["status" => "error", "message" => $msg];
    }

    public function listar() {
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
        return [
            "status" => "success",
            "data" => $this->ventaModel->listar($limit)
        ];
    }

    public function dashboardStats() {
        return [
            "status" => "success",
            "data" => $this->ventaModel->dashboardStats()
        ];
    }
}
?>
