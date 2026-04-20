<?php
// Capturamos el token desde la URL (gracias al .htaccess)
$token = $_GET['token'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Establecer Contraseña | pakAG</title>
    <style>
        /* (Se mantienen los estilos del CSS anterior...) */
        :root {
            --bg-dark: #0E0B16; --bg-surface: #1A1626; --accent-primary: #7C3AED;
            --text-primary: #FFFFFF; --text-secondary: #94A3B8; --st-failed-bg: rgba(239,68,68,0.1);
            --st-failed-fg: #EF4444; --st-delivered-fg: #10B981; --border-normal: rgba(255,255,255,0.1);
        }
        body { margin: 0; font-family: sans-serif; background: var(--bg-dark); color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { background: var(--bg-surface); padding: 32px; border-radius: 16px; width: 100%; max-width: 400px; border: 1px solid var(--border-normal); }
        input { width: 100%; padding: 12px; margin: 8px 0 20px; background: #241E33; border: 1px solid var(--border-normal); border-radius: 8px; color: white; box-sizing: border-box; }
        .btn { width: 100%; padding: 14px; background: var(--accent-primary); border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-box { display: none; background: var(--st-failed-bg); color: var(--st-failed-fg); padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
        #success-state { display: none; text-align: center; }
    </style>
</head>
<body>

    <div class="card">
        <div id="form-state">
            <h1 style="font-size: 24px; margin-bottom: 8px;">Nueva contraseña</h1>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">Configura tu acceso para el token: <br><small style="color: var(--accent-primary)"><?php echo htmlspecialchars($token); ?></small></p>
            
            <div id="error-msg" class="error-box"></div>

            <form id="pwdForm">
                <label style="font-size: 13px; color: var(--text-secondary);">Contraseña Nueva</label>
                <input type="password" id="new_password" required minlength="6" placeholder="Mínimo 6 caracteres">
                
                <label style="font-size: 13px; color: var(--text-secondary);">Confirmar Contraseña</label>
                <input type="password" id="confirm_password" required placeholder="Repite la contraseña">
                
                <button type="submit" id="submitBtn" class="btn">Actualizar Contraseña</button>
            </form>
        </div>

        <div id="success-state">
            <div style="color: var(--st-delivered-fg); font-size: 48px; margin-bottom: 16px;">✓</div>
            <h2>¡Listo!</h2>
            <p>Tu contraseña ha sido cambiada y tu cuenta está activa.</p>
            <a href="/login" class="btn" style="text-decoration: none; display: block;">Ir al Login</a>
        </div>
    </div>

    <script>
        const pwdForm = document.getElementById('pwdForm');
        const errorMsg = document.getElementById('error-msg');
        const submitBtn = document.getElementById('submitBtn');
        const token = "<?php echo $token; ?>";

        pwdForm.onsubmit = async (e) => {
            e.preventDefault();
            errorMsg.style.display = 'none';
            
            const new_password = document.getElementById('new_password').value;
            const confirm_password = document.getElementById('confirm_password').value;

            // Validación local
            if (new_password !== confirm_password) {
                showError("Las contraseñas no coinciden.");
                return;
            }

            if (!token) {
                showError("No se encontró un token válido en la URL.");
                return;
            }

            // Iniciar Fetch
            submitBtn.disabled = true;
            submitBtn.innerText = "Procesando...";

            try {
                const response = await fetch('http://10.23.26.64:3000/api/auth/changePwd', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        new_password: new_password,
                        reset_pwd_token: token
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('form-state').style.display = 'none';
                    document.getElementById('success-state').style.display = 'block';
                } else {
                    // Manejo de errores según tu tabla (400, 401, 500)
                    showError(data.message || "Error al cambiar la contraseña.");
                }
            } catch (err) {
                showError("Error de conexión con el servidor.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = "Actualizar Contraseña";
            }
        };

        function showError(text) {
            errorMsg.innerText = text;
            errorMsg.style.display = 'block';
        }
    </script>
</body>
</html>