<?php
/**
 * NUTRICENTER - Unified Persistent Storage Manager
 * Reads and writes directly to backend/data/nutricenter_db.json with file locking
 */

class Storage {
    private static function getFilePath() {
        return dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'nutricenter_db.json';
    }

    public static function init() {
        $path = self::getFilePath();
        $dir = dirname($path);
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
    }

    public static function getAll() {
        $path = self::getFilePath();
        if (!file_exists($path)) {
            return ['roles' => [], 'usuarios' => [], 'productos' => [], 'clientes' => [], 'cajas' => [], 'ventas' => []];
        }
        $content = file_get_contents($path);
        $data = json_decode($content, true);
        return is_array($data) ? $data : ['roles' => [], 'usuarios' => [], 'productos' => [], 'clientes' => [], 'cajas' => [], 'ventas' => []];
    }

    public static function saveAll($data) {
        $path = self::getFilePath();
        $dir = dirname($path);
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    }

    // ==========================================
    // USUARIOS CRUD
    // ==========================================
    public static function getUsuarios() {
        $data = self::getAll();
        return $data['usuarios'] ?? [];
    }

    public static function getUsuarioById($id) {
        $users = self::getUsuarios();
        foreach ($users as $u) {
            if ($u['id'] == $id) return $u;
        }
        return null;
    }

    public static function getUsuarioByEmail($email) {
        $users = self::getUsuarios();
        $email = strtolower(trim($email));
        foreach ($users as $u) {
            if (strtolower(trim($u['email'] ?? '')) === $email) return $u;
        }
        return null;
    }

    public static function addUsuario($userData) {
        $data = self::getAll();
        $maxId = 0;
        foreach ($data['usuarios'] as $u) {
            if ($u['id'] > $maxId) $maxId = $u['id'];
        }
        $userData['id'] = $maxId + 1;
        $userData['created_at'] = date('Y-m-d H:i:s');
        $userData['estado'] = $userData['estado'] ?? 1;
        $data['usuarios'][] = $userData;
        self::saveAll($data);
        return $userData;
    }

    public static function updateUsuario($id, $updates) {
        $data = self::getAll();
        $found = false;
        foreach ($data['usuarios'] as &$u) {
            if ($u['id'] == $id) {
                if (isset($updates['nombre'])) $u['nombre'] = $updates['nombre'];
                if (isset($updates['email'])) $u['email'] = $updates['email'];
                if (isset($updates['telefono'])) $u['telefono'] = $updates['telefono'];
                if (isset($updates['rol'])) $u['rol'] = $updates['rol'];
                if (isset($updates['rol_id'])) $u['rol_id'] = $updates['rol_id'];
                if (isset($updates['estado'])) $u['estado'] = $updates['estado'];
                if (!empty($updates['password'])) {
                    $u['password'] = password_hash($updates['password'], PASSWORD_BCRYPT);
                }
                $u['updated_at'] = date('Y-m-d H:i:s');
                $found = $u;
                break;
            }
        }
        if ($found) {
            self::saveAll($data);
        }
        return $found;
    }

    public static function deleteUsuario($id) {
        $data = self::getAll();
        $initialCount = count($data['usuarios']);
        $data['usuarios'] = array_values(array_filter($data['usuarios'], function($u) use ($id) {
            return $u['id'] != $id;
        }));
        if (count($data['usuarios']) < $initialCount) {
            self::saveAll($data);
            return true;
        }
        return false;
    }

    // ==========================================
    // PRODUCTOS CRUD
    // ==========================================
    public static function getProductos() {
        $data = self::getAll();
        return $data['productos'] ?? [];
    }

    public static function getProductoById($id) {
        $products = self::getProductos();
        foreach ($products as $p) {
            if ($p['id'] == $id) return $p;
        }
        return null;
    }

