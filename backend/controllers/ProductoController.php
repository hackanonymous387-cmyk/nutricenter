<?php
/**
 * NUTRICENTER - Producto Controller (Complete CRUD)
 */

require_once __DIR__ . '/../models/Producto.php';

class ProductoController {
    private $productoModel;

    public function __construct($db) {
        $this->productoModel = new Producto($db);
    }

    public function listar() {
        return ["status" => "success", "data" => $this->productoModel->listar()];
    }

    public function buscarPorCodigo() {
        $codigo = $_GET['codigo'] ?? '';
        if (empty($codigo)) {
            http_response_code(400);
            return ["status" => "error", "message" => "Código no proporcionado"];
        }
        $prod = $this->productoModel->buscarPorCodigo($codigo);
        if ($prod) {
            return ["status" => "success", "data" => $prod];
        }
        return ["status" => "error", "message" => "Producto no encontrado con el código: " . $codigo];
    }

    public function ajustarStock($data) {
        $producto_id = intval($data['producto_id'] ?? 0);
        $cantidad = intval($data['cantidad'] ?? 0);
        $tipo = $data['tipo'] ?? 'suma';

        if ($producto_id <= 0 || $cantidad <= 0) {
            http_response_code(400);
            return ["status" => "error", "message" => "Parámetros inválidos para ajuste de stock"];
        }

        $res = $this->productoModel->ajustarStock($producto_id, $cantidad, $tipo);
        if ($res) {
            return ["status" => "success", "message" => "Stock actualizado exitosamente", "data" => $res];
        }
        return ["status" => "error", "message" => "Error al actualizar stock"];
    }

    public function crear($data) {
        $nombre = strip_tags(trim($data['nombre'] ?? ''));
        $precio = floatval($data['precio'] ?? 0);
        $precio_compra = floatval($data['precio_compra'] ?? 0);
        $stock = intval($data['stock'] ?? 0);
        $stock_minimo = intval($data['stock_minimo'] ?? 5);
        $categoria_id = intval($data['categoria_id'] ?? 1);
        $sku = strip_tags(trim($data['sku'] ?? ''));
        $codigo_barras = strip_tags(trim($data['codigo_barras'] ?? ''));
        $imagen = strip_tags(trim($data['imagen'] ?? ''));

        if (empty($nombre)) {
            return ["status" => "error", "message" => "El nombre del producto es obligatorio"];
        }

        if ($precio <= 0) {
            return ["status" => "error", "message" => "El precio debe ser mayor a cero"];
        }

        if ($stock < 0) {
            return ["status" => "error", "message" => "El stock no puede ser negativo"];
        }

        if (empty($sku)) {
            $sku = 'PRD-' . strtoupper(substr(md5(uniqid()), 0, 6));
        }

        $res = $this->productoModel->crear($sku, $nombre, $categoria_id, $precio, $stock, $codigo_barras, $precio_compra, $stock_minimo, $imagen);

        if ($res) {
            return ["status" => "success", "message" => "Producto registrado exitosamente", "data" => $res];
        }
        return ["status" => "error", "message" => "Error al guardar el producto en el catálogo"];
    }

    public function actualizar($data) {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) {
            return ["status" => "error", "message" => "ID de producto inválido para actualización"];
        }

        $res = $this->productoModel->actualizar($id, $data);
        if ($res) {
            return ["status" => "success", "message" => "Producto modificado correctamente", "data" => $res];
        }
        return ["status" => "error", "message" => "Error al actualizar el producto"];
    }

    public function eliminar($id) {
        $id = intval($id);
        if ($id <= 0) {
            return ["status" => "error", "message" => "ID de producto inválido para eliminación"];
        }

        $res = $this->productoModel->eliminar($id);
        if ($res) {
            return ["status" => "success", "message" => "Producto eliminado exitosamente del catálogo"];
        }
        return ["status" => "error", "message" => "No se pudo eliminar el producto"];
    }
}
?>
