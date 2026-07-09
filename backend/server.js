const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensaje: '🚀 API funcionando correctamente', version: '1.0.0' });
});

app.get('/api/productos', (req, res) => {
    res.json([
        { id: 1, nombre: 'Laptop Gaming', precio: 1200 },
        { id: 2, nombre: 'Mouse Inalámbrico', precio: 35 },
        { id: 3, nombre: 'Teclado Mecánico', precio: 80 }
    ]);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});