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

  let yearInitial = FULL_DATA[0].date.split('-')[0];
  let monthInitial = FULL_DATA[0].date.split('-')[1];
  let prevision1 = calculoAnual(FULL_DATA[0].deposit, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision2 = calculoAnual(prevision1, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision3 = calculoAnual(prevision2, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision4 = calculoAnual(prevision3, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision5 = calculoAnual(prevision4, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision6 = calculoAnual(prevision5, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision7 = calculoAnual(prevision6, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision8 = calculoAnual(prevision7, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision9 = calculoAnual(prevision8, FULL_DATA[0].deposit, mediaMensualGanancias);
  let prevision10 = calculoAnual(prevision9, FULL_DATA[0].deposit, mediaMensualGanancias);

  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 1}: ${prevision1}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 2}: ${prevision2}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 3}: ${prevision3}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 4}: ${prevision4}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 5}: ${prevision5}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 6}: ${prevision6}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 7}: ${prevision7}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 8}: ${prevision8}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 9}: ${prevision9}`);
  console.log(`Prevision ${monthInitial}/${Number(yearInitial) + 10}: ${prevision10}`);

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





