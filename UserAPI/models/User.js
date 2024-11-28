var knex = require("../database/connection");
var bcrypt = require('bcrypt');
const PasswordToken = require("./PasswordToken");

class User{

    //Metodo para listagem de usuarios
    async findAll(){
        try{
            var result = await knex.select(["id","email","role","nome"]).table("users");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    //Metodo para procurar ou achar o usuario por id
    async findById(id){
        try{    
            var result = await knex.select(["id", "email", "role","nome"]).where({id: id}).table("users");
             //Verificando a variavel result
             if(result.length > 0){

                return result[0];
                
            }else{
                return undefined;
            }
        }catch(err){
            console.log(err);
        }
    }

    //Metodo para procurar ou achar o usuario via e-mail
    async findByEmail(email){
        try{    
            var result = await knex.select(["id", "email", "password", "role","nome"]).where({email: email}).table("users");
             //Verificando a variavel result
             if(result.length > 0){

                //Pegando o primeiro e-mail que ele vai achar na base de dados
                return result[0];
                
            }else{
                return undefined;
            }
        }catch(err){
            console.log(err);
        }
    }

    async new(email, password,nome){

        try{
             var hash = await bcrypt.hash(password, 10);
            await knex.insert({email,password: hash,nome,role:0}).table("users");
        }catch(err){
            console.log(err);
        }
    }

    /*Criando um metodo que será responsavel para verificar se o email que esta cadastrado
        no base de dados é igual a que esta ser passado pelo usuario
    */
   async findEmail(email){

        try{

            var result = await knex.select("*").from("users").where({email: email});
            
            //Veficando a variavel result
            if(result.length > 0){
                return true;
            }else{
                return false;
            }

        }catch(err){
            console.log(err);
            return false;
        }
   }

   //Criando o metodo para atualização dos dados do usuarios
   async update(id,email,nome,role){

      var user =  await this.findById(id);

      //Verificando se o usuarios existe
      if(user != undefined){

        //Criando uma variavel editUser que vai ser preenchido na medida que usurio vai inserir os dados
        var editUser = {}
        //Verificando o e-mail
        if(email != undefined){
            if(email != user.email){
              var result =  await this.findEmail(email);
              //Verificando o resultado vindo da verificação do email apartir do metodo findEmail
              if(result == false){
                    editUser.email = email;
              }else{
                return {status: false, err: "O e-mail já esta cadastrado!"}
              }
            }
        }

        //Verificando o nome
        if(nome != undefined){
            editUser.nome = nome;
        }

        //Verificando o role ou cargo
        if(role != undefined){
            editUser.role = role;
        }

        try{
            //Chamando o nosso banco de dados
            await knex.update(editUser).where({id: id}).table("users");
            return {status: true}

        }catch(err){

            return {status: false, err: err}
            console.log(err);
        }
      }else{
        return {status: false, err: "O usuario não existe!"}
      }
   }

   //Criando o metodo para deleção de usuario
   async delete(id){

       var user = await this.findById(id);
       //Verificando se o usuario existe na base de dados
       if(user != undefined){
            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true}
            }catch(err){

                return {status: false,err}
            }

       }else{
            return {status: false, err: "O usuario não existe, por tanto não pode ser deletado."}
       }
   }

   //Metodo para mudança de senha
   async changePassword(newPassword, id, token){
        //Criptografando a nova senha
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users");
        //Atualizando o token como usado
        await PasswordToken.setUsed(token);
   }
}

module.exports = new User();