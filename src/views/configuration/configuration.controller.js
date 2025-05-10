let FULL_DATA;
const StoreService = window.StoreService;
const UtilsService = window.UtilsService;
const JSONBIN = window.JSONBIN;


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


async function addNewItemHandler(){
    let FULL_DATA = StoreService.get('chartData');
	
	if(!FULL_DATA){
		alert('No se han encontrado datos');
		return;
	}

	const fecha = document.getElementById('fecha').value;
    const nuevoCapital = Number(document.getElementById('nuevoCapital').value);
	const importeInvertido = Number(document.getElementById('invertido').value);
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
			"actualValue": importeInvertido,  // el valor actual al cierre del dia incluye el valor nonDeposit
			"nonDeposit": 0,    // dinero no invertido en ninguna accion, deprecado
			"actualProfit": importeInvertido - previousMonth.total.actualValue,
			"actualProfit%": (importeInvertido / previousMonth.total.actualValue) * 100,
		}
	}

	COPY_DATA[year].months.push(newItem);
    const JsonBinConfig = StoreService.get(UtilsService.CONSTANT.SESSION.JSONBIN);
    JSONBIN.config(JsonBinConfig.url, JsonBinConfig.masterKey);
	let response = await JSONBIN.set(COPY_DATA);
	
	if(response){
		StoreService.set(UtilsService.CONSTANT.SESSION.CHART_DATA, COPY_DATA);
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
		StoreService.set(UtilsService.CONSTANT.SESSION.JSONBIN, {
			url: dataUrl,
			masterKey: masterKey
		});
	}
}


