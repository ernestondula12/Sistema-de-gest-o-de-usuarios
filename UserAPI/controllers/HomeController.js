class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Guia do programador");
    }

    //Criando um metodo para validar token
    async validate(req, res){
        res.send("okay");
    }

}

module.exports = new HomeController();