<?php
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed. Use POST."]);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?? $_POST;

$dbHost     = $data['db_host'] ?? null;
$dbName     = $data['db_name'] ?? null;
$dbUser     = $data['db_user'] ?? null;
$dbPassword = $data['db_pass'] ?? null; 
$dbEngine   = $data['db_engine'] ?? 'mysql'; 
$table      = $data['table']
$sites      = $data['sites']
$passwords  = $data['pwds']
$site      = $data['site']
$password  = $data['pwd']


if (!$dbHost || !$dbName || !$dbUser) {
    http_response_code(400);
    echo json_encode([
        "error" => "Missing arguments. 'db_host', 'db_name', and 'db_user' are required."
    ]);
    exit();
}

try {
    $charset = 'utf8mb4';
    $dsn = "{$dbEngine}:host={$dbHost};dbname={$dbName};charset={$charset}";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $pdo = new PDO($dsn, $dbUser, $dbPassword, $options);

    if ($searchTerm) {
        $sql = "INSERT INTO `:table` (`:passwords`, `:sites`) VALUES (':password', ':site');";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':table' => $table, ':passwords' => $passwords, ':sites' => $sites, ':password' => $password, ':site' => $site]);
        $result = $stmt->fetch();

        echo json_encode([
            "status" => "Connected successfully!",
            "query_result" => $result ?: "No matching data found."
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "message" => "Successfully connected to database '{$dbName}' on '{$dbHost}' using PDO."
        ]);
    }

} catch (\PDOException $e) {
    http_response_code(401);
    echo json_encode([
        "status" => "Database connection failed",
        "error" => $e->getMessage() 
    ]);
}

