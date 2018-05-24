//JSON estudiantes.
//var estudiantes = [ ];

$(document).ready(function() {

	//var estudiantes = [ ];

	eventsListener();

	//Añadimos los eventos a los botones
	function eventsListener () {
		$("#boton-registro").click(function(event) {
			validarCampos(0);
		});
		$("#boton-actualizar").click(function (event) {
			validarCampos(1);
		});

		$("#mostrar-estudiantes").click(mostrarEstudiantes);
		$("#mostrar-promedio").click(mostrarPromedio);
		$("#mostrar-mayor").click(mostrarMayorNota);
		$("#mostrar-menor").click(mostrarMenorNota);
		$("#buscar-estudiantes").click(buscarEstudiante);
		$("#codigo-busqueda").keypress(buscarPressEnter);

		$("#codigo, #nombre, #nota").change(function(event) {
			limpiarMensaje();
		});
		
	}

	//Función para registrar estudiantes leugo de validar los campos del formulario.
	function registrarEstudiantes () {
		var nuevoCodigo = $("#codigo");
		var mensajeRegistro = $("#mensaje-registro");
		var mensaje ="";

		if (validarExisteCodigo() == false) {
			var nuevoNombre = $("#nombre").val();
			var nuevoNota = parseFloat($("#nota").val());
			var nuevoEstudiante = {"codigo":nuevoCodigo.val(), "nombre":nuevoNombre, "nota":nuevoNota};	
			//estudiantes.push(nuevoEstudiante);

			var stringEstudiante = JSON.stringify(nuevoEstudiante);
			localStorage.setItem(nuevoCodigo.val(), stringEstudiante);

			mensaje = "(*) El estudiante fue registrado de manera satisfactoria."

			$("#form-registro")[0].reset();

			mostrarEstudiantes();

		} else {
			mensaje = "(*) El estudiante con código <b>' "+nuevoCodigo.val()+" '</b> ya se encuentra registrado.";
			nuevoCodigo.focus();
			enfocarCampos(nuevoCodigo);
		}
		mensajeRegistro.html(mensaje);
	}


	function actualizarEstudiantes () {
		var nuevoCodigo = $("#codigo");
		var mensajeRegistro = $("#mensaje-registro");
		var mensaje ="";

		var nuevoNombre = $("#nombre").val().toString();
		var nuevoNota = parseFloat($("#nota").val());

		var nuevoEstudiante = {"codigo":nuevoCodigo.val(), "nombre":nuevoNombre, "nota":nuevoNota};	

		var stringEstudiante = JSON.stringify(nuevoEstudiante);
		localStorage.setItem(nuevoCodigo.val(), stringEstudiante);

		mensaje = "(*) El estudiante fue actualizado de manera satisfactoria."

		$("#form-registro")[0].reset();

		mensajeRegistro.html(mensaje);

		mostrarEstudiantes();

		restablecerEstadoForm();
	}


	//Función para validar si el código ingresado ya se encuentra registrado.
	function validarExisteCodigo () {
		var existe = false;

		if (localStorage.length == 0) {   //estudiantes.length
			return existe;
		} else {
			for (var i = 0; i < localStorage.length; i++) {
				if (($("#codigo").val()).toString() == localStorage.key(i)) {
					existe = true;
					return existe;
				} else {
					existe = false;
				}
			}
			return existe;
		}
	}
	//Función para busacar si presiona la tecla enter en el input buscar-codigo.
	function buscarPressEnter (event) {
		if (event.CharacterCode == 13 || event.keyCode == 13) {
			buscarEstudiante();
		}
	}

	//Función para insertar los estudiantes encontrados en la tabla.
	function buscarEstudiante() {
		var codigoBuscar = $("#codigo-busqueda");
		if ((codigoBuscar.val()).toString() =="") {
			alert("Por favor, ingrese un código en el campo de búsqueda.");
			codigoBuscar.focus();
			enfocarCampos(codigoBuscar);
		} else {
			var resultadoBusqueda = $("#resultado-busqueda");
			resultadoBusqueda.html(estudianteEncontrado());
			desenfocarCampo(codigoBuscar);
		}
	}

	//Función que busca el código en el JSON estudiantes y retorna un resultado(mensaje ó registro encontrado).
	function estudianteEncontrado() {
		var codigoBuscado = $("#codigo-busqueda");
		var dataEstudiantes = "";
		if (localStorage.length == 0) {
			dataEstudiantes = "<tr><td colspan = '5' align='center'>(*) No se encontraron estudiantes registrados</td></tr>";
			return dataEstudiantes;

		} else {
			for (var i = 0; i < localStorage.length; i++) {
				var clave = localStorage.key(i);
				if ((codigoBuscado.val()).toString() == clave) {
					var jsonEstudiante = JSON.parse(localStorage.getItem(clave));
					dataEstudiantes += "<tr name='filas'><td>"+jsonEstudiante.codigo+"</td><td>"+jsonEstudiante.nombre+"</td><td>"+jsonEstudiante.nota+"</td>";
					dataEstudiantes += '<td><button class=btn-editar onclick=editarEstudiante('+"'"+jsonEstudiante.codigo+"'"+')>Editar</button></td>';
					dataEstudiantes += '<td><button class=btn-eliminar onclick=eliminarEstudiante('+"'"+jsonEstudiante.codigo+"'"+')>Eliminar</button></td></tr>';
					return dataEstudiantes;
				} 
			}
			dataEstudiantes = "<tr><td colspan = '5' align='center'>(*) No se encontró ningún estudiante con el código ingresado</td></tr>"
			return dataEstudiantes;
		}
	}

	//Función que permite validar si exiten estudiantes
	function validarLista () {
		numRegistros = localStorage.length;
		if(numRegistros == 0){
			alert("No se encontraron estudiantes registrados.");
			return false;
		} else {
			return true;
		}
	}


	//Función que permite calcular la nota promedio de los estudiantes.
	function mostrarPromedio () {
		if (validarLista()) {
			var suma = 0;
			for (var i = 0; i < localStorage.length; i++) {

				var clave = localStorage.key(i);
				var jsonEstudiante = JSON.parse(localStorage.getItem(clave));

				var suma = suma+jsonEstudiante.nota;
				var prom = suma/localStorage.length;

			}
			alert("El promedio de las notas es: " +prom);
		}
		
	}

	//Función que permite calcular y mostrar al estudiante con mayor nota.
	function mostrarMayorNota () {
		if (validarLista()) {
			var mayorNota = 0;
			var codigoMayorNota ="";
			var nombreMayorNota ="";

			for (var i = 0; i < localStorage.length; i++) {

				var clave = localStorage.key(i);
				var jsonEstudiante = JSON.parse(localStorage.getItem(clave));

				if (jsonEstudiante.nota > mayorNota) {
					mayorNota = jsonEstudiante.nota;
					codigoMayorNota = jsonEstudiante.codigo;
					nombreMayorNota = jsonEstudiante.nombre;
				}
			}
		alert("Estudiante con mayor nota --> Código: "+codigoMayorNota+", Nombre: "+nombreMayorNota+", Nota: "+mayorNota);
		}
	}

	//Función que permite calcular y mostrar al estudiante con menor nota.
	function mostrarMenorNota () {
		if (validarLista()) {
			var menorNota = 1000;
			var codigoMenorNota ="";
			var nombreMenorNota ="";
			for (var i = 0; i < localStorage.length; i++) {

				var clave = localStorage.key(i);
				var jsonEstudiante = JSON.parse(localStorage.getItem(clave));

				if (jsonEstudiante.nota < menorNota) {
					menorNota = jsonEstudiante.nota;
					codigoMenorNota = jsonEstudiante.codigo;
					nombreMenorNota = jsonEstudiante.nombre;
				}
			}
			alert("Estudiante con menor nota --> Código: "+codigoMenorNota+", Nombre: "+nombreMenorNota+", Nota: "+menorNota);
		}
	}

	//Función que valida los campos para luego poder registrar los estudiantes.
	function validarCampos (iFuncion) {
		var codigoIngresado = $("#codigo");
		var nombreIngresado = $("#nombre");
		var notaIngresada = $("#nota");

		var mensajeRegistro = $("#mensaje-registro");
		var mensaje ="";

		if (codigoIngresado.val() == "" || codigoIngresado.val() == null) {
			mensaje = "(<sup>1</sup> Codigo) Por favor, ingrese el código del estudiante.";
			mensajeRegistro.html(mensaje);
			codigoIngresado.focus();
			enfocarCampos(codigoIngresado);

		} else {
			desenfocarCampo(codigoIngresado);
			if (nombreIngresado.val() == "" || nombreIngresado.val() == null) {
				mensaje = "(<sup>2</sup> Nombre) Por favor, ingrese el nombre del estudiante.";
				mensajeRegistro.html(mensaje);
				nombreIngresado.focus();
				enfocarCampos(nombreIngresado);
			} else {
				desenfocarCampo(nombreIngresado);
				if (notaIngresada.val() == "" || notaIngresada.val() == null) {
					mensaje = "(<sup>3</sup> Nota) Por favor, ingrese un valor numérico entre 0 y 20 en nota del estudiante.";
					mensajeRegistro.html(mensaje);
					notaIngresada.focus();
					enfocarCampos(notaIngresada);
				} else {
					validarNota(iFuncion);
				}
			}
		}
	}

	//Función que valida la nota ingresada.
	function validarNota (iFuncion) {
		var notaIngresada = $("#nota");
		var valorNota = parseInt($("#nota").val());

		var mensajeRegistro = $("#mensaje-registro");
		var mensaje ="";

		if (isNaN(valorNota)==false) {
			if (valorNota>=0 && valorNota<=20) {
				if (iFuncion == 0) {
					registrarEstudiantes();
				}
				if (iFuncion == 1) {
					actualizarEstudiantes();
				}
				
				desenfocarCampo(notaIngresada);
			} else {
				mensaje ="(<sup>3</sup> Nota) Por favor, ingrese una nota entre 0 y 20.";
				mensajeRegistro.html(mensaje);
				notaIngresada.focus();
				enfocarCampos(notaIngresada);
			}
		} else {
			mensaje = "(<sup>3</sup> Nota) El campo nota solamente admite números.";
			mensajeRegistro.html(mensaje);
			notaIngresada.focus();
			enfocarCampos(notaIngresada);
		}
	}

	function enfocarCampos (element) {
		$(element).css('borderColor', 'red');
	}

	function desenfocarCampo (element) {
		$(element).css('borderColor', 'black');
	}


});


