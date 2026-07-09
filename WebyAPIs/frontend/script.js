// Configuración
const API_URL = 'https://tu-api-url.onrender.com/api/productos';

// Elementos DOM
const productsList = document.getElementById('productsList');
const apiStatus = document.getElementById('apiStatus');
const productForm = document.getElementById('productForm');

// Verificar conexión con la API
async function checkApiStatus() {
    try {
        const response = await fetch('https://tu-api-url.onrender.com');
        if (response.ok) {
            apiStatus.textContent = '✅ API conectada correctamente';
            apiStatus.className = 'api-status online';
            return true;
        }
    } catch (error) {
        apiStatus.textContent = '❌ Error al conectar con la API';
        apiStatus.className = 'api-status offline';
        return false;
    }
}

// Cargar productos
async function loadProducts() {
    try {
        productsList.innerHTML = '<div class="loading">Cargando productos...</div>';
        
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        productsList.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Mostrar productos
function displayProducts(products) {
    if (products.length === 0) {
        productsList.innerHTML = '<div class="loading">No hay productos disponibles</div>';
        return;
    }

    productsList.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.nombre}</h3>
            <div class="price">$${product.precio}</div>
            <div class="id">ID: ${product.id}</div>
        </div>
    `).join('');
}

// Agregar nuevo producto
async function addProduct(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, precio })
        });
        
        if (!response.ok) throw new Error('Error al agregar producto');
        
        // Limpiar formulario
        productForm.reset();
        
        // Recargar productos
        await loadProducts();
        
        // Mostrar mensaje de éxito
        alert('✅ Producto agregado correctamente');
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}

// Event listeners
productForm.addEventListener('submit', addProduct);

// Inicializar
async function init() {
    const isConnected = await checkApiStatus();
    if (isConnected) {
        await loadProducts();
    }
}

init();