const StoreService = window.StoreService;
const UtilsService = window.UtilsService;

(async function init() {
  let FULL_DATA = StoreService.get(UtilsService.CONSTANT.SESSION.CHART_DATA);

  if (!FULL_DATA) {
    alert('No se han encontrado datos');
    return;
  }

  let dataChartElements = [];
  let dataSeries2 = [];
  FULL_DATA.forEach((element, index) => {
    dataChartElements.push([new Date(element.date).getTime(), element["current"].toFixed(2)]);
    dataSeries2.push([new Date(element.date).getTime(), element["deposit"].toFixed(2)])
  });
  const lastDay = dataChartElements[dataChartElements.length - 1][0];

  let chart = initInversionChart(FULL_DATA);
  initGananciasChart(FULL_DATA);
  initPorcentageChart(FULL_DATA)



  var resetCssClasses = function (activeEl) {
    var els = document.querySelectorAll('button');
    Array.prototype.forEach.call(els, function (el) {
      el.classList.remove('active');
    });

    activeEl.target.classList.add('active');
  };
  document.querySelector('#one_month').addEventListener('click', function (e) {
    resetCssClasses(e);
    let lastDateFormated = new Date(lastDay);
    let month = lastDateFormated.getMonth() + 1;
    let newYear;
    let newMonth;
    let newDay = lastDateFormated.getDate();
    if (month == 1) {
      newMonth = 12;
      newYear = lastDateFormated.getFullYear() - 1;
    } else {
      newMonth = month - 1;
      newYear = lastDateFormated.getFullYear();
    }
    chart.zoomX(
      new Date(`${newYear}-${newMonth}-${newDay}`).getTime(),
      lastDay
    );
  });
  document.querySelector('#three_months').addEventListener('click', function (e) {
    resetCssClasses(e);
    let lastDateFormated = new Date(lastDay);
    let month = lastDateFormated.getMonth() + 1;
    let monthMinusThree = month - 3;
    let newYear;
    let newMonth;
    let newDay = lastDateFormated.getDate();
    if (monthMinusThree < 0) {
      newMonth = 12 + monthMinusThree;
      newYear = lastDateFormated.getFullYear() - 1;
    } else {
      newMonth = monthMinusThree;
      newYear = lastDateFormated.getFullYear();
    }
    chart.zoomX(
      new Date(`${newYear}-${newMonth}-${newDay}`).getTime(),
      lastDay
    );
  });
  document.querySelector('#six_months').addEventListener('click', function (e) {
    resetCssClasses(e);
    let lastDateFormated = new Date(lastDay);
    let month = lastDateFormated.getMonth() + 1;
    let monthMinusSix = month - 6;
    let newYear;
    let newMonth;
    let newDay = lastDateFormated.getDate();
    if (monthMinusSix < 0) {
      newMonth = 12 + monthMinusSix;
      newYear = lastDateFormated.getFullYear() - 1;
    } else {
      newMonth = monthMinusSix;
      newYear = lastDateFormated.getFullYear();
    }
    chart.zoomX(
      new Date(`${newYear}-${newMonth}-${newDay}`).getTime(),
      lastDay
    );
  });
  document.querySelector('#one_year').addEventListener('click', function (e) {
    resetCssClasses(e);
    let lastDateFormated = new Date(lastDay);
    let newYear = lastDateFormated.getFullYear() - 1;
    let newMonth = lastDateFormated.getMonth() + 1;
    let newDay = lastDateFormated.getDate();
    chart.zoomX(
      new Date(`${newYear}-${newMonth}-${newDay}`).getTime(),
      lastDay
    );
  });
  document.querySelector('#ytd').addEventListener('click', function (e) {
    resetCssClasses(e);
    let lastDateFormated = new Date(lastDay);
    let newYear = lastDateFormated.getFullYear();
    chart.zoomX(
      new Date(`${newYear}-01-01`).getTime(),
      lastDay
    );
  });
  document.querySelector('#all').addEventListener('click', function (e) {
    resetCssClasses(e);
    chart.zoomX(
      undefined,
      undefined
    );
  });
  document.querySelector('#ytd').addEventListener('click', function () { });

})();

