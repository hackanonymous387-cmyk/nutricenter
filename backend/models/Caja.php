<?php
/**
 * NUTRICENTER - Caja Entity Model (Inspirado en Gain POS)
 * Control de aperturas, cierres, arqueos de caja y auditoría de turnos
 */

class Caja {
    private $conn;
    private $table_name = "cajas";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Obtener la caja activa actual (opcionalmente por usuario)
     */
    public function getCajaActiva($usuario_id = null) {
        if (!$this->conn) {
            return [
                "id" => 1,
                "usuario_id" => $usuario_id ?: 1,
                "monto_apertura" => 100.00,
                "monto_cierre" => null,
                "total_ventas" => 277.50,
                "estado" => "abierta",
                "fecha_apertura" => date("Y-m-d H:i:s")
            ];
        }

        $query = "SELECT c.*, u.nombre as cajero_nombre 
                  FROM " . $this->table_name . " c
                  LEFT JOIN usuarios u ON c.usuario_id = u.id
                  WHERE c.estado = 'abierta' ";
        
        if ($usuario_id) {
            $query .= " AND c.usuario_id = :usuario_id ";
        }
        $query .= " ORDER BY c.id DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        if ($usuario_id) {
            $stmt->bindParam(":usuario_id", $usuario_id);
        }
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Abrir una nueva sesión de caja
     */
    public function abrirCaja($usuario_id, $monto_apertura) {
        $usuario_id = intval($usuario_id);
        $monto_apertura = floatval($monto_apertura);

        if (!$this->conn) {
            return [
                "status" => "success",
                "message" => "Caja abierta correctamente (Modo simulación)",
                "caja_id" => 1
            ];
        }

        // Verificar si ya existe una caja abierta para este usuario
        $cajaExistente = $this->getCajaActiva($usuario_id);
        if ($cajaExistente) {
            return [
                "status" => "error",
                "message" => "Ya existe una caja abierta para este usuario (Caja #" . $cajaExistente['id'] . ")"
            ];
        }

        $query = "INSERT INTO " . $this->table_name . " (usuario_id, monto_apertura, total_ventas, estado, fecha_apertura)
                  VALUES (:usuario_id, :monto_apertura, 0.00, 'abierta', NOW())";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":usuario_id", $usuario_id);
        $stmt->bindParam(":monto_apertura", $monto_apertura);

        if ($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "Caja abierta con éxito",
                "caja_id" => $this->conn->lastInsertId()
            ];
        }

        return ["status" => "error", "message" => "No se pudo abrir la caja"];
    }

    /**
     * Cerrar caja y generar arqueo con diferencias
     */
    public function cerrarCaja($caja_id, $monto_cierre, $observaciones = '') {
        $caja_id = intval($caja_id);
        $monto_cierre = floatval($monto_cierre);
        $observaciones = htmlspecialchars(strip_tags(trim($observaciones)), ENT_QUOTES, 'UTF-8');

        if (!$this->conn) {
            return [
                "status" => "success",
                "message" => "Caja cerrada correctamente",
                "diferencia" => 0.00
            ];
        }

        // Calcular total vendido en esta caja
        $queryCalc = "SELECT SUM(total) as total_ventas FROM ventas WHERE caja_id = :caja_id AND estado = 'Completado'";
        $stmtCalc = $this->conn->prepare($queryCalc);
        $stmtCalc->bindParam(":caja_id", $caja_id);
        $stmtCalc->execute();
        $calc = $stmtCalc->fetch();
        $totalVentas = floatval($calc['total_ventas'] ?? 0.00);

        // Obtener monto apertura
        $queryApertura = "SELECT monto_apertura FROM " . $this->table_name . " WHERE id = :caja_id";
        $stmtAp = $this->conn->prepare($queryApertura);
        $stmtAp->bindParam(":caja_id", $caja_id);
        $stmtAp->execute();
        $cajaInfo = $stmtAp->fetch();
        $montoApertura = floatval($cajaInfo['monto_apertura'] ?? 0.00);

        $montoEsperado = $montoApertura + $totalVentas;
        $diferencia = $monto_cierre - $montoEsperado;

        $query = "UPDATE " . $this->table_name . " 
                  SET monto_cierre = :monto_cierre,
                      total_ventas = :total_ventas,
                      diferencia = :diferencia,
                      estado = 'cerrada',
                      fecha_cierre = NOW(),
                      observaciones = :observaciones
                  WHERE id = :caja_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":monto_cierre", $monto_cierre);
        $stmt->bindParam(":total_ventas", $totalVentas);
        $stmt->bindParam(":diferencia", $diferencia);
        $stmt->bindParam(":observaciones", $observaciones);
        $stmt->bindParam(":caja_id", $caja_id);

        if ($stmt->execute()) {
            return [
                "status" => "success",
                "message" => "Caja cerrada exitosamente",
                "monto_apertura" => $montoApertura,
                "total_ventas" => $totalVentas,
                "monto_esperado" => $montoEsperado,
                "monto_cierre" => $monto_cierre,
                "diferencia" => $diferencia
            ];
        }

        return ["status" => "error", "message" => "Error al cerrar la caja"];
    }

    /**
     * Resumen de caja para arqueo rápido
     */
    public function getResumenCaja($caja_id) {
        if (!$this->conn) {
            return [
                "monto_apertura" => 100.00,
                "total_ventas" => 277.50,
                "total_efectivo" => 185.00,
                "total_yape" => 92.50,
                "total_tarjeta" => 0.00,
                "cantidad_ventas" => 2
            ];
        }

        $query = "SELECT 
                    COUNT(id) as cantidad_ventas,
                    COALESCE(SUM(total), 0) as total_ventas,
                    COALESCE(SUM(CASE WHEN metodo_pago = 'Efectivo' THEN total ELSE 0 END), 0) as total_efectivo,
                    COALESCE(SUM(CASE WHEN metodo_pago IN ('Yape', 'Plin') THEN total ELSE 0 END), 0) as total_yape,
                    COALESCE(SUM(CASE WHEN metodo_pago = 'Tarjeta' THEN total ELSE 0 END), 0) as total_tarjeta,
                    COALESCE(SUM(CASE WHEN metodo_pago = 'Transferencia' THEN total ELSE 0 END), 0) as total_transferencia
                  FROM ventas 
                  WHERE caja_id = :caja_id AND estado = 'Completado'";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":caja_id", $caja_id);
        $stmt->execute();
        return $stmt->fetch();
    }
}
?>
