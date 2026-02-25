<?php
// Povolení CORS pro komunikaci s React frontendem
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Připojení k databázi
$host = "databaza1.itnahodinu.cz";
$db_name = "NAZEV_TVOJ_DATABAZE"; // ZMĚNIT
$username = "UZIVATEL"; // ZMĚNIT
$password = "HESLO"; // ZMĚNIT

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["error" => "Chyba připojení k databázi: " . $exception->getMessage()]);
    exit;
}

// Získání akce z URL (např. api1.php?action=get_company)
$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Zpracování JSON těla z POST/PUT požadavků
$data = json_decode(file_get_contents("php://input"));

// ---------------------------------------------------------
// ROUTY
// ---------------------------------------------------------

if ($action == 'get_company' && $method == 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : die();
    
    $stmt = $conn->prepare("SELECT id, name, email, redirect_url, custom_question, positive_threshold, url_google, url_facebook, url_firmy, url_tripadvisor, qr_color FROM companies WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($row) {
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Firma nenalezena"]);
    }
}

elseif ($action == 'add_review' && $method == 'POST') {
    if(!empty($data->company_id) && !empty($data->rating)) {
        $id = uniqid(); // Generování ID
        
        $stmt = $conn->prepare("INSERT INTO reviews (id, company_id, rating, comment, source) VALUES (?, ?, ?, ?, ?)");
        
        if($stmt->execute([
            $id, 
            $data->company_id, 
            $data->rating, 
            isset($data->comment) ? $data->comment : null,
            isset($data->source) ? $data->source : null
        ])) {
            http_response_code(201);
            echo json_encode(["success" => true, "id" => $id]);
        } else {
            http_response_code(503);
            echo json_encode(["error" => "Nelze uložit recenzi"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Chybí povinná data"]);
    }
}

else {
    echo json_encode(["message" => "API běží. Použijte parametr ?action=..."]);
}
?>
