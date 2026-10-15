import JsonWebToken from "jsonwebtoken";
import dotenv from "dotenv"; 

//importar ususarios por mientras que "no hay bd"
import {usuarios} from "./../controllers/authenticaion.controller.js"; 
//para poder usarlo 
dotenv.config(); 

function soloAdmin (req,res,next){
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect ("/")
}

function soloPublico (req,res,next){
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect ("/admin")
}

function revisarCookie (req){
    try {
        const cookieJWT = req.headers.cookie.split("; ").find (cookie => cookie.startsWith("jwt=")).slice(4);
    const decodificada = JsonWebToken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log(decodificada);
    const usuarioARevisar = usuarios.find(usuario => usuario.user === decodificada.user);
    console.log(usuarioARevisar);
    if(!usuarioARevisar){
        return false 
    } 
    return true ;
    }
    catch{
        return false; 
    }
    
}



export const methods = {
    soloAdmin,
    soloPublico
}