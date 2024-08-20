<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_FILES['pdfFile']) && $_FILES['pdfFile']['error'] == 0) {
        $uploadedFile = $_FILES['pdfFile'];
        $uploadDir = '192.168.1.53/RecursosSistemaTurnos/calif_atenc/';
        $uploadFile = $uploadDir . basename($uploadedFile['name']);

        // Verificar el tipo de archivo
        $fileType = strtolower(pathinfo($uploadFile, PATHINFO_EXTENSION));
        if ($fileType != 'pdf') {
            echo 'Solo se permiten archivos PDF.';
            exit;
        }

        // Crear directorio si no existe
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Mover el archivo subido al directorio de destino
        if (move_uploaded_file($uploadedFile['tmp_name'], $uploadFile)) {
            echo 'Archivo subido exitosamente.';
        } else {
            echo 'Error al mover el archivo.';
        }
    } else {
        echo 'No se ha subido ningún archivo o hubo un error en la subida.';
    }
} else {
    echo 'Método de solicitud no permitido.';
}
?>