    public static function addProducto($prodData) {
        $data = self::getAll();
        $maxId = 0;
        foreach ($data['productos'] as $p) {
            if ($p['id'] > $maxId) $maxId = $p['id'];
        }
        $prodData['id'] = $maxId + 1;
        $prodData['sku'] = !empty($prodData['sku']) ? $prodData['sku'] : ('PRD-' . str_pad($prodData['id'], 3, '0', STR_PAD_LEFT));
        $prodData['codigo_barras'] = $prodData['codigo_barras'] ?? ('7750' . str_pad($prodData['id'], 4, '0', STR_PAD_LEFT));
        $prodData['imagen'] = !empty($prodData['imagen']) ? $prodData['imagen'] : 'default_product.png';
        $prodData['estado'] = 1;
        $prodData['created_at'] = date('Y-m-d H:i:s');
        $data['productos'][] = $prodData;
        self::saveAll($data);
        return $prodData;
    }

    public static function updateProducto($id, $updates) {
        $data = self::getAll();
        $found = false;
        foreach ($data['productos'] as &$p) {
            if ($p['id'] == $id) {
                if (isset($updates['nombre'])) $p['nombre'] = $updates['nombre'];
                if (isset($updates['sku'])) $p['sku'] = $updates['sku'];
                if (isset($updates['codigo_barras'])) $p['codigo_barras'] = $updates['codigo_barras'];
                if (isset($updates['categoria'])) $p['categoria'] = $updates['categoria'];
                if (isset($updates['categoria_id'])) $p['categoria_id'] = intval($updates['categoria_id']);
                if (isset($updates['precio'])) $p['precio'] = floatval($updates['precio']);
                if (isset($updates['precio_compra'])) $p['precio_compra'] = floatval($updates['precio_compra']);
                if (isset($updates['stock'])) $p['stock'] = intval($updates['stock']);
                if (isset($updates['stock_minimo'])) $p['stock_minimo'] = intval($updates['stock_minimo']);
                if (isset($updates['imagen']) && !empty($updates['imagen'])) $p['imagen'] = $updates['imagen'];
                if (isset($updates['estado'])) $p['estado'] = intval($updates['estado']);
                $p['updated_at'] = date('Y-m-d H:i:s');
                $found = $p;
                break;
            }
        }
        if ($found) {
            self::saveAll($data);
        }
        return $found;
    }

    public static function deleteProducto($id) {
        $data = self::getAll();
        $initialCount = count($data['productos']);
        $data['productos'] = array_values(array_filter($data['productos'], function($p) use ($id) {
            return $p['id'] != $id;
        }));
        if (count($data['productos']) < $initialCount) {
            self::saveAll($data);
            return true;
        }
        return false;
    }

    public static function adjustStock($id, $qty, $type = 'suma') {
        $data = self::getAll();
        $found = false;
        foreach ($data['productos'] as &$p) {
            if ($p['id'] == $id) {
                if ($type === 'resta') {
                    $p['stock'] = max(0, intval($p['stock']) - intval($qty));
                } else {
                    $p['stock'] = intval($p['stock']) + intval($qty);
                }
                $found = $p;
                break;
            }
        }
        if ($found) {
            self::saveAll($data);
        }
        return $found;
    }

    // ==========================================
    // VENTAS & POS TRANSACTIONAL
    // ==========================================
    public static function getVentas($limit = 50) {
        $data = self::getAll();
        $ventas = $data['ventas'] ?? [];
        usort($ventas, function($a, $b) {
            return strtotime($b['fecha'] ?? '') - strtotime($a['fecha'] ?? '');
        });
        return array_slice($ventas, 0, $limit);
    }

