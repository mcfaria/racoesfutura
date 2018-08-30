<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
          <v-container>
            <v-form @submit.prevent="criar">

            <v-layout row>
                <v-flex xs12>
                  <v-text-field
                  name="email"
                  label="Email"
                  id="email"
                  type="email"
                  v-model="email"
                  required></v-text-field>
                  </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                  name="senha"
                  label="Senha"
                  id="senha"
                  type="password"
                  v-model="senha"
                  required></v-text-field>
                  </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                  name="confirmarsenha"
                  label="Confirmar Senha"
                  id="confirmarsenha"
                  type="password"
                  v-model="confirmarsenha"
                  :rules="[compararSenhas]"
                  required></v-text-field>
                  </v-flex>
              </v-layout>
               <v-layout row>
                <v-flex xs12>
                  <v-btn type="submit">Criar</v-btn>
                  </v-flex>
              </v-layout>
              </v-form>
          </v-container>
          </v-card-text>
          </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data(){
    return {
      email:'',
      senha:'',
      confirmarsenha:''
    }
  },
  computed:{
    compararSenhas(){
      return this.senha !== this.confirmarsenha? 'Senha não são iguais': ''
    },
    usuario(){
      return this.$store.getters.user;
    }
  },
  watch:{
    user(value){
      if(value !== null && value !== undefined){
        this.$route.push('/');
      }
    }
  },
  methods:{
    criar(){
      this.$store.dispatch('criarUsuario', { email: this.email, senha: this.senha });
    }
  }
}
</script>

