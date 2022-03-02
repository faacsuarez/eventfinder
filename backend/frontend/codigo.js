//const URLBase = "http://localhost:3000"
const URLBase = "https://eventfinderobligatorio.glitch.me"

// ------------- NAV ------------------//

const burger = document.querySelector(".nav-toggle")
const nav = document.querySelector(".menu");

burger.addEventListener("click", ()=> {
    nav.classList.toggle("active");
})

let datosGlobales; 
let datosGlobalesEventos;
let datosGlobalesIndividual;
let datosEventosListar;

// ------ VENTANA AMPLIAR EVENTO ---------//

let contenidoAmpliarEvento = document.querySelector("#contenidoAmpliarEvento");

let comboDepartamentos = document.querySelector("#slcFiltrarDpto");

// ---------- VERIFICACION EN LOCAL STORAGE ---------------- //

if(localStorage.getItem("idGuardado") === null){
    document.querySelector("#logIn").style.display = "flex";
    document.querySelector("#mostrarEventos").style.display = "none";
}
else {
    document.querySelector("#logIn").style.display = "none";

    fetch(URLBase + "/eventos").
            then(r => r.json())
            .then(jsonEventos => {
                
            console.log(jsonEventos);
            datosGlobalesEventos = jsonEventos;
            datosEventosListar = datosGlobalesEventos
            rellenarSelectDepartamentos();
            listarEventos();

            document.querySelector("#logIn").style.display = "none";
            document.querySelector("#mostrarEventos").style.display = "flex";
            document.querySelector("#btnCrearEvento").style.display = "flex";

            let botonFiltrarCategoria = document.querySelectorAll(".btnFiltrarCategoria")
            botonFiltrarCategoria.forEach(botonn => {
                    botonn.addEventListener("click", filtrarCategoria);
            })
            })
}



// ----------------- GET EVENTOS------------ //

let botonCerrarSesion = document.querySelector("#btnCerrarSesion");
let botonDelPerfil = document.querySelector("#btnMiPerfil");

let exito = document.querySelector("#exito");
let exitoEvento = document.querySelector("#exitoEvento");
let problema = document.querySelector("#problema");

let botonRegistro = document.querySelector("#registro");
let botonCrearEvento = document.querySelector("#btnCrearEvento");
let botonRetroceso = document.querySelector("#retroceso");


// ------------------ INPUT REGISTRO USUARIOS ------------------

let campoNombre = document.querySelector("#txtNombre");
let campoApellido = document.querySelector("#txtApellido");
let campoUsuario = document.querySelector("#txtUsuario");
let campoContraseña = document.querySelector("#txtContraseña");

let botonAgregarUsuario = document.querySelector("#btnAgregarUsuario");


// ------------- POST REGISTRO USUARIOS -------- //

const agregarUsuario = () => {

    let nombreUsuario = campoNombre.value;
    let apellidoUsuario = campoApellido.value;
    let usuarioUsuario = campoUsuario.value;
    let contraseñaUsuario = campoContraseña.value;

    if(nombreUsuario === "" || apellidoUsuario === "" || usuarioUsuario === "" || contraseñaUsuario === ""){
        establecerError(campoNombre, 'Debe ingresar un nombre');
        establecerError(campoApellido, 'Debe ingresar un apellido');
        establecerError(campoUsuario, 'Debe ingresar un nombre de usuario');
        establecerError(campoContraseña, 'Debe ingresar una contraseña');
    }
    else if(contraseñaUsuario.length<6){
        establecerError(campoContraseña, 'Debe ingresar una contraseña con más de 6 dígitos');
    }
    else {
        fetch(URLBase + "/usuarios", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
            nombre: nombreUsuario, 
            apellido: apellidoUsuario,
            usuario: usuarioUsuario,
            contraseña: contraseñaUsuario,
            })
        })
        .then(r => r.json())
        .then(usuarioInsertado => {
            console.log(usuarioInsertado);

            if(usuarioInsertado === "Ese nombre de usuario ya existe"){
                establecerError(campoUsuario, 'Este nombre de usuario ya existe')
            }
            else {
                establecerExito(campoNombre);
                establecerExito(campoApellido);
                establecerExito(campoUsuario);
                establecerExito(campoContraseña);
                document.querySelector("#exito").style.display = "block";
                console.log(usuarioInsertado)
                datosGlobales.push(usuarioInsertado);
                //listarUsuarios();
            }
        });
    }
}
botonAgregarUsuario.addEventListener("click", agregarUsuario);