function initInversionChart(FULL_DATA) {
  let dataChartElements = [];
  let dataSeries2 = [];
  FULL_DATA.forEach((element, index) => {
    dataChartElements.push([new Date(element.date).getTime(), element["current"].toFixed(2)]);
    dataSeries2.push([new Date(element.date).getTime(), element["deposit"].toFixed(2)])
  });

  const lastDay = dataChartElements[dataChartElements.length - 1][0];

  var options = {
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: '#999',
        }
      ],
      xaxis: [
        {
          x: lastDay,
          borderColor: '#999',
          yAxisIndex: 0
        }
      ]
    },
    chart: {
      type: 'line',
      height: 320,
      toolbar: {
        show: false
      },
      id: 'total',
      group: 'inversiones',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [5, 5],
      curve: 'straight',
      dashArray: [0, 5]
    },
    series: [
      {
        name: 'Total',
        data: dataChartElements
      },
      {
        name: 'Invertido',
        data: dataSeries2
      }
    ],
    markers: {
      size: 0,
      style: 'hollow'
    },
    colors: ["#4caf50", "#03a9f4"],
    xaxis: {
      type: 'datetime',
      min: dataChartElements[0][0],
      tickAmount: 6
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(2) + '&euro;';
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd-MM-yyyy'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
  };
  const chart = new ApexCharts(document.querySelector('#area-chart-2'), options);
  chart.render();
  return chart;
}

