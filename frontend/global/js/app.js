/**
 * URL de la API real.
 * Si dejamos vacía (""), cargará el Mock Data automáticamente.
 */
import { getApiUrl } from './nuestroServidorEs.js';

const API_URL = getApiUrl('/dashboard/apps');
console.log("API_URL:", API_URL);
/**
 * MOCK DATA: Tus módulos de prueba
 */
const mockMenuData = [
    { id: 1, titulo: "Mis deudas", icono: "fa-solid fa-wallet", url: "#" },
    { id: 2, titulo: "Mi progreso Gym", icono: "fa-duotone fa-solid fa-weight-hanging", url: "#" },
    { id: 3, titulo: "Mi CV", icono: "fa-solid fa-briefcase", url: "https://software-odette.netlify.app/" },
];

/**
 * Función ultra-segura para obtener datos.
 */
async function fetchMenuData() {
    // Si la URL no está vacía, intentamos consumir la API
    if (API_URL && API_URL.trim() !== "") {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                return data; // Retorna data real si todo sale bien
            } else {
                console.warn(`La API respondió con error: ${response.status}. Usando mock data...`);
            }
        } catch (error) {
            console.warn("Error de conexión con la API. Usando mock data...", error);
        }
    }
    
    // Fallback directo: si no hay URL o el fetch falló, devuelve el mock inmediatamente.
    return mockMenuData;
}

/**
 * Renderiza los botones en la tarjeta blanca
 */
async function renderMenu() {
    const grid = document.getElementById('menu-grid');
    
    // Obtenemos los datos (espera la API o el Mock)
    const data = await fetchMenuData();
    
    // Limpiamos el texto de "Cargando..."
    grid.innerHTML = '';

    // Inyectamos cada botón
    data.forEach(item => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'menu-item';
        
        link.innerHTML = `
            <div class="icon-container">
                <i class="${item.icono}"></i>
            </div>
            <span>${item.titulo}</span>
        `;
        
        grid.appendChild(link);
    });
}

// Iniciar al cargar el documento
document.addEventListener('DOMContentLoaded', renderMenu);