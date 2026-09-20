# Matriz de Trazabilidad

## Objetivo

Relacionar los principales riesgos y requisitos funcionales del escenario de Digital Onboarding con las pruebas definidas en el proyecto.

| ID | Requisito / Riesgo | Nivel de prueba | Caso de prueba | Evidencia |
|---|---|---|---|---|
| TR-001 | Obtener información correctamente desde una API | API | API-001 - Obtener productos correctamente | Reporte Playwright |
| TR-002 | Manejar endpoints inexistentes | API | API-002 - Endpoint inexistente debe retornar 404 | Reporte Playwright |
| TR-003 | Manejar consultas sin resultados | API | API-003 - Categoría inexistente debe retornar lista vacía | Reporte Playwright |
| TR-004 | Evitar cobros duplicados ante notificaciones repetidas | Transaccional | TRX-001 - Pago duplicado debe procesarse una sola vez | Reporte Playwright |
| TR-005 | Evitar descuentos de inventario duplicados | Transaccional | TRX-001 - Pago duplicado debe procesarse una sola vez | Reporte Playwright |
| TR-006 | Procesar mensajes de forma asíncrona | Integración / Async | ASYNC-001 - Procesar mensaje y controlar duplicados | Reporte Playwright |
| TR-007 | Controlar reprocesamiento de mensajes | Integración / Async | ASYNC-001 - Procesar mensaje y controlar duplicados | Reporte Playwright |
| TR-008 | Validar el acceso al portal web | E2E | E2E-001 - Login exitoso con usuario válido | Reporte Playwright |
| TR-009 | Validar comportamiento bajo carga | Performance | K6 - Payment Load Test | `docs/evidencias/performance/k6-result.txt` |
| TR-010 | Controlar errores y tiempos de respuesta | Performance | K6 - Payment Load Test | `docs/Performance_Report.md` |

## Riesgos prioritarios cubiertos

### R1 - Pago duplicado

Una misma notificación de pago puede recibirse más de una vez.

**Control:** uso de `idempotencyKey`.

**Prueba:** `TRX-001`.

**Resultado esperado:** un único cobro lógico y un único descuento de inventario.

### R2 - Procesamiento duplicado de mensajes

Un mensaje puede intentar procesarse nuevamente.

**Control:** identificación del mensaje procesado.

**Prueba:** `ASYNC-001`.

**Resultado esperado:** el segundo procesamiento es identificado como duplicado.

### R3 - Degradación bajo carga

El servicio puede presentar errores o aumento de latencia cuando aumenta el volumen de solicitudes.

**Control:** prueba de carga con k6 y umbrales automáticos.

**Prueba:** `Payment Load Test`.

**Criterios iniciales definidos para este ejercicio:**

- Errores HTTP < 1%.
- Errores funcionales < 1%.
- P95 de respuesta < 2 segundos.

Estos valores son criterios iniciales para el ejercicio y deberían validarse posteriormente con métricas y acuerdos reales del negocio.

## Observación

La matriz se puede ampliar conforme se incorporen nuevos requisitos, componentes o escenarios de negocio.