const StoreService = window.StoreService;

(async function init(){
	let FULL_DATA = StoreService.get('chartData');
	
	if(!FULL_DATA){
		alert('No se han encontrado datos');
		return;
	}

	//TODO: ver como se puede adaptar la configuracion para que se pueda cargar dinamicamente
	// sin conocer los datos del JSON
	const availableYears = Object.keys(FULL_DATA);
	let invertido = [];
	let importeAprox = [];
	let chartDataRevenuePercentage = [];
    let chartDataRevenue = [];

	availableYears.forEach((year, index)=>{
		FULL_DATA[year].months.forEach(element => {
			invertido.push({ label: element.name, y: element["depositTotal"] });
			importeAprox.push({ label: element.name, y: element["total"].actualValue });
			chartDataRevenuePercentage.push({ label: element.name, y: element["revenue%"] });
            chartDataRevenue.push({ label: element.name, y: element["revenue"] });
		});
	});


	//TODO: hacer los charts dinamicos para que se pueda leer del json la configuracion
	ChartService.renderChart1("chartContainerTotal", {
		chartTitle: "Total Cartera",
		axisY: {
			title: "Importe Euros",
			color: "#4F81BC",
		},
		data: [
			{
				title: "total",
				color: "#4caf50",
				dataPoints: importeAprox
			},
			{
				title: "invertido",
				color: "#e91e63",
				dataPoints: invertido
			}
		]
	});
	ChartService.renderChart2("chartContainerBeneficio",   {
		chartTitle: "Posiciones cerradas",
		axisY: {
			title: "Importe Euros",
			color: "#4F81BC",
		},
		data: [
			{
				title: "% beneficio",
				color: "#03a9f4",
				dataPoints: chartDataRevenuePercentage
			},
			{
				title: "&#8364; beneficio",
				color: "#e91e63",
				dataPoints: (function(){
					return chartDataRevenue.map(item=>{
						item.color = item.y >=0? "#4caf50" : "#e91e63";
						return item;
					});
				})()
			}
		]
	});	
})();