    public static function addVenta($saleData, $items) {
        $data = self::getAll();
        
        $maxId = 0;
        foreach ($data['ventas'] as $v) {
            if ($v['id'] > $maxId) $maxId = $v['id'];
        }
        $venta_id = $maxId + 1;

        $prefijo = ($saleData['tipo_comprobante'] === 'Factura') ? 'F001' : (($saleData['tipo_comprobante'] === 'Nota de Venta') ? 'NV01' : 'B001');
        $codigoVenta = $saleData['codigo_venta'] ?? ($prefijo . '-' . str_pad($venta_id + 1000, 7, '0', STR_PAD_LEFT));

        $total = floatval($saleData['total'] ?? 0);
        $subtotal = floatval($saleData['subtotal'] ?? ($total / 1.18));
        $igv = floatval($saleData['igv'] ?? ($total - $subtotal));
        $monto_recibido = floatval($saleData['monto_recibido'] ?? $total);
        $vuelto = max(0.00, $monto_recibido - $total);

        $newVenta = [
            'id' => $venta_id,
            'codigo_venta' => $codigoVenta,
            'caja_id' => $saleData['caja_id'] ?? 1,
            'usuario_id' => $saleData['usuario_id'] ?? null,
            'cliente_id' => $saleData['cliente_id'] ?? null,
            'cliente_nombre' => $saleData['cliente_nombre'] ?? 'PÚBLICO GENERAL',
            'cliente_documento' => $saleData['cliente_documento'] ?? '00000000',
            'tipo_comprobante' => $saleData['tipo_comprobante'] ?? 'Boleta',
            'subtotal' => round($subtotal, 2),
            'igv' => round($igv, 2),
            'descuento' => floatval($saleData['descuento'] ?? 0),
            'total' => round($total, 2),
            'metodo_pago' => $saleData['metodo_pago'] ?? 'Efectivo',
            'monto_recibido' => round($monto_recibido, 2),
            'vuelto' => round($vuelto, 2),
            'estado' => 'Completado',
            'fecha' => date('Y-m-d H:i:s'),
            'items' => []
        ];

        // Process items and reduce stock
        foreach ($items as $item) {
            $prodId = intval($item['producto_id']);
            $cant = intval($item['cantidad']);
            $precio = floatval($item['precio'] ?? $item['precio_unitario'] ?? 0);
            $itemSubtotal = floatval($item['subtotal'] ?? ($cant * $precio));

            // Reduce stock in products table
            foreach ($data['productos'] as &$p) {
                if ($p['id'] == $prodId) {
                    $p['stock'] = max(0, intval($p['stock']) - $cant);
                    if ($precio <= 0) $precio = floatval($p['precio']);
                    $item['nombre'] = $p['nombre'];
                    break;
                }
            }

            $newVenta['items'][] = [
                'producto_id' => $prodId,
                'nombre' => $item['nombre'] ?? ('Producto #' . $prodId),
                'cantidad' => $cant,
                'precio_unitario' => round($precio, 2),
                'subtotal' => round($itemSubtotal, 2)
            ];
        }

        // Update caja total if active
        if (!empty($data['cajas'])) {
            foreach ($data['cajas'] as &$caja) {
                if (($caja['estado'] ?? '') === 'abierta') {
                    $caja['total_ventas'] = floatval($caja['total_ventas'] ?? 0) + $total;
                    break;
                }
            }
        }

        array_unshift($data['ventas'], $newVenta);
        self::saveAll($data);

        return $newVenta;
    }

    // ==========================================
    // DASHBOARD LIVE METRICS
    // ==========================================
    public static function getDashboardStats() {
        $data = self::getAll();
        $ventas = $data['ventas'] ?? [];
        $productos = $data['productos'] ?? [];
        $clientes = $data['clientes'] ?? [];
        $cajas = $data['cajas'] ?? [];

        $totalIngresos = 0;
        $ventasHoy = 0;
        $today = date('Y-m-d');

        foreach ($ventas as $v) {
            $totalIngresos += floatval($v['total']);
            if (substr($v['fecha'] ?? '', 0, 10) === $today) {
                $ventasHoy += floatval($v['total']);
            }
        }

        $bajoStock = 0;
        $valorInventario = 0;
        foreach ($productos as $p) {
            $st = intval($p['stock']);
            $min = intval($p['stock_minimo'] ?? 5);
            $pr = floatval($p['precio']);
            $valorInventario += ($st * $pr);
            if ($st <= $min) {
                $bajoStock++;
            }
        }

        $cajaAbierta = false;
        $cajaInfo = null;
        foreach ($cajas as $c) {
            if (($c['estado'] ?? '') === 'abierta') {
                $cajaAbierta = true;
                $cajaInfo = $c;
                break;
            }
        }

        return [
            'total_ingresos' => round($totalIngresos, 2),
            'ventas_hoy' => round($ventasHoy, 2),
            'total_ventas_count' => count($ventas),
            'total_productos' => count($productos),
            'bajo_stock_count' => $bajoStock,
            'valor_inventario' => round($valorInventario, 2),
            'total_clientes' => count($clientes),
            'caja_abierta' => $cajaAbierta,
            'caja_info' => $cajaInfo,
            'ultimas_ventas' => array_slice($ventas, 0, 6)
        ];
    }
}
?>
