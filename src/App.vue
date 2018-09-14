<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" app>
      <v-list dense>
        <v-list-tile v-for="item in menuItens" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark app>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">Vendas Online</router-link>
      </v-toolbar-title>
      <v-toolbar-side-icon @click.native="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItens" :key="item.title" router :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat v-show="estaLogado" @click="sair" >
          <v-icon left>exit_to_app</v-icon>
          Sair
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="hidden-sm-only hidden-md-only hidden-lg-only hidden-xl-only">
        <v-btn flat v-show="estaLogado" @click="sair" >
          <v-icon left>exit_to_app</v-icon>
          Sair
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
        <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      sideNav: false
    }
  },
  computed:{
    menuItens() {
      let menuItens = [
        // { icon: 'face', title: 'Novo Usuario', link:'/usuario/novo' },
        { icon: 'lock_open', title: 'Entrar', link:'/entrar'}]

      if(this.estaLogado){
        menuItens = [
        { icon: 'create', title: 'Novo Pedido', link:'/pedido/novo' },
        { icon: 'home', title: 'Meus Pedidos', link:'/' },
        // { icon: 'supervisor_account', title: 'Usuários', link:'/usuario' },
        // { icon: 'person', title: 'Perfil', link:'/perfil' },
        // { icon: 'spa', title: 'Produtos', link:'/produto/listar' }
      ]
      }
      return menuItens;
    },
    estaLogado() {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined;
    },
    user(){
      return this.$store.getters.user;
    }
  },
   watch:{
    user(value){
      if(value !== null && value !== undefined){
        this.$router.push('/');
      }
    }
  },
  methods:{
    sair(){
      this.$store.dispatch('sair');
    }
  },
  name: 'App'
}
</script>
