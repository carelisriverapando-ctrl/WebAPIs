const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Datos de ejemplo
const productos = [
    { id: 1, nombre: 'Laptop', precio: 1200 },
    { id: 2, nombre: 'Mouse', precio: 25 },
    { id: 3, nombre: 'Teclado', precio: 45 }
];

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API funcionando correctamente' });
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// Obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        res.json(producto);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Crear nuevo producto
app.post('/api/productos', (req, res) => {
    const { nombre, precio } = req.body;
    const nuevoProducto = {
        id: productos.length + 1,
        nombre,
        precio
    };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});