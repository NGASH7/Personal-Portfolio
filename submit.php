<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);

    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'iankamnganga@gmail.com';
        $mail->Password = 'jzvq sjub momh vogg';  // Gmail App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('iankamnganga@gmail.com', 'Website Contact');
        $mail->addReplyTo($email, $name);
        $mail->addAddress('iankamnganga@gmail.com');

        $mail->isHTML(true);
        $mail->Subject = "Message from $name";
        $mail->Body = "
            <h3>Message from your website</h3>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Message:</strong> {$message}</p>
        ";

        // Handle Attachments
        if (!empty($_FILES['attachment']['name'][0])) {
            foreach ($_FILES['attachment']['tmp_name'] as $key => $tmp_name) {
                $fileTmpPath = $_FILES['attachment']['tmp_name'][$key];
                $fileName    = $_FILES['attachment']['name'][$key];
                $fileSize    = $_FILES['attachment']['size'][$key];
                $fileError   = $_FILES['attachment']['error'][$key];

                if ($fileError === UPLOAD_ERR_OK) {
                    if ($fileSize <= 20 * 1024 * 1024) {
                        $mail->addAttachment($fileTmpPath, $fileName);
                    } else {
                        echo "Error: File '$fileName' exceeds 20MB limit.";
                        exit;
                    }
                }
            }
        }

        $mail->send();
        echo "success";

    } catch (Exception $e) {
        echo "Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
