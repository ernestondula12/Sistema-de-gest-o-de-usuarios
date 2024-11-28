<template>
  <div>
        <div class="column is-offset-2 is-8">
            <h1 class="title has-text-centered is-3 has-text-primary is-spaced">Painel Administrativo</h1>
            <h2></h2>
            <h2 class="title is-3 has-text-black has-text-centered">Menu</h2>


            <aside class="menu">
              <p class="menu-label">Navegação</p>

              <ul class="menu-list">
                  <li><a href="#">Usuarios</a></li>
                  <li><a href="#">Proudtos</a></li>
                  <li><a href="#">Informações</a></li>
              </ul>

            </aside>

        </div>
 
  <div class="table-container">
      <table class="table is-hoverable">
    <thead>
      <tr>
        <th>ID</th>
        <th>NOME</th>
        <th>E-MAIL</th>
        <th>CARGO</th>
        <th>AÇÕES</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
            <td>{{user.id}}</td>
          <td>{{user.nome}}</td>
          <td>{{user.email}}</td>
          <td>{{user.role | processRole}}</td>
          <td>
            <router-link :to="{name: 'userEdit', params:{id: user.id}}"><button class="button is-success">Editar</button></router-link> |
            <button class="button is-danger" @click="showModalUser(user.id)">Deletar</button></td>
      </tr>
    </tbody>
  </table>
        <div :class="{modal: true, 'is-active': showModal}">
            <div class="modal-background"></div>
            <div class="modal-content">
             <div class="card">
                <header class="card-header">
                    <p class="card-header-title">
                        Voce quer realmente deletar este usuario ?
                    </p>
                </header>
                <div class="card-content">
                    <div class="content">
                      <p>
                        informamos que após a confirmação da deleção do usuario o mesmo sera excluido permanentemente da sua base de dados.
                      </p>
                    </div>
            </div>
            <footer class="card-footer">
                <a href="#" class="card-footer-item" @click="hideModal()">Cancelar</a>

                <a href="#" class="card-footer-item" @click="deleteUser()">Sim, quero deletar</a>
            </footer>
            </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click="hideModal()"></button>
        </div>
</div>
</div>
</template>

<script>
//Importando o axios
import axios from 'axios';
export default {
    created(){
      
      /*Esta rota para listagem de usuarios esta protegida pelo um middleware e para acessar a mesma 
      precisamos mandar junto com cabeçalho header para conseguirmos acessar a mesma rota
      */

      var req = {
          headers: {
              Authorization: "Bearer " + localStorage.getItem('token')
          }
      }

      axios.get("http://localhost:8686/users", req).then(res => {
          console.log(res);
          this.users = res.data;
      }).catch(err => {
          console.log(err);
      })
      console.log("Olá");
    },
    data(){
        return {
            users: [],
            showModal: false,
            deleteUserId: -1
        }
    },
    methods: {
        hideModal(){
            this.showModal = false;
        },
        showModalUser(id){
            this.deleteUserId = id;
            this.showModal = true;
        },
        deleteUser(){

             var req = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            }

            axios.delete("http://localhost:8686/user/"+this.deleteUserId, req).then(res => {
                console.log(res);
                this.showModal = false;

                //Após a requisição der certo 
                this.users = this.users.filter(u => u.id != this.deleteUserId);

            }).catch(err => {
                console.log(err);
                this.showModal = false;
            })
        }
    },
    filters: {
        processRole: function(value){
            if(value == 0){
                return "Usuario comum"
            }else if(value == 1){
                return "Admin"
            }
        } 
    }
}
</script>

<style>

</style>