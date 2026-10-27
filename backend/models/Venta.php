<?php
/**
 * NUTRICENTER - Venta Entity Model
 * Supports POS and Web Checkout with Credit Card, Yape/Plin, Cash, and real-time stock deduction
 */

require_once __DIR__ . '/../config/Storage.php';

class Venta {
    private $conn;
    private $table_name = "ventas";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Registrar Venta POS o Compra Web
     */
    public function registrarVenta($data) {
        $cliente_nombre = htmlspecialchars(strip_tags(trim($data['cliente_nombre'] ?? $data['cliente'] ?? 'PÚBLICO GENERAL')), ENT_QUOTES, 'UTF-8');
        $cliente_documento = htmlspecialchars(strip_tags(trim($data['cliente_documento'] ?? '00000000')), ENT_QUOTES, 'UTF-8');
        $tipo_comprobante = in_array($data['tipo_comprobante'] ?? '', ['Boleta', 'Factura', 'Nota de Venta', 'Pedido Web']) ? $data['tipo_comprobante'] : 'Boleta';
        $metodo_pago = htmlspecialchars(strip_tags(trim($data['metodo_pago'] ?? 'Efectivo')), ENT_QUOTES, 'UTF-8');
        
        $total = floatval($data['total'] ?? 0);
        $subtotal = floatval($data['subtotal'] ?? ($total / 1.18));
        $igv = floatval($data['igv'] ?? ($total - $subtotal));
        $descuento = floatval($data['descuento'] ?? 0);
        $monto_recibido = floatval($data['monto_recibido'] ?? $total);
        $vuelto = max(0.00, $monto_recibido - $total);
        $items = $data['items'] ?? [];

        if (empty($items) || !is_array($items)) {
            return ["status" => "error", "message" => "El carrito de compra está vacío"];
        }

        $saleData = [
            'caja_id' => !empty($data['caja_id']) ? intval($data['caja_id']) : 1,
            'usuario_id' => !empty($data['usuario_id']) ? intval($data['usuario_id']) : null,
            'cliente_id' => !empty($data['cliente_id']) ? intval($data['cliente_id']) : null,
            'cliente_nombre' => $cliente_nombre,
            'cliente_documento' => $cliente_documento,
            'tipo_comprobante' => $tipo_comprobante,
            'subtotal' => $subtotal,
            'igv' => $igv,
            'descuento' => $descuento,
            'total' => $total,
            'metodo_pago' => $metodo_pago,
            'monto_recibido' => $monto_recibido,
            'vuelto' => $vuelto
        ];

        // 1. Process in Unified Storage (guarantees persistence and real stock discount)
        $result = Storage::addVenta($saleData, $items);

        // 2. Synchronize to MySQL if connection active
        if ($this->conn) {
            try {
                $this->conn->beginTransaction();
                $query = "INSERT INTO " . $this->table_name . " 
                          (codigo_venta, caja_id, usuario_id, cliente_id, cliente_nombre, cliente_documento, tipo_comprobante, subtotal, igv, descuento, total, metodo_pago, monto_recibido, vuelto, estado) 
                          VALUES (:codigo, :caja_id, :usuario_id, :cliente_id, :cliente_nombre, :cliente_doc, :tipo_comp, :subtotal, :igv, :descuento, :total, :metodo, :monto_rec, :vuelto, 'Completado')";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":codigo", $result['codigo_venta']);
                $stmt->bindParam(":caja_id", $saleData['caja_id']);
                $stmt->bindParam(":usuario_id", $saleData['usuario_id']);
                $stmt->bindParam(":cliente_id", $saleData['cliente_id']);
                $stmt->bindParam(":cliente_nombre", $saleData['cliente_nombre']);
                $stmt->bindParam(":cliente_doc", $saleData['cliente_documento']);
                $stmt->bindParam(":tipo_comp", $saleData['tipo_comprobante']);
                $stmt->bindParam(":subtotal", $saleData['subtotal']);
                $stmt->bindParam(":igv", $saleData['igv']);
                $stmt->bindParam(":descuento", $saleData['descuento']);
                $stmt->bindParam(":total", $saleData['total']);
                $stmt->bindParam(":metodo", $saleData['metodo_pago']);
                $stmt->bindParam(":monto_rec", $saleData['monto_recibido']);
                $stmt->bindParam(":vuelto", $saleData['vuelto']);
                $stmt->execute();
                $this->conn->commit();
            } catch (Exception $e) {
                if ($this->conn->inTransaction()) $this->conn->rollBack();
                error_log("MySQL sync sale error: " . $e->getMessage());
            }
        }

        return [
            "status" => "success",
            "codigo_venta" => $result['codigo_venta'],
            "tipo_comprobante" => $result['tipo_comprobante'],
            "cliente_nombre" => $result['cliente_nombre'],
            "cliente_documento" => $result['cliente_documento'],
            "subtotal" => $result['subtotal'],
            "igv" => $result['igv'],
            "total" => $result['total'],
            "monto_recibido" => $result['monto_recibido'],
            "vuelto" => $result['vuelto'],
            "metodo_pago" => $result['metodo_pago'],
            "fecha" => $result['fecha'],
            "items" => $result['items']
        ];
    }

    /**
     * Listar ventas
     */
    public function listar($limit = 50) {
        return Storage::getVentas($limit);
    }

    /**
     * Obtener estadísticas en vivo para el Dashboard
     */
    public function dashboardStats() {
        return Storage::getDashboardStats();
    }
}
?>
