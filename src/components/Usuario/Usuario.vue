<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar dense>
          <v-toolbar-title>Usuários</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="filtro = !filtro">
            <v-icon>search</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout align-start row>
          <v-flex xs10 sm4 offset-xs1 >
            <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            color="white"
            hide-no-data
            hide-selected
            item-text="Nome"
            item-value="API"
            label="Listar Usuários"
            placeholder="Digite o nome ou login"
            prepend-icon="search"
            return-object
      ></v-autocomplete>
            </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        filtro: false,
        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        model: null,
        search: null
      }
    },

    computed: {
      fields () {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
          return {
            key: key,
            value: this.model[key] || 'n/a'
          }
        })
      },
      items () {
        return this.entries.map(entry => {
          const Nome = entry.Nome.length > this.descriptionLimit
            ? entry.Nome.slice(0, this.descriptionLimit) + '...'
            : entry.Nome

          return Object.assign({}, entry, { Nome })
        })
        // return this.entries.map(entry => {
        //   const Description = entry.Description.length > this.descriptionLimit
        //     ? entry.Description.slice(0, this.descriptionLimit) + '...'
        //     : entry.Description

        //   return Object.assign({}, entry, { Description })
        // })
      }
    },

    watch: {
      search (val) {
        // Items have already been loaded
        //if (this.items.length > 0) return

        this.isLoading = true
        // Lazily load input items
        axios.get('https://appshom.agnet.com.br/agwebapi/api/usuario/pesquisar?id=' + val, {
          headers: {
          "Authorization": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibWFyY2Vsby5mYXJpYSIsIm5hbWVpZGVudGlmaWVyIjoibWFyY2Vsby5mYXJpYSIsImVtYWlsYWRkcmVzcyI6Im1hcmNlbG8uZmFyaWFAYWd0ZXJjZWlyby5jb20uYnIiLCJBcGxpY2FjYW9JZCI6IkFORFJBREVfU1BBUlRBIiwiZXhwIjoxNTM1MDQ1NDkxfQ.2grulWwXMD--X8lxTPHvTdZBvHbZrdqSKu881dthkEI"
          }
          })
          .then(res => {
            this.count = res.data.length
            this.entries = res.data
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))

        // Lazily load input items
        // axios.get('https://api.publicapis.org/entries')
        //   .then(res => {
        //     const { count, entries } = res.data
        //     this.count = count
        //     this.entries = entries
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
        //   .finally(() => (this.isLoading = false))
      }
    }
  }
</script>