//Función que permite mostrar estudiantes.
function mostrarEstudiantes () {
	var tablaEstudiantes = $("#lista-estudiantes");
	var dataEstudiantes = "";


	if (localStorage.length == 0) {
		dataEstudiantes = "<tr><td colspan = '5' align='center'>(*) No se encontraron estudiantes registrados</td></tr>"
		tablaEstudiantes.html(dataEstudiantes);

	} else {
		for (var i = 0; i < localStorage.length; i++) {

			var clave = localStorage.key(i);
			var jsonEstudiante = JSON.parse(localStorage.getItem(clave));

			dataEstudiantes += "<tr><td>"+jsonEstudiante.codigo+"</td><td>"+jsonEstudiante.nombre+"</td><td>"+jsonEstudiante.nota+"</td>";
			dataEstudiantes += '<td><button class=btn-editar onclick=editarEstudiante('+"'"+jsonEstudiante.codigo+"'"+')>Editar</button></td>';
			dataEstudiantes += '<td><button class=btn-eliminar onclick=eliminarEstudiante('+"'"+jsonEstudiante.codigo+"'"+')>Eliminar</button></td></tr>';
		}
		tablaEstudiantes.html(dataEstudiantes);
	}
}


function editarEstudiante (codigo) {
	var estudianteAEditar = JSON.parse(localStorage.getItem(codigo));

	$("#codigo").val(estudianteAEditar.codigo); 
	$("#nombre").val(estudianteAEditar.nombre);
	$("#nota").val(estudianteAEditar.nota);

	cambiarEstadoForm();	
}

function eliminarEstudiante (codigo) {
	localStorage.removeItem(codigo);
	mostrarEstudiantes();
}

function cambiarEstadoForm () {
	$("#codigo").attr('disabled', 'true');
	$("#boton-registro").attr('disabled', 'true');
	$("#boton-actualizar").removeAttr('disabled');
}

function restablecerEstadoForm () {
	$("#codigo").removeAttr('disabled')
	$("#boton-registro").removeAttr('disabled');
	$("#boton-actualizar").attr('disabled', 'true');
}

function limpiarMensaje () {
	$("#mensaje-registro").html("");
}