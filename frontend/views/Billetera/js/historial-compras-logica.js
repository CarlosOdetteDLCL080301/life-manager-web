import { getApiUrl } from "./../../../global/js/nuestroServidorEs.js";

const API_URL = getApiUrl("/compras/historial");

// MOCK DE DATOS (Simulando respuesta de FastAPI)
const mockCompras = [
  {
    id: 1,
    concepto: "Despensa Walmart",
    tipo: "TDC",
    metodo: "Débito BBVA",
    monto: 1250.0,
    fecha: "2026-07-12",
    hora: "14:30",
    meses_restantes: null,
    total_meses: null,
  },
  {
    id: 2,
    concepto: "Nintendo Switch OLED",
    tipo: "MSI",
    metodo: "TDC Nu",
    monto: 5999.0,
    fecha: "2026-07-10",
    hora: "18:15",
    meses_restantes: 11,
    total_meses: 12,
  },
  {
    id: 3,
    concepto: "Café Starbucks",
    tipo: "Debito",
    metodo: "Efectivo",
    monto: 120.5,
    fecha: "2026-07-09",
    hora: "08:45",
    meses_restantes: null,
    total_meses: null,
  },
  {
    id: 4,
    concepto: "Pago Internet Izzi",
    tipo: "TDC",
    metodo: "TDC Rappi",
    monto: 550.0,
    fecha: "2026-06-28",
    hora: "10:00",
    meses_restantes: null,
    total_meses: null,
  },
  {
    id: 5,
    concepto: "Audífonos Sony",
    tipo: "MSI",
    metodo: "TDC Nu",
    monto: 2500.0,
    fecha: "2026-05-15",
    hora: "16:20",
    meses_restantes: 1,
    total_meses: 3,
  },
];

// VARIABLE GLOBAL QUE ALMACENA LOS DATOS REALES O EL MOCK
let historialActivo = [];

// CONFIGURACIÓN DE ICONOS Y COLORES POR TIPO
const typeConfig = {
  TDC: { icon: "fa-house", color: "text-blue-500", bg: "bg-blue-50" },
  Debito: { icon: "fa-bolt", color: "text-amber-500", bg: "bg-amber-50" },
  MSI: {
    icon: "fa-calendar-days",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  Efectivo: {
    icon: "fa-wallet",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  }, // Agregado por si acaso
};

const formatMoney = (amount) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    amount,
  );

function formatearFecha(fecha) {
  // Solución para evitar desfases de zona horaria al parsear 'YYYY-MM-DD'
  const [year, month, day] = fecha.split("-");
  const fechaObjeto = new Date(year, month - 1, day);

  const opciones = { day: "2-digit", month: "long", year: "numeric" };
  const partes = new Intl.DateTimeFormat("es-ES", opciones).formatToParts(
    fechaObjeto,
  );

  const dia = partes.find((p) => p.type === "day").value;
  const anio = partes.find((p) => p.type === "year").value;
  let mes = partes.find((p) => p.type === "month").value;

  mes = mes.charAt(0).toUpperCase() + mes.slice(1);
  return `${dia}/${mes}/${anio}`;
}

