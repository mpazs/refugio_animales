import bcryptjs from "bcryptjs";
import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv"; 
//para poder usarlo 
dotenv.config(); 

//un no hay bd por lo qeu usare un array para tener usuarios 
export const usuarios = [
    {
        user : "admin1",
        email : "admin1@gmail.com",
        password : "contraseñaadmin1"
    }
];

async function login(req,res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password; 
     //si los daos no tienen nada, no se registra
    if(!user || !password){
        return res.status(400).send({status: "error", message: "Todos los campos son obligatorios"});
    }
    //revisar si ya existe el ususario
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if(!usuarioARevisar){
        return res.status(400).send({status: "error", message: "Error al registrarse"});
    }
    const loginCorrecto =  await bcryptjs.compare(password, usuarioARevisar.password);
    if (!loginCorrecto){
        return res.status(400).send({status: "error", message: "Error al registrarse"});
    }
    const token = JsonWebToken.sign(
        {user:usuarioARevisar.user},
        process.env.JVT_SECRET, 
        {expiresIn:process.env.JVT_EXPIRATION} )

        const cookieOption ={
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ) ,
            path: "/"
        }
        res.cookie("jwt",token,cookieOption); 
        res.send({status:"ok",message:"usuario logeado", redirect:"/admin"})
}




async function register(req,res){
    console.log(req.body);
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password; 
    //si los daos no tienen nada, no se registra
    if(!user || !email || !password){
        return res.status(400).send({status: "error", message: "Todos los campos son obligatorios"});
    }
    //revisar si ya existe el ususario
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if(usuarioARevisar){
        return res.status(400).send({status: "error", message: "El usuario ya existe"});
    }
    //para encriptar la contraseña
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario = {
        user,
        email,
        password: hashPassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({status: "ok", message: "Usuario ${nuevoUsuario.user} registrado correctamente",redirect: "/"});
}
export const methods = {
    login,
    register 
}