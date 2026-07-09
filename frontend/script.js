// ============ CONFIGURACIÓN ============
const API_URL = '/api';

// ============ ELEMENTOS DOM ============
const pacientesList = document.getElementById('pacientes-list');
const citasList = document.getElementById('citas-list');
const pacienteForm = document.getElementById('pacienteForm');
const totalPacientes = document.getElementById('totalPacientes');
const totalCitas = document.getElementById('totalCitas');
const ultimosPacientes = document.getElementById('ultimosPacientes');
const proximasCitas = document.getElementById('proximasCitas');

// ============ NAVEGACIÓN ============
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        
        const tab = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        
        // Actualizar título
        const titles = {
            dashboard: 'Dashboard',
            pacientes: 'Pacientes',
            citas: 'Citas Médicas',
            registrar: 'Registrar Paciente'
        };
        document.getElementById('pageTitle').textContent = titles[tab] || 'Dashboard';
    });
});

// ============ PACIENTES ============
async function cargarPacientes() {
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        const result = await response.json();
        
        if (result.success) {
            mostrarPacientes(result.data);
            totalPacientes.textContent = result.count;
            mostrarUltimosPacientes(result.data.slice(0, 5));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarPacientes(pacientes) {
    if (!pacientes || pacientes.length === 0) {
        pacientesList.innerHTML = `<div class="loading-text">📭 No hay pacientes registrados</div>`;
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Paciente</th>
                    <th>Edad</th>
                    <th>Diagnóstico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    pacientes.forEach(p => {
        html += `
            <tr>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.edad} años</td>
                <td>${p.diagnostico || 'Sin diagnóstico'}</td>
                <td><span class="status-badge status-${p.estado.replace(/\s/g, '')}">${p.estado || 'Activo'}</span></td>
                <td>
                    <button class="btn-delete-table" onclick="eliminarPaciente(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    pacientesList.innerHTML = html;
}

function mostrarUltimosPacientes(pacientes) {
    if (!pacientes || pacientes.length === 0) {
        ultimosPacientes.innerHTML = '<p class="loading-text">Sin pacientes recientes</p>';
        return;
    }
    
    ultimosPacientes.innerHTML = pacientes.map(p => `
        <div class="list-item">
            <span class="item-name">${p.nombre}</span>
            <span class="item-meta">${p.diagnostico || 'Sin diagnóstico'}</span>
        </div>
    `).join('');
}

async function eliminarPaciente(id) {
    if (!confirm('¿Eliminar este paciente?')) return;
    
    try {
        await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
        await cargarPacientes();
    } catch (error) {
        alert('Error al eliminar');
    }
}

// ============ CITAS ============
async function cargarCitas() {
    try {
        const response = await fetch(`${API_URL}/citas`);
        const result = await response.json();
        
        if (result.success) {
            mostrarCitas(result.data);
            totalCitas.textContent = result.count;
            mostrarProximasCitas(result.data.slice(0, 5));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarCitas(citas) {
    if (!citas || citas.length === 0) {
        citasList.innerHTML = `<div class="loading-text">📭 No hay citas agendadas</div>`;
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Paciente ID</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    citas.forEach(c => {
        html += `
            <tr>
                <td><strong>#${c.pacienteId}</strong></td>
                <td>${c.fecha}</td>
                <td>${c.hora}</td>
                <td>${c.medico || 'Médico asignado'}</td>
                <td>${c.motivo || 'Consulta'}</td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    citasList.innerHTML = html;
}

function mostrarProximasCitas(citas) {
    if (!citas || citas.length === 0) {
        proximasCitas.innerHTML = '<p class="loading-text">Sin citas próximas</p>';
        return;
    }
    
    proximasCitas.innerHTML = citas.map(c => `
        <div class="list-item">
            <span class="item-name">Paciente #${c.pacienteId}</span>
            <span class="item-meta">${c.fecha} ${c.hora}</span>
        </div>
    `).join('');
}

function mostrarFormularioCita() {
    alert('📅 Para agendar una cita, ve a la pestaña "Registrar" y completa el formulario.');
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
            document.querySelector('[data-tab="dashboard"]').click();
            await cargarPacientes();
            await cargarCitas();
        }
    } catch (error) {
        alert('❌ Error al registrar');
    }
});

// ============ INICIALIZACIÓN ============
async function init() {
    await cargarPacientes();
    await cargarCitas();
}

init();