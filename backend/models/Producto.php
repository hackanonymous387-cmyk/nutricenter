<?php
/**
 * NUTRICENTER - Producto Entity Model
 * Complete inventory management with dual MySQL & Unified Storage persistence
 */

require_once __DIR__ . '/../config/Storage.php';

class Producto {
    private $conn;
    private $table_name = "productos";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all active products with low stock indicator
     */
    public function listar() {
        $prods = Storage::getProductos();
        $formatted = [];
        foreach ($prods as $p) {
            $stock = intval($p['stock'] ?? 0);
            $min = intval($p['stock_minimo'] ?? 5);
            $formatted[] = [
                'id' => (int)$p['id'],
                'sku' => htmlspecialchars($p['sku'] ?? '', ENT_QUOTES, 'UTF-8'),
                'codigo_barras' => htmlspecialchars($p['codigo_barras'] ?? '', ENT_QUOTES, 'UTF-8'),
                'nombre' => htmlspecialchars($p['nombre'] ?? '', ENT_QUOTES, 'UTF-8'),
                'categoria' => htmlspecialchars($p['categoria'] ?? 'Suplementos', ENT_QUOTES, 'UTF-8'),
                'categoria_id' => intval($p['categoria_id'] ?? 1),
                'precio' => floatval($p['precio'] ?? 0),
                'precio_compra' => floatval($p['precio_compra'] ?? 0),
                'stock' => $stock,
                'stock_minimo' => $min,
                'alerta_stock' => ($stock <= $min) ? 1 : 0,
                'imagen' => htmlspecialchars($p['imagen'] ?? 'default_product.png', ENT_QUOTES, 'UTF-8'),
                'estado' => intval($p['estado'] ?? 1)
            ];
        }
        return $formatted;
    }

    /**
     * Búsqueda por código de barras o SKU para POS instantáneo
     */
    public function buscarPorCodigo($codigo) {
        $codigo = trim($codigo);
        $prods = Storage::getProductos();
        foreach ($prods as $p) {
            if (($p['codigo_barras'] ?? '') === $codigo || ($p['sku'] ?? '') === $codigo) {
                return $p;
            }
        }
        return null;
    }

    /**
     * Crear producto con datos completos de inventario
     */
    public function crear($sku, $nombre, $categoria_id, $precio, $stock, $codigo_barras = '', $precio_compra = 0, $stock_minimo = 5, $imagen = 'default_product.png') {
        $categoriasNombres = [
            1 => 'Proteínas',
            2 => 'Creatinas',
            3 => 'Pre-Entrenos',
            4 => 'Colágeno & Salud',
            5 => 'Quemadores',
            6 => 'Multivitamínicos',
            7 => 'Aceites Naturales'
        ];
        $categoriaNombre = $categoriasNombres[$categoria_id] ?? 'Suplementos';

        $newProd = [
            'sku' => $sku,
            'codigo_barras' => $codigo_barras,
            'nombre' => $nombre,
            'categoria' => $categoriaNombre,
            'categoria_id' => $categoria_id,
            'precio' => floatval($precio),
            'precio_compra' => floatval($precio_compra),
            'stock' => intval($stock),
            'stock_minimo' => intval($stock_minimo),
            'imagen' => $imagen ?: 'default_product.png',
            'estado' => 1
        ];

        $res = Storage::addProducto($newProd);

        if ($this->conn) {
            try {
                $query = "INSERT INTO " . $this->table_name . " 
                          (sku, codigo_barras, nombre, categoria_id, precio, precio_compra, stock, stock_minimo, imagen) 
                          VALUES (:sku, :barras, :nombre, :categoria_id, :precio, :pcompra, :stock, :smin, :imagen)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":sku", $sku);
                $stmt->bindParam(":barras", $codigo_barras);
                $stmt->bindParam(":nombre", $nombre);
                $stmt->bindParam(":categoria_id", $categoria_id);
                $stmt->bindParam(":precio", $precio);
                $stmt->bindParam(":pcompra", $precio_compra);
                $stmt->bindParam(":stock", $stock);
                $stmt->bindParam(":smin", $stock_minimo);
                $stmt->bindParam(":imagen", $imagen);
                $stmt->execute();
            } catch (Exception $e) {
                error_log("MySQL create product error: " . $e->getMessage());
            }
        }

        return $res;
    }

    /**
     * Actualizar producto
     */
    public function actualizar($id, $data) {
        $id = intval($id);
        if ($id <= 0) return false;

        $updates = [];
        if (!empty($data['nombre'])) $updates['nombre'] = strip_tags(trim($data['nombre']));
        if (!empty($data['sku'])) $updates['sku'] = strip_tags(trim($data['sku']));
        if (isset($data['codigo_barras'])) $updates['codigo_barras'] = strip_tags(trim($data['codigo_barras']));
        if (isset($data['categoria_id'])) {
            $updates['categoria_id'] = intval($data['categoria_id']);
            $categoriasNombres = [
                1 => 'Proteínas', 2 => 'Creatinas', 3 => 'Pre-Entrenos',
                4 => 'Colágeno & Salud', 5 => 'Quemadores', 6 => 'Multivitamínicos', 7 => 'Aceites Naturales'
            ];
            $updates['categoria'] = $categoriasNombres[$updates['categoria_id']] ?? ($data['categoria'] ?? 'Suplementos');
        } elseif (!empty($data['categoria'])) {
            $updates['categoria'] = trim($data['categoria']);
        }
        if (isset($data['precio'])) $updates['precio'] = floatval($data['precio']);
        if (isset($data['precio_compra'])) $updates['precio_compra'] = floatval($data['precio_compra']);
        if (isset($data['stock'])) $updates['stock'] = intval($data['stock']);
        if (isset($data['stock_minimo'])) $updates['stock_minimo'] = intval($data['stock_minimo']);
        if (!empty($data['imagen'])) $updates['imagen'] = trim($data['imagen']);

        $res = Storage::updateProducto($id, $updates);

        if ($this->conn) {
            try {
                $query = "UPDATE " . $this->table_name . " 
                          SET nombre = :nombre, precio = :precio, stock = :stock, stock_minimo = :smin 
                          WHERE id = :id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":nombre", $updates['nombre']);
                $stmt->bindParam(":precio", $updates['precio']);
                $stmt->bindParam(":stock", $updates['stock']);
                $stmt->bindParam(":smin", $updates['stock_minimo']);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
            } catch (Exception $e) {
                error_log("MySQL update product error: " . $e->getMessage());
            }
        }

        return $res;
    }

    /**
     * Eliminar producto
     */
    public function eliminar($id) {
        $id = intval($id);
        if ($id <= 0) return false;

        $res = Storage::deleteProducto($id);

        if ($this->conn) {
            try {
                $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":id", $id);
                $stmt->execute();
            } catch (Exception $e) {
                error_log("MySQL delete product error: " . $e->getMessage());
            }
        }

        return $res;
    }

    /**
     * Ajuste manual de stock
     */
    public function ajustarStock($producto_id, $cantidad, $tipo = 'suma') {
        $res = Storage::adjustStock($producto_id, $cantidad, $tipo);

        if ($this->conn) {
            try {
                $operador = ($tipo === 'resta') ? '-' : '+';
                $query = "UPDATE " . $this->table_name . " 
                          SET stock = GREATEST(0, stock " . $operador . " :cant) 
                          WHERE id = :id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":cant", $cantidad);
                $stmt->bindParam(":id", $producto_id);
                $stmt->execute();
            } catch (Exception $e) {
                error_log("MySQL adjust stock error: " . $e->getMessage());
            }
        }

        return $res;
    }
}
?>
