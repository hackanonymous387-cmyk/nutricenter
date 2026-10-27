<?php
/**
 * NUTRICENTER - Database Configuration & PDO Singleton Connection
 * Supports secure environment variable configuration
 */

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn = null;

    public function __construct() {
        $this->host = getenv('DB_HOST') ?: "localhost";
        $this->db_name = getenv('DB_NAME') ?: "nutricenter_db";
        $this->username = getenv('DB_USER') ?: "root";
        $this->password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : "";
    }

    /**
     * Get Database Connection (PDO)
     * @return PDO|null
     */
    public function getConnection() {
        if ($this->conn === null) {
            try {
                $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];

                $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $exception) {
                // Log internal connection failure safely without leaking credentials to client
                error_log("Database connection error: " . $exception->getMessage());
                return null;
            }
        }
        return $this->conn;
    }
}
?>
