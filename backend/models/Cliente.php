<?php
/**
 * NUTRICENTER - Cliente Entity Model (CRM POS - Inspirado en Gain POS)
 * Gestión de clientes con DNI / RUC para emisión rápida de comprobantes
 */

class Cliente {
    private $conn;
    private $table_name = "clientes";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Buscar clientes por número de documento o nombre
     */
    public function buscar($termino) {
        $termino = trim($termino);
        if (!$this->conn) {
            return [
                ["id" => 1, "tipo_documento" => "DNI", "numero_documento" => "00000000", "nombre" => "CLIENTES VARIOS / PÚBLICO GENERAL", "telefono" => "999999999"],
                ["id" => 2, "tipo_documento" => "DNI", "numero_documento" => "72345678", "nombre" => "Carlos Mendoza Silva", "telefono" => "987654321"],
                ["id" => 3, "tipo_documento" => "RUC", "numero_documento" => "20601234567", "nombre" => "NATURAL HEALTH S.A.C.", "telefono" => "014567890"]
            ];
        }

        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE numero_documento LIKE :term OR nombre LIKE :term2 
                  ORDER BY nombre ASC LIMIT 10";

        $stmt = $this->conn->prepare($query);
        $likeTerm = "%" . $termino . "%";
        $stmt->bindParam(":term", $likeTerm);
        $stmt->bindParam(":term2", $likeTerm);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Obtener por número de documento exacto
     */
    public function obtenerPorDocumento($documento) {
        if (!$this->conn) return null;

        $query = "SELECT * FROM " . $this->table_name . " WHERE numero_documento = :doc LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":doc", $documento);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Registrar o actualizar cliente rápido desde el POS
     */
    public function registrarOActualizar($tipo_doc, $num_doc, $nombre, $telefono = '', $email = '', $direccion = '') {
        $tipo_doc = strtoupper(trim($tipo_doc ?: 'DNI'));
        $num_doc = trim($num_doc);
        $nombre = strtoupper(trim($nombre));
        $telefono = trim($telefono);
        $email = trim($email);
        $direccion = trim($direccion);

        if (empty($num_doc) || empty($nombre)) {
            return ["status" => "error", "message" => "Número de documento y nombre son obligatorios"];
        }

        if (!$this->conn) {
            return ["status" => "success", "cliente_id" => rand(10, 99)];
        }

        $existente = $this->obtenerPorDocumento($num_doc);
        if ($existente) {
            // Actualizar datos de contacto si cambiaron
            $query = "UPDATE " . $this->table_name . " 
                      SET nombre = :nombre, telefono = :telefono, email = :email, direccion = :dir 
                      WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":nombre", $nombre);
            $stmt->bindParam(":telefono", $telefono);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":dir", $direccion);
            $stmt->bindParam(":id", $existente['id']);
            $stmt->execute();

            return ["status" => "success", "cliente_id" => $existente['id'], "action" => "updated"];
        }

        // Crear nuevo
        $query = "INSERT INTO " . $this->table_name . " (tipo_documento, numero_documento, nombre, telefono, email, direccion)
                  VALUES (:tipo_doc, :num_doc, :nombre, :telefono, :email, :dir)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":tipo_doc", $tipo_doc);
        $stmt->bindParam(":num_doc", $num_doc);
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":telefono", $telefono);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":dir", $direccion);

        if ($stmt->execute()) {
            return ["status" => "success", "cliente_id" => $this->conn->lastInsertId(), "action" => "created"];
        }

        return ["status" => "error", "message" => "No se pudo registrar el cliente"];
    }

    /**
     * Listar todos los clientes
     */
    public function listar() {
        if (!$this->conn) {
            return $this->buscar('');
        }

        $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC LIMIT 50";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>
