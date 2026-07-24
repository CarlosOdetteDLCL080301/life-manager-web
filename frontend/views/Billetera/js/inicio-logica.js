// Configuración base
import { getApiUrl } from "./../../../global/js/nuestroServidorEs.js";
const SUELDO_TOTAL = 7000.0;
let chartInstancia = null;

//endpoints
const ENDPOINTS = {
  TDC: getApiUrl("/compras/tdc"),
  MSI: getApiUrl("/compras/msi"),
  DEBITO: getApiUrl("/compras/debito"),
  EFECTIVO: getApiUrl("/compras/efectivo"),
  RECIENTES: getApiUrl("/compras/recientes")
};
// Formateador de moneda
const formatMoney = (amount) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    amount,
  );

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosDashboard();
});

/**
 * Calcula dinámicamente las fechas de corte (del 06 al 06)
 * Si hoy es antes del día 6, el inicio es el mes pasado.
 */
function calcularPeriodosCorte() {
  const hoy = new Date();
  let anioInicio = hoy.getFullYear();
  let mesInicio = hoy.getMonth();
  let anioFin = anioInicio;
  let mesFin = mesInicio + 1;

  // Si aún no es día 6, retrocedemos un mes para el inicio
  if (hoy.getDate() < 6) {
    mesInicio -= 1;
    mesFin -= 1;
  }

  // Ajuste de años si brincamos enero/diciembre
  if (mesInicio < 0) {
    mesInicio = 11;
    anioInicio -= 1;
  }
  if (mesFin > 11) {
    mesFin = 0;
    anioFin += 1;
  }

  const pad = (n) => String(n + 1).padStart(2, "0"); // +1 porque getMonth es 0-11

  return {
    fechaInicio: `${anioInicio}-${pad(mesInicio)}-06`,
    fechaFin: `${anioFin}-${pad(mesFin)}-06`,
  };
}

/**
 * Orquestador principal de peticiones
 */
async function cargarDatosDashboard() {
  const { fechaInicio, fechaFin } = calcularPeriodosCorte();

  // Actualizamos el texto del periodo en la tarjeta TDC
  document.getElementById("periodo-cortes").innerText =
    `Corte: ${fechaInicio} al ${fechaFin}`;

  // Estructura MOCK por defecto (Actualizada con Efectivo)
  let datosCargados = {
    totalTDC: 1946.98,
    totalMSI: 4651.74,
    totalDebito: 100,
    totalEfectivo: 100,
    recientes: [
      {
        id: 1,
        concepto: "Suscripción Gimnasio",
        fecha: "2026-07-20",
        costo: 600.0,
        tipo: "TDC",
      },
      {
        id: 2,
        concepto: "Protector de radios bici",
        fecha: "2026-07-15",
        costo: 350.0,
        tipo: "Debito",
      },
      {
        id: 3,
        concepto: "Red Dead Redemption 2",
        fecha: "2026-07-10",
        costo: 850.0,
        tipo: "MSI",
      },
      {
        id: 4,
        concepto: "Café Starbucks",
        fecha: "2026-07-09",
        costo: 120.5,
        tipo: "Efectivo",
      },
    ],
  };
  console.log("Datos MOCK iniciales:", datosCargados);
  try {
    // Disparamos todos los endpoints al mismo tiempo (Concurrencia para velocidad)
    const [resTDC, resMSI, resDebito, resEfectivo, resRecientes] =
      await Promise.all([
        fetch(
          `${ENDPOINTS.TDC}?inicio=${fechaInicio}&fin=${fechaFin}`,
        ),
        fetch(
          `${ENDPOINTS.MSI}?inicio=${fechaInicio}&fin=${fechaFin}`,
        ),
        fetch(
          `${ENDPOINTS.DEBITO}?inicio=${fechaInicio}&fin=${fechaFin}`,
        ),
        fetch(
          `${ENDPOINTS.EFECTIVO}?inicio=${fechaInicio}&fin=${fechaFin}`,
        ),
        fetch(`${ENDPOINTS.RECIENTES}`),
      ]);
      console.log( `${ENDPOINTS.TDC}?inicio=${fechaInicio}&fin=${fechaFin}`);
      console.log( `${ENDPOINTS.MSI}?inicio=${fechaInicio}&fin=${fechaFin}`);
      console.log( `${ENDPOINTS.DEBITO}?inicio=${fechaInicio}&fin=${fechaFin}`);
      console.log( `${ENDPOINTS.EFECTIVO}?inicio=${fechaInicio}&fin=${fechaFin}`);
      console.log( `${ENDPOINTS.RECIENTES}`);
    // Si los endpoints responden bien, reemplazamos el mock
    if (
      resTDC.ok &&
      resMSI.ok &&
      resDebito.ok &&
      resEfectivo.ok &&
      resRecientes.ok
    ) {
      datosCargados.totalTDC = (await resTDC.json()).total || 0;
      datosCargados.totalMSI = (await resMSI.json()).total || 0;
      datosCargados.totalDebito = (await resDebito.json()).total || 0;
      datosCargados.totalEfectivo = (await resEfectivo.json()).total || 0;
      datosCargados.recientes = await resRecientes.json();
    } else {
      console.warn("Endpoints no listos. Usando MOCK de datos.");
    }
  } catch (error) {
    console.warn("API apagada o error de red. Usando MOCK de datos.");
  }

  actualizarInterfaz(datosCargados);
}

