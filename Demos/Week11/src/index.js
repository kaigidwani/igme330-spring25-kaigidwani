const { createServer } = require('http');

const server = createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'type/plain');
    res.end('Hello World');
});

server.listen(3000, 'localhost', () => {
    console.log(`Server running at http://localhost:3000`);
});