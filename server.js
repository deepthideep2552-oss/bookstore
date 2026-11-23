const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let nextId = 6;
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', price: 450 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 520 },
  { id: 3, title: 'Docker Deep Dive', author: 'Nigel Poulton', price: 399 },
  { id: 4, title: 'The Phoenix Project', author: 'Gene Kim', price: 350 },
  { id: 5, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', price: 250 }
];
let cart = [];

// View + search books
app.get('/api/books', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  res.json(books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
});
// Manage books: add / update / delete
app.post('/api/books', (req, res) => {
  const { title, author, price } = req.body;
  if (!title || !author || isNaN(price)) return res.status(400).json({ error: 'title, author, price required' });
  const book = { id: nextId++, title, author, price: Number(price) };
  books.push(book);
  res.status(201).json(book);
});
app.put('/api/books/:id', (req, res) => {
  const b = books.find(x => x.id == req.params.id);
  if (!b) return res.status(404).json({ error: 'not found' });
  Object.assign(b, req.body, { id: b.id });
  res.json(b);
});
app.delete('/api/books/:id', (req, res) => {
  books = books.filter(x => x.id != req.params.id);
  cart = cart.filter(x => x.id != req.params.id);
  res.status(204).end();
});
// Cart
app.get('/api/cart', (req, res) => res.json({ items: cart, total: cart.reduce((s, b) => s + b.price * b.qty, 0) }));
app.post('/api/cart/:id', (req, res) => {
  const b = books.find(x => x.id == req.params.id);
  if (!b) return res.status(404).json({ error: 'not found' });
  const item = cart.find(x => x.id === b.id);
  item ? item.qty++ : cart.push({ ...b, qty: 1 });
  res.status(201).json({ ok: true });
});
app.delete('/api/cart/:id', (req, res) => { cart = cart.filter(x => x.id != req.params.id); res.status(204).end(); });
app.get('/health', (req, res) => res.send('OK'));

module.exports = app;
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`BookStore running on http://localhost:${port}`));
}
