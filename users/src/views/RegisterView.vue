<template>
  <div id="container">
    <h2 class="titulo2">Registro de usuário</h2>
    <hr>
    <div class="columns is-centered">
        <div class="column is-half">
            <div v-if="erro != undefined">
                <div class="notification is-danger">
                     {{erro}}
                </div>
            </div>
            <label for="nome" class="label">Nome</label>
            <input type="text" name="nome" placeholder="Digite o seu nome" class="input is-rounded is-loading" v-model="nome">
            <label for="email" class="label">E-mail</label>
            <input type="text" name="email" placeholder="Digite o seu e-mail" class="input is-rounded" v-model="email">
            <label for="senha" class="label">Senha</label>
            <input type="password" name="password" placeholder="******" class="input is-rounded" v-model="password">
            <hr>
            <button class="button is-dark is-fullwidth" id="botao" @click="register">Cadastrar</button>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
        data(){
            return {
                nome: '',
                password: '',
                email: '',
                erro: undefined
            }
        },
        methods: {
             register(){
                axios.post("http://localhost:8686/user",{
                    nome: this.nome,
                    password: this.password,
                    email: this.email
                }).then(res => {

                        console.log(res);
                        this.$router.push({name: 'home'});

                }).catch(err => {
                    var msgErro = err.response.data.err;
                    this.erro = msgErro;
                    console.log(msgErro);
                })
            }
        }
}
</script>

<style>
    #container{

        margin-top: 20px;
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