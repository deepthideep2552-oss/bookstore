const test = require('node:test');
const assert = require('node:assert');
const app = require('../server');

test('BookStore API', async (t) => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const j = (p, o) => fetch(base + p, o).then(r => r.json());

  const all = await j('/api/books');
  assert.ok(all.length >= 5, 'books listed');

  const found = await j('/api/books?q=docker');
  assert.strictEqual(found.length, 1, 'search works');

  await fetch(base + '/api/cart/1', { method: 'POST' });
  const cart = await j('/api/cart');
  assert.strictEqual(cart.items.length, 1, 'add to cart works');

  const r = await fetch(base + '/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'T', author: 'A', price: 100 }) });
  assert.strictEqual(r.status, 201, 'manage: add book works');
  server.close();
});
