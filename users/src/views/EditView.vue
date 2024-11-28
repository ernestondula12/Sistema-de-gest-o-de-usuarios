<template>
  <div id="container">
    <h2 class="titulo2">Edição de usuario</h2>
    <hr>
    <div class="columns is-centered">
        <div class="column is-half">
            <div  v-if="error != undefined">
                <div class="notification is-danger">
                    {{error}}
                </div>
            </div>
        <label for="nome" class="label">Nome</label>
        <input type="text" name="nome" placeholder="Digite o seu nome" class="input is-rounded" v-model="nome">
        <label for="email" class="label">E-mail</label>
        <input type="email" name="email" placeholder="Digite o seu e-mail" class="input is-rounded" v-model="email">
        <hr>
        <button class="button is-dark is-fullwidth" id="botao" @click="update">Editar</button>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    created(){


          var req = {
          headers: {
              Authorization: "Bearer " + localStorage.getItem('token')
          }
      }

        //Verificando se o id passado na rota pelo usuario existe na base de dados 
        axios.get("http://localhost:8686/user/" + this.$route.params.id, req).then(res => {
            console.log(res);

            this.nome = res.data.nome;
            this.email = res.data.email;
            this.id = res.data.id;

        }).catch(err => {
            console.log(err.response);
            this.$router.push({name: 'users'})
        })
    },

    data(){
        return {
            nome: '',
            email: '',
            id: -1,
            error: undefined
        }
    },
    methods:{
        update(){

                var req = {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                }
            }

            axios.put("http://localhost:8686/user",{
                nome: this.nome,
                email: this.email,
                id: this.id
            }, req).then(res => {
                console.log(res);
                this.$router.push({name: 'users'});
            }).catch(err => {
                var msgErro = err.response.data.err;
                this.err = msgErro;
                console.log(msgErro);
            })
        }
    }
}
</script>

<style>
    #container{
        margin-top: 25px;
        margin: 10px;
        padding: 30px;
    }

    .titulo2{
        font-size: 25px;
        color: #e69595;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .label{
        margin-top: 10px;
    }

    #botao{
        margin-top: 15px;
    }
</style>