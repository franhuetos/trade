let FULL_DATA;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url = urlParams.get('url');
const key = urlParams.get('key');
const StoreService = window.StoreService;
const JSONBIN = window.JSONBIN;

if(url && key){
	JSONBIN.config(url, key);
	StoreService.set('jsonbin', {
		url: url,
		masterKey: key
	});
	const urlActual = window.location.href;
	const urlSinParametros = urlActual.split("?")[0];
	window.location.href = urlSinParametros;
}else{
	init();
}

async function init(){
	let jsonBin = StoreService.get('jsonbin');
	document.getElementById('dataUrl').value = jsonBin.url;
	document.getElementById('masterKey').value = jsonBin.masterKey;
	JSONBIN.config(jsonBin.url, jsonBin.masterKey);

	FULL_DATA = await JSONBIN.get();
	
	if(!FULL_DATA){
		alert('No se han encontrado datos');
		return;
	}

	StoreService.set('chartData', FULL_DATA);
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
}

function formAccionClickHandler(){
	const [beneficio, riesgo] = document.getElementById('ratio').value.split(':');
    const precioActualAccion = Number(document.getElementById('precioActualAccion').value);
	const takeProfitAccion = Number(document.getElementById('takeProfitAccion').value);
	const totalAmount = Number(document.getElementById('totalAmount').value);
	const riskAmount = Number(document.getElementById('riskAmount').value);
	const positionSizeForm = Number(document.getElementById('positionSizeForm').value);

	const incremento = ((takeProfitAccion - precioActualAccion) / precioActualAccion) * 100;
	const detrimento = incremento / Number(beneficio);

	const beneficioAObtener = takeProfitAccion - precioActualAccion;
	const perdidaAObtener = beneficioAObtener / Number(beneficio);

	const stopLooseAccion = precioActualAccion - perdidaAObtener;

	let positionSize = 0;
	if(positionSizeForm && (positionSizeForm > 0)){
		positionSize = positionSizeForm;
	}else{
		positionSize = (totalAmount * riskAmount) / detrimento;
	}
	const perdidaTotal = positionSize * (1 - (detrimento / 100));
	const gananciaTotal = positionSize * (1 + (incremento / 100));
	const perdidaTotalValue = positionSize - perdidaTotal;
	const gananciaTotalValue = gananciaTotal - positionSize;

	document.getElementById('responseEntrada').innerHTML = precioActualAccion;
	document.getElementById('responseTakeProfit').innerHTML = takeProfitAccion;
	document.getElementById('responseStopLoss').innerHTML = stopLooseAccion;
	document.getElementById('responseSize').innerHTML = positionSize;
	document.getElementById('responseWin').innerHTML = gananciaTotal;
	document.getElementById('responseLoss').innerHTML = perdidaTotal;
	document.getElementById('responseWinValue').innerHTML = gananciaTotalValue;
	document.getElementById('responseLossValue').innerHTML = perdidaTotalValue;
}


async function formClickHandler(){
	const fecha = document.getElementById('fecha').value;
    const nuevoCapital = Number(document.getElementById('nuevoCapital').value);
	const importeInvertido = Number(document.getElementById('invertido').value);
    const capitalDisponible = Number(document.getElementById('capitalDisponible').value);
	const COPY_DATA = JSON.parse(JSON.stringify(FULL_DATA));

	let newItem = {
		"name": "",
		"revenue": 0,       // importe de ganancia/perdida de las operaciones cerradas en el dia
		"revenue%": 0,      //  calculado en base a previousValue + revenue
		"deposit": 0,
		"depositTotal": 0,
		"total": {
			"previousValue": 0,  //valor al cierre del dia anterior
			"actualValue": 0,  // el valor actual al cierre del dia incluye el valor nonDeposit
			"nonDeposit": 0,    // dinero no invertido en ninguna accion
			"actualProfit": 0,  // previousValue - actualValue
			"actualProfit%": 0,
		}
	};
	let [year, month, day] = fecha.split('-');
	newItem.name = fecha;
	let thisYear = null;
	let previousMonth = null;

	if (COPY_DATA[year]) {
		//el año ya existe
		thisYear = COPY_DATA[year];
		previousMonth = thisYear && thisYear.months.length ? thisYear.months[thisYear.months.length -1] : getNewItem();
	} else {
		//es un nuevo año
		thisYear = { months: [] };
		let previousYear = COPY_DATA[year - 1];
		previousMonth = previousYear && previousYear.months.length ? previousYear.months[thisYear.months.length -1] : getNewItem();
	}

	newItem = {
		"name": fecha,
		"revenue": 0,       // importe de ganancia/perdida de las operaciones cerradas en el dia
		"revenue%": 0,      //  calculado en base a previousValue + revenue
		"deposit": nuevoCapital,
		"depositTotal": previousMonth.depositTotal + nuevoCapital,
		"total": {
			"previousValue": previousMonth.total.actualValue,  //valor al cierre del dia anterior
			"actualValue": importeInvertido + capitalDisponible,  // el valor actual al cierre del dia incluye el valor nonDeposit
			"nonDeposit": capitalDisponible,    // dinero no invertido en ninguna accion
			"actualProfit": (importeInvertido + capitalDisponible) - previousMonth.total.actualValue,
			"actualProfit%": ((importeInvertido + capitalDisponible) / previousMonth.total.actualValue) * 100,
		}
	}

	COPY_DATA[year].months.push(newItem);
	let response = await JSONBIN.set(COPY_DATA);
	
	if(response){
		StoreService.set('chartData', COPY_DATA);
		alert('Nuevo dato guardado');
	}else{
		alert('Ha ocurrido un error al guardar el dato');
	}
	
	location.reload();
};

function configClickHandler(){
	const dataUrl = document.getElementById('dataUrl').value;
	const masterKey = document.getElementById('masterKey').value;
	if (window.confirm("Estas seguro de querer configurar estos datos?. Perderás la información guardada en localStorage.")) {
		JSONBIN.config(dataUrl, masterKey);
		StoreService.set('jsonbin', {
			url: dataUrl,
			masterKey: masterKey
		});
	}
}


