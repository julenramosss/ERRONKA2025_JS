// Login, 2FA, Error pages — with interactive state switcher

const LoginScreen = ({ onSubmit }) => {
  const [loginState, setLoginState] = React.useState("default");
  const [email, setEmail] = React.useState("mikel.arregi@pakag.com");
  const [password, setPassword] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const STATES = [
    { id: "default", label: "Normal" },
    { id: "error", label: "Error" },
    { id: "loading", label: "Cargando" },
    { id: "disabled", label: "Cuenta desactivada" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginState === "loading") return;
    setLoading(true);
    setSubmitted(true);
    if (loginState === "default" || loginState === "disabled") {
      setTimeout(() => {
        setLoading(false);
        onSubmit?.();
      }, 1400);
    } else {
      setTimeout(() => setLoading(false), 1400);
    }
  };

  const isError = loginState === "error" && submitted && !loading;
  const isDisabled = loginState === "disabled";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
        background: "linear-gradient(160deg, #0E0B16 0%, #1A1626 100%)",
        position: "relative",
      }}
    >
      <div className="ambient-glow" />
      <div className="noise" />

      {/* Left: form */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 60px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <PakLogo size={32} />
          {/* State switcher — interactive prototype controls */}
          <div
            style={{
              display: "flex",
              gap: 2,
              padding: 3,
              background: "var(--bg-elevated)",
              borderRadius: 9,
              border: "1px solid var(--border-normal)",
            }}
          >
            {STATES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setLoginState(s.id);
                  setSubmitted(false);
                  setLoading(false);
                }}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  background:
                    loginState === s.id
                      ? "var(--accent-subtle)"
                      : "transparent",
                  color:
                    loginState === s.id
                      ? "var(--accent-light)"
                      : "var(--text-disabled)",
                  whiteSpace: "nowrap",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{ maxWidth: 420, width: "100%", alignSelf: "center" }}
          className="fade-up"
        >
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontSize: 13,
                color: "var(--accent-light)",
                fontWeight: 500,
                marginBottom: 8,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              · Bienvenido
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              Inicia sesión
            </h1>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
            >
              Gestión de reparto inteligente — para flotas que no pueden
              permitirse fallar.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <Label>Email</Label>
              <Input
                icon={<I.Mail size={16} />}
                placeholder="tu@pakag.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isDisabled}
                type="email"
                error={isError}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Label>Contraseña</Label>
              <Input
                icon={<I.Lock size={16} />}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isDisabled}
                error={isError}
                placeholder="Tu contraseña"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      color: "var(--text-secondary)",
                      display: "flex",
                      padding: 2,
                    }}
                  >
                    {showPass ? <I.EyeOff size={16} /> : <I.Eye size={16} />}
                  </button>
                }
              />
            </div>

            {/* Error message */}
            {isError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "var(--st-failed-bg)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "var(--st-failed-fg)",
                  fontSize: 13,
                  marginBottom: 16,
                }}
                className="fade-in"
              >
                <I.AlertCircle
                  size={16}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span>
                  Email o contraseña incorrectos. Comprueba tus credenciales e
                  inténtalo de nuevo.
                </span>
              </div>
            )}

            {/* Disabled account message */}
            {isDisabled && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "var(--st-pending-bg)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  color: "var(--st-pending-fg)",
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                <I.AlertTriangle
                  size={16}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>
                    Cuenta desactivada
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                    Un administrador ha desactivado tu cuenta. Contacta con
                    soporte en <a href="#">soporte@pakag.com</a>.
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Checkbox
                id="rem"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                label="Recordarme"
              />
              <a href="#" style={{ fontSize: 13 }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Btn
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={isDisabled}
              iconRight={!loading && <I.ArrowRight size={16} />}
            >
              {loading
                ? "Verificando…"
                : isDisabled
                  ? "Cuenta desactivada"
                  : "Iniciar sesión"}
            </Btn>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 12,
              color: "var(--text-disabled)",
            }}
          >
            ¿Problemas para entrar? <a href="#">soporte@pakag.com</a>
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--text-disabled)",
            letterSpacing: "0.03em",
          }}
        >
          pakAG © 2026 — Elduaien / Aduna · v2.4.1
        </div>
      </div>

      {/* Right: decorative */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
          borderLeft: "1px solid var(--border-normal)",
          background:
            "radial-gradient(at 70% 30%, rgba(124,58,237,0.25), transparent 60%)",
        }}
      >
        <LoginDecor />
      </div>
    </div>
  );
};

