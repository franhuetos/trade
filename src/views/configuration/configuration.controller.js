let FULL_DATA;
const StoreService = window.StoreService;
const UtilsService = window.UtilsService;
const JSONBIN = window.JSONBIN;
let jsonBinConfig = StoreService.get(UtilsService.CONSTANT.SESSION.JSONBIN);

document.getElementById('dataUrl').value = jsonBinConfig.url;
document.getElementById('masterKey').value = jsonBinConfig.masterKey;
document.getElementById('fecha').value = new Date().toISOString().split('T')[0];


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
    let FULL_DATA = StoreService.get(UtilsService.CONSTANT.SESSION.CHART_DATA);
	
	if(!FULL_DATA){
		alert('No se han encontrado datos');
		return;
	}

	const fecha = document.getElementById('fecha').value;
    const nuevoCapital = Number(document.getElementById('nuevoCapital').value);
	const importeInvertido = Number(document.getElementById('invertido').value);
	const COPY_DATA = JSON.parse(JSON.stringify(FULL_DATA));



	let [year, month, day] = fecha.split('-');

	if(Number(year) < 2024){
		alert('Año de la fecha incorrecto');
		return;
	}

	if(Number(month) <= 0 || Number(month) > 12){
		alert('Mes de la fecha incorrecto');
		return;
	}

	if(Number(day) <= 0 || Number(day) > 31){
		alert('Dia de la fecha incorrecto');
		return;
	}

	if(isNaN(nuevoCapital)){
		alert('Nuevo capital incorrecto');
		return;
	}

	if(isNaN(importeInvertido)){
		alert('Importe invertido incorrecto');
		return;
	}

	let totalCapital = nuevoCapital;
	if(FULL_DATA && FULL_DATA.length){
		totalCapital = FULL_DATA[FULL_DATA.length-1].deposit + nuevoCapital;
	}
	

	const newItem = {
		"date": fecha,
		"deposit": totalCapital,
		"current": importeInvertido
	}

	COPY_DATA.push(newItem);
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

async function configClickHandler(){
	const dataUrl = document.getElementById('dataUrl').value;
	const masterKey = document.getElementById('masterKey').value;
	if (window.confirm("Estas seguro de querer configurar estos datos?. Perderás la información guardada en localStorage.")) {
		JSONBIN.config(dataUrl, masterKey);
		StoreService.set(UtilsService.CONSTANT.SESSION.JSONBIN, {
			url: dataUrl,
			masterKey: masterKey
		});
		let response = await JSONBIN.get();
		StoreService.set(UtilsService.CONSTANT.SESSION.CHART_DATA, response);
	}
}


