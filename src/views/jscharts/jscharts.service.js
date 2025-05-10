

(function(window){
    window = window || {};

    //TODO: no se para que vale esta función la copie y la pege
    function toggleDataSeries(e) {
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		chartTotal.render();
	}

    // Hacer que sea configurable mediante un formulario, los datos que quieres obtener
    // ejemplo: 
    // titulo del chart
    // literales de las partes del chart
    // propiedades de las que obtener los datos
    // {
    //     chartTitle: "Total Cartera",
    //     axisY: {
    //         title: "Importe Euros",
    //         color: "#4F81BC",
    //     },
    //     data: [
    //         {
    //             title: "total",
    //             color: "#4caf50",
    //             dataPoints: importeAprox
    //         },
    //         {
    //             title: "invertido",
    //             color: "#e91e63",
    //             dataPoints: invertido
    //         }
    //     ]
    // }
    function renderChart1(chartName, config){
        var chartTotal = new CanvasJS.Chart(chartName, {
            animationEnabled: true,
            title:{
                text: config.chartTitle
            },	
            axisY: {
                title: config.axisY.title,
                titleFontColor: config.axisY.color,
                lineColor: config.axisY.color,
                labelFontColor: config.axisY.color,
                tickColor: config.axisY.color
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor:"pointer",
                itemclick: toggleDataSeries
            },
            data: [
            {
                type: "line",	
                name: config.data[0].title,
                legendText: config.data[0].title,
                // axisYType: "secondary",
                showInLegend: true,
                color: config.data[0].color,
                dataPoints: config.data[0].dataPoints
            },
            {
                type: "line",	
                name: config.data[1].title,
                legendText: config.data[1].title,
                // axisYType: "secondary",
                showInLegend: true,
                color: config.data[1].color,
                dataPoints: config.data[1].dataPoints
            }
          ]
        });
        chartTotal.render();
    }

    function renderChart2(chartName, config){
        var chartBeneficio = new CanvasJS.Chart(chartName, {
            animationEnabled: true,
            title:{
                text: config.chartTitle
            },	
            axisY: {
                title: config.axisY.title,
                titleFontColor: config.axisY.color,
                lineColor: config.axisY.color,
                labelFontColor: config.axisY.color,
                tickColor: config.axisY.color
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor:"pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "column",
                name: config.data[0].title,
                legendText: config.data[0].title,
                showInLegend: true, 
                color: config.data[0].color,
                dataPoints: config.data[0].dataPoints
            },
            {
                type: "column",	
                name: config.data[1].title,
                legendText: config.data[1].title,
                // axisYType: "secondary",
                showInLegend: true,
                // color: "#4caf50",
                dataPoints: config.data[1].dataPoints
            }
        ]
        });
        chartBeneficio.render();
    }


    window.ChartService = {
        renderChart1: renderChart1,
        renderChart2: renderChart2
    }
})(window);