// ----------------- INPUT LOG-IN USUARIOS ----------------

let usuarioLogin = document.querySelector("#logInUsuario");
let passwordLogin = document.querySelector("#logInPassword");
let botonLogin = document.querySelector("#logInBtn");


const iniciarSesion = () => {

    let logUsuario = usuarioLogin.value
    let passUsuario = passwordLogin.value

    if(logUsuario === ""  || passUsuario ===""){
        establecerError(usuarioLogin, 'Debe ingresar un usuario para poder entrar')
        establecerError(passwordLogin, 'Debe ingresar una contraseña')
    }
    else {

        fetch(URLBase + "/usuarioLogin", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
            logUsuario: logUsuario, 
            passUsuario: passUsuario,
            })
        })
        .then(r => r.json())
        .then(infoLogin => {


            if(infoLogin === "No existe un usuario con eso"){
                establecerError(usuarioLogin, 'Verifique los campos')
                establecerError(passwordLogin, 'Verifique los campos')

                usuarioLogin.value = ""
                passwordLogin.value = ""
            }
            else {
                datosGlobalesEventos = infoLogin.datosEventos;
                datosEventosListar = datosGlobalesEventos
                localStorage.setItem('userGuardado', infoLogin.datosUsuario.usuario);
                localStorage.setItem('nombreGuardado', infoLogin.datosUsuario.nombre);
                localStorage.setItem('apellidoGuardado', infoLogin.datosUsuario.apellido);
                localStorage.setItem('idGuardado', infoLogin.datosUsuario._id);
    
                document.querySelector("#logIn").style.display = "none";
                document.querySelector("#btnCrearEvento").style.display = "flex";
                rellenarSelectDepartamentos();
                listarEventos();
                document.querySelector("#mostrarEventos").style.display = "flex"; 
            }

                           
        });
    }         

    }
botonLogin.addEventListener("click", iniciarSesion);

// ----------------- SELECT DINAMICO DE DEPARTAMENTOS ------------ //

const rellenarSelectDepartamentos = () => {

    let arrayDepartamentos = [];

    datosGlobalesEventos.forEach(evento => {
        if(arrayDepartamentos.includes(evento.departamento) === false){
            arrayDepartamentos.push(evento.departamento)
        }
    });

    arrayDepartamentos.forEach(departamento => {
        comboDepartamentos.innerHTML += `<option value="${departamento}">${departamento}</option>`        
    })
}

// ----------------- FILTRAR EVENTOS POR DEPARTAMENTO------------ //

const filtrarDepartamentos = () => {

    let valorDelSelect = comboDepartamentos.value

    let filtradosPorDepartamentos = datosGlobalesEventos.filter(evento => {
        if(evento.departamento === valorDelSelect || valorDelSelect === "todos"){
            return evento
        }
    })
    datosEventosListar = filtradosPorDepartamentos
    listarEventos();
}


// ------------------------------ CERRAR SESIÓN ----------------------

const cerrandoSesion = () => {
    localStorage.clear();
    document.querySelector("#logIn").style.display = "block";
    document.querySelector("#mostrarEventos").style.display = "none";
    document.querySelector("#btnCrearEvento").style.display = "none";
    document.querySelector("#eventosCreadosPorUsuario").style.display = "none";
}
botonCerrarSesion.addEventListener("click", cerrandoSesion);



const filtrarCategoria = evt => {

    let tipoCategoria = evt.target.getAttribute("data-idcategoria");
 
    let filtradosPorCategoria = datosGlobalesEventos.filter(evento => {
        if(evento.categoria === tipoCategoria || tipoCategoria === "todasCategorias"){
            return evento
        }
    })

    datosEventosListar = filtradosPorCategoria
    listarEventos();
}



// ----------------- BOTONES ------------ //
const mostrarCrearEvento = () => {
    document.querySelector("#mostrarEventos").style.display = "none";
    document.querySelector("#crearEvento").style.display = "flex";
    document.querySelector("#btnCrearEvento").style.display = "none";
}
botonCrearEvento.addEventListener("click", mostrarCrearEvento);

