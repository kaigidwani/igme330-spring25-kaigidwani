const { createServer } = require('http');

const server = createServer((req, res) => {
    console.log(`Request! ${req.url}`);

    res.writeHead(200, { 'Content-type': 'text/plain'});
    res.end(req.url + '\n');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'type/plain');
    res.end('Hello World');
});

server.listen(3000, 'localhost', () => {
    console.log(`Server running at http://localhost:3000`);
});