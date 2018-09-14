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
              readonly
            ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
          <v-flex xs12>
            <v-btn :disabled="!valid" @click="gravar" class="primary" >Incluir</v-btn>
            <v-btn @click="limparTudo" class="secondary" >Limpar</v-btn>
            <v-btn @click="criarPedido" class="primary" >Finalizar</v-btn>
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
                  <v-text-field v-model="editedItem.Quantidade"
                  label="Quantidade"
                  type="number"
                  :rules="[rules.required, rules.quantidade]"
                  required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                  v-model="editedItem.Desconto"
                  label="Desconto"
                  type="number"
                  :rules="[rules.quantidadePositiva]"
                  required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="secondary" flat @click.native="fechar">Cancelar</v-btn>
            <v-btn class="primary" flat @click.native="atualizar">Alterar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
          :headers="colunas"
          :items="resultado"
          no-data-text="Nenhum produto"
          hide-actions
          item-key="Id">
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-icon small class="mr-4" @click="editItem(props.item)">edit</v-icon>
                <v-icon small @click="deleteItem(props.item)"> delete </v-icon>
              </td>
              <td>{{ props.item.Nome }}</td>
              <td>{{ props.item.Categoria }}</td>
              <td class="text-xs-right">{{ props.item.Quantidade }}</td>
              <td class="text-xs-right">{{ props.item.Valor }}</td>
              <td class="text-xs-right">{{ props.item.Total | numerico }}</td>
            </tr>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card flat>
              <v-card-text>Peek-a-boo!</v-card-text>
            </v-card>
          </template>
        </v-data-table>
    </v-container>
  </v-flex>
</v-layout>

</template>
<script>
export default {
  data() {
    return {
      valid: false,
      name: "",
      model: {
        Valor: '',
        Quantidade: 10
      },
      produto: "",
      cliente: null,
      quantidade: 10,
      rules: {
        required: value => !!value || "Obrigatório",
        quantidade: value => value > 0 || "Maior que 0",
        quantidadePositiva: value => value > -1 || "Não pode ser negativo",
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

      // pagination: {
      //   sortBy: 'Nome'
      // },
      selected: [],
      colunas: [
        { text: '#', value: 'Id', sortable: false },
        { text: 'Produto', align: 'left', value: 'Nome' },
        { text: 'Categoria', align: 'left', value: 'Categoria' },
        { text: 'Quantidade', value: 'Quantidade' },
        { text: 'Valor', value: 'Valor' },
        { text: 'Total', value: 'Total' }
      ],

      dialog: false,
      editedIndex: -1,
      editedItem: {
        Nome: '',
        Quantidade: 0
      },
    };
  },
  mounted(){
    this.cliente = this.$store.getters.cliente;
  },
  methods: {
    gravar() {
      if (this.$refs.form.validate()) {
        const produto = {
          Id: this.model.Id,
          Nome: this.model.Nome,
          Categoria: this.model.Categoria,
          Valor: this.model.Valor,
          Quantidade: parseFloat(this.quantidade),
          Desconto: 0,
          Total: 0
        };
        this.$store.dispatch('incluirPedido', produto);
      }
    },
    criarPedido(){
      this.$router.push('/pedido/finalizar');
    },
    limpar() {
      this.$refs.form.reset();
    },
    limparTudo() {
      this.$store.dispatch('limparPedido');
      this.$refs.form.reset();
    },
    editItem (item) {
        this.editedIndex = this.$store.getters.lista.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
    },
    deleteItem (item) {
        this.$store.dispatch('excluirPedido', item);
    },
    fechar () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
    },
    atualizar () {
        if(this.editedItem.Valor > 0){
          if (this.editedIndex > -1) {
            Object.assign(this.$store.getters.lista[this.editedIndex], this.editedItem)
            this.$store.dispatch('alterarPedido', this.editedItem);
          }
          this.fechar()
        }
    }
  },
  computed: {
    produtos() {
      return this.$store.getters.produtos;
    },
    clientes() {
      return this.$store.getters.clientes;
    },
    resultado() {
      return this.$store.getters.lista;
    },
    formTitle () {
        return this.editedItem.Nome;
    }
  },
  watch: {
    cliente(val){
      this.$store.dispatch('informarCliente', val);
    },
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