const hacerRetroseso = () => {
    document.querySelector("#mostrarEventos").style.display = "flex";
    document.querySelector("#crearEvento").style.display = "none";
    document.querySelector("#btnCrearEvento").style.display = "flex";
}
botonRetroceso.addEventListener("click", hacerRetroseso);

const mostrarRegistro = () => {
    document.querySelector("#logIn").style.display = "none";
    document.querySelector("#crearUsuario").style.display = "flex";
}
botonRegistro.addEventListener("click", mostrarRegistro);



// --------------------- INPUT CREAR EVENTO --------------------

let formNombreEvento = document.querySelector("#nombreEvento");
let formFechaEvento = document.querySelector("#fechaEvento");
let formHoraInicio = document.querySelector("#horaInicio");
let formHoraFin = document.querySelector("#horaFin");
let formUbicacionEvento = document.querySelector("#ubicacionEvento");
let formPrecioEvento = document.querySelector("#precioEvento");
let formInfoAdicional = document.querySelector("#infoAdicionalEvento");

let botonAgregarEvento = document.querySelector("#btnAgregarEvento");

// ------------- POST EVENTOS -------- //

const agregarEvento = () => {
    
    var nombreGuardado = localStorage.getItem('nombreGuardado');
    var idGuardado = localStorage.getItem('idGuardado');

    let categoriaSelect = document.getElementById("categoriaEvento");
    let departamentoSelect = document.getElementById("departamentoEvento");
    let eventoCategoria = document.getElementById("categoriaEvento").value;
    let eventoDepartamento = document.getElementById("departamentoEvento").value;
    let eventoVacuna = document.querySelector( 'input[name="vacuna"]');

    let nombreEvento = formNombreEvento.value;
    let categoriaEvento = eventoCategoria;
    let fechaEvento = formFechaEvento.value
    let horaInicio = formHoraInicio.value;
    let horaFin = formHoraFin.value;
    let ubicacionEvento = formUbicacionEvento.value;
    let departamentoEvento = eventoDepartamento;
    let precioEvento = parseInt(formPrecioEvento.value);
    let vacunaEvento = eventoVacuna.value;
    let infoAdicionalEvento = formInfoAdicional.value;

    var hasta = 1;
    var desde = 3;
    var numero = Math.floor(Math.random()*(hasta -(desde -1))) + desde;
 
    if(nombreEvento === "" || fechaEvento === "" || ubicacionEvento === "" ||  horaInicio === "" || horaFin === "" || precioEvento === "" || categoriaEvento === "seleccioneCat" || departamentoEvento === "seleccioneDep"){
        establecerError(formNombreEvento, 'Ingrese un nombre');
        establecerError(formFechaEvento, 'Seleccione una fecha');
        establecerError(formUbicacionEvento, 'Ingrese una ubicación');
        establecerError(formHoraInicio, 'Seleccione');
        establecerError(formHoraFin, 'Seleccione');
        
        categoriaSelect.style.borderColor = "red";
        document.getElementById("errorCategoria").innerHTML="Seleccione una categoría"

        departamentoSelect.style.borderColor = "red";
        document.getElementById("errorDepartamento").innerHTML="Seleccione un departamento"

        formPrecioEvento.style.borderColor = "red";
        document.getElementById("errorPrecio").innerHTML="Ingrese un precio"

        formInfoAdicional.style.borderColor = "red";
        document.getElementById("errorTextarea").innerHTML="Ingrese información"
    }
    else {

        document.querySelector("#exitoEvento").style.display = "block";
 
        fetch(URLBase + "/eventos", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
            numero: numero,
            nombre: nombreEvento, 
            categoria: categoriaEvento,
            fecha: fechaEvento,
            horaInicio: horaInicio,
            horaFin: horaFin,
            ubicacion: ubicacionEvento,
            departamento: departamentoEvento,
            precio: precioEvento,
            vacuna: vacunaEvento,
            infoAdicional: infoAdicionalEvento,
            organizador: nombreGuardado,
            idOrganizador: idGuardado,
        })
        })
        .then(r => r.json())
        .then(eventoInsertado => {
            console.log(eventoInsertado)
            datosGlobalesEventos.push(eventoInsertado);
            datosEventosListar = datosGlobalesEventos
            listarEventos();
        });
    }
}
botonAgregarEvento.addEventListener("click", agregarEvento);


