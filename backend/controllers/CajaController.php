<?php
/**
 * NUTRICENTER - Caja Controller
 */

require_once __DIR__ . '/../models/Caja.php';

class CajaController {
    private $cajaModel;

    public function __construct($db) {
        $this->cajaModel = new Caja($db);
    }

    /**
     * Obtener el estado actual de la caja
     */
    public function estado() {
        $usuario_id = $_GET['usuario_id'] ?? null;
        $caja = $this->cajaModel->getCajaActiva($usuario_id);

        if ($caja) {
            $resumen = $this->cajaModel->getResumenCaja($caja['id']);
            return [
                "status" => "success",
                "caja_abierta" => true,
                "caja" => $caja,
                "resumen" => $resumen
            ];
        }

        return [
            "status" => "success",
            "caja_abierta" => false,
            "message" => "No hay ninguna caja abierta actualmente"
        ];
    }

    /**
     * Apertura de turno de caja
     */
    public function abrir($input) {
        $usuario_id = $input['usuario_id'] ?? 1;
        $monto_apertura = $input['monto_apertura'] ?? 0;

        if ($monto_apertura < 0) {
            http_response_code(400);
            return ["status" => "error", "message" => "El monto de apertura no puede ser negativo"];
        }

        return $this->cajaModel->abrirCaja($usuario_id, $monto_apertura);
    }

    /**
     * Cierre de turno y arqueo de caja
     */
    public function cerrar($input) {
        $caja_id = $input['caja_id'] ?? null;
        $monto_cierre = $input['monto_cierre'] ?? 0;
        $observaciones = $input['observaciones'] ?? '';

        if (!$caja_id) {
            http_response_code(400);
            return ["status" => "error", "message" => "ID de caja es requerido"];
        }

        return $this->cajaModel->cerrarCaja($caja_id, $monto_cierre, $observaciones);
    }
}
?>
