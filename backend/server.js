const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ============ BASE DE DATOS EN MEMORIA ============
let pacientes = [
    {
        id: 1,
        nombre: 'María González',
        edad: 45,
        telefono: '555-1234',
        diagnostico: 'Hipertensión',
        estado: 'Activo',
        fechaIngreso: '2026-07-01'
    },
    {
        id: 2,
        nombre: 'Carlos Rodríguez',
        edad: 32,
        telefono: '555-5678',
        diagnostico: 'Diabetes Tipo 2',
        estado: 'En tratamiento',
        fechaIngreso: '2026-07-05'
    },
    {
        id: 3,
        nombre: 'Ana Martínez',
        edad: 28,
        telefono: '555-9012',
        diagnostico: 'Fractura de brazo',
        estado: 'En recuperación',
        fechaIngreso: '2026-07-08'
    }
];

let citas = [
    {
        id: 1,
        pacienteId: 1,
        fecha: '2026-07-15',
        hora: '10:00',
        motivo: 'Consulta de seguimiento',
        medico: 'Dr. Pérez'
    },
    {
        id: 2,
        pacienteId: 2,
        fecha: '2026-07-16',
        hora: '11:30',
        motivo: 'Control de glucosa',
        medico: 'Dra. López'
    }
];

// ============ ENDPOINTS DE PACIENTES ============

// Obtener todos los pacientes
app.get('/api/pacientes', (req, res) => {
    res.json({
        success: true,
        count: pacientes.length,
        data: pacientes
    });
});

// Obtener paciente por ID
app.get('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const paciente = pacientes.find(p => p.id === id);
    
    if (!paciente) {
        return res.status(404).json({
            success: false,
            error: 'Paciente no encontrado'
        });
    }
    
    res.json({
        success: true,
        data: paciente
    });
});

// Crear nuevo paciente
app.post('/api/pacientes', (req, res) => {
    const { nombre, edad, telefono, diagnostico, estado } = req.body;
    
    if (!nombre || !edad) {
        return res.status(400).json({
            success: false,
            error: 'Nombre y edad son obligatorios'
        });
    }
    
    const nuevoPaciente = {
        id: pacientes.length + 1,
        nombre,
        edad: parseInt(edad),
        telefono: telefono || 'No registrado',
        diagnostico: diagnostico || 'Sin diagnóstico',
        estado: estado || 'Activo',
        fechaIngreso: new Date().toISOString().split('T')[0]
    };
    
    pacientes.push(nuevoPaciente);
    
    res.status(201).json({
        success: true,
        message: 'Paciente registrado exitosamente',
        data: nuevoPaciente
    });
});

// Eliminar paciente
app.delete('/api/pacientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Paciente no encontrado'
        });
    }
    
    const pacienteEliminado = pacientes.splice(index, 1)[0];
    
    res.json({
        success: true,
        message: 'Paciente eliminado',
        data: pacienteEliminado
    });
});

// ============ ENDPOINTS DE CITAS ============

// Obtener todas las citas
app.get('/api/citas', (req, res) => {
    res.json({
        success: true,
        count: citas.length,
        data: citas
    });
});

// Crear nueva cita
app.post('/api/citas', (req, res) => {
    const { pacienteId, fecha, hora, motivo, medico } = req.body;
    
    if (!pacienteId || !fecha || !hora) {
        return res.status(400).json({
            success: false,
            error: 'Paciente, fecha y hora son obligatorios'
        });
    }
    
    const nuevaCita = {
        id: citas.length + 1,
        pacienteId: parseInt(pacienteId),
        fecha,
        hora,
        motivo: motivo || 'Consulta general',
        medico: medico || 'Médico asignado'
    };
    
    citas.push(nuevaCita);
    
    res.status(201).json({
        success: true,
        message: 'Cita agendada exitosamente',
        data: nuevaCita
    });
});

// ============ RUTA PRINCIPAL ============
// Esta ruta envía el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============ INICIAR SERVIDOR ============
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏥 Servidor Hospital corriendo en puerto ${PORT}`);
    console.log(`📋 Pacientes: ${pacientes.length}`);
    console.log(`📅 Citas: ${citas.length}`);
    console.log(`🌐 Frontend: https://webyapis-api.onrender.com`);
});