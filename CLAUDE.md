# pakAG Backend

Stack: Next.js 15 App Router + TypeScript + MySQL (mysql2) + JWT + Nodemailer.

## Arquitectura por endpoint (src/app/api/{recurso}/{accion}/)

- dtos/ → interfaz + validateXxxDto(body: unknown). NO Zod.
- repository/ → solo SQL con mysql2, prepared statements.
- service/ → solo lógica, sin SQL.
- route.ts → try/catch, orquesta.
- types.ts → dominio.

## Contexto

- Schema de la DB de Workbench en ./schema.sql

## Reglas

- tsc --noEmit debe pasar siempre.
- Nunca `any`. Nunca SQL en route.ts. Nunca lógica en repository/.
- Errores: ValidationError / NotFoundError / UnauthorizedError / ForbiddenError / ConflictError desde src/lib/errors.ts.
- Patrón de referencia: src/app/api/users/create/ y src/app/api/users/changePwd/.
