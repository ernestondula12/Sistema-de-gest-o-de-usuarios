var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

//key secret for authentique user or token 
var secret = "gustavaleriondula";

class UserController{

    async index(req, res){

        var users = await User.findAll();
        res.json(users);
    }

    //Criando uma função que vai ser responsavel por receber o id do usuario e achar
    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{

            res.status(200);
            res.json(user);
        }
    }

    async create(req, res){

        var {email, nome, password} = req.body;

        //Valindo somente o e-mail
        if(email == undefined || email == '' || email == ' '){

            res.status(400);
            res.json({err: "E-mail inválido"});
            return;

        }

            var emailExists = await User.findEmail(email);

            if(emailExists){
                res.status(406);
                res.json({err: "O e-mail já esta cadastrado!"});
                return;
            }

            await User.new(email,password,nome);

            res.status(200);
            res.send("Tudo Ok!");
    }

    async edit(req,res){
        var {id, nome, role, email} = req.body;
        //Editando e atualizando
        var result = await User.update(id,email,nome,role);
        //Verificando o result
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
            }else{
                res.status(406);
                res.json(result.err);
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }

    //Dentro deste metodo vamos chamar a nossa função responsavel pela deleção de usuario

    async remove(req, res){
        var id = req.params.id

        var result = await User.delete(id);

        if(result.status){
            res.status(200);
            res.send("Tudo OK!");
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    //Metodo para recuperação de senha
    async recoverPassword(req,res){
        var email = req.body.email;

        var result = await PasswordToken.create(email);

        //Verificando o estado da requisição
        if(result.status){
            res.status(200);
            res.send("" + result.token);
        }else{
            res.status(406);
            res.send(result.err);
        }
    }   

    //Criando o metodo para redefinir a senha
    async changePassword(req,res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        //Verificando a variavel responsavel para o retorno se caso o token é valido ou não

        if(isTokenValid.status){

            await User.changePassword(password, isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada!");

        }else{
            res.status(406);
            res.send("Token inválido");
        }
    }

    //Metodo para login de usuarios
    async login(req, res){

        var {email, password} = req.body;

        //Busca de usuario por email
        var user = await User.findByEmail(email);
        //Verificando se o usuario existe
        if(user != undefined){
            //Fazendo comparação de senhas
          var resultado = await  bcrypt.compare(password, user.password);
          
            if(resultado){

                var token = jwt.sign({email: user.email, role: user.role}, secret);
                res.status(200);
                res.json({token:token});
            }else{

                res.status(406);
                res.json({err: "Senha incorreta"});
            }
          
        }else{
            res.status(406);
            res.json({status: false, err: "O usuario não existe"});
        }

    }

}

module.exports = new UserController();