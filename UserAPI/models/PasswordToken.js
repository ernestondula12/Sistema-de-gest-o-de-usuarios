var knex = require("../database/connection");
var User = require("./User");
const { v4: uuiv4} = require('uuid');

class PasswordToken{

    /*Criando o metodo create que será responsavel 
    por receber um e-mail para que o usuario que tiver esse e-mail recuperar a senha*/

    async create(email){

        //Verificando se o email informado pelo usuario esta cadastrado no sistema
        //Verificando ou pegando o id do usuario que possui o e-mail
        var user =  await User.findByEmail(email);
        if(user != undefined){  

            try{

                var token = uuiv4();

                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtokens");

                return {status: true, token: token}

            }catch(err){
                console.log(err);
                return {status: false, err: err}
            }
            
        }else{

            return {status: false, err: "O e-mail passado não existe no banco de dados!"}
        }
    }

    //Criando o metodo que vai receber e validar o token
    async validate(token){
        try{

            var result = await knex.select().where({token: token}).table("passwordtokens");
            if(result.length > 0){
                var tk = result[0];

                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }
            }else{
                return {status: false};
            }
        }catch(err){
            console.log(err);
            return {status: false};
        }
    }

    //Metodo para atualizar o estado do token de "não usado" para "usado";

    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtokens");
    }

}

module.exports = new PasswordToken();