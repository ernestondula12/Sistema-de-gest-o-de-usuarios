var jwt = require('jsonwebtoken');
var secret = "gustavaleriondula";

module.exports = function(req, res, next){

    const authToken = req.headers['authorization']

    if(authToken != undefined){

        var token = authToken;
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try{

            
            var decoded = jwt.verify(token,secret);
            //Verificando o role do usuario na aplicação
            if(decoded.role == 1){
                next();
            }else{
                res.status(403);
                res.send("Voce não tem permissão para isso");
                return;
            }
        }catch(err){
            res.status(403);
            res.send("Voce não esta autenticado");
            return;
        }

    }else{
        res.status(403);
        res.send("Voce não esta autenticado");
        return;
    }

}