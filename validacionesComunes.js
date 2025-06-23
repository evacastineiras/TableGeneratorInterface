function validateEditableInputs(form, est) {
    const editableInputs = form.querySelectorAll('input:not([disabled])');
    let hasEmptyInputs = false;
  
    editableInputs.forEach((input) => {
      const fieldName = input.name.replace("id-", "");
      const campo3 = est.find((campo) => campo.Field === fieldName);
      if (campo3 && campo3.Null === "NO" && input.value.trim() === "") {
        hasEmptyInputs = true;
        input.classList.add("err"); 
      } else {
        input.classList.remove("err"); 
      }
    });
  
    return hasEmptyInputs;
  }

  function genValidation(form, estructura)
  {

   
    const editableInputs = form.querySelectorAll('input:not([disabled])')
    let hayError = false
    let aux = 0;
    let mensajeError = null

    while(!hayError && editableInputs.length > aux + 1)
    {
     
      let nombreCampo = editableInputs[aux].name;
      switch(nombreCampo.toLowerCase())
      {
        case 'dni': validateDNI(editableInputs[aux].value); break;
        case 'usuario': validateUsuario(editableInputs[aux].value); break;
        case 'contrasena': validateContrasena(editableInputs[aux].value); break;
        case 'id_rol': validateIdRolFuncAcc(editableInputs[aux].value); break;
        case 'id_funcionalidad': validateIdRolFuncAcc(editableInputs[aux].value); break;
        case 'id_accion': validateIdRolFuncAcc(editableInputs[aux].value); break;
        case 'nombre_persona': validateNombrePersona(editableInputs[aux].value); break;
        case 'rol_name': validateNameRolFuncAcc(editableInputs[aux].value); break;
        case 'nombre_funcionalidad': validateNameRolFuncAcc(editableInputs[aux].value); break;
        case 'nombre_accion': validateNameRolFuncAcc(editableInputs[aux].value); break;
        case 'apellidos_persona': validateApellidos(editableInputs[aux].value); break;
        case 'rol_descripcion': validateDescripRolFuncAcc(editableInputs[aux].value); break;
        case 'descrip_funcionalidad': validateDescripRolFuncAcc(editableInputs[aux].value); break;
        case 'descrip_accion': validateDescripRolFuncAcc(editableInputs[aux].value); break;
        case 'fechanacimiento_persona': validateNacimiento(editableInputs[aux].value); break;
        case 'direccion_persona': validateDireccion(editableInputs[aux].value); break;
        case 'telefono_persona': validateTelefono(editableInputs[aux].value); break;
        case 'email_persona': validateEmail(editableInputs[aux].value); break;
        case 'foto_persona': validateFoto(editableInputs[aux].value); break;
        
      }
    }


    function validateDNI(input){
      let num, aux2, letra;
      const expr = /^\d{8}[A-Z]$/;
      if (expr.test(input) === true) {
          num = input.substring(0, 8);
          num = num.replace('X', 0);
          num = num.replace('Y', 1);
          num = num.replace('Z', 2);
          aux2 = input.substring(input.length - 1, input.length);
          num = num % 23;
          letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
          letra = letra.substring(num, num + 1);
          if (letra !== aux2) {
              mensajeError="La letra del DNI es incorrecta";
              hayError = true;
          }
    }else {
      mensajeError= "El DNI es incorrecto";
      hayError = true;
    }
    aux++;
  }

    function validateUsuario(input){
      let expr = /^[a-zA-Z0-9]{3,45}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "El nombre de usuario no es válido";
        hayError = true;
      }
      aux++;
    }

    function validateContrasena(input){
      let expr = /^[a-zA-Z0-9_-]{3,45}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "La contraseña no es válida";
        hayError = true;
      }
      aux++;
    }

    function validateIdRolFuncAcc(input){
      let expr = /^\d{1,4}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "El id no es válido";
        hayError = true;
      }
      aux++;
    }

    function validateNombrePersona(input){
      let expr = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s\-']{3,45}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "El nombre no es válido";
        hayError = true;
      }
      aux++;
    }

    function validateNameRolFuncAcc(input){
      let expr = /^[a-zA-Z]{3,45}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "El nombre no es válido";
        hayError = true;
      }
      aux++;
    }

    function validateApellidos(input){
      let expr = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s'\-]{5,100}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "Los apellidos no son válidos";
        hayError = true;
      }
      aux++;
    }

    function validateDescripRolFuncAcc(input){
      let expr = /^(?!.*[=<>$#{}[\]])[\s\S]{20,200}$/;
      if(expr.test(input) ===  false)
      {
        mensajeError = "La descripción no es válida";
        hayError = true;
      }
      aux++;
    }
    
    function validateNacimiento(input){
      //fecha válida de 2 números para día, dos números para mes y cuatro números para año, - como caracter de separación
      let expr = /^[0-9][0-9]\-[0-9][0-9]-[0-9]{4}$/;
      if(expr.test(input) === false)
      {
        mensajeError = "El formato de la fecha no es correcto (XX-XX-XXXX)";
        hayError = true;
      }
      aux++;
    }

    function validateDireccion(input){
      let expr = /^[0-9a-zA-ZÀ-ÿáéíóúÁÉÍÓÚüÜ\s\/,\-ºª]{10,200}$/;

      if(expr.test(input) === false)
      {
       mensajeError = "La dirección no es válida." 
       hayError = true;
      }
      

      if(input.length > 200)
      {
        mensajeError = mensajeError + " Es demasiado larga"
      }
      

      if(input.length < 10)
      {
        mensajeError = mensajeError + " Es demasiado corta"
      }
      
      aux++;
    }

    function validateTelefono(input){
      let expr = /^[0-9]{9}$/;

      if(expr.test(input) == false)
      {
        mensajeError = "El numero de teléfono no es correcto"
        hayError = true;
      }
      aux++;
    }

    function validateEmail(input){
      let expr = /^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}$/;

      if(expr.test(input))
      {
        mensajeError = "El email no es valido."
        hayError = true;
      }
      
      aux++;
    }

    function validateFoto(input){
      let expr = /^([a-zA-Z0-9]{6,40})\.(png|jpg)$/;
      if(expr.test(input.trim()))
      {
        hayError = true;
        mensajeError = "El formato de imagen no es válido"
      }
      aux++;
  }


  return mensajeError;
  }