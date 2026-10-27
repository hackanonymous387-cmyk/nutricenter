<?php
/**
 * NUTRICENTER - Usuario Controller (Complete CRUD & Auth)
 */

require_once __DIR__ . '/../models/Usuario.php';

class UsuarioController {
    private $usuarioModel;

    public function __construct($db) {
        $this->usuarioModel = new Usuario($db);
    }

    public function login($data) {
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');

        if (empty($email) || empty($password)) {
            return ["status" => "error", "message" => "Debe ingresar correo y contraseña"];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ["status" => "error", "message" => "Formato de correo electrónico inválido"];
        }

        $res = $this->usuarioModel->login($email, $password);
        if ($res) {
            return ["status" => "success", "data" => $res];
        }
        return ["status" => "error", "message" => "Credenciales incorrectas o usuario inactivo"];
    }

    public function registro($data) {
        $nombre = trim($data['nombre'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '');
        $telefono = trim($data['telefono'] ?? '');

        if (empty($nombre) || empty($email) || empty($password)) {
            return ["status" => "error", "message" => "Complete todos los campos obligatorios"];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ["status" => "error", "message" => "Ingrese un correo electrónico válido"];
        }

        if (strlen($password) < 6) {
            return ["status" => "error", "message" => "La contraseña debe tener un mínimo de 6 caracteres"];
        }

        $res = $this->usuarioModel->registrar($nombre, $email, $password, $telefono);
        if ($res) {
            return ["status" => "success", "message" => "Usuario registrado correctamente"];
        }
        return ["status" => "error", "message" => "El correo ya está registrado o hubo un error al crear la cuenta"];
    }

    public function crear($data) {
        $nombre = trim($data['nombre'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = trim($data['password'] ?? '123456');
        $telefono = trim($data['telefono'] ?? '');
        $rol = trim($data['rol'] ?? 'Vendedor');
        $estado = isset($data['estado']) ? intval($data['estado']) : 1;

        if (empty($nombre) || empty($email)) {
            return ["status" => "error", "message" => "El nombre y correo electrónico son obligatorios"];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ["status" => "error", "message" => "Correo electrónico no válido"];
        }

        $res = $this->usuarioModel->crear($nombre, $email, $password, $telefono, $rol, 2, $estado);
        if ($res) {
            return ["status" => "success", "message" => "Usuario creado exitosamente", "data" => $res];
        }
        return ["status" => "error", "message" => "El correo electrónico ya se encuentra registrado"];
    }

    public function actualizar($data) {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) {
            return ["status" => "error", "message" => "ID de usuario inválido para actualización"];
        }

        $res = $this->usuarioModel->actualizar($id, $data);
        if ($res) {
            return ["status" => "success", "message" => "Usuario actualizado correctamente", "data" => $res];
        }
        return ["status" => "error", "message" => "No se pudo actualizar el usuario"];
    }

    public function eliminar($id) {
        $id = intval($id);
        if ($id <= 0) {
            return ["status" => "error", "message" => "ID de usuario inválido para eliminación"];
        }

        // Prevent deleting root master admin (#1)
        if ($id === 1) {
            return ["status" => "error", "message" => "Por seguridad, la cuenta Administrador Maestro (#1) no puede ser eliminada"];
        }

        $res = $this->usuarioModel->eliminar($id);
        if ($res) {
            return ["status" => "success", "message" => "Usuario eliminado permanentemente"];
        }
        return ["status" => "error", "message" => "No se encontró el usuario a eliminar"];
    }

    public function obtener($id) {
        $res = $this->usuarioModel->obtener($id);
        if ($res) {
            return ["status" => "success", "data" => $res];
        }
        return ["status" => "error", "message" => "Usuario no encontrado"];
    }

    public function listar() {
        return ["status" => "success", "data" => $this->usuarioModel->listar()];
    }
}
?>
