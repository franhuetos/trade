const SOLARIA = {
    INVERSION: {
        numeroAcciones: 15,
        precioMedioXAccion: 8.461,
        dineroGastado: 126.92,
        valorActual: null,
        valorFinal: null
    },
    PRECIO_ACTUAL_COMPRA_ACCION: 6.424,
    PRECIO_ACTUAL_VENTA_ACCION: 6.424,
    PRECIO_OBJETIVO_ACCION: 6.5  
}

const MERLIN = {
    INVERSION: {
        numeroAcciones: 12,
        precioMedioXAccion: 10.367,
        dineroGastado: 124.41,
        valorActual: null,
        valorFinal: null
    },
    PRECIO_ACTUAL_COMPRA_ACCION: 10.040,
    PRECIO_ACTUAL_VENTA_ACCION: 10.040,
    PRECIO_OBJETIVO_ACCION: 10.32  
}

const PUIG = {
    INVERSION: {
        numeroAcciones: 6,
        precioMedioXAccion: 17.760,
        dineroGastado: 106.56,
        valorActual: null,
        valorFinal: null
    },
    PRECIO_ACTUAL_COMPRA_ACCION: 16.970,
    PRECIO_ACTUAL_VENTA_ACCION: 16.970,
    PRECIO_OBJETIVO_ACCION: 17.408 
}

const data = PUIG;

//inputs de datos
const INVERSION = {
    numeroAcciones: data.INVERSION.numeroAcciones,
    precioMedioXAccion: data.INVERSION.precioMedioXAccion,
    dineroGastado: data.INVERSION.dineroGastado,
    valorActual: null,
    valorFinal: null
}


// inputs de configuracion del resultado
const PRECIO_ACTUAL_COMPRA_ACCION = data.PRECIO_ACTUAL_COMPRA_ACCION;
const PRECIO_ACTUAL_VENTA_ACCION = data.PRECIO_ACTUAL_VENTA_ACCION;
const PRECIO_OBJETIVO_ACCION = data.PRECIO_OBJETIVO_ACCION;


//calculos
 INVERSION.valorActual = INVERSION.numeroAcciones * PRECIO_ACTUAL_VENTA_ACCION;

const DINERO_PERDIDO = INVERSION.dineroGastado - INVERSION.valorActual;
const BENEFICIO_NECESARIO_POR_ACCION = PRECIO_OBJETIVO_ACCION - PRECIO_ACTUAL_VENTA_ACCION;

INVERSION.valorFinal = INVERSION.numeroAcciones * PRECIO_OBJETIVO_ACCION;

const PERDIDA_A_RECUPERAR_CON_NUEVAS_ACCIONES = INVERSION.dineroGastado  - INVERSION.valorFinal;
const NUEVAS_ACCIONES_NECESARIAS = Math.round(PERDIDA_A_RECUPERAR_CON_NUEVAS_ACCIONES / BENEFICIO_NECESARIO_POR_ACCION);

const NUEVA_INVERSION = {
    numeroAcciones: NUEVAS_ACCIONES_NECESARIAS,
    precioMedioXAccion: PRECIO_ACTUAL_COMPRA_ACCION,
    dineroGastado: NUEVAS_ACCIONES_NECESARIAS * PRECIO_ACTUAL_COMPRA_ACCION,
    valorActual: NUEVAS_ACCIONES_NECESARIAS * PRECIO_ACTUAL_COMPRA_ACCION,
    valorFinal: NUEVAS_ACCIONES_NECESARIAS * PRECIO_OBJETIVO_ACCION
}




const BENEFICIO_INVERSION = INVERSION.valorFinal - INVERSION.dineroGastado;
const BENEFICIO_NUEVA_INVERSION = NUEVA_INVERSION.valorFinal - NUEVA_INVERSION.dineroGastado;

const VALOR_FINAL = {
    valorInversion: INVERSION.dineroGastado + NUEVA_INVERSION.dineroGastado,
    valorFinal: INVERSION.valorFinal + NUEVA_INVERSION.valorFinal,
    ganancias: Number(BENEFICIO_NUEVA_INVERSION.toFixed(3)) + Number(BENEFICIO_INVERSION.toFixed(3)),
    beneficioPorAccion: BENEFICIO_NECESARIO_POR_ACCION
}

console.table(NUEVA_INVERSION);
console.table(VALOR_FINAL);
console.log('Pasar estos valores por calculadora precio/beneficio!!!');
console.table({
    ratio: '2:1',
    precioAccionAComprar: data.PRECIO_ACTUAL_COMPRA_ACCION,
    precioObjeticoAccion: data.PRECIO_OBJETIVO_ACCION,
    riesgoCuenta: 1,
    tamanoPosicion: VALOR_FINAL.valorInversion
});
console.log('script finished!');