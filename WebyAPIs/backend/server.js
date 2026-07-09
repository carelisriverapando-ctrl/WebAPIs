const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

let productos = [
    { id: 1, nombre: 'Laptop Gaming', precio: 1200, categoria: 'Electrónicos' },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 35, categoria: 'Periféricos' },
    { id: 3, nombre: 'Teclado Mecánico', precio: 80, categoria: 'Periféricos' }
];

app.get('/', (req, res) => {
    res.json({ mensaje: '🚀 API funcionando correctamente', version: '1.0.0' });
});

app.get('/api/productos', (req, res) => {
    res.json({ success: true, count: productos.length, data: productos });
});

app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return res.status(404).json({ error: 'No encontrado' });
    res.json({ success: true, data: producto });
});

app.post('/api/productos', (req, res) => {
    const { nombre, precio, categoria } = req.body;
    if (!nombre || !precio) return res.status(400).json({ error: 'Faltan campos' });
    const nuevoProducto = { id: productos.length + 1, nombre, precio: parseFloat(precio), categoria: categoria || 'Sin categoría' };
    productos.push(nuevoProducto);
    res.status(201).json({ success: true, message: 'Creado', data: nuevoProducto });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});