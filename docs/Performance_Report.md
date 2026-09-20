# 📊 Reporte de Prueba de Performance

## 1. Objetivo

Evaluar el comportamiento del servicio simulado de pagos bajo una carga controlada, verificando principalmente:

- Tiempo de respuesta.
- Porcentaje de errores.
- Correctitud de la respuesta funcional.
- Capacidad del escenario para mantener los criterios definidos durante la ejecución.

La prueba se realizó sobre un servicio local simulado, evitando utilizar servicios reales o ambientes productivos.

---

## 2. Alcance

La prueba se enfocó en el endpoint:

```text
POST /payment