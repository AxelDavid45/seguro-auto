// imprime los valores en el select de anios
let fechaMax = new Date().getFullYear(),
	fechaMin = fechaMax - 20;

const selectAnios = document.querySelector('#anio');
for (let i = fechaMax; i > fechaMin; i--) {
	let option = document.createElement('option');
	option.value = i;
	option.innerHTML = i;
	selectAnios.appendChild(option);
}

// Clase que construye el objeto
function Seguro(marca, anio, tipo) {
	this.marca = marca;
	this.anio = anio;
	this.tipo = tipo;
}
// Proto para calcular el precio
Seguro.prototype.cotizarSeguro = function () {
	let cantidad;
	const base = 2000;
	/* LOS PORCENTAJES POR LOS QUE SE MULTIPLICARAN LAS CANTIDADES DE ACUERDO
		A LA MARCA DEL CARRO SERAN LOS SIGUIENTES:
		----------AMERICANO: 1.15-------------------- 
		----------ASIATICO: 1.05--------------------- 
		----------EUROPEO: 1.35----------------------
	 */
	switch (this.marca) {
		case 'Americano':
			cantidad = base * 1.15;
			break;
		case 'Asiatico':
			cantidad = base * 1.05;
			break;
		case 'Europeo':
			cantidad = base * 1.35;
			break;
	}
	// Diferencia entre cada año
	const diferenciaAnios = new Date().getFullYear() - this.anio;
	// CADA AÑO DE DIFERENCIA HAY QUE REDUCIR 3% EL COSTO DEL SEGURO
	cantidad -= ((diferenciaAnios * 3) * cantidad) / 100;
	/* 
		SI EL SEGURO ES BASICO SE MULTIPLICA POR 30% MAS
		SI EL SEGURO ES COMPLETO SE MULTIPLICA POR 50% MAS
	*/
	if (this.tipo === 'Basico') {
		cantidad *= 1.30;
	} else {
		cantidad *= 1.50;
	}
	cantidadFinal = cantidad.toFixed(2);

	return cantidadFinal;

}

// Clase de Ui
function Ui() {}
// prototipo que muestra los mensajes en la interfaz del usuario
Ui.prototype.mostrarMensaje = function (mensaje, tipo) {
	// crea el div
	const divMensaje = document.createElement('div');
	// comprueba el tipo de mensaje que tiene que mostrar
	if (tipo === 'error') {
		// añade las clases necesarias e inserta el mensaje
		divMensaje.classList.add('mensaje', 'error');
		divMensaje.innerHTML = `${mensaje}`;
	} else {
		divMensaje.classList.add('mensaje', 'correcto');
		divMensaje.innerHTML = `${mensaje}`;
	}

	// inserta el formulario antes del formulario
	formulario.insertBefore(divMensaje, document.querySelector('.form-group'));

	setTimeout(function () {
		document.querySelector('.mensaje').remove();
	}, 2000);
}
// Muestra los resultados en pantalla
Ui.prototype.mostrarResultado = function (seguro, cantidad) {
	const spinner = document.querySelector('#cargando img');
	const divResultado = document.querySelector('#resultado');
	const divcontenido = document.createElement('div');
	
	spinner.style.display = 'block';
	divcontenido.className = 'resultado';
	divcontenido.innerHTML = `
	<p class="resumen">Resumen:</p>
	<p>Marca seleccionada: ${seguro.marca}</p>
	<p>Año seleccionado: ${seguro.anio}</p>
	<p>Tipo: ${seguro.tipo}</p>
	<p>Total a pagar: $ ${cantidad}</p>
	`;
	
	setTimeout(function () {
		spinner.style.display = 'none';
		divResultado.appendChild(divcontenido);
		
		
	}, 2000);

}



// Event listener
const formulario = document.getElementById('cotizar-seguro');

formulario.addEventListener('submit', function (e) {
	e.preventDefault();
	// obtenenemos datos de la marca
	const marca = document.querySelector('#marca');
	const marcaSeleccionada = marca.options[marca.selectedIndex].value;
	// obtenemos el dato de el año
	const anio = document.querySelector('#anio');
	const anioSeleccionado = anio.options[anio.selectedIndex].value;
	// Obtenemos el dato del <select> del tipo
	const tipo = document.querySelector('input[name="tipo"]:checked').value;

	// Hacemos una instancia de la interfaz
	const UI = new Ui();

	// comprobamos que el form no este vacio
	if (marcaSeleccionada === '' || anioSeleccionado === '' || tipo === '') {
		// llamamos al proto mostrarMensaje para que muestre en la interfaz el mensaje de error
		UI.mostrarMensaje('Faltan campos por llenar, por favor verifica', 'error');
	} else {

		const resultado = document.querySelector('#resultado div');
		if (resultado != null) {
			resultado.remove();
		}
		// creamos un objeto nuevo con el constructor de seguro
		const seguro = new Seguro(marcaSeleccionada, anioSeleccionado, tipo);
		const cantidad = seguro.cotizarSeguro();
		// Llamamos al proto mostrar mensaje para que muestre en la interfaz el mensaje de correcto
		UI.mostrarMensaje('Los datos estan correcto, estamos procesando la información', 'correcto');
		UI.mostrarResultado(seguro, cantidad);
	}
});