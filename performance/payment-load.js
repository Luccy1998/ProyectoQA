import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const paymentErrors = new Rate('payment_errors');

const BASE_URL =
  __ENV.PERFORMANCE_BASE_URL || 'http://localhost:3001';

export const options = {
  scenarios: {
    payment_load_test: {
      executor: 'constant-arrival-rate',

      // Escenario inicial: 10 solicitudes por segundo
      rate: 10,
      timeUnit: '1s',

      // Duración total de la prueba
      duration: '10s',

      // Usuarios virtuales disponibles inicialmente
      preAllocatedVUs: 5,

      // Máximo de usuarios virtuales permitidos
      maxVUs: 10,
    },
  },

  thresholds: {
    // Máximo 1% de solicitudes con error
    http_req_failed: ['rate<0.01'],

    // Máximo 1% de errores funcionales
    payment_errors: ['rate<0.01'],

    // El 95% de las respuestas debe tardar menos de 2 segundos
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {

  const payload = JSON.stringify({
    trackingId: `PERF-${__VU}-${__ITER}`,
    paymentId: `PAY-${__VU}-${__ITER}`,
    amount: 100,
  });

  const response = http.post(
    `${BASE_URL}/payment`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: {
        endpoint: 'payment',
      },
    }
  );

  const isSuccessful = check(response, {
    'HTTP 200': (res) => res.status === 200,

    'respuesta contiene estado PAID': (res) => {
      try {
        return res.json('status') === 'PAID';
      } catch {
        return false;
      }
    },

    'respuesta contiene trackingId': (res) => {
      try {
        return Boolean(res.json('trackingId'));
      } catch {
        return false;
      }
    },
  });

  paymentErrors.add(!isSuccessful);
}