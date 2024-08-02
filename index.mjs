import { readFile, readFileSync } from 'node:fs';
import http from 'node:http';
import url from 'node:url';
const __dirname = import.meta.dirname;

const PORT = 8000;
// Helpers
import { replaceTempate } from './modules/replaceTemplate.js';

// Templates
const tempOverview = readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
// JSON data
const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = productData.map(product => replaceTempate(tempCard, product)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

  } else if (pathname === '/product') {
    const product = productData[query.id];

    if (!product) {
      res.statusCode = 404;
      res.end('Product not found');
    }

    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = replaceTempate(tempProduct, product);

    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1 style="color:red">Page not found</h1>');
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on port ${PORT}`);
});