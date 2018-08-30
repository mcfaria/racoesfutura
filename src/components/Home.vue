<template>
  <v-container>
    <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-btn class="primary" large router to="/cliente/novo">
            Cliente
          </v-btn>
        </v-flex>
        <v-flex xs12 sm6>
          <v-btn class="primary" large router to="/produto/novo">
            Produto
          </v-btn>
        </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
   computed: {
  //   lista (){
  //     return this.$store.getters.featureMeetups
  //   }
  }
}
</script>
