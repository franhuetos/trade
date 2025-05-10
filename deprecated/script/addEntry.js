const fs = require('fs');
const readline = require('readline');
const historicalData = require('../src/data.js');
const DATA_FILE = './src/data.js';
const DATA_BACKUP_FILE = './src/data-backup.json';


// Configurar readline para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getNewItem() {
    return {
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
    }
}

// Preguntar por el nombre
rl.question('Por favor, introduce la fecha (YYYY-MM-DD): ', (fecha) => {

    rl.question('Nuevo capital ingresado: ', (nuevoIngreso) => {

        nuevoIngreso = Number(nuevoIngreso);

        rl.question('Por favor, introduce el valor total del importe invertido: ', (importeInvertido) => {

            importeInvertido = Number(importeInvertido);

            rl.question('Por favor, introduce el capital disponible: ', (capitalDisponible) => {

                // Realizamos un backup de los datos antiguos
                fs.writeFile(DATA_BACKUP_FILE, `let data = ${JSON.stringify(historicalData)};module.exports = data;`, (err) => {
                    if (err) {
                        console.error('Error al generar el fichero de backup:', err);
                    } else {
                        console.log('Actualizado fichero de backup');
                    }
                    rl.close();
                });

                capitalDisponible = Number(capitalDisponible);

                let newItem = getNewItem();
                let [year, month, day] = fecha.split('-');
                newItem.name = fecha;
                let thisYear = null;
                let previousMonth = null;

                if (historicalData[year]) {
                    //el año ya existe
                    thisYear = historicalData[year];
                    previousMonth = thisYear && thisYear.months.length ? thisYear.months[thisYear.months.length -1] : getNewItem();
                } else {
                    //es un nuevo año
                    thisYear = { months: [] };
                    let previousYear = historicalData[year - 1];
                    previousMonth = previousYear && previousYear.months.length ? previousYear.months[thisYear.months.length -1] : getNewItem();
                }

                newItem = {
                    "name": fecha,
                    "revenue": 0,       // importe de ganancia/perdida de las operaciones cerradas en el dia
                    "revenue%": 0,      //  calculado en base a previousValue + revenue
                    "deposit": nuevoIngreso,
                    "depositTotal": previousMonth.depositTotal + nuevoIngreso,
                    "total": {
                        "previousValue": previousMonth.total.actualValue,  //valor al cierre del dia anterior
                        "actualValue": importeInvertido + capitalDisponible,  // el valor actual al cierre del dia incluye el valor nonDeposit
                        "nonDeposit": capitalDisponible,    // dinero no invertido en ninguna accion
                        "actualProfit": (importeInvertido + capitalDisponible) - previousMonth.total.actualValue,
                        "actualProfit%": ((importeInvertido + capitalDisponible) / previousMonth.total.actualValue) * 100,
                    }
                }

                historicalData[year].months.push(newItem);


                // Guardar en un archivo
                fs.writeFile(DATA_FILE, `let data = ${JSON.stringify(historicalData)};module.exports = data;`, (err) => {
                    if (err) {
                        console.error('Error al guardar el archivo:', err);
                    } else {
                        console.log('Actualizado fichero ' + DATA_FILE);
                    }
                    // Cerrar la interfaz de readline
                    rl.close();

                });
            });
        });
    });
});

