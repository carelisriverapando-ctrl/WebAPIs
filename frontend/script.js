// ============ CONFIGURACIÓN ============
const API_URL = 'https://webyapis-api.onrender.com/api';

// ============ ELEMENTOS DOM ============
const pacientesList = document.getElementById('pacientes-list');
const citasList = document.getElementById('citas-list');
const pacienteForm = document.getElementById('pacienteForm');
const totalPacientes = document.getElementById('totalPacientes');
const totalCitas = document.getElementById('totalCitas');

// ============ NAVEGACIÓN ============
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const tab = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
    });
});

// ============ PACIENTES ============
async function cargarPacientes() {
    try {
        pacientesList.innerHTML = '<div class="loading">Cargando pacientes...</div>';
        const response = await fetch(`${API_URL}/pacientes`);
        const result = await response.json();
        
        if (result.success) {
            mostrarPacientes(result.data);
            totalPacientes.textContent = result.count;
        }
    } catch (error) {
        pacientesList.innerHTML = `<div class="loading">❌ Error: ${error.message}</div>`;
    }
}

function mostrarPacientes(pacientes) {
    if (pacientes.length === 0) {
        pacientesList.innerHTML = '<div class="loading">No hay pacientes registrados</div>';
        return;
    }
    
    pacientesList.innerHTML = pacientes.map(p => `
        <div class="card">
            <div class="card-title">${p.nombre}</div>
            <div class="card-detail">
                <strong>Edad:</strong> ${p.edad} años
            </div>
            <div class="card-detail">
                <strong>Teléfono:</strong> ${p.telefono}
            </div>
            <div class="card-detail">
                <strong>Diagnóstico:</strong> ${p.diagnostico}
            </div>
            <div class="card-detail">
                <strong>Estado:</strong>
                <span class="card-status status-${p.estado.toLowerCase().replace(' ', '')}">${p.estado}</span>
            </div>
            <div class="card-detail">
                <strong>Ingreso:</strong> ${p.fechaIngreso}
            </div>
            <div class="card-actions">
                <button class="btn-delete" onclick="eliminarPaciente(${p.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

async function eliminarPaciente(id) {
    if (!confirm('¿Estás seguro de eliminar este paciente?')) return;
    
    try {
        const response = await fetch(`${API_URL}/pacientes/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await cargarPacientes();
            alert('Paciente eliminado correctamente');
        }
    } catch (error) {
        alert('Error al eliminar paciente');
    }
}

// ============ CITAS ============
async function cargarCitas() {
    try {
        citasList.innerHTML = '<div class="loading">Cargando citas...</div>';
        const response = await fetch(`${API_URL}/citas`);
        const result = await response.json();
        
        if (result.success) {
            mostrarCitas(result.data);
            totalCitas.textContent = result.count;
        }
    } catch (error) {
        citasList.innerHTML = `<div class="loading">❌ Error: ${error.message}</div>`;
    }
}

function mostrarCitas(citas) {
    if (citas.length === 0) {
        citasList.innerHTML = '<div class="loading">No hay citas agendadas</div>';
        return;
    }
    
    citasList.innerHTML = citas.map(c => `
        <div class="card">
            <div class="card-title">📅 Cita #${c.id}</div>
            <div class="card-detail">
                <strong>Paciente ID:</strong> ${c.pacienteId}
            </div>
            <div class="card-detail">
                <strong>Fecha:</strong> ${c.fecha}
            </div>
            <div class="card-detail">
                <strong>Hora:</strong> ${c.hora}
            </div>
            <div class="card-detail">
                <strong>Médico:</strong> ${c.medico}
            </div>
            <div class="card-detail">
                <strong>Motivo:</strong> ${c.motivo}
            </div>
        </div>
    `).join('');
}

// ============ REGISTRAR PACIENTE ============
pacienteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const edad = document.getElementById('edad').value;
    const telefono = document.getElementById('telefono').value.trim() || 'No registrado';
    const diagnostico = document.getElementById('diagnostico').value.trim() || 'Sin diagnóstico';
    const estado = document.getElementById('estado').value;
    
    if (!nombre || !edad) {
        alert('❌ Nombre y edad son obligatorios');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/pacientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, edad, telefono, diagnostico, estado })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Paciente registrado exitosamente');
            pacienteForm.reset();
            document.querySelector('[data-tab="pacientes"]').click();
            await cargarPacientes();
        }
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
});

// ============ INICIALIZACIÓN ============
async function init() {
    await cargarPacientes();
    await cargarCitas();
    
    // Actualizar cada 30 segundos
    setInterval(cargarPacientes, 30000);
    setInterval(cargarCitas, 30000);
}

init();

console.log('🏥 Sistema Hospital iniciado');
console.log(`📡 API: ${API_URL}`);