const LoginDecor = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: 40,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: "8%",
        right: "-4%",
        transform: "rotate(6deg)",
      }}
    >
      <div
        style={{
          width: 320,
          padding: 16,
          background: "var(--bg-surface)",
          borderRadius: 12,
          border: "1px solid var(--border-normal)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--accent-light)" }}
          >
            PKG-261042
          </span>
          <StatusBadge status="in_transit" size="sm" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
          Itziar Etxeberria
        </div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Kale Nagusia 12, Tolosa
        </div>
        <div
          style={{
            marginTop: 12,
            height: 1,
            background: "var(--border-normal)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            fontSize: 11,
            color: "var(--text-disabled)",
          }}
        >
          <span>Parada #3</span>
          <span>ETA 10:20</span>
        </div>
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        top: "40%",
        right: "15%",
        transform: "rotate(-4deg)",
      }}
    >
      <div
        style={{
          width: 280,
          padding: 16,
          background: "var(--bg-elevated)",
          borderRadius: 12,
          border: "1px solid var(--border-normal)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--accent-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-light)",
            }}
          >
            <I.Truck size={16} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Ruta de hoy
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              8 paradas · 24 km
            </div>
          </div>
        </div>
        <Progress value={62} />
        <div
          style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 8 }}
        >
          <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>
            5 de 8
          </span>{" "}
          completadas
        </div>
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        bottom: "12%",
        right: "8%",
        transform: "rotate(3deg)",
      }}
    >
      <div
        style={{
          width: 360,
          height: 200,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--border-normal)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <MapCanvas
          points={[
            { lat: 43.134, lng: -2.078, status: "delivered", stop: 1 },
            { lat: 43.161, lng: -2.043, status: "delivered", stop: 2 },
            { lat: 43.125, lng: -2.007, status: "in_transit", stop: 3 },
            { lat: 43.176, lng: -2.053, status: "assigned", stop: 4 },
          ]}
          origin={{ lat: 43.145, lng: -2.085 }}
          route
          activeStop={3}
          height={200}
          compact
          showControls={false}
        />
      </div>
    </div>

    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 40,
        right: 40,
        zIndex: 5,
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          maxWidth: 480,
        }}
      >
        Cada paquete
        <br />
        <span style={{ color: "var(--accent-light)" }}>en su sitio.</span>
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          marginTop: 12,
          fontSize: 14,
          maxWidth: 380,
        }}
      >
        El centro de operaciones para la flota de reparto de Aduna — ruta,
        estado y trazabilidad en una sola pantalla.
      </div>
    </div>
  </div>
);