// ------------- LISTAR EVENTOS -------- //
const listarEventos = () => {

    const months = ["enero", "febrero", "marzo","abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
    todosEventos.innerHTML = "";

    datosEventosListar.forEach(evento => {

        var mydate = new Date(evento.fecha);
        let fechaFormateada = mydate.getDate() + " " + months[mydate.getMonth()] + " " + mydate.getFullYear()

        document.querySelector("#todosEventos").innerHTML += `
        <article class="infoEvento">
            <img src="img/${evento.categoria}${evento.numero}.jpeg">
            <h3>${evento.nombre}</h3>
            <small class="${evento.categoria}">${evento.categoria}</small>
            <p><i class="fas fa-map-marker-alt"></i>${evento.ubicacion}</p>
            <p><i class="far fa-calendar-alt"></i>${fechaFormateada}</p>
            <p><i class="far fa-clock"></i>${evento.horaInicio} - ${evento.horaFin}</p>
            <p><input type="button" data-idEvento="${evento._id}" value="+" class="ampliacionEvento" id="${evento.categoria}"></p>
        </article>`;
    })
    let botonAmpliarEvento = document.querySelectorAll(".ampliacionEvento")

    botonAmpliarEvento.forEach(botoncito => {
            botoncito.addEventListener("click", ampliarUsuarioBoton);
    })
}

// -------------- MOSTRAR EVENTOS DE CADA USUARIO ------------------ //

let eventosDeCadaPerfil = document.querySelector("#eventosPorPerfil");

const mostrarPerfil = () => {

    document.querySelector("#eventosCreadosPorUsuario").style.display = "flex";
    eventosDeCadaPerfil.innerHTML = ""
    let idDelOrganizador = localStorage.getItem('idGuardado');
    document.querySelector("#mostrarEventos").style.display = "none";

    fetch(URLBase + "/eventos/"+idDelOrganizador, {
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(r => r.json())
    .then(eventoPerfil => {

        

        eventoPerfil.forEach(individual => {

        const months = ["enero", "febrero", "marzo","abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
        var mydate = new Date(individual.fecha);
        let fechaFormateada = mydate.getDate() + " " + months[mydate.getMonth()] + " " + mydate.getFullYear()
        eventosDeCadaPerfil.innerHTML += `
            
        <article class="infoEventoIndividual">
            <img src="img/${individual.categoria}${individual.numero}.jpeg">
            <h3>${individual.nombre}</h3>
            <small class="${individual.categoria}">${individual.categoria}</small>
            <p><i class="fas fa-map-marker-alt"></i>${individual.ubicacion}</p>
            <p><i class="far fa-calendar-alt"></i>${fechaFormateada}</p>
            <p><i class="far fa-clock"></i>${individual.horaInicio} - ${individual.horaFin}</p>
            <p><input type="button" data-idEventoIndividual="${individual._id}" value="X" class="eliminarEvento"></p>
        </article> `;
        })

        let botonesEliminar = document.querySelectorAll(".eliminarEvento");

        botonesEliminar.forEach(eliminacion => {
         eliminacion.addEventListener("click", eliminarEventoIndividual);
    })
    });
}
botonDelPerfil.addEventListener("click", mostrarPerfil);



const eliminarEventoIndividual = evt => {

    let idEventoEliminar = evt.target.getAttribute("data-idEventoIndividual");

    let confirmacion = confirm("¿Está seguro que desea eliminar este evento?");

    if(confirmacion===true){
        fetch(URLBase + "/eventoo/"+idEventoEliminar, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(r => r.json())
        .then(eventoIndividualEliminado => {

            console.log(eventoIndividualEliminado);

            let idEliminado = eventoIndividualEliminado._id;
            datosGlobales = datosGlobales.filter(usuario => usuario._id !== idEliminado);
            mostrarPerfil();
        });
    }
} 


//AMPLIAR CADA EVENTO CON CLICK
const ampliarUsuarioBoton = evt => {

    document.querySelector("#ampliarEvento").style.display = "flex";

    let idEventoAmpliar = evt.target.getAttribute("data-idEvento");
    console.log(idEventoAmpliar)
    fetch(URLBase + "/evento/"+idEventoAmpliar, {
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(r => r.json())
    .then(eventoEncontrado => {

        const months = ["enero", "febrero", "marzo","abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
        var mydate = new Date(eventoEncontrado.fecha);
        let fechaFormateada = mydate.getDate() + " " + months[mydate.getMonth()] + " " + mydate.getFullYear()

        contenidoAmpliarEvento.innerHTML = `
            <small id="closeAmpliar">+</small>
            <img src="img/${eventoEncontrado.categoria}${eventoEncontrado.numero}.jpeg">
            <h2>${eventoEncontrado.nombre}</h2>
            <small class="${eventoEncontrado.categoria}">${eventoEncontrado.categoria}</small>
            <h3><i class="fas fa-map-marker-alt"></i> ${eventoEncontrado.ubicacion}</h3>
            <p>${eventoEncontrado.departamento}</p>
            <h3><i class="far fa-calendar-alt"></i>${fechaFormateada}</h3>
            <h3><i class="far fa-clock"></i>${eventoEncontrado.horaInicio} - ${eventoEncontrado.horaFin}<h3/>
            <h3><i class="fas fa-dollar-sign"></i>${eventoEncontrado.precio}</h3>
            <h3><i class="fas fa-crutch"></i>${eventoEncontrado.vacuna}<h3/>
            <h3>Info Adicional</h3>
            <p>${eventoEncontrado.infoAdicional}</p>
            <p>Evento creado por ${eventoEncontrado.organizador}</p>
        `;

        let btnCerrarModal = document.querySelector("#closeAmpliar");

        const cerrarModal = () =>{
            document.querySelector("#ampliarEvento").style.display = "none";
        }
        btnCerrarModal.addEventListener("click", cerrarModal);
    });
}



function establecerError(input,mensaje) {
    const formContenido = input.parentElement;
    const small = formContenido.querySelector('small');
    small.innerText = mensaje;
    formContenido.className = 'form-contenido error';
}


function establecerExito(input){
  const formContenido = input.parentElement;
  formContenido.className = 'form-contenido exito';
}




let tablaUsuarios = document.querySelector("#tablaUsuarios")

// ----------------- GET USUARIOS------------ //
fetch(URLBase + "/usuarios").
then(r => r.json())
.then(datos => {
    console.log(datos);
    datosGlobales = datos;
    //listarUsuarios();
})



// ---------------- MOSTRAR USUARIOS------------ //

/*
const listarUsuarios = () => {

    tablaUsuarios.innerHTML = "";

    datosGlobales.forEach(persona => {
    
        tablaUsuarios.innerHTML += `<tr>

        <td>${persona.nombre}</td>
        <td>${persona.apellido}</td>
        <td>${persona.usuario}</td>
        <td>${persona.contraseña}</td>
        <td><input type="button" data-idUsuario="${persona._id}" value="X" class="eliminar"></td>
        </tr>`
    })

    let botones = document.querySelectorAll(".eliminar");

    botones.forEach(boton => {
        boton.addEventListener("click", eliminarUsuarioBoton);
    })
}

// ----------------- DELETE USUARIO ------------ //

const eliminarUsuarioBoton = evt => {

    // los evt podemos saber en que xy del mouse, cuanto tiempo desde que cargo la pagina se hizo click
    let idUsuarioEliminar = evt.target.getAttribute("data-idUsuario");

    //recibe como parametro el mensaje que le quiero mostrar al usaurio
    let confirmacion = confirm("¿Está seguro que desea eliminar?");

    //if(confirmacion===true)
    if(confirmacion===true){
        fetch(URLBase + "/usuarios/"+idUsuarioEliminar, {
            method:"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(r => r.json())
        .then(usuarioEliminado => {
            console.log(usuarioEliminado);
            let idEliminado = usuarioEliminado._id;
            // el filter crea un usuario con los nuevos datos
            // sumo a todos menos al idEliminado
            datosGlobales = datosGlobales.filter(usuario => usuario._id !== idEliminado);
            //listarUsuarios ACTUALIZA TODO
            listarUsuarios();
        });
    }
}    
*/

