<template>
  <div id="container">
        <h2 class="titulo2">Login de Usuario</h2>
        <hr>
        <div class="columns is-centered">
            <div class="column is-half">
                <div v-if="erro != undefined">
                    <div class="notification is-danger">
                        {{erro}}
                    </div>
                </div>
                <label for="email" class="label">E-mail</label>
                <input type="text" name="email" placeholder="Digite o seu e-mail" class="input is-rounded" v-model="email">
                <label for="senha" class="label">Password</label>
                <input type="password" name="password" placeholder="*******" class="input is-rounded" v-model="password">
                <hr>
                <button class=" button is-dark is-fullwidth" @click="login">Entrar</button>
            </div>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data(){

        return{
            email: '',
            password: '',
            erro: undefined
        }
    },
    methods:{
            login(){
                axios.post("http://localhost:8686/login", {
                    email: this.email,
                    password: this.password
                }).then(res => {
                    localStorage.setItem('token', res.data.token);
                    this.$router.push({name: 'home'});
                    console.log("Logou....");
                }).catch(err => {
                    var msgErro = err.response.data.err;
                    this.erro = msgErro;
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