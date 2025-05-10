const StoreService = window.StoreService;

(async function init(){
	let FULL_DATA = StoreService.get('chartData');
	
	if(!FULL_DATA){
		alert('No se han encontrado datos');
		return;
	}

    let dataChartElements = [];
    let dataSeries2 = [];
    const availableYears = Object.keys(FULL_DATA);
    availableYears.forEach((year, index)=>{
        FULL_DATA[year].months.forEach(element => {
            if(element.name.includes('-')){
                dataChartElements.push([new Date(element.name).getTime(), element["total"].actualValue.toFixed(2)]);
                dataSeries2.push([new Date(element.name).getTime(), element["depositTotal"].toFixed(2)])
            }
        });
    });

    const lastDay = dataChartElements[dataChartElements.length-1][0];

    setAreaChart3(FULL_DATA);
    
    
    var options = {
        annotations: {
          yaxis: [
            // {
            //   y: 30,
            //   borderColor: '#999',
            // //   label: {
            // //     show: true,
            // //     text: 'Support',
            // //     style: {
            // //       color: '#fff',
            // //       background: '#00E396'
            // //     }
            // //   }
            // }
          ],
          xaxis: [
            // {
            //   x: lastDay,
            //   borderColor: '#999',
            //   yAxisIndex: 0,
            // //   label: {
            // //     show: true,
            // //     text: 'Rally',
            // //     style: {
            // //       color: '#fff',
            // //       background: '#775DD0'
            // //     }
            // //   }
            // }
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
        tooltip: {
          x: {
            format: 'yyyy-MM-dd'
          }
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        }
      };
      var chart = new ApexCharts(document.querySelector('#area-chart-2'), options);
      chart.render();
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
        let month = lastDateFormated.getMonth();
        let newYear;
        let newMonth;
        let newDay = lastDateFormated.getDate();
        if(month == 0){
            newMonth = 11;
            newYear = lastDateFormated.getFullYear() - 1;
        }else{
            newMonth = month - 1;
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
        let month = lastDateFormated.getMonth();
        let monthMinusSix = month - 6;
        let newYear;
        let newMonth;
        let newDay = lastDateFormated.getDate();
        if(monthMinusSix < 0){
            newMonth = 12 + monthMinusSix;
            newYear = lastDateFormated.getFullYear() - 1;
        }else{
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
        let newMonth = lastDateFormated.getMonth();
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
            new Date(`${newYear}-01-31`).getTime(),
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
      document.querySelector('#ytd').addEventListener('click', function () {});
})();


function setAreaChart3(FULL_DATA){
  let dataChartElements = [];
    let dataSeries3 = [];
    const availableYears = Object.keys(FULL_DATA);
    let allDays = [];
    availableYears.forEach(year=>{
        FULL_DATA[year].months.forEach((element) => {
          allDays.push(element);
        });
    });

    function calcularImporteDiferencia(invertido, valorReal) {
      return valorReal - invertido;
    }

    function calcularPorcentajeDiferencia(valorInicial, valorFinal) {
      return ((valorFinal - valorInicial) / valorInicial) * 100;
    }

    let previousElement;
    let dataChart3 = [];
    let colors = [];
    allDays.forEach(element=>{  
          dataChart3.push([new Date(element.name).getTime(), calcularImporteDiferencia(element.depositTotal, element.total.actualValue).toFixed(2)]);
          colors.push(calcularImporteDiferencia(element.depositTotal, element.total.actualValue).toFixed(2) > 0? '#e16161' : "#1aaf50");
    });

    const lastDay = dataChart3[dataChart3.length-1][0];
  var options = {
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: '#cc2b22'
        }
      ],
      xaxis: [
        // {
        //   x: lastDay,
        //   borderColor: '#999',
        //   yAxisIndex: 0
        // }
      ]
    },
    chart: {
      type: 'bar',
      height: 320,
      toolbar: {
        show: false
      },
    },
    dataLabels: {
      enabled: false
    },
    series: [
      {
        name: 'Ganancias',
        data: dataChart3,
      }
    ],
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: 100000000,
              color: "#4caf50"
            },
            {
              from: 0,
              to: -100000000,
              color: '#cc2b22'
            }
          ]
        }
      }
    },
    xaxis: {
      type: 'datetime',
      min: dataChart3[0][0],
      tickAmount: 6
    },
    tooltip: {
      x: {
        format: 'yyyy-MM-dd'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    }
  };
  var chart = new ApexCharts(document.querySelector('#area-chart-3'), options);
  chart.render();
}





