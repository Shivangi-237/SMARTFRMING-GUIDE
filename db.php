<?php
$host = 'localhost'; // Default MySQL host
$dbname = 'smart-farming'; // Ensure this matches the database name
$username = 'root'; // Default XAMPP MySQL username
$password = ''; // Default XAMPP MySQL password (empty)

/*try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}*/
$conn=new mysqli($host, $username, $password, $dbname);
if($conn->connect_error)
{
    die("Database connection failed: " . $conn->connect_error);
}
echo "connected successfully";
?>