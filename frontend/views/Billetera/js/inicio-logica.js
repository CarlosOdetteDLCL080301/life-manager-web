const API_URL = "";

// MOCK de datos modificado (eliminado el campo 'icono' y 'tipo' que ya no usaremos en el diseño)
const mockResponse = {
  resumen: {
    porcentajeLibre: 88,
    totalMensualidades: 4500.0,
    totalCompras: 1200.0,
  },
  historial: [
    {
      id: 1,
      concepto: "Red Dead Redemption 2",
      fecha: "29/Junio",
      costo: 850.0,
    },
    { id: 2, concepto: "Comida", fecha: "20/Junio", costo: 200.0 },
    {
      id: 3,
      concepto: "Protector de radios bici",
      fecha: "15/Junio",
      costo: 350.0,
    },
    { id: 4, concepto: "Cita", fecha: "10/Junio", costo: 600.0 },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  cargarDatosDashboard();
});

async function cargarDatosDashboard() {
  let data = mockResponse;

  if (API_URL !== "") {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        data = await response.json();
      } else {
        console.warn("API falló, usando MOCK data.");
      }
    } catch (error) {
      console.error("Error conectando a la API, usando MOCK data:", error);
    }
  }

  renderizarGrafica(data.resumen);
  renderizarHistorial(data.historial);
}

function renderizarGrafica(resumen) {
  document.getElementById("porcentajeCentro").innerText =
    `${resumen.porcentajeLibre}%`;
  const ctx = document.getElementById("walletChart").getContext("2d");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Mensualidades", "Compras", "Libre"],
      datasets: [
        {
          data: [
            resumen.totalMensualidades,
            resumen.totalCompras,
            (resumen.totalMensualidades + resumen.totalCompras) *
              (resumen.porcentajeLibre / (100 - resumen.porcentajeLibre)),
          ],
          backgroundColor: ["#284ca8", "#897dc0", "#f1f5f9"],
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

  if (historial.length === 0) {
    container.innerHTML =
      '<p class="text-center text-slate-400 py-4">No hay movimientos recientes.</p>';
    return;
  }

  historial.forEach((item) => {
    const costoFormateado = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(item.costo);

    // Diseño de la tarjeta simplificado, puramente tipográfico
    const htmlItem = `
                    <div class="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
                        <div>
                            <h4 class="font-bold text-slate-700 text-base">${item.concepto}</h4>
                            <p class="text-sm text-slate-400 mt-0.5">${item.fecha}</p>
                        </div>
                        <div class="text-right pl-4">
                            <span class="font-bold text-brand-900 text-lg">${costoFormateado}</span>
                        </div>
                    </div>
                `;
    container.insertAdjacentHTML("beforeend", htmlItem);
  });
}
