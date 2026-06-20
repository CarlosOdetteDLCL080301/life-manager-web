/**
 * MOCK DATA: Información de respaldo (Plan B).
 * Se usará solo si la API real falla o aún no está configurada.
 */
const mockAPI = {
    profile: {
        name: "Carlos Odette De La Cruz López",
        title: "Ingeniero en Computación",
        description: "Desarrollador web con experiencia en automatización de procesos y gestión de servidores. Apasionado por la optimización de sistemas y la implementación de soluciones tecnológicas eficientes.",
        photoUrl: "https://software-odette.netlify.app/assets/carlos%20odette-DL1xFTWi.png" 
    },
    apps: [
        { id: 1, name: "Proyecto 1", icon: "fas fa-hospital", url: "https://odette.admimpulsa.com.mx/proyecto1" },
        { id: 2, name: "Visita en casa", icon: "fas fa-stethoscope", url: "/proyecto2" },
        { id: 3, name: "Video Consulta", icon: "fas fa-video", url: "/proyecto3" },
        { id: 4, name: "Farmacia", icon: "fas fa-prescription-bottle-alt", url: "/farmacia" },
        { id: 5, name: "Enfermedades", icon: "fas fa-viruses", url: "/enfermedades" },
        { id: 6, name: "Covid-19", icon: "fas fa-shield-virus", url: "/covid" }
    ],
    experience: [
        {
            role: "Analista de Datos",
            company: "ImpulsaBTL",
            location: "Gustavo A. Madero, CDMX",
            date: "Abril 2024 - Actualidad",
            tasks: [
                "Preparé y limpié datos provenientes de CSV y bases de datos para generar reportes operativos.",
                "Implementé procesos de automatización en Excel y scripts."
            ]
        },
        {
            role: "Desarrollador Full-Stack",
            company: "Impulsa Estrategias Publicitarias",
            location: "CDMX",
            date: "Enero 2024 - Actualidad",
            tasks: [
                "Desarrollo de backends y webhooks utilizando Java y Python.",
                "Creación de interfaces y consumo de APIs externas."
            ]
        }
    ],
    projects: [
        {
            id: 1,
            title: "MisDeudas Bot",
            description: "Bot financiero desarrollado con Python, FastAPI y Telegram API para el seguimiento de gastos, con backend gestionado en Supabase.",
            imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop", 
            repoUrl: "#"
        },
        {
            id: 2,
            title: "Gestión de Centralita IP",
            description: "Coordinación, configuración y pruebas de un sistema de conmutador virtual y telefonía IP para optimizar la comunicación empresarial.",
            imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
            repoUrl: "#"
        }
    ],
    // NUEVO: Sobre Mí
    about: {
        text: "Soy Ingeniero en Computación egresado de la UNAM, enfocado en el desarrollo Full-Stack y Backend con tecnologías como Java y Python. Disfruto trabajar en entornos Linux y explorar soluciones de infraestructura. Fuera del código, divido mi tiempo entre la administración de un negocio de servicio técnico, el entrenamiento físico (rutinas Upper/Lower), aprender a tocar el piano y visitar museos de arte e historia."
    }
};

/**
 * URLs DE TUS APIs REALES
 * Aquí colocarás los enlaces a tus endpoints cuando los tengas listos.
 * Si dejas el string vacío (""), el sistema usará el mock data automáticamente.
 */
const apiEndpoints = {
    profile: "", // Ejemplo: "https://tu-api.com/v1/perfil"
    apps: "",    // Ejemplo: "https://tu-api.com/v1/proyectos"
    experience: "", // Ejemplo: "https://tu-api.com/v1/experiencia"
    projects: "", // Ejemplo: "https://tu-api.com/v1/proyectos-destacados"
    about: ""     // Ejemplo: "https://tu-api.com/v1/sobre-mi"
};

/**
 * Función central para obtener datos.
 * Intenta consumir la API real; si falla, retorna la Mock Data.
 */
async function fetchAPI(endpointName) {
    const realUrl = apiEndpoints[endpointName];

    // 1. Si configuraste una URL, intentamos hacer la petición real
    if (realUrl !== "") {
        try {
            const response = await fetch(realUrl);
            
            // Si la respuesta no es OK (ej. error 404 o 500), forzamos el error
            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.status}`);
            }
            
            // Si todo salió bien, convertimos a JSON y retornamos la data real
            const realData = await response.json();
            console.log(`Datos reales cargados para: ${endpointName}`);
            return realData;
            
        } catch (error) {
            // Si hubo un error (red, servidor caído, etc.), lo mostramos en consola
            console.warn(`Fallo al cargar API real para '${endpointName}'. Usando Mock Data. Detalles:`, error);
        }
    }

    // 2. Si no hay URL configurada o la petición falló, retornamos el Mock Data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAPI[endpointName]);
        }, 300); // Simulamos un ligero retraso de red de 300ms
    });
}

/**
 * Funciones de Renderizado (Pintar en el HTML)
 * Estas funciones no cambian, ya que fetchAPI() se encarga de entregarles
 * los datos correctos sin importar de dónde vengan.
 */

async function loadProfile() {
    const data = await fetchAPI('profile');
    document.getElementById('hero-name').textContent = data.name;
    document.getElementById('hero-title').textContent = data.title;
    document.getElementById('hero-desc').textContent = data.description;
    
    const imgElement = document.getElementById('hero-img');
    imgElement.src = data.photoUrl;
    imgElement.onerror = () => imgElement.src = 'https://via.placeholder.com/250';
}

async function loadAppMenu() {
    const apps = await fetchAPI('apps');
    const gridContainer = document.getElementById('app-grid');
    gridContainer.innerHTML = '';

    apps.forEach(app => {
        const anchor = document.createElement('a');
        anchor.href = app.url;
        anchor.className = 'menu-item';
        anchor.innerHTML = `
            <i class="${app.icon}"></i>
            <span>${app.name}</span>
        `;
        gridContainer.appendChild(anchor);
    });
}

async function loadExperience() {
    const experiences = await fetchAPI('experience');
    const timelineContainer = document.getElementById('experience-timeline');
    timelineContainer.innerHTML = '';

    experiences.forEach(job => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        const tasksHtml = job.tasks.map(task => `<li>${task}</li>`).join('');

        item.innerHTML = `
            <h4>${job.role}</h4>
            <div class="company">${job.company}</div>
            <span class="date">${job.location} | ${job.date}</span>
            <ul>
                ${tasksHtml}
            </ul>
        `;
        timelineContainer.appendChild(item);
    });
}

async function loadProjects() {
    const projectsData = await fetchAPI('projects');
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';

    projectsData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        card.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">
            <div class="project-info">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <a href="${project.repoUrl}" class="btn btn-outline" style="color: var(--color1); border-color: var(--color1);">Ver detalles</a>
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

async function loadAbout() {
    const aboutData = await fetchAPI('about');
    document.getElementById('about-text').textContent = aboutData.text;
}

/**
 * Iniciar todo al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadAppMenu();
    loadExperience();
    loadProjects(); 
    loadAbout();    
});