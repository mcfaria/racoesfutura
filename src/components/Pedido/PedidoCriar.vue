<template>


  <v-layout column>
    <v-flex xs12>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm8 md6>
            <v-autocomplete
              v-model="cliente"
              :items="clientes"
              :loading="isLoadingCliente"
              :search-input.sync="searchCliente"
              :rules="[rules.requiredselecao]"
              hide-no-data
              hide-selected
              item-text="Nome"
              item-value="Id"
              label="Consultar Clientes"
              placeholder="Digite o cliente"
              return-object
            ></v-autocomplete>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 sm6>
            <v-autocomplete
              v-model="model"
              :items="produtos"
              :loading="isLoadingProduto"
              :search-input.sync="searchProduto"
              :rules="[rules.requiredselecao]"
              hide-no-data
              hide-selected
              item-text="Nome"
              item-value="Id"
              label="Consultar Produtos"
              placeholder="Digite o nome do produto"
              return-object
            ></v-autocomplete>
        </v-flex>

        <v-flex xs6 sm3>
            <v-text-field
              v-model="quantidade"
              :rules="[rules.required, rules.quantidade]"
              label="Quantidade"
              placeholder="Quantidade"
              type="number"
              outline
              required
            ></v-text-field>
        </v-flex>

        <v-flex xs6 sm3>
            <v-text-field
              v-model="model.Valor"
              label="Valor"
              placeholder="Valor"
              outline
            ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
          <v-flex xs12>
            <v-btn :disabled="!valid" @click="gravar" class="primary" >Incluir</v-btn>
            <v-btn @click="limpar" class="primary" >Limpar</v-btn>
          </v-flex>
        </v-layout>
    </v-container>
  </v-form>
    <v-container>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.Quantidade" label="Quantidade"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.Desconto" label="Dessert name"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="fechar">Cancelar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="atualizar">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
    v-model="selected"
    :headers="colunas"
    :items="resultado"
    :pagination.sync="pagination"
    select-all
    item-key="name"
    class="elevation-1"
  >
    <template slot="headers" slot-scope="props">
      <tr>
        <th>
          <v-checkbox
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            primary
            hide-details
            @click.native="toggleAll"
          ></v-checkbox>
        </th>
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header.value)"
        >
          <v-icon small>arrow_upward</v-icon>
          {{ header.text }}
        </th>
      </tr>
    </template>
    <template slot="items" slot-scope="props">
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td>
          <v-checkbox
            :input-value="props.selected"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            create
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
        <td>{{ props.item.Nome }}</td>
        <td>{{ props.item.Categoria }}</td>
        <td class="text-xs-right">{{ props.item.Quantidade }}</td>
        <td class="text-xs-right">{{ props.item.Valor }}</td>
      </tr>
    </template>
  </v-data-table>
    </v-container>
  </v-flex>
</v-layout>

</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      valid: false,
      name: "",
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 10 || "Name must be less than 10 characters"
      ],
      model: {
        Valor: ""
      },
      produto: "",
      cliente: "",
      quantidade: "",
      rules: {
        required: value => !!value || "Obrigatório",
        quantidade: value => value > 0 || "Maior que 0",
        requiredselecao: value => {
          return (
            (value != null && value != undefined && value.Id != null) ||
            "Obrigatório"
          );
        }
      },

      descriptionLimit: 60,
      // Produtos
      isLoadingProduto: false,
      listaProdutos: [],
      searchProduto: null,

      // Clientes
      select: null,
      isLoadingCliente: false,
      listaClientes: [],
      searchCliente: null,

      // Pedidos
      resultado: [],

      pagination: {
        sortBy: 'Nome'
      },
      selected: [],
      colunas: [
        { text: 'Actions', value: 'Id', sortable: false },
        { text: 'Produto', align: 'left', value: 'Nome' },
        { text: 'Categoria', align: 'left', value: 'Categoria' },
        { text: 'Quantidade', value: 'Quantidade' },
        { text: 'Valor', value: 'Valor' }
      ],

      dialog: false,
      editedIndex: -1,
      editedItem: {
        Nome: '',
        Quantidade: 0
      },
    };
  },
  methods: {
    gravar() {
      if (this.$refs.form.validate()) {
        const achou = this.resultado.find(x => x.Id === this.model.Id);
        if (achou) {
          achou.Quantidade += parseFloat(this.quantidade);
        } else {
          this.resultado.push({
            Id: this.model.Id,
            Nome: this.model.Nome,
            Categoria: this.model.Categoria,
            Valor: this.model.Valor,
            Quantidade: parseFloat(this.quantidade),
            Desconto: 0
          });
        }
      }
    },
    limpar() {
      this.$refs.form.reset();
    },
    editItem (item) {
        this.editedIndex = this.resultado.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },
    deleteItem (item) {
        const index = this.resultado.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.resultado.splice(index, 1)
    },
    fechar () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
    },
    atualizar () {
        if (this.editedIndex > -1) {
          Object.assign(this.resultado[this.editedIndex], this.editedItem)
        } else {
          this.resultado.push(this.editedItem)
        }
        this.close()
    }
  },
  computed: {
    produtos() {
      return this.$store.getters.produtos;
    },
    clientes() {
      return this.$store.getters.clientes;
    },
    formTitle () {
        return this.editedItem.Nome;
    }
  },
  watch: {
    searchProduto(val) {
      if (this.produtos.length > 0) return;
      this.isLoadingProduto = true;
      this.count = this.produtos.length;
      this.listaProdutos = this.produtos;
      this.isLoadingProduto = false;
    },
    searchCliente(val) {
      if (this.clientes.length > 0) return;

      this.isLoadingCliente = true;
      this.count = this.clientes.length;
      this.listaClientes = this.clientes;
      this.isLoadingCliente = false;
    },
    dialog (val) {
        val || this.fechar()
    }
  }
};
</script>
