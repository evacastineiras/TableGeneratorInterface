
function realizarinterfaztabla(estructuratabla) {
  let tablaActual = document.getElementById('id-tabla').value;

    console.log("Estructura: ");
    console.log(estructuratabla)
    peticionBack(tablaActual, 'SEARCH')
    //______________ LLAMADA A BACK _______________________
 function peticionBack(controlador, action){
  var Data = $("#form-IU").serialize()+"&controlador="+controlador+'&action='+ action;
    var respuesta = $.post(urlllamada, Data, function(){})
    .done(function(){
        if (respuesta.responseJSON['ok']){
          let miTabla = new Table(respuesta.responseJSON);
          miTabla.limpiarTablaHTML();
          miTabla.crearTablaHTML();
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
    console.log(respuesta)
 }
    

//_____________________CLASE TABLE ____________________
    class Table {
      nombresTabla = [];
      valores = [];
      tablaActual = "";
      tablaMap = {}
      estructuraActual = estructuratabla
      campoIncrem = false
  
      constructor(respuesta) {
        this.nombresTabla = Object.keys(respuesta.resource[0]);
        this.valores = respuesta.resource.map((tupla) => Object.values(tupla));
        this.tablaActual = document.getElementById('id-tabla').value;
      }

      //_________________LIMPIAR TABLA __________________
      
    limpiarTablaHTML() {
      const gestionTablaDiv = document.getElementById(`id-gestion-tabla`);
      const tablaDivs = gestionTablaDiv.getElementsByClassName("tabla-nueva");
      while (tablaDivs.length > 0) {
        gestionTablaDiv.removeChild(tablaDivs[0]);
      }
    }


      //____________________CREAR TABLA______________
      crearTablaHTML() {
        const gestionTablaDiv = document.getElementById('id-gestion-tabla');
        const tablaDivs = gestionTablaDiv.getElementsByClassName("tabla-nueva");
        while (tablaDivs.length > 0) {
          gestionTablaDiv.removeChild(tablaDivs[0]);
        }
        let cajaImagenes = document.querySelector(".imagenes")
        if(cajaImagenes)
        cajaImagenes.remove()
  
        const divImagenes = document.createElement("div");
        divImagenes.classList.add("imagenes");
        
        gestionTablaDiv.appendChild(divImagenes);
  
      
      
        const iconoAgregar = document.createElement("img");
        iconoAgregar.src = "iconos/icon-add.png";
        iconoAgregar.alt = "Agregar";
        iconoAgregar.style.width = "26px";
        iconoAgregar.style.height = "26px";
        iconoAgregar.classList.add("icono-agregar");
        iconoAgregar.removeEventListener("click", this.formularioAgregar.bind(this)); 
        iconoAgregar.addEventListener("click", this.formularioAgregar.bind(this)); 
        divImagenes.appendChild(iconoAgregar);
      
        const iconoBuscar = document.createElement("img");
        iconoBuscar.src = "iconos/icon-search.png";
        iconoBuscar.alt = "Buscar";
        iconoBuscar.style.width = "26px";
        iconoBuscar.style.height = "26px";
        iconoBuscar.classList.add("icono-buscar");
        iconoBuscar.removeEventListener("click", this.formularioBuscar.bind(this)); 
        iconoBuscar.addEventListener("click", this.formularioBuscar.bind(this)); 
        divImagenes.appendChild(iconoBuscar);
      //tabla
        const tabla = document.createElement("table");
        tabla.classList.add("tabla-nueva");
        const encabezado = document.createElement("tr");
        this.nombresTabla.forEach((nombre) => {
          const th = document.createElement("th");
          th.textContent = nombre;
          encabezado.appendChild(th);
        });
        const thAcciones = document.createElement("th");
        encabezado.appendChild(thAcciones);
        tabla.appendChild(encabezado);
  
        this.valores.forEach((valores) => {
          const fila = document.createElement("tr");
          valores.forEach((valor) => {
            const celda = document.createElement("td");
      
            // Comprobar si el valor es un objeto
            if (typeof valor === "object" && valor !== null) {
              const lista = document.createElement("ul");
              for (const key in valor) {
                if (valor.hasOwnProperty(key)) {
                  const listItem = document.createElement("li");
                  listItem.textContent = `${key}: ${valor[key]}`;
                  lista.appendChild(listItem);
                }
              }
              celda.appendChild(lista);
            } else {
              celda.textContent = valor;
            }
      
            fila.appendChild(celda);
          });
      
       //iconos
          const celdaAcciones = document.createElement("td");
          const iconoEditar = document.createElement("img");
          iconoEditar.src = "iconos/icon-edit.png";
          iconoEditar.alt = "Editar";
          iconoEditar.classList.add("icono-accion");
          iconoEditar.style.width = "16px";
          iconoEditar.style.height = "16px";
          iconoEditar.addEventListener("click", this.formularioEditar.bind(this));
      
          const iconoEliminar = document.createElement("img");
          iconoEliminar.src = "iconos/icon-delete.png";
          iconoEliminar.alt = "Eliminar";
          iconoEliminar.classList.add("icono-accion");
          iconoEliminar.style.width = "16px";
          iconoEliminar.style.height = "16px";
          iconoEliminar.addEventListener("click", this.formularioEliminar.bind(this));
      
          celdaAcciones.appendChild(iconoEditar);
          celdaAcciones.appendChild(iconoEliminar);
          fila.appendChild(celdaAcciones);
      
          tabla.appendChild(fila);
        });
      
        gestionTablaDiv.appendChild(tabla);
      }

      //___________________FORMULARIOS______________________________
      
      async formularioAgregar(event) {
        
        const divFormIU = document.getElementById("div-form-IU");
        divFormIU.innerHTML = "";
        divFormIU.classList.add("form-modal");
        
      
        const formIU = document.createElement("form");
        formIU.id = "form-IU";
        formIU.classList.add("form-IU");
      
        let campoIncremental;
      
        for (let i=0; i<this.estructuraActual.resource.length; i++) {
          if (this.estructuraActual.resource[i].Extra == "auto_increment") 
          campoIncremental = this.estructuraActual.resource[i].Field;
        }
      
        this.nombresTabla.forEach((nombreCampo) => {
          const idCampo = "id-" + nombreCampo;
          const nombreInput = "" + nombreCampo;
      
          const divCampo = document.createElement("div");
      
          const label = document.createElement("label");
          label.htmlFor = idCampo;
          label.textContent = nombreCampo;
      
          const input = document.createElement("input");
          input.type = "text";
          input.id = idCampo;
          input.name = nombreInput;
      
          // Verifica si el campo es incremental y ajusta la propiedad disabled en consecuencia
          if (nombreCampo === campoIncremental) {
            input.disabled = true;

            //Encontramos el valor que debe llevar el campo incremental:
            let maxIncremental = parseInt(this.valores[0][0])
            for(let i = 0; i<this.valores.length; i++)
            {
              if (parseInt(this.valores[i][0]) > maxIncremental)
              maxIncremental = parseInt(this.valores[i][0])
            }

            input.value = ++maxIncremental;
          }
      
          divCampo.appendChild(label);
          divCampo.appendChild(input);
          formIU.appendChild(divCampo);
        });
      
        const submitButton = document.createElement("input");
        submitButton.type = "submit";
        submitButton.value = "Agregar";
        formIU.appendChild(submitButton);
      
        divFormIU.appendChild(formIU);
      
        divFormIU.style.display = "block";
      
        const closeIcon = document.createElement("img");
        closeIcon.src = "iconos/icon-close.png";
        closeIcon.alt = "Cerrar";
        closeIcon.style.width = "16px";
        closeIcon.style.position = "absolute";
        closeIcon.style.top = "28vh";
        closeIcon.style.right = "42vw";
        closeIcon.style.cursor = "pointer";
        closeIcon.addEventListener("click", () => {
          divFormIU.style.display = "none";
        });
        divFormIU.appendChild(closeIcon);
      
        formIU.addEventListener("submit", async (event) => {
          event.preventDefault();
      
          // ---------------------------------------------------VALIDACION---------------------------------------
          const hasEmptyInputs = await validateEditableInputs(
            formIU,
            this.estructuraActual.resource
          );
      
          if (hasEmptyInputs) {
            window.alert("Hay campos vacios");
            return;
          }else{
               const mensajeError = await 
                genValidation(
                  formIU,
                  this.estructuraActual.resource
                );

                if (mensajeError === null)
                {
                  const tablaActual = this.tablaActual;
                const datos = $(formIU).serialize();
            
                peticionBack(tablaActual, "ADD", datos);
                divFormIU.style.display = "none";
                }else{
                  window.alert("! - " +  mensajeError);
                  return;
                }
                }

       
      
          
        });
        
      }
      
    
    

    formularioBuscar(event){
      console.log("busco")
      const divFormIU = document.getElementById("div-form-IU");
      divFormIU.innerHTML = ""; 
      divFormIU.classList.add("form-modal"); 

      const formIU = document.createElement("form");
      formIU.id = "form-IU";
      formIU.classList.add("form-IU"); 

  const camposTabla = this.nombresTabla;

  camposTabla.forEach((campo) => {
    const divCampo = document.createElement("div");

    const label = document.createElement("label");
    label.htmlFor = "input-" + campo;
    label.textContent = campo;

    const input = document.createElement("input");
    input.type = "text";
    input.id = "input-" + campo;
    input.name = campo;

    divCampo.appendChild(label);
    divCampo.appendChild(input);
    formIU.appendChild(divCampo);
  });

  const submitButton = document.createElement("input");
  submitButton.type = "submit";
  submitButton.value = "Buscar";
  formIU.appendChild(submitButton);

  divFormIU.appendChild(formIU);

  divFormIU.style.display = "block";

  const closeIcon = document.createElement("img");
  closeIcon.src = "iconos/icon-close.png";
  closeIcon.alt = "Cerrar";
  closeIcon.style.width = "16px";
  closeIcon.style.position = "absolute";
  closeIcon.style.top = "28vh";
  closeIcon.style.right = "42vw";
  closeIcon.style.cursor = "pointer";
  closeIcon.addEventListener("click", () => {
    divFormIU.style.display = "none";
  });
  divFormIU.appendChild(closeIcon);

  formIU.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const tablaActual = this.tablaActual;
    const datos = $(formIU).serialize();

    peticionBack(tablaActual, "SEARCH", datos);
    divFormIU.style.display = "none";
  });
    }

  formularioEditar(event) {
      const fila = event.target.parentNode.parentNode;
      const inputs = fila.querySelectorAll("td:not(:last-child)");
      const valores = Array.from(inputs).map((input) => input.textContent);

      print("estructura: " + this.estructuraActual);
    
      const divFormIU = document.getElementById("div-form-IU");
      divFormIU.innerHTML = "";
      divFormIU.classList.add("form-modal");
    
      const formIU = document.createElement("form");
      formIU.id = "form-IU";
      formIU.classList.add("form-IU");
    
      let idCampo; // Variable para el campo clave
      const camposEstructura = estructuratabla.resource;
      let campoClave = null;
    
      for (let index = 0; index < camposEstructura.length; index++) {
        if (camposEstructura[index].Key === "PRI") {
          campoClave = camposEstructura[index].Field;
          break;
        }
      }
    
      valores.forEach((valor, index) => {
        const nombreCampo = this.nombresTabla[index];
        idCampo = "id-" + nombreCampo;
        const nombreInput = "" + nombreCampo;
    
        const divCampo = document.createElement("div");
    
        const label = document.createElement("label");
        label.htmlFor = idCampo;
        label.textContent = nombreCampo;
    
        const input = document.createElement("input");
    
        if (nombreCampo === campoClave) {
          const spanValor = document.createElement("span");
          spanValor.textContent = valor;
    
          divCampo.appendChild(label);
          divCampo.appendChild(spanValor);
    
          input.type = "hidden";
          input.value = valor;
          input.id = idCampo;
          input.name = nombreInput;
        } else {
          input.type = "text";
          input.value = valor;
          input.id = idCampo;
          input.name = nombreInput;
        }
    
        divCampo.appendChild(label);
        divCampo.appendChild(input);
        formIU.appendChild(divCampo);
      });
    
      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "Guardar cambios";
      formIU.appendChild(submitButton);
    
      divFormIU.appendChild(formIU);
      divFormIU.style.display = "block";
    
      const closeIcon = document.createElement("img");
      closeIcon.src = "iconos/icon-close.png";
      closeIcon.alt = "Cerrar";
      closeIcon.style.width = "16px";
      closeIcon.style.position = "absolute";
      closeIcon.style.top = "28vh";
      closeIcon.style.right = "42vw";
      closeIcon.style.cursor = "pointer";
      closeIcon.addEventListener("click", () => {
        divFormIU.style.display = "none";
      });
      divFormIU.appendChild(closeIcon);
    
      formIU.addEventListener("submit", async (event) => {
        event.preventDefault();
        const tablaActual = this.tablaActual;
        const datos = $(formIU).serialize();
    
        const datosConCampoClave = datos + `&${campoClave}=${idCampo}`;

  
      
          // ---------------------------------------------------VALIDACION---------------------------------------
          const hasEmptyInputs = await validateEditableInputs(
            formIU,
            this.estructuraActual.resource
          );
      
          if (hasEmptyInputs) {
            window.alert("Hay campos vacios");
            return;
          }else{
               const mensajeError = await 
                genValidation(
                  formIU,
                  this.estructuraActual.resource
                );

                if (mensajeError != null)
                {
                  window.alert("! - " +  mensajeError);
                  return;
                
                }
              }

       
      
          
        
    
        peticionBack(tablaActual, "EDIT", datosConCampoClave);
        divFormIU.style.display = "none";
      });
    }
    
    
    
    
    formularioEliminar(event2) {

      const fila = event2.target.parentNode.parentNode;
      const inputs = fila.querySelectorAll("td:not(:last-child)");
      const valores = Array.from(inputs).map((input) => input.textContent);
    
      const divFormIU = document.getElementById("div-form-IU");
      divFormIU.innerHTML = "";
      divFormIU.classList.add("form-modal");
    
      const formIU = document.createElement("form");
      formIU.id = "form-IU";
      formIU.classList.add("form-IU");
    
      let idCampo; // Variable para el campo clave
      const camposEstructura = estructuratabla.resource;
      let campoClave = null;
    
      for (let index = 0; index < camposEstructura.length; index++) {
        if (camposEstructura[index].Key === "PRI") {
          campoClave = camposEstructura[index].Field;
          break;
        }
      }
    
      valores.forEach((valor, index) => {
        const nombreCampo = this.nombresTabla[index];
        idCampo = "id-" + nombreCampo;
        const nombreInput = "" + nombreCampo;
    
        const divCampo = document.createElement("div");
    
        const label = document.createElement("label");
        label.htmlFor = idCampo;
        label.textContent = nombreCampo;
        const input = document.createElement("input");

          input.type = "hidden";
          input.value = valor;
          input.id = idCampo;
          input.name = nombreInput;
        
        divCampo.appendChild(label);
        divCampo.appendChild(input);
        formIU.appendChild(divCampo);
      });
      const confirmacionPregunta = document.createElement("p");
      confirmacionPregunta.textContent = "¿Estás seguro de que deseas eliminar esta fila?";
      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "Eliminar";
      formIU.appendChild(submitButton);
    
      divFormIU.appendChild(formIU);
      divFormIU.style.display = "block";
    
      const closeIcon = document.createElement("img");
      closeIcon.src = "iconos/icon-close.png";
      closeIcon.alt = "Cerrar";
      closeIcon.style.width = "16px";
      closeIcon.style.position = "absolute";
      closeIcon.style.top = "28vh";
      closeIcon.style.right = "42vw";
      closeIcon.style.cursor = "pointer";
      closeIcon.addEventListener("click", () => {
        divFormIU.style.display = "none";
      });
      divFormIU.appendChild(closeIcon);
    
      formIU.addEventListener("submit", (event) => {
        event.preventDefault();
        const tablaActual = this.tablaActual;
        const datos = $(formIU).serialize();
    
        const datosConCampoClave = datos;
    
        peticionBack(tablaActual, "DELETE", datosConCampoClave);
        divFormIU.style.display = "none";
      });    
    }
    }
}