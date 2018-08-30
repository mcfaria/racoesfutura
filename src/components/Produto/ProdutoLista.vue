<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-toolbar dense>
          <v-toolbar-title>Produtos</v-toolbar-title>
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
            label="Consultar Produtos"
            placeholder="Digite o nome do produto"
            prepend-icon="search"
            return-object
      ></v-autocomplete>
            </v-flex>
        </v-layout>
        <v-list two-line>
          <template v-for="(item, index) in lista">
            <v-list-tile
              :key="item.title"
              avatar
              ripple
              @click="toggle(index)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">{{ item.headline }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
                <v-icon
                  v-if="selected.indexOf(index) < 0"
                  color="grey lighten-1"
                >
                  star_border
                </v-icon>

                <v-icon
                  v-else
                  color="yellow darken-2"
                >
                  star
                </v-icon>
              </v-list-tile-action>

            </v-list-tile>
            <v-divider
              v-if="index + 1 < items.length"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
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
        search: null,
        selected: [2],
        lista: [
          {
            action: '15 min',
            headline: 'Brunch this weekend?',
            title: 'Ali Connors',
            subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
          },
          {
            action: '2 hr',
            headline: 'Summer BBQ',
            title: 'me, Scrott, Jennifer',
            subtitle: "Wish I could come, but I'm out of town this weekend."
          },
          {
            action: '6 hr',
            headline: 'Oui oui',
            title: 'Sandra Adams',
            subtitle: 'Do you have Paris recommendations? Have you ever been?'
          },
          {
            action: '12 hr',
            headline: 'Birthday gift',
            title: 'Trevor Hansen',
            subtitle: 'Have any ideas about what we should get Heidi for her birthday?'
          },
          {
            action: '18hr',
            headline: 'Recipe to try',
            title: 'Britta Holt',
            subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.'
          }
        ]
      }
    },

    methods: {
      toggle (index) {
        const i = this.selected.indexOf(index)

        if (i > -1) {
          this.selected.splice(i, 1)
        } else {
          this.selected.push(index)
        }
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
