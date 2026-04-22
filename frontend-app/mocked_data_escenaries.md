# 🧪 mocked_data.sql — Guía de escenarios

## Cómo usarlo

Cambia **una sola línea** al principio del fichero y ejecuta el SQL completo:

```sql
SET @test_scenario = 1; -- ← solo cambias esto (1..5)
```

> Después recarga las queries del frontend o reinicia el servidor de desarrollo.

---

## Escenarios — qué ver en `/myRoute`

### Escenario 1 — Ruta cruzó medianoche ⭐ DEFAULT

> La ruta de **ayer** sigue `in_progress`. La query la pilla con prioridad 0.

| Elemento | Qué ver                                                      |
| -------- | ------------------------------------------------------------ |
| Header   | Fecha de ayer · _"Martxan"_ · _"1/3 geldialdi osatuta"_      |
| Botón    | **"Ibilbidea bukatu"** activo (no `disabled`)                |
| Banner   | **Ninguno** _(solo aparece para `planned` + futuro)_         |
| Parada 1 | Amaia Olano — ✅ `delivered`                                 |
| Parada 2 | Josu Zabala — **activa**, botones _"Entregatuta"_ / _"Huts"_ |
| Parada 3 | Nerea Eizaguirre — en espera                                 |

**Prueba de flujo:** pulsa _"Ibilbidea bukatu"_ sin entregar nada → paradas 2 y 3 pasan a `undelivered` → ruta `completed` → página muestra `EmptyRouteState`.

---

### Escenario 2 — Ruta de HOY en `planned`

- Botón **"Ibilbidea hasi"** activo
- 3 paradas en `assigned`
- Sin banner

---

### Escenario 3 — Ruta de MAÑANA en `planned`

- Botón **desactivado**
- Banner: _"Ruta hau beste egun batekoa da. Planifikatuta dago, baina gaur ezin da hasi."_
- La ruta se muestra igualmente _(antes no aparecía nada)_

---

### Escenario 4 — Sin ruta + 6 paquetes sin entregar

- `EmptyRouteState` con bloque de aviso:
  > _"6 pakete geratu dira entregatu gabe..."_
- Botón **"Ruta hau gaur egin"** activo

---

### Escenario 5 — Vacío limpio

- `EmptyRouteState` sin bloque de aviso ni botón de recuperar