/**
 * Calcula las matemáticas y pinta toda la UI
 */
function actualizarInterfaz(datos) {
  // 1. Matemáticas
  const gastosTotales =
    datos.totalTDC + datos.totalMSI + datos.totalDebito + datos.totalEfectivo;
  const sueldoRestante = SUELDO_TOTAL - gastosTotales;

  // Porcentaje libre (evitamos números negativos en la gráfica)
  let porcentajeLibre = 0;
  if (sueldoRestante > 0) {
    porcentajeLibre = ((sueldoRestante / SUELDO_TOTAL) * 100).toFixed(1);
  }

  // 2. Pintar Tarjetas Grandecitas
  document.getElementById("monto-tdc").innerText = formatMoney(
    datos.totalTDC + datos.totalMSI,
  );

  const restanteDOM = document.getElementById("monto-restante");
  restanteDOM.innerText = formatMoney(sueldoRestante);

  // Si te pasas del sueldo, el texto se pone en alerta roja
  if (sueldoRestante < 0) {
    restanteDOM.classList.replace("text-slate-800", "text-red-500");
  }

  // 3. Pintar Gráfica con los 5 bloques separados
  renderizarGrafica(
    datos.totalMSI,
    datos.totalTDC,
    datos.totalDebito,
    datos.totalEfectivo,
    sueldoRestante,
    porcentajeLibre,
  );

  // 4. Pintar Historial Reciente
  renderizarHistorial(datos.recientes);
}

function renderizarGrafica(msi, tdc, debito, efectivo, restante, porcentaje) {
  document.getElementById("porcentajeCentro").innerText = `${porcentaje}%`;
  const ctx = document.getElementById("walletChart").getContext("2d");

  // Destruir gráfica anterior si existe (evita bugs de canvas al recargar)
  if (chartInstancia) chartInstancia.destroy();

  // Si el restante es negativo, mostramos 0 en la sección libre
  const valorLibreGrafica = restante > 0 ? restante : 0;

  chartInstancia = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["MSI", "TDC", "Débito", "Efectivo", "Libre"],
      datasets: [
        {
          data: [msi, tdc, debito, efectivo, valorLibreGrafica],
          // Colores de la paleta 'brand'
          backgroundColor: [
            "#284ca8",
            "#897dc0",
            "#002890",
            "#c6b3d9",
            "#f1f5f9",
          ],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "80%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (context.label === "Libre") return " Saldo Libre";
              return ` $${context.raw.toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

function renderizarHistorial(historial) {
  const container = document.getElementById("historialContainer");
  container.innerHTML = "";

  if (!historial || historial.length === 0) {
    container.innerHTML =
      '<p class="text-center text-slate-400 py-4">No hay movimientos recientes.</p>';
    return;
  }
  //Visualizaremos el contenido del historial en la consola para depuración
  console.log("Historial Reciente:", historial);


  historial.forEach((item) => {
    // Asignamos colores a la etiqueta según el tipo
    const coloresBadge = {
      TDC: "bg-blue-50 text-blue-600",
      Debito: "bg-amber-50 text-amber-600",
      MSI: "bg-purple-50 text-purple-600",
      Efectivo: "bg-emerald-50 text-emerald-600",
    };
    const badgeClass = coloresBadge[item.tipo] || "bg-slate-100 text-slate-600";

    const htmlItem = `
            <div class="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                <div>
                    <h4 class="font-bold text-slate-700 text-base">${item.concepto}</h4>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs px-2 py-0.5 rounded-md font-bold ${badgeClass}">${item.tipo}</span>
                        <p class="text-xs text-slate-400">${item.fecha}</p>
                    </div>
                </div>
                <div class="text-right pl-4 shrink-0">
                    <span class="font-bold text-slate-800 text-lg">${formatMoney(item.costo || item.monto)}</span>
                </div>
            </div>
        `;
    container.insertAdjacentHTML("beforeend", htmlItem);
  });
}