const TwoFAScreen = ({ onSubmit, onBack }) => {
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = React.useState(45);
  const [loading, setLoading] = React.useState(false);
  const [resent, setResent] = React.useState(false);
  const refs = React.useRef([]);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const setDigit = (i, v) => {
    if (v && !/^\d$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length) {
      const next = ["", "", "", "", "", ""];
      paste.split("").forEach((ch, i) => {
        next[i] = ch;
      });
      setCode(next);
      refs.current[Math.min(paste.length, 5)]?.focus();
      e.preventDefault();
    }
  };

  const filled = code.every((c) => c !== "");
  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit?.();
    }, 1000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0E0B16 0%, #1A1626 100%)",
        position: "relative",
        padding: 24,
      }}
    >
      <div className="ambient-glow" />
      <div className="noise" />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          zIndex: 2,
          position: "relative",
        }}
        className="fade-up"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <PakLogo size={32} />
        </div>
        <Card padding={32} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 20px",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, var(--accent-primary), var(--accent-hover))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(124,58,237,0.4)",
              color: "white",
            }}
          >
            <I.Shield size={28} />
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Verificación en dos pasos
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 13,
              margin: "0 0 24px",
              lineHeight: 1.5,
            }}
          >
            Hemos enviado un código de 6 dígitos a{" "}
            <span style={{ color: "var(--accent-light)" }}>
              ma***@pakag.com
            </span>
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            {code.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                value={d}
                maxLength={1}
                onChange={(e) => setDigit(i, e.target.value)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !d && i > 0)
                    refs.current[i - 1]?.focus();
                  if (e.key === "ArrowLeft" && i > 0)
                    refs.current[i - 1]?.focus();
                  if (e.key === "ArrowRight" && i < 5)
                    refs.current[i + 1]?.focus();
                }}
                className="mono focus-ring"
                style={{
                  width: 48,
                  height: 56,
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: 600,
                  background: "var(--bg-elevated)",
                  border: `1.5px solid ${d ? "var(--accent-primary)" : "var(--border-normal)"}`,
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "all 160ms",
                  boxShadow: d ? "0 0 0 3px rgba(124,58,237,0.2)" : "none",
                }}
              />
            ))}
          </div>

          <Btn
            variant="primary"
            size="lg"
            fullWidth
            disabled={!filled}
            loading={loading}
            onClick={handleVerify}
            iconRight={!loading && <I.Check size={16} />}
          >
            Verificar
          </Btn>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {resent ? (
                <span style={{ color: "var(--st-delivered-fg)" }}>
                  ✓ Código reenviado
                </span>
              ) : countdown > 0 ? (
                <>
                  Reenviar código en{" "}
                  <span
                    className="mono"
                    style={{ color: "var(--accent-light)" }}
                  >
                    {countdown}s
                  </span>
                </>
              ) : (
                <button
                  onClick={() => {
                    setCountdown(45);
                    setResent(true);
                    setTimeout(() => setResent(false), 3000);
                  }}
                  style={{ color: "var(--accent-light)", fontSize: 12 }}
                >
                  Reenviar código
                </button>
              )}
            </div>
            <button
              onClick={onBack}
              style={{
                fontSize: 12,
                color: "var(--text-disabled)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                justifyContent: "center",
              }}
            >
              <I.ChevronLeft size={12} /> Volver al inicio de sesión
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Error404 = ({ onBack }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-dark)",
      padding: 24,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div className="ambient-glow" />
    <div
      style={{
        textAlign: "center",
        zIndex: 2,
        position: "relative",
        maxWidth: 420,
      }}
    >
      <div
        style={{
          fontSize: 180,
          fontWeight: 800,
          lineHeight: 1,
          background:
            "linear-gradient(135deg, #A78BFA 0%, #7C3AED 50%, #3D2960 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.05em",
          marginBottom: 16,
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
        Esta página no existe
      </h2>
      <p style={{ color: "var(--text-secondary)", margin: "0 0 24px" }}>
        Parece que te has perdido en la ruta. Comprueba la URL o vuelve al
        inicio.
      </p>
      <Btn variant="primary" onClick={onBack} icon={<I.ArrowLeft size={16} />}>
        Volver al inicio
      </Btn>
    </div>
  </div>
);

const ErrorOffline = ({ onRetry }) => {
  const [retrying, setRetrying] = React.useState(false);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-dark)",
        padding: 24,
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div
          style={{
            width: 80,
            height: 80,
            margin: "0 auto 20px",
            borderRadius: 20,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-normal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--st-failed-fg)",
          }}
        >
          {retrying ? <I.Loader size={36} /> : <I.WifiOff size={36} />}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
          Sin conexión con el servidor
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 13,
            margin: "0 0 24px",
          }}
        >
          No hemos podido contactar con pakAG. Comprueba tu conexión e inténtalo
          de nuevo.
        </p>
        <Btn
          variant="primary"
          loading={retrying}
          onClick={() => {
            setRetrying(true);
            setTimeout(() => {
              setRetrying(false);
              onRetry?.();
            }, 2000);
          }}
          icon={!retrying && <I.RefreshCw size={16} />}
        >
          {retrying ? "Reconectando…" : "Reintentar"}
        </Btn>
      </div>
    </div>
  );
};

const AccessDenied = ({ onBack }) => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
    }}
  >
    <div style={{ textAlign: "center", maxWidth: 400 }}>
      <div
        style={{
          width: 80,
          height: 80,
          margin: "0 auto 20px",
          borderRadius: 20,
          background: "var(--st-failed-bg)",
          border: "1px solid rgba(239,68,68,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--st-failed-fg)",
        }}
      >
        <I.Shield size={36} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>
        Acceso denegado
      </h2>
      <p style={{ color: "var(--text-secondary)", margin: "0 0 24px" }}>
        Esta sección es exclusiva para administradores. Si crees que es un
        error, contacta con tu responsable.
      </p>
      <Btn
        variant="secondary"
        onClick={onBack}
        icon={<I.ArrowLeft size={16} />}
      >
        Volver
      </Btn>
    </div>
  </div>
);

Object.assign(window, {
  LoginScreen,
  TwoFAScreen,
  Error404,
  ErrorOffline,
  AccessDenied,
});
