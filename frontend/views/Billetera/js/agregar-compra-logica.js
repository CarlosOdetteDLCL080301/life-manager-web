import { getApiUrl } from './../../../global/js/nuestroServidorEs.js';
// Configuración de URLs para la API
const API_GET_USUARIOS = "";
const API_POST_COMPRA = getApiUrl('/compras');

// Referencias del DOM
const form = document.getElementById('formNuevaCompra');
const selectTipo = document.getElementById('tipo');
const contenedorMeses = document.getElementById('contenedorMeses');
const inputMeses = document.getElementById('meses_restantes');
const inputFecha = document.getElementById('fecha');
const selectComprador = document.getElementById('comprador');
const btnGuardar = document.getElementById('btnGuardar');
const mensajeEstado = document.getElementById('mensajeEstado');

document.addEventListener('DOMContentLoaded', () => {
    configurarFechaPorDefecto();
    configurarEventosUI();
    cargarUsuariosGET();
});

// 1. Configurar fecha de hoy por defecto
function configurarFechaPorDefecto() {
    const hoy = new Date();
    // Formatear a YYYY-MM-DD respetando la zona horaria local
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    
    inputFecha.value = `${year}-${month}-${day}`;
}

// 2. Lógica visual: Mostrar/Ocultar campo de meses
function configurarEventosUI() {
    selectTipo.addEventListener('change', (e) => {
        if (e.target.value === 'MSI') {
            contenedorMeses.classList.remove('hidden');
            inputMeses.setAttribute('required', 'true');
            // Pequeña animación para que no aparezca de golpe
            setTimeout(() => contenedorMeses.classList.add('opacity-100'), 10);
        } else {
            contenedorMeses.classList.add('hidden');
            inputMeses.removeAttribute('required');
            inputMeses.value = ''; // Limpiar si cambian de opinión
        }
    });
}

// 3. Petición HTTP GET - Cargar Usuarios
async function cargarUsuariosGET() {
    let usuarios = [];

    if (API_GET_USUARIOS !== "") {
        try {
            const response = await fetch(API_GET_USUARIOS);
            if (response.ok) {
                usuarios = await response.json();
            } else {
                throw new Error("Fallo en la API");
            }
        } catch (error) {
            console.warn("No se pudo conectar a la API GET, usando MOCK.");
            usuarios = obtenerMockUsuarios();
        }
    } else {
        // Si la URL está vacía, cargar el mock directamente
        usuarios = obtenerMockUsuarios();
    }

    // Inyectar en el select
    selectComprador.innerHTML = ''; // Limpiar opciones previas
    usuarios.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.nombre;
        
        // Seleccionar tu nombre por defecto
        if (user.nombre === 'Odette') {
            option.selected = true;
        }
        
        selectComprador.appendChild(option);
    });
}

// 4. Petición HTTP POST - Guardar Compra
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar que la página se recargue

    // Cambiar estado del botón a cargando
    const originalBtnText = btnGuardar.innerHTML;
    btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    btnGuardar.disabled = true;
    mensajeEstado.classList.add('hidden');

    // Recopilar datos del formulario
    const formData = new FormData(form);
    const dataPayload = {
        concepto: formData.get('concepto'),
        tipo: formData.get('tipo'),
        monto: parseFloat(formData.get('monto')),
        fecha: formData.get('fecha'),
        comprador_id: parseInt(formData.get('comprador')),
        meses_restantes: formData.get('tipo') === 'MSI' ? parseInt(formData.get('meses_restantes')) : null
    };

    // Ejecutar la petición POST
    if (API_POST_COMPRA !== "") {
        try {
            const response = await fetch(API_POST_COMPRA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataPayload)
            });

            if (response.ok) {
                mostrarMensaje("Compra registrada con éxito", "success");
                form.reset();
                configurarFechaPorDefecto(); // Restaurar fecha
                contenedorMeses.classList.add('hidden'); // Ocultar meses
            } else {
                throw new Error("Error en el servidor");
            }
        } catch (error) {
            console.error(error);
            mostrarMensaje("Error al conectar con el servidor", "error");
        }
    } else {
        // Simulación MOCK POST (Espera 1 segundo para simular red)
        setTimeout(() => {
            console.log("MOCK POST Exitoso. Datos enviados:", dataPayload);
            mostrarMensaje("Simulación: Compra guardada exitosamente", "success");
            form.reset();
            configurarFechaPorDefecto();
            contenedorMeses.classList.add('hidden');
            btnGuardar.innerHTML = originalBtnText;
            btnGuardar.disabled = false;
        }, 1000);
        return; // Cortar la ejecución aquí para el mock
    }

    // Restaurar botón
    btnGuardar.innerHTML = originalBtnText;
    btnGuardar.disabled = false;
});

// Utilidades Auxiliares
function obtenerMockUsuarios() {
    return [
        { id: 1, nombre: 'Odette' },
        { id: 2, nombre: 'Carlos' },
        { id: 3, nombre: 'Familiar' }
    ];
}

function mostrarMensaje(texto, tipo) {
    mensajeEstado.textContent = texto;
    mensajeEstado.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');
    
    if (tipo === 'success') {
        mensajeEstado.classList.add('bg-green-100', 'text-green-800');
    } else {
        mensajeEstado.classList.add('bg-red-100', 'text-red-800');
    }
}
