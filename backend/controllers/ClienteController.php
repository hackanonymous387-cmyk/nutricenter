<?php
/**
 * NUTRICENTER - Cliente Controller
 */

require_once __DIR__ . '/../models/Cliente.php';

class ClienteController {
    private $clienteModel;

    public function __construct($db) {
        $this->clienteModel = new Cliente($db);
    }

    /**
     * Buscar clientes
     */
    public function buscar() {
        $termino = $_GET['q'] ?? '';
        $clientes = $this->clienteModel->buscar($termino);
        return [
            "status" => "success",
            "data" => $clientes
        ];
    }

    /**
     * Registrar cliente rápido
     */
    public function crear($input) {
        $tipo_doc = $input['tipo_documento'] ?? 'DNI';
        $num_doc = $input['numero_documento'] ?? '';
        $nombre = $input['nombre'] ?? '';
        $telefono = $input['telefono'] ?? '';
        $email = $input['email'] ?? '';
        $direccion = $input['direccion'] ?? '';

        if (empty($num_doc) || empty($nombre)) {
            http_response_code(400);
            return ["status" => "error", "message" => "Número de documento y Nombre son obligatorios"];
        }

        return $this->clienteModel->registrarOActualizar($tipo_doc, $num_doc, $nombre, $telefono, $email, $direccion);
    }

    /**
     * Listar clientes
     */
    public function listar() {
        $clientes = $this->clienteModel->listar();
        return [
            "status" => "success",
            "data" => $clientes
        ];
    }
}
?>
