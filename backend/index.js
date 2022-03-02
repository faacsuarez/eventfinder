let express = require("express");
let app = express();
require('dotenv').config()
let puerto = process.env.PORT || 58914;
let cors = require("cors");

let userDB= process.env.DB_USER;
let passDB = process.env.DB_PASS;

let mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${userDB}:${passDB}@cluster0.n066c.mongodb.net/buscadorEventos?retryWrites=true&w=majority`);
let db = mongoose.connection
db.once("open", () => console.log("Conectado a la base de datos"))


app.use(cors());
app.use(express.json());



// cada vez que al serivor le llega una peticion de barra mandamos lo que este dentro de la carpeta fronted
app.use("/", express.static("frontend"));


//MIDDLEWEARE LOG-IN
app.use((req, res, next) => {
    let nombreUsuario = "A";
    if(nombreUsuario === "A"){
        next();
    }else{
        res.statusCode = 401;
        res.json({mensaje:"No autorizado"});
    }
})

// ****************** 
// USUARIOS
// ****************** 

let usuarioSchema = new mongoose.Schema({
    nombre:String,
    apellido:String,
    usuario:String,
    contraseña:String
})

// collection USUARIOS
let Usuario = mongoose.model("Usuario", usuarioSchema);

app.get("/usuarios", (req,res) => {
    Usuario.find( { edad:{ $gte:10 }} ,(err, usuarios) => {
        if(err){
            res.json({mensaje:"Error, no se encontro un usuario"});
        }
        else {
            res.json(usuarios)
        }
    })
})


app.post("/usuarioLogin", (req,res) => {
    Usuario.findOne({usuario:{$eq:req.body.logUsuario}, contraseña:{$eq:req.body.passUsuario}},
        (err, usuarioLogeado) => {
            console.log(req.body.logUsuario)
            console.log(req.body.passUsuario)
            console.log(usuarioLogeado)
            if(err){
                res.json({mensaje: "Error"})
            }
            else if(usuarioLogeado === null){
                res.json("No existe un usuario con eso")
            }
            else {
                Evento.find((err, eventos) => {
                    if(err){
                        res.json({mensaje:"Error eventos"});
                    }
                    else {
                        res.json({datosEventos: eventos, 
                            datosUsuario: usuarioLogeado})
                    }
                })

            }
        })
})


app.post("/usuarios", (req,res) => {
    Usuario.findOne({usuario:{$eq:req.body.usuario}},
        (err, usuario) => {
            if(err){
                res.json({mensaje: "Error"})
            }
            else if(usuario === null){
                let usuarioNuevo = new Usuario({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    usuario: req.body.usuario,
                    contraseña: req.body.contraseña,
                })

            usuarioNuevo.save((err, usuarioIngresado) => {
                    if(err){
                        res.json({mensaje:"Error en la inserción de un nuevo usuario"});
                    }
                    else {
                        res.json(usuarioIngresado)
                    }
                })
            }
            else {
                    res.json({mensaje: "Ese nombre de usuario ya existe"})
                }
        })
})

app.delete("/usuarios/:idEliminar", (req,res) => {
    Usuario.findByIdAndDelete(req.params.idEliminar, (err,usuarioEliminado) => {
        if(err){
            res.json({mensaje:"Error al eliminar usuario"});
        }
        else {
            res.json(usuarioEliminado)
        }
    })
})

// ****************** 
// EVENTOS
// ****************** 

let eventoSchema = new mongoose.Schema({
    numero:Number,
    nombre:String,
    categoria:String,
    fecha:Date,
    horaInicio:String,
    horaFin:String,
    ubicacion:String,
    departamento:String,
    precio:Number,
    vacuna:String,
    infoAdicional:String,
    organizador:String,
    idOrganizador:String,
})

// collection EVENTOS
let Evento = mongoose.model("Evento", eventoSchema);

app.get("/eventos", (req,res) => {
    Evento.find((err, eventos) => {
        if(err){
            res.json({mensaje:"Error eventos"});
        }
        else {
            res.json(eventos)
        }
    })
})

app.post("/eventos", (req,res) => {
    Evento.findOne({nombre:{$eq:req.body.nombre}},
        (err, evento) => {
            if(err){
                res.json({mensaje: "Error en nose"})
            }
            else if(evento === null){
                let eventoNuevo = new Evento({
                    numero: req.body.numero,
                    nombre: req.body.nombre,
                    categoria: req.body.categoria,
                    fecha: req.body.fecha,
                    horaInicio: req.body.horaInicio,
                    horaFin: req.body.horaFin,
                    ubicacion: req.body.ubicacion,
                    departamento: req.body.departamento,
                    precio: req.body.precio,
                    vacuna: req.body.vacuna,
                    infoAdicional: req.body.infoAdicional,
                    organizador: req.body.organizador,
                    idOrganizador: req.body.idOrganizador
                })

                eventoNuevo.save((err, eventoIngresado) => {
                    if(err){
                        res.json({mensaje:"Error en la insersión de un nuevo evento"});
                    }
                    else {
                        res.json(eventoIngresado)
                    }
                })
            }
            else {
                    res.json({mensaje: "Ese evento ya existe"})
                }
        })
})



app.get("/eventos/:idOrganizador", (req,res) => {
    console.log(req.params.idOrganizador)
        Evento.find({idOrganizador:{$eq:req.params.idOrganizador}}, (err, eventoPerfil) => {
        if(err){
            res.json({mensaje:"Error, no se encontro un evento"});
        }
        else {
            res.json(eventoPerfil)
        }
    })
})


app.get("/evento/:id", (req,res) => {
    Evento.findById(req.params.id, (err, eventoEncontrado) => {
        if(err){
            res.json({mensaje:"Error al encontrar evento"});
        }
        else {
            res.json(eventoEncontrado)
        }
    })
})



app.delete("/eventoo/:idEliminarEvento", (req,res) => {
    Evento.findByIdAndDelete(req.params.idEliminarEvento, (err,eventoIndividualEliminado) => {
        if(err){
            res.json({mensaje:"Error al eliminar usuario"});
        }
        else {
            res.json(eventoIndividualEliminado)
        }
    })
})





app.get("/eventos/:idOrganizador", (req,res) => {
    console.log(req.params.idOrganizador)
        Evento.find({idOrganizador:{$eq:req.params.idOrganizador}}, (err, eventoPerfil) => {
        if(err){
            res.json({mensaje:"Error, no se encontro un evento"});
        }
        else {
            res.json(eventoPerfil)
        }
    })
})



//MIDDLEWEARE 404

app.use((req, res, next) => {
    res.statusCode = 404;
    res.json({mensaje: "No existe esa solicitud"});
});


app.listen(puerto, () => {
    console.log("Servidor ejecutado correctamente")
});




