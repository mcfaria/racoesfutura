<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
          <v-container>
            <v-form @submit.prevent="entrar">
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
                  :rules="[requerido]"
                  required></v-text-field>
                  </v-flex>
              </v-layout>
               <v-layout row>
                <v-flex xs12>
                  <v-btn class="primary" type="submit">Entrar</v-btn>
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
      senha:''
    }
  },
  computed:{
    requerido(){
      return this.senha === '' ? 'Informe a senha': ''
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
    entrar(){
      this.$store.dispatch('entrarUsuario', { email: this.email, senha: this.senha });
    }
  }
}
</script>

