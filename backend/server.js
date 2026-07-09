const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// ============ BASE DE DATOS ============
let pacientes = [
    { id: 1, nombre: 'María González', edad: 45, telefono: '555-1234', diagnostico: 'Hipertensión', estado: 'Activo', fechaIngreso: '2026-07-01' },
    { id: 2, nombre: 'Carlos Rodríguez', edad: 32, telefono: '555-5678', diagnostico: 'Diabetes Tipo 2', estado: 'En tratamiento', fechaIngreso: '2026-07-05' },
    { id: 3, nombre: 'Ana Martínez', edad: 28, telefono: '555-9012', diagnostico: 'Fractura de brazo', estado: 'En recuperación', fechaIngreso: '2026-07-08' }
];

let citas = [
    { id: 1, pacienteId: 1, fecha: '2026-07-15', hora: '10:00', motivo: 'Consulta de seguimiento', medico: 'Dr. Pérez' },
    { id: 2, pacienteId: 2, fecha: '2026-07-16', hora: '11:30', motivo: 'Control de glucosa', medico: 'Dra. López' }
];

// ============ API ENDPOINTS ============

// Ruta raíz - SIRVE EL FRONTEND
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

// Pacientes
app.get('/api/pacientes', (req, res) => {
    res.json({ success: true, count: pacientes.length, data: pacientes });
});

app.post('/api/pacientes', (req, res) => {
    const { nombre, edad, telefono, diagnostico, estado } = req.body;
    if (!nombre || !edad) {
        return res.status(400).json({ success: false, error: 'Nombre y edad son obligatorios' });
    }
    const nuevo = {
        id: pacientes.length + 1,
        nombre,
        edad: parseInt(edad),
        telefono: telefono || 'No registrado',
        diagnostico: diagnostico || 'Sin diagnóstico',
        estado: estado || 'Activo',
        fechaIngreso: new Date().toISOString().split('T')[0]
    };
    pacientes.push(nuevo);
    res.status(201).json({ success: true, message: 'Paciente registrado', data: nuevo });
});

app.delete('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'No encontrado' });
    }
    pacientes.splice(index, 1);
    res.json({ success: true, message: 'Eliminado' });
});

// Citas
app.get('/api/citas', (req, res) => {
    res.json({ success: true, count: citas.length, data: citas });
});

app.post('/api/citas', (req, res) => {
    const { pacienteId, fecha, hora, motivo, medico } = req.body;
    if (!pacienteId || !fecha || !hora) {
        return res.status(400).json({ success: false, error: 'Faltan datos' });
    }
    const nueva = {
        id: citas.length + 1,
        pacienteId: parseInt(pacienteId),
        fecha,
        hora,
        motivo: motivo || 'Consulta general',
        medico: medico || 'Médico asignado'
    };
    citas.push(nueva);
    res.status(201).json({ success: true, message: 'Cita creada', data: nueva });
});

// ============ INICIAR ============
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
    console.log(`📋 Pacientes: ${pacientes.length}`);
    console.log(`📅 Citas: ${citas.length}`);
});