function initGananciasChart(FULL_DATA) {

  let dataChartElements = [];

  FULL_DATA.forEach((element, index) => {
    const ganancia = element["current"].toFixed(2) - element["deposit"].toFixed(2);
    dataChartElements.push([new Date(element.date).getTime(), ganancia]);
  });

  var options = {
    chart: {
      type: 'line',
      height: 320,
      toolbar: {
        show: false
      },
      id: 'total',
      group: 'inversiones',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [5, 5],
      curve: 'straight',
      dashArray: [0, 5]
    },
    series: [
      {
        name: 'Total',
        data: dataChartElements
      }
    ],
    markers: {
      size: 0,
      style: 'hollow'
    },
    colors: ["#4caf50"],
    xaxis: {
      type: 'datetime',
      min: dataChartElements[0][0],
      tickAmount: 6
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(2) + '€';
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd-MM-yyyy'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
  };
  let chart = new ApexCharts(document.querySelector('#ganancias-chart'), options);
  chart.render();
}

function initPorcentageChart(FULL_DATA) {

  let dataChartElements = [];
  let previousMonth = null;
  let previousGanancia = 0;

  FULL_DATA.forEach((element, index) => {
    const month = element.date.split('-')[1];
    if (month != previousMonth) {
      let ganancia = element["current"] - element["deposit"];
      let diferenciaGanancia = ganancia - previousGanancia;
      previousGanancia = ganancia;

      let gananciaActual = calcularPorcentaje(element["deposit"], diferenciaGanancia);
      dataChartElements.push([new Date(element.date).getTime(), gananciaActual]);
      previousMonth = month;
      previousDeposit = element["deposit"];
    }
    if (index == FULL_DATA.length - 1) {
      let ganancia = element["current"] - element["deposit"];
      let diferenciaGanancia = ganancia - previousGanancia;
      previousGanancia = ganancia;

      let gananciaActual = calcularPorcentaje(element["deposit"], diferenciaGanancia);
      dataChartElements.push([new Date(element.date).getTime(), gananciaActual]);
      previousMonth = month;
      previousDeposit = element["deposit"];
    }
  });

  const mediaMensualGanancias = calcularMediaMensualGanancias(dataChartElements);
  const mediaAnualGanancias = calcularMediaAnualGanancias(dataChartElements);

  showPrediccion(FULL_DATA, mediaMensualGanancias);
  

  var options = {
    chart: {
      type: 'line',
      height: 320,
      toolbar: {
        show: false
      },
      id: 'total',
      group: 'inversiones',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [5, 5],
      curve: 'straight',
      dashArray: [0, 5]
    },
    series: [
      {
        name: 'Total',
        data: dataChartElements
      }
    ],
    markers: {
      size: 0,
      style: 'hollow'
    },
    colors: ["#4caf50"],
    xaxis: {
      type: 'datetime',
      min: dataChartElements[0][0],
      tickAmount: 6
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toFixed(2) + '%';
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd-MM-yyyy'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    annotations: {
      yaxis: [{
        y: mediaMensualGanancias,
        borderColor: '#0071e3ff',
        label: {
          borderColor: '#0071e3ff',
          style: {
            color: '#fff',
            background: '#0071e3ff',
          },
          text: `${mediaMensualGanancias.toFixed(2)}% Mensual`,
        }
      },
    {
        y: mediaAnualGanancias,
        borderColor: '#0071e3ff',
        label: {
          borderColor: '#0071e3ff',
          style: {
            color: '#fff',
            background: '#0071e3ff',
          },
          text: `${mediaAnualGanancias.toFixed(2)}% Anual`,
        }
      }]
    }

  };
  let chart = new ApexCharts(document.querySelector('#porcentage-chart'), options);
  chart.render();
}

// function calcularPorcentaje(valorInicial , valorFinal ) {
//   const diferencia = valorFinal - valorInicial; // 120 - 100 = 20
//   const porcentajeIncremento = (diferencia / valorInicial) * 100; // (20 / 100) * 100 = 20

//   return porcentajeIncremento;
// }

function calcularPorcentaje(numeroTotal, numeroParcial) {
  const porcentaje = (numeroParcial / numeroTotal) * 100;
  return porcentaje;
}

function calcularMediaMensualGanancias(arrayObjetos) {
  // 1. Asegurarse de que el array no esté vacío
  if (arrayObjetos.length === 0) {
    return 0; // o NaN, o lanzar un error, según el caso de uso
  }

  // 2. Usar reduce() para sumar todos los precios
  const sumaPrecios = arrayObjetos.reduce((acumulador, arrayActual) => {
    return acumulador + arrayActual[1];
  }, 0); // El 0 es el valor inicial del acumulador

  // 3. Calcular la media
  const media = sumaPrecios / arrayObjetos.length;
  return media;
}

function calcularMediaAnualGanancias(arrayObjetos) {
   // 1. Asegurarse de que el array no esté vacío
  if (arrayObjetos.length === 0) {
    return 0; // o NaN, o lanzar un error, según el caso de uso
  }

  let year;
  let previousYear = new Date(arrayObjetos[0][0]).toISOString().split('T')[0].split('-')[0];
  let acumuladorAnual = 0;
  let arrayAnual = [];

  arrayObjetos.forEach((element, index) => {
    year = new Date(element[0]).toISOString().split('T')[0].split('-')[0];
    if (year != previousYear) {
      arrayAnual.push(acumuladorAnual);
      previousYear = year;
      acumuladorAnual = 0;
    }

    acumuladorAnual += element[1];
    
  });

  if (year == previousYear) {
      arrayAnual.push(acumuladorAnual);
    }

  let mediaAnual = arrayAnual.reduce((acumulador, elementoActual) => {
    return acumulador + elementoActual;
  }, 0) / arrayAnual.length;

  return mediaAnual;
}

function calculoAnual(importeInicial, incremento, porcentage){
  let importeTotal = importeInicial;
  for(let i = 1; i<=12; i++){
    importeTotal = importeTotal + (importeInicial * (porcentage/100));
    importeTotal = importeTotal + incremento;
  }
  return importeTotal;
}

function showPrediccion(FULL_DATA, mediaMensualGanancias){
  let yearInitial = FULL_DATA[0].date.split('-')[0];
  let monthInitial = FULL_DATA[0].date.split('-')[1];
  let prevision = [];
  let originalInversion = FULL_DATA[0].deposit;
  let importeAnterior = FULL_DATA[0].deposit;
  for(let i = 0; i < 20; i++){
    importeAnterior = calculoAnual(importeAnterior, originalInversion, mediaMensualGanancias)
    prevision.push(importeAnterior);
  }

  const parrafo = document.getElementById('prediccion');
  let text = '';
  for(let i = 0; i < prevision.length; i++){
    text+= `Prevision ${monthInitial}/${Number(yearInitial) + i + 1}: ${prevision[i]} \n`;
  }
  parrafo.innerText = text;
}





