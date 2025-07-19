<?php
// spremi_zahtjev.php

// Podaci za povezivanje s bazom
$servername = "localhost";
$username = "rolkomba_admin"; // Zamijenite s vašim korisničkim imenom
$password = "Gradjevinac2018*"; // Zamijenite s vašom lozinkom
$dbname = "rolkomba_ponude"; // Zamijenite s imenom vaše baze

// Prikupi podatke iz forme
$ime_prezime = $_POST['ime'];
$email = $_POST['email'] ?? null;
$telefon = $_POST['telefon'] ?? null;
$poruka = $_POST['poruka'] ?? null;
$proizvodi = $_POST['proizvodi'];

// Stvori konekciju
$conn = new mysqli($servername, $username, $password, $dbname);

// Provjeri konekciju
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Pripremi SQL upit
$stmt = $conn->prepare("INSERT INTO zahtjevi (ime_prezime, email, telefon, poruka, proizvodi) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $ime_prezime, $email, $telefon, $poruka, $proizvodi);

// Izvrši upit
if ($stmt->execute()) {
    // Pošalji email obavijest (opcionalno)
    $to = "info@rolkom.ba";
    $subject = "Novi zahtjev za ponudu - ROLKOM.ba";
    $message = "Novi zahtjev za ponudu od: $ime_prezime\n\n";
    $message .= "Proizvodi:\n$proizvodi\n\n";
    $message .= "Kontakt: $telefon / $email";
    mail($to, $subject, $message);
    
    // Preusmjeri na stranicu zahvale
    header('Location: hvala.html');
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
