
function cerrarcajaerrorform(){
    document.getElementById('mensajeerror').innerHTML = '';
    document.getElementById('cajaerrorform').style.display = 'none';
}

function abrircajaerrorform(mensaje){
    document.getElementById('mensajeerror').innerHTML = mensaje;
    document.getElementById('cajaerrorform').style.display = 'block';
}

function initIU(){
    document.getElementById('cajaerrorform').style.display = 'none';
    conseguirtablas();
}

// crearselect(
	// true/false : con true se coloca un valor vacio como primer option (para SEARCH)
	// id que va tener el select, 
	// name que va tener el select, 
	// atributo del array datos que utilizamos para el value de cada option, 
	// atributo del array datos que vamos utilizar para el text de cada option, 
	// array de datos con las filas de la entidad, 
	// value que queremos que este como selected en el select)
// devuelve un elemento select
function crearselect(convacio, id, name, valueoption, textoption, datos, itemseleccionado){
	
	rol_select = document.createElement("select");
	rol_select.name = name;
	rol_select.id = id;

	if (convacio){
		option_rol = document.createElement("option");
		option_rol.value = '';
		option_rol.text = '';
		option_rol.selected = true;
		rol_select.appendChild(option_rol);
	}

	for (let i=0;i<datos.length;i++){
		option_rol = document.createElement("option");
		option_rol.value = datos[i][valueoption];
		option_rol.text = datos[i][textoption];

		if (option_rol.value == itemseleccionado){
			option_rol.selected = true;
		}
		rol_select.appendChild(option_rol);
	}
	
	return rol_select;

}

function conseguirtablas(){
    
    var Data ={
        controlador:'funcionesesquema',
        action:'listatablas',
    };

    var respuesta = $.post(urlllamada, Data, function(){})
    .done(function(){
        construirselecttablas(respuesta.responseJSON);
    })
    .fail(function(){
        abrircajaerrorform(mensajeerrorhttp(respuesta.status));
    });

}

function mensajeerrorhttp(codigoerrorhttp){
    /*
            0: undefined error (illegal cross origin request, firewall block, request cancelled in code, browser extension mucking things up)
            100-199: respuestas informativas

            200-299: respuestas satisfactorias
                200: exito 
                204: exito pero respuesta sin contenido

            300-399: redirecciones

            400-499: errores cliente
                400: bad request. no se pudo interpretar la peticion
                401: unauthorized. necesario autenticar para obtener la respuesta. similar a 403 pero aqui se puede autenticar
                403: forbidden. No tiene permisos para cierto contenido y el servidor rechaza otorgar respuesta
                404: not found. No pudo encontrar el contenido solicitado
                405: method not allowed. el metodo solicitado esta deshabilitado
                415: URI Too Long. la uri es mas larga de lo que el servidor quiere interpretar

            500-599: errores servidores
                500: Internal Server Error
                501: Not Implemented. el metodo solicitado no esta implementado
                502: Bad Gateway. el servidor, trabajando como puerta de enlace, no obtuvo respuesta valida
                503: Service Unavaliable. El servidor no esta listo para atender la peticion
                504: Gateway Timeout. el servidor, trabajando como puerta de enlace, no obtuvo respuesta a tiempo
    */

    let codes={
        0: 'undefined error (illegal cross origin request, firewall block, request cancelled in code, browser extension mucking things up)',

        200: 'exito', 
        204: 'exito pero respuesta sin contenido',

        400: 'bad request. no se pudo interpretar la peticion',
        401: 'unauthorized. necesario autenticar para obtener la respuesta. similar a 403 pero aqui se puede autenticar',
        403: 'forbidden. No tiene permisos para cierto contenido y el servidor rechaza otorgar respuesta',
        404: 'not found. No pudo encontrar el contenido solicitado',
        405: 'method not allowed. el metodo solicitado esta deshabilitado',
        415: 'URI Too Long. la uri es mas larga de lo que el servidor quiere interpretar',

        500: 'Internal Server Error',
        501: 'Not Implemented. el metodo solicitado no esta implementado',
        502: 'Bad Gateway. el servidor, trabajando como puerta de enlace, no obtuvo respuesta valida',
        503: 'Service Unavaliable. El servidor no esta listo para atender la peticion',
        504: 'Gateway Timeout. el servidor, trabajando como puerta de enlace, no obtuvo respuesta a tiempo',
    }

    return codes[codigoerrorhttp];

}

function construirselecttablas(tablas){
    let tablas_select = crearselect(false,'id-tabla','name-tabla', 'Tables_in_IU2022', 'Tables_in_IU2022', tablas.resource, null);
	$("#caja_select_tablas").append(tablas_select);
    //le mete las tablas que hay en un select
}

function buscarestructuratabla(){

    let tablaseleccionada = document.getElementById('id-tabla').value;

    var Data ={
        'controlador':'funcionesesquema',
        'action':'estructuratabla',
        'tabla':tablaseleccionada,
    };

    var respuesta = $.post(urlllamada, Data, function(){})
    .done(function(){
        realizarinterfaztabla(respuesta.responseJSON);
    })
    .fail(function(){
        abrircajaerrorform(mensajeerrorhttp(respuesta.status));
    });

}

// funcion peticionBackdesdeformulario(controlador, action)
// Recoge el contenido del formulario con id "id-form_IU" y le añade los campos controlador y action con su valor pasado
// si da un error http sale por el fail, si da un error de petición sale por el else del done, y si la peticion es correcta sale por el true del done

async function peticionBackdesdeformulario(controlador, action){

    var Data = $("#form-IU").serialize()+"&controlador="+controlador+'&action='+action;

    console.log("controlador: " + controlador)
    console.log("action: " + action)
    var respuesta = $.post(urlllamada, Data, function(){})
    .done(function(){
        if (respuesta.responseJSON['ok']){
            realizarinterfaztabla(respuesta.responseJSON)
            }
        else{
            abrircajaerrorform('error : '+respuesta.responseJSON['code']);
        }
    })
    .fail(function(){
        abrircajaerrorform(mensajeerrorhttp(respuesta.status));
    });

    $("#form-IU").remove();
    $("#div-form-IU").hide();
}

//function llamadaBack(){
  //  alert('llamada');
//}