<?php
$config = require __DIR__ . '/config.php';
require __DIR__ . '/lib/api.php';

$endpointUrl = rtrim($config['base_url'], '/') . $config['change_pwd_path'];
$timeout = (int) ($config['request_timeout_seconds'] ?? 10);

function h(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function validate_reset_token(string $endpointUrl, string $token, int $timeout): array
{
    $response = api_patch_json($endpointUrl, [
        'reset_pwd_token' => $token,
    ], $timeout);

    if ($response['error']) {
        return [
            'valid' => null,
            'transport_error' => $response['error'],
            'status' => $response['status'],
            'message' => 'No se pudo validar el enlace ahora mismo.',
        ];
    }

    $status = (int) ($response['status'] ?? 0);
    $data = $response['data'] ?? [];

    if ($status === 200 && array_key_exists('valid', $data)) {
        return [
            'valid' => (bool) $data['valid'],
            'transport_error' => null,
            'status' => $status,
            'message' => null,
        ];
    }

    if ($status === 401) {
        return [
            'valid' => false,
            'transport_error' => null,
            'status' => $status,
            'message' => $data['message'] ?? 'Invalid or expired email token',
        ];
    }

    return [
        'valid' => null,
        'transport_error' => null,
        'status' => $status,
        'message' => $data['message'] ?? 'No se pudo validar el enlace ahora mismo.',
    ];
}

function change_password(string $endpointUrl, string $token, string $password, int $timeout): array
{
    $response = api_patch_json($endpointUrl, [
        'reset_pwd_token' => $token,
        'new_password' => $password,
    ], $timeout);

    if ($response['error']) {
        return [
            'success' => false,
            'expired' => false,
            'message' => 'No se pudo conectar con la API. Revisa la base URL o el servidor.',
            'status' => 0,
        ];
    }

    $status = (int) ($response['status'] ?? 0);
    $data = $response['data'] ?? [];

    if ($status === 200) {
        return [
            'success' => true,
            'expired' => false,
            'message' => $data['message'] ?? 'Password changed successfully',
            'status' => $status,
        ];
    }

    if ($status === 401) {
        return [
            'success' => false,
            'expired' => true,
            'message' => $data['message'] ?? 'Invalid or expired email token',
            'status' => $status,
        ];
    }

    return [
        'success' => false,
        'expired' => false,
        'message' => $data['message'] ?? 'No se pudo actualizar la contraseña.',
        'status' => $status,
    ];
}

$scene = 'form';
$errors = [];
$pageHttpCode = 200;
$formPassword = '';
$formConfirm = '';
$successMessage = null;
$token = trim((string) ($_GET['token'] ?? $_GET['reset_pwd_token'] ?? ''));
$tokenPreview = $token !== ''
    ? (strlen($token) > 20 ? substr($token, 0, 20) . '…' : $token)
    : 'sin token';

if ($token === '') {
    $scene = 'expired';
    $pageHttpCode = 404;
} else {
    $tokenCheck = validate_reset_token($endpointUrl, $token, $timeout);

    if ($tokenCheck['valid'] === false) {
        $scene = 'expired';
        $pageHttpCode = 404;
    } elseif ($tokenCheck['valid'] === null) {
        $scene = 'error';
        $errors[] = $tokenCheck['message'];
        $pageHttpCode = 503;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $scene === 'form') {
    $formPassword = (string) ($_POST['new_password'] ?? '');
    $formConfirm = (string) ($_POST['confirm_password'] ?? '');

    if ($formPassword === '') {
        $errors[] = 'La nueva contraseña es obligatoria.';
    }

    if (strlen($formPassword) < 6) {
        $errors[] = 'La nueva contraseña debe tener al menos 6 caracteres.';
    }

    if ($formPassword !== $formConfirm) {
        $errors[] = 'Las contraseñas no coinciden.';
    }

    if (empty($errors)) {
        $changeResult = change_password($endpointUrl, $token, $formPassword, $timeout);

        if ($changeResult['success']) {
            $scene = 'success';
            $successMessage = $changeResult['message'];
        } elseif ($changeResult['expired']) {
            $scene = 'expired';
            $pageHttpCode = 404;
        } else {
            $errors[] = $changeResult['message'];
        }
    }
}

http_response_code($pageHttpCode);
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title><?php echo match ($scene) {
    'success' => 'Contraseña actualizada — pakAG',
    'expired' => '404 — Enlace inválido — pakAG',
    'error' => 'Error — pakAG',
    default => 'Cambiar contraseña — pakAG',
}; ?></title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet"/>
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

    <?php if ($scene === 'form'): ?>
        <div class="card fade-up" data-form-card>
            <div class="hero">
                <div class="hero-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
                    </svg>
                </div>
                <h1>Crea una nueva contraseña</h1>
                <p>Elige una contraseña segura para tu cuenta pakAG.</p>
            </div>

            <?php foreach ($errors as $error): ?>
                <div class="alert fade-in" role="alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                    </svg>
                    <span><?php echo h($error); ?></span>
                </div>
            <?php endforeach; ?>

            <form method="post" data-reset-form novalidate>
                <div class="field">
                    <label class="field-label" for="new_password">Nueva contraseña</label>
                    <div class="input-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input id="new_password" name="new_password" type="password" minlength="6" placeholder="Mínimo 6 caracteres" value="<?php echo h($formPassword); ?>" autocomplete="new-password" required data-password/>
                        <button type="button" class="toggle-visibility" data-toggle-visibility data-target="new_password" aria-label="Mostrar u ocultar contraseña">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>

                    <div class="strength fade-in <?php echo $formPassword !== '' ? 'is-visible' : ''; ?>" data-strength>
                        <div class="strength-head">
                            <span data-strength-label>Muy débil</span>
                            <span data-strength-value>0/5</span>
                        </div>
                        <div class="strength-track">
                            <div class="strength-bar" data-strength-bar></div>
                        </div>
                        <div class="criteria">
                            <div class="criterion" data-criterion="length"><span class="criterion-bullet"></span>Mínimo 6 caracteres</div>
                            <div class="criterion" data-criterion="upper"><span class="criterion-bullet"></span>Una mayúscula</div>
                            <div class="criterion" data-criterion="number"><span class="criterion-bullet"></span>Un número</div>
                            <div class="criterion" data-criterion="symbol"><span class="criterion-bullet"></span>Un símbolo (!@#…)</div>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label class="field-label" for="confirm_password">Confirmar contraseña</label>
                    <div class="input-wrap <?php echo ($formConfirm !== '' && $formPassword !== $formConfirm) ? 'has-error' : ''; ?>">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="18" height="11" x="3" y="11" rx="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <input id="confirm_password" name="confirm_password" type="password" minlength="6" placeholder="Repite la contraseña" value="<?php echo h($formConfirm); ?>" autocomplete="new-password" required data-confirm-password/>
                        <button type="button" class="toggle-visibility" data-toggle-visibility data-target="confirm_password" aria-label="Mostrar u ocultar contraseña">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                    </div>
                    <div class="inline-message error <?php echo ($formConfirm !== '' && $formPassword !== $formConfirm) ? 'is-visible' : ''; ?>" data-mismatch-error>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        Las contraseñas no coinciden
                    </div>
                    <div class="inline-message success <?php echo ($formConfirm !== '' && $formPassword === $formConfirm) ? 'is-visible' : ''; ?>" data-match-success>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                        Las contraseñas coinciden
                    </div>
                </div>

                <button class="primary-btn" type="submit" data-submit>
                    Cambiar contraseña
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
            </form>

            <div class="token-hint">
                Token: <code><?php echo h($tokenPreview); ?></code>
            </div>
        </div>

        <div class="card center fade-in hidden" data-loading-state>
            <div class="loader-ring"></div>
            <div style="font-size:16px;font-weight:600;margin-bottom:6px">Actualizando contraseña…</div>
            <div style="font-size:13px;color:var(--text-secondary)">Estamos guardando tus cambios de forma segura.</div>
        </div>
    <?php elseif ($scene === 'success'): ?>
        <div class="card center fade-up">
            <div class="state-icon success">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
            </div>
            <h2>¡Contraseña actualizada!</h2>
            <p>Tu contraseña se ha cambiado correctamente.<br/>Ya puedes iniciar sesión con tus nuevas credenciales.</p>
            <div class="center-actions">
                <a class="primary-btn" href="<?php echo h($config['login_url']); ?>">
                    Ir al inicio de sesión
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </a>
            </div>
            <div class="status-note"><?php echo h($successMessage ?? 'Por seguridad, se han cerrado todas las demás sesiones.'); ?></div>
        </div>
    <?php elseif ($scene === 'expired'): ?>
        <div class="card center fade-up">
            <div class="state-icon warning">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h2>404 · Enlace no válido</h2>
            <p>Este enlace de recuperación no existe, ha caducado o ya fue utilizado.<br/>Necesitas solicitar uno nuevo.</p>
            <div class="center-actions">
                <a class="primary-btn" href="mailto:<?php echo h($config['support_email']); ?>">Contactar soporte</a>
            </div>
            <div class="status-note">Token recibido: <code><?php echo h($tokenPreview); ?></code></div>
        </div>
    <?php else: ?>
        <div class="card center fade-up">
            <div class="state-icon error">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </div>
            <h2>Algo ha ido mal</h2>
            <p>No hemos podido validar tu enlace o conectar con la API.<br/>Revisa la configuración o inténtalo más tarde.</p>
            <?php foreach ($errors as $error): ?>
                <div class="alert fade-in" role="alert" style="margin-top:18px;text-align:left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                    </svg>
                    <span><?php echo h($error); ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="footer">pakAG © 2026 · Elduaien / Aduna</div>
</div>
<script src="assets/js/app.js"></script>
</body>
</html>
