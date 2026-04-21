<?php
$config = require __DIR__ . '/config.php';
require __DIR__ . '/lib/api.php';

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function track_package(string $baseUrl, string $trackingToken, int $timeout): array
{
    $url = rtrim($baseUrl, '/') . '/api/tracking/' . urlencode($trackingToken);
    $response = api_get_json($url, $timeout);

    if (!empty($response['error'])) {
        return [
            'success' => false,
            'message' => 'Error de conexión: ' . $response['error'],
        ];
    }

    $status = (int) ($response['status'] ?? 0);
    $data = $response['data'] ?? [];

    if ($status === 200) {
        return ['success' => true, 'data' => $data];
    }

    if ($status === 404) {
        return [
            'success' => false,
            'message' => 'Token de rastreo inválido o expirado.',
        ];
    }

    return [
        'success' => false,
        'message' => $data['message'] ?? 'Error al buscar paquete (Error ' . $status . ').',
    ];
}

$scene = 'search';
$packageData = null;
$errors = [];
$trackingToken = trim((string) ($_GET['token'] ?? ''));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $trackingToken = trim((string) ($_POST['tracking_token'] ?? ''));

    if (empty($trackingToken)) {
        $errors[] = 'Por favor ingresa tu token de rastreo.';
    } else {
        $result = track_package($config['base_url'], $trackingToken, $config['request_timeout_seconds']);
        if ($result['success']) {
            $scene = 'tracking';
            $packageData = $result['data'];
        } else {
            $errors[] = $result['message'];
        }
    }
}

// Si hay token en URL, hacer búsqueda automática
if ($trackingToken !== '' && $scene === 'search') {
    $result = track_package($config['base_url'], $trackingToken, $config['request_timeout_seconds']);
    if ($result['success']) {
        $scene = 'tracking';
        $packageData = $result['data'];
    } else {
        $errors[] = $result['message'];
    }
}

// Estados para mapeo de colores
$statusMap = [
    'pending' => ['label' => 'Pendiente', 'icon' => '📋', 'class' => 'pending'],
    'processing' => ['label' => 'Procesando', 'icon' => '⚙️', 'class' => 'pending'],
    'in_warehouse' => ['label' => 'En almacén', 'icon' => '🏢', 'class' => 'pending'],
    'in_transit' => ['label' => 'En tránsito', 'icon' => '🚚', 'class' => 'pending'],
    'out_for_delivery' => ['label' => 'Salida a reparto', 'icon' => '📦', 'class' => 'pending'],
    'in_delivery' => ['label' => 'En reparto', 'icon' => '📦', 'class' => 'pending'],
    'delivered' => ['label' => 'Entregado', 'icon' => '✓', 'class' => 'delivered'],
    'failed' => ['label' => 'Entrega fallida', 'icon' => '✗', 'class' => 'failed'],
    'returned' => ['label' => 'Devuelto', 'icon' => '↩️', 'class' => 'failed'],
];

?><!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Rastrear Paquete — pakAG</title>
    <link rel="stylesheet" href="assets/css/styles.css"/>
</head>
<body>
<div class="glow"></div>
<div class="page-wrap">
    <div class="logo-wrap">
        <div class="logo">
            <div class="logo-badge">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/>
                    <path d="M12 22V12"/>
                </svg>
            </div>
            <div class="logo-text">pak<span>AG</span></div>
        </div>
    </div>

    <?php if ($scene === 'search'): ?>
        <div class="card fade-up">
            <div class="hero">
                <h1>Rastrear tu paquete</h1>
                <p>Ingresa el código para ver el estado y ubicación.</p>
            </div>

            <?php foreach ($errors as $error): ?>
                <div class="alert fade-in">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <?php echo h($error); ?>
                </div>
            <?php endforeach; ?>

            <form method="post" novalidate>
                <div class="field">
                    <label class="field-label">Token de rastreo</label>
                    <input name="tracking_token" type="text" placeholder="Copia el token del email de confirmación" required autofocus style="width:100%; padding:12px; background:var(--bg-surface); border:1px solid var(--border-normal); border-radius:8px; color:white;">
                </div>
                <button type="submit" class="primary-btn" style="width:100%; margin-top:25px; cursor:pointer;">
                    Rastrear paquete
                </button>
            </form>

            <div class="token-hint" style="margin-top:30px;">
                <p>Revisa el email de confirmación del pedido</p>
                <p style="font-size:12px; color:var(--text-disabled); margin-top:8px;">Te enviamos un link con tu token de rastreo único</p>
            </div>
        </div>

    <?php elseif ($scene === 'tracking' && $packageData): ?>
        <div class="card tracking-card fade-up">
            <div class="tracking-header">
                <div>
                    <h2 style="margin-bottom:4px;"><?php echo h($packageData['tracking_code'] ?? 'Paquete'); ?></h2>
                    <p style="color:var(--text-secondary); font-size:13px;">
                        <?php 
                        $status = $packageData['status'] ?? 'unknown';
                        $statusInfo = $statusMap[$status] ?? ['label' => 'Estado desconocido', 'icon' => '?', 'class' => 'pending'];
                        echo h($statusInfo['label']);
                        ?>
                    </p>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:28px; margin-bottom:8px;">
                        <?php echo $statusInfo['icon']; ?>
                    </div>
                </div>
            </div>

            <?php if (!empty($packageData['recipient_name'])): ?>
                <div class="package-info">
                    <h3 style="font-size:12px; color:var(--text-secondary); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em;">Destinatario</h3>
                    <p style="font-weight:500;"><?php echo h($packageData['recipient_name']); ?></p>
                </div>
            <?php endif; ?>

            <?php if (!empty($packageData['address'])): ?>
                <div class="package-info">
                    <h3 style="font-size:12px; color:var(--text-secondary); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em;">Dirección de entrega</h3>
                    <p>
                        <?php echo h($packageData['address']['street'] ?? ''); ?>
                        <?php if (!empty($packageData['address']['city'])): ?><br><?php echo h($packageData['address']['city']); ?>, <?php endif; ?>
                        <?php if (!empty($packageData['address']['postal_code'])): ?><?php echo h($packageData['address']['postal_code']); ?><?php endif; ?>
                    </p>
                </div>
            <?php endif; ?>

            <?php if (!empty($packageData['estimated_delivery'])): ?>
                <div class="package-info">
                    <h3 style="font-size:12px; color:var(--text-secondary); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em;">Entrega estimada</h3>
                    <p><?php echo h($packageData['estimated_delivery']); ?></p>
                </div>
            <?php endif; ?>

            <?php if (!empty($packageData['last_update'])): ?>
                <div class="package-info">
                    <h3 style="font-size:12px; color:var(--text-secondary); margin-bottom:4px; text-transform:uppercase; letter-spacing:.05em;">Última actualización</h3>
                    <p style="font-size:12px; color:var(--text-disabled);"><?php echo h($packageData['last_update']); ?></p>
                </div>
            <?php endif; ?>

            <div class="tracking-footer">
                <form method="post" style="margin-bottom:0;">
                    <button type="submit" class="secondary-btn" style="margin-bottom:0;">
                        Buscar otro paquete
                    </button>
                </form>
            </div>
        </div>
    <?php endif; ?>

    <div class="footer">pakAG © 2026</div>
</div>
</body>
</html>