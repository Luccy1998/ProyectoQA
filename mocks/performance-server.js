const http = require('http');

const PORT = 3001;

const server = http.createServer((req, res) => {

  if (req.url === '/health' && req.method === 'GET') {

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(
      JSON.stringify({
        status: 'UP',
        service: 'payment-service-mock',
      })
    );

    return;
  }

  if (req.url === '/payment' && req.method === 'POST') {

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {

      res.writeHead(200, {
        'Content-Type': 'application/json',
      });

      res.end(
        JSON.stringify({
          status: 'PAID',
          trackingId: 'PERF-001',
          message: 'Pago procesado correctamente',
        })
      );

    });

    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json',
  });

  res.end(
    JSON.stringify({
      status: 'NOT_FOUND',
      message: 'Endpoint no encontrado',
    })
  );

});

server.listen(PORT, () => {

  console.log(
    `Servidor de performance ejecutándose en http://localhost:${PORT}`
  );

});