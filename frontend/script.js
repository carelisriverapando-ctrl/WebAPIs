// ============ CONFIGURACIÓN ============
// Usar la URL actual (automático)
const API_URL = '/api';  // <--- CAMBIADO: usa la ruta relativa

// El resto del código queda igual...

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
        pacientesList.innerHTML = '<div class="loading">⏳ Cargando pacientes...</div>';
        
        const response = await fetch(`${API_URL}/pacientes`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Pacientes recibidos:', result);
        
        if (result.success) {
            mostrarPacientes(result.data);
            totalPacientes.textContent = result.count || result.data.length;
        } else {
            throw new Error('Error en la respuesta de la API');
        }
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        pacientesList.innerHTML = `
            <div class="error" style="text-align:center;padding:40px;color:#dc3545;">
                ❌ Error: ${error.message}
                <br><small>Verifica que la API esté corriendo en ${API_URL}</small>
            </div>
        `;
    }
}

function mostrarPacientes(pacientes) {
    if (!pacientes || pacientes.length === 0) {
        pacientesList.innerHTML = '<div class="loading">📭 No hay pacientes registrados</div>';
        return;
    }
    
    pacientesList.innerHTML = pacientes.map(p => `
        <div class="card">
            <div class="card-title">${p.nombre}</div>
            <div class="card-detail">
                <strong>Edad:</strong> ${p.edad} años
            </div>
            <div class="card-detail">
                <strong>Teléfono:</strong> ${p.telefono || 'No registrado'}
            </div>
            <div class="card-detail">
                <strong>Diagnóstico:</strong> ${p.diagnostico || 'Sin diagnóstico'}
            </div>
            <div class="card-detail">
                <strong>Estado:</strong>
                <span class="card-status status-${(p.estado || 'activo').toLowerCase().replace(' ', '')}">${p.estado || 'Activo'}</span>
            </div>
            <div class="card-detail">
                <strong>Ingreso:</strong> ${p.fechaIngreso || 'No registrado'}
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
            alert('✅ Paciente eliminado correctamente');
        } else {
            throw new Error('Error al eliminar');
        }
    } catch (error) {
        alert('❌ Error al eliminar paciente');
        console.error(error);
    }
}

// ============ CITAS ============
async function cargarCitas() {
    try {
        citasList.innerHTML = '<div class="loading">⏳ Cargando citas...</div>';
        
        const response = await fetch(`${API_URL}/citas`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Citas recibidas:', result);
        
        if (result.success) {
            mostrarCitas(result.data);
            totalCitas.textContent = result.count || result.data.length;
        } else {
            throw new Error('Error en la respuesta de la API');
        }
    } catch (error) {
        console.error('Error al cargar citas:', error);
        citasList.innerHTML = `
            <div class="error" style="text-align:center;padding:40px;color:#dc3545;">
                ❌ Error: ${error.message}
            </div>
        `;
    }
}

function mostrarCitas(citas) {
    if (!citas || citas.length === 0) {
        citasList.innerHTML = '<div class="loading">📭 No hay citas agendadas</div>';
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
                <strong>Médico:</strong> ${c.medico || 'Médico asignado'}
            </div>
            <div class="card-detail">
                <strong>Motivo:</strong> ${c.motivo || 'Consulta general'}
            </div>
        </div>
    `).join('');
}

// ============ REGISTRAR PACIENTE ============
pacienteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Mostrar mensaje de carga
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    btn.disabled = true;
    
    const nombre = document.getElementById('nombre').value.trim();
    const edad = document.getElementById('edad').value;
    const telefono = document.getElementById('telefono').value.trim() || 'No registrado';
    const diagnostico = document.getElementById('diagnostico').value.trim() || 'Sin diagnóstico';
    const estado = document.getElementById('estado').value;
    
    if (!nombre || !edad) {
        alert('❌ Nombre y edad son obligatorios');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }
    
    const paciente = {
        nombre,
        edad: parseInt(edad),
        telefono,
        diagnostico,
        estado
    };
    
    console.log('Enviando paciente:', paciente);
    
    try {
        const response = await fetch(`${API_URL}/pacientes`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paciente)
        });
        
        console.log('Respuesta status:', response.status);
        
        const result = await response.json();
        console.log('Respuesta:', result);
        
        if (result.success) {
            alert('✅ Paciente registrado exitosamente');
            pacienteForm.reset();
            // Cambiar a la pestaña de pacientes
            document.querySelector('[data-tab="pacientes"]').click();
            await cargarPacientes();
        } else {
            throw new Error(result.error || 'Error al registrar');
        }
    } catch (error) {
        console.error('Error detallado:', error);
        alert(`❌ Error al registrar: ${error.message}`);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// ============ AGREGAR CITA (Función simple) ============
// Agregamos un botón en la interfaz para agregar citas
function agregarCitaSimple() {
    const pacienteId = prompt('ID del paciente:');
    if (!pacienteId) return;
    
    const fecha = prompt('Fecha (YYYY-MM-DD):');
    if (!fecha) return;
    
    const hora = prompt('Hora (HH:MM):');
    if (!hora) return;
    
    const motivo = prompt('Motivo de la cita:');
    const medico = prompt('Médico:');
    
    fetch(`${API_URL}/citas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pacienteId: parseInt(pacienteId),
            fecha,
            hora,
            motivo: motivo || 'Consulta general',
            medico: medico || 'Médico asignado'
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert('✅ Cita agendada exitosamente');
            cargarCitas();
        } else {
            alert('❌ Error: ' + result.error);
        }
    })
    .catch(err => {
        alert('❌ Error: ' + err.message);
    });
}

// ============ INICIALIZACIÓN ============
async function init() {
    console.log('🏥 Sistema Hospital iniciando...');
    console.log(`📡 Conectando a: ${API_URL}`);
    
    // Verificar conexión con la API
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        if (response.ok) {
            console.log('✅ Conexión con API exitosa');
        } else {
            console.warn('⚠️ La API no responde correctamente');
        }
    } catch (error) {
        console.error('❌ No se pudo conectar con la API:', error);
    }
    
    await cargarPacientes();
    await cargarCitas();
    
    // Agregar botón para agregar cita (temporal)
    const citasSection = document.querySelector('#tab-citas .section-header');
    const btnCita = document.createElement('button');
    btnCita.className = 'btn-primary';
    btnCita.style.width = 'auto';
    btnCita.style.padding = '8px 20px';
    btnCita.innerHTML = '<i class="fas fa-plus"></i> Agendar Cita';
    btnCita.onclick = agregarCitaSimple;
    citasSection.appendChild(btnCita);
    
    // Actualizar cada 30 segundos
    setInterval(cargarPacientes, 30000);
    setInterval(cargarCitas, 30000);
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);