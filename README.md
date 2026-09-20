# Proyecto QA - Ejercicio práctico

Este proyecto corresponde al ejercicio práctico para el proceso de Analista de QA.

La idea principal es mostrar cómo abordaría las pruebas de una plataforma de onboarding digital, dando prioridad a los escenarios que considero más importantes por el riesgo que pueden representar para el negocio.

En el proyecto incluí pruebas de API, pruebas transaccionales, procesamiento asíncrono, una prueba E2E y una prueba básica de performance.

---

## Tecnologías utilizadas

- Node.js
- TypeScript
- Playwright
- k6
- Git
- GitHub Actions
- APIs REST
- Mocks locales

---

## Estructura del proyecto

```text
ProyectoQA
│
├── .github/
│   └── workflows/
│       └── qa.yml
│
├── config/
│   └── environment.ts
│
├── docs/
│   ├── Performance_Report.md
│   ├── traceability-matrix.md
│   └── evidencias/
│       └── performance/
│           └── k6-result.txt
│
├── mocks/
│   ├── payment-service.ts
│   ├── queue-service.ts
│   └── performance-server.js
│
├── performance/
│   └── payment-load.js
│
├── tests/
│   ├── api/
│   │   └── products.spec.ts
│   ├── transaction/
│   │   └── payment-idempotency.spec.ts
│   ├── async/
│   │   └── payment-processing.spec.ts
│   └── e2e/
│       └── login.spec.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