// RENDERIZADO
function renderData(data) {
  const tableBody = document.getElementById("desktop-table-body");
  const cardContainer = document.getElementById("mobile-card-container");
  const emptyState = document.getElementById("empty-state");

  tableBody.innerHTML = "";
  cardContainer.innerHTML = "";

  if (data.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  data.forEach((item) => {
    // Validación de seguridad por si viene un tipo que no está en la configuración
    const conf = typeConfig[item.tipo] || {
      icon: "fa-receipt",
      color: "text-slate-500",
      bg: "bg-slate-100",
    };

    const estadoBadge =
      item.tipo === "MSI"
        ? `<span class="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-bold">Restan ${item.meses_restantes || "?"}/${item.total_meses || "?"} meses</span>`
        : `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-lg font-bold">Liquidado</span>`;

    // Render PC
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50 transition-colors duration-200";
    tr.innerHTML = `
                    <td class="px-6 py-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center ${conf.bg} ${conf.color} shadow-sm">
                            <i class="fa-solid ${conf.icon}"></i>
                        </div>
                    </td>
                    <td class="px-6 py-4 font-bold text-slate-800">
                        ${item.concepto}
                    </td>
                    <td class="px-6 py-4 text-slate-600 font-medium"><i class="fa-solid fa-credit-card text-slate-400 mr-2"></i>${item.tipo}</td>
                    <td class="px-6 py-4">${estadoBadge}</td>
                    <td class="px-6 py-4 text-slate-500 font-medium">${formatearFecha(item.fecha)} <span class="text-xs ml-1 text-slate-400 font-normal">${item.hora || ""}</span></td>
                    <td class="px-6 py-4 text-right font-black text-slate-900 text-lg">${formatMoney(item.monto)}</td>
                `;
    tableBody.appendChild(tr);

    // Render Móvil
    const card = document.createElement("div");
    card.className = "p-5 flex items-center justify-between";
    card.innerHTML = `
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center mt-1 ${conf.bg} ${conf.color} shadow-sm">
                            <i class="fa-solid ${conf.icon} text-xl"></i>
                        </div>
                        <div>
                            <span class="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider rounded-lg font-bold mb-1.5">${item.tipo}</span>
                            <h3 class="font-bold text-slate-900 leading-tight">${item.concepto}</h3>
                            <div class="flex items-center text-xs text-slate-500 mt-2 gap-2 font-medium">
                                <span><i class="fa-solid fa-wallet mr-1 text-slate-400"></i>${item.metodo || item.tipo}</span>
                                ${item.hora ? `<span class="text-slate-300">•</span><span><i class="fa-regular fa-clock mr-1 text-slate-400"></i>${item.hora}</span>` : ""}
                            </div>
                            <div class="flex items-center text-xs text-slate-500 mt-1 gap-2 font-medium">
                                <span><i class="fa-regular fa-calendar mr-1 text-slate-400"></i>${formatearFecha(item.fecha)}</span>
                                ${item.tipo === "MSI" ? `<span class="text-slate-300">•</span> <span class="text-amber-600 font-bold">Restan ${item.meses_restantes || "?"} meses</span>` : ""}
                            </div>
                        </div>
                    </div>
                    <div class="text-right pl-3 shrink-0">
                        <span class="block text-xl font-black text-slate-900 tracking-tight">${formatMoney(item.monto)}</span>
                    </div>
                `;
    cardContainer.appendChild(card);
  });
}

// LÓGICA DE FILTRADO (Ahora filtra sobre historialActivo, no sobre el mock directamente)
function applyFilters() {
  const searchTerm = document
    .getElementById("filter-search")
    .value.toLowerCase();
  const typeTerm = document.getElementById("filter-type").value;
  const dateStart = document.getElementById("filter-date-start").value;
  const dateEnd = document.getElementById("filter-date-end").value;

  const filteredData = historialActivo.filter((item) => {
    const matchSearch = item.concepto.toLowerCase().includes(searchTerm);
    const matchType = typeTerm === "" || item.tipo === typeTerm;

    let matchDate = true;
    if (dateStart && dateEnd) {
      matchDate = item.fecha >= dateStart && item.fecha <= dateEnd;
    } else if (dateStart) {
      matchDate = item.fecha >= dateStart;
    } else if (dateEnd) {
      matchDate = item.fecha <= dateEnd;
    }

    return matchSearch && matchType && matchDate;
  });
  renderData(filteredData);
}

// FILTROS RÁPIDOS
function quickFilter(action) {
  document.getElementById("filter-search").value = "";
  document.getElementById("filter-type").value = "";
  document.getElementById("filter-date-start").value = "";
  document.getElementById("filter-date-end").value = "";

  // Obtenemos la fecha de hoy real para cálculos dinámicos
  const hoy = new Date();
  const year = hoy.getFullYear();

  // Función auxiliar para formatear fecha a YYYY-MM-DD
  const pad = (n) => n.toString().padStart(2, "0");

  if (action === "mes_actual") {
    const primerDia = new Date(year, hoy.getMonth(), 1);
    const ultimoDia = new Date(year, hoy.getMonth() + 1, 0);

    document.getElementById("filter-date-start").value =
      `${year}-${pad(primerDia.getMonth() + 1)}-01`;
    document.getElementById("filter-date-end").value =
      `${year}-${pad(ultimoDia.getMonth() + 1)}-${pad(ultimoDia.getDate())}`;
  } else if (action === "mes_anterior") {
    const mesAnterior = hoy.getMonth() - 1;
    const primerDia = new Date(year, mesAnterior, 1);
    const ultimoDia = new Date(year, mesAnterior + 1, 0);

    document.getElementById("filter-date-start").value =
      `${primerDia.getFullYear()}-${pad(primerDia.getMonth() + 1)}-01`;
    document.getElementById("filter-date-end").value =
      `${ultimoDia.getFullYear()}-${pad(ultimoDia.getMonth() + 1)}-${pad(ultimoDia.getDate())}`;
  }
  applyFilters();
}

// EVENTOS DE BÚSQUEDA Y FILTRADO
document
  .getElementById("filter-search")
  .addEventListener("input", applyFilters);
document.getElementById("filter-type").addEventListener("change", applyFilters);
document
  .getElementById("filter-date-start")
  .addEventListener("change", applyFilters);
document
  .getElementById("filter-date-end")
  .addEventListener("change", applyFilters);

// FUNCIÓN PRINCIPAL DE CONEXIÓN CON EL BACKEND
async function inicializarHistorial() {
  try {
    // Intentamos golpear tu API de FastAPI
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error de conexión HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Mapeamos los datos para asegurar que los campos cuadren con el frontend
      historialActivo = data.map((item) => ({
        ...item,
        // Extraemos la hora de 'creado_at' si el backend no manda un campo 'hora' específico
        hora:
          item.hora ||
          (item.creado_at
            ? item.creado_at.split("T")[1].substring(0, 5)
            : null),
      }));
      console.log("✅ Datos cargados exitosamente desde la API");
    } else {
      console.log("La base de datos está vacía.");
      historialActivo = [];
    }
  } catch (error) {
    console.warn(
      "⚠️ API no disponible o en error. Usando MOCK de datos:",
      error.message,
    );
    historialActivo = mockCompras; // Cae suavemente al MOCK
  }

  // Una vez resuelto (con API o MOCK), pintamos la tabla
  renderData(historialActivo);
}

// Arrancamos la aplicación
inicializarHistorial();
