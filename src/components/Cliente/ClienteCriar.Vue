<template>
  <v-layout column>
    <v-flex xs12>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-flex xs6 sm3>
            <v-text-field
              v-model="model.Nome"
              :rules="[rules.required]"
              label="Nome"
              placeholder="Nome"
              type="text"
              required
            ></v-text-field>
        </v-flex>
      <v-layout row wrap>
          <v-flex xs12>
            <v-btn :disabled="!valid" @click="gravar" class="primary" >Incluir</v-btn>
            <v-btn @click="limpar" class="primary" >Limpar</v-btn>
          </v-flex>
        </v-layout>

      <v-layout row wrap>
          <v-flex xs12>
            <p v-for="c in clientes" :key="c.Id">
              <small>{{c.Id}}</small> - {{c.Nome}}
              </p>
          </v-flex>
        </v-layout>
    </v-container>
  </v-form>
  </v-flex>
</v-layout>

</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      valid: false,
      model: {
        Nome: ""
      },
      rules: {
        required: value => !!value || "Obrigatório",
        quantidade: value => value > 0 || "Maior que 0",
        requiredselecao: value => {
          return (
            (value != null && value != undefined && value._id != null) ||
            "Obrigatório"
          );
        }
      },
      resultado: [],
    };
  },
 computed: {
    clientes (){
      return this.$store.getters.clientes
    }
  },
  methods: {
    gravar() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('incluirCliente', this.model);
        this.limpar();
      }
    },
    limpar() {
      this.$refs.form.reset();
    }
  }
};
</script>
