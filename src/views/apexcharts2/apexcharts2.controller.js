const StoreService = window.StoreService;
const UtilsService = window.UtilsService;

(async function init(){
	let FULL_DATA = StoreService.get(UtilsService.CONSTANT.SESSION.CHART_DATA);
	
	if(!FULL_DATA){
		alert('No se han encontrado datos');
		return;
	}

    let dataChartElements = [];
    let dataSeries2 = [];
    FULL_DATA.forEach((element, index)=>{
        dataChartElements.push([new Date(element.date).getTime(), element["current"].toFixed(2)]);
        dataSeries2.push([new Date(element.date).getTime(), element["deposit"].toFixed(2)])      
    });

    const lastDay = dataChartElements[dataChartElements.length-1][0];    
    
    var options = {
        annotations: {
          yaxis: [
            {
              y: 30,
              borderColor: '#999',
            //   label: {
            //     show: true,
            //     text: 'Support',
            //     style: {
            //       color: '#fff',
            //       background: '#00E396'
            //     }
            //   }
            }
          ],
          xaxis: [
            {
              x: lastDay,
              borderColor: '#999',
              yAxisIndex: 0,
            //   label: {
            //     show: true,
            //     text: 'Rally',
            //     style: {
            //       color: '#fff',
            //       background: '#775DD0'
            //     }
            //   }
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
        tooltip: {
          x: {
            format: 'yyyy-MM-dd'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
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
            newMonth = 12;
            newYear = lastDateFormated.getFullYear() - 1;
        }else{
            newMonth = month;
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
        let monthMinusSix = month - 5;
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





