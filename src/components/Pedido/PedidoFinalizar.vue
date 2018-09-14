<template>
<v-tabs centered dark icons-and-text>
    <v-tabs-slider color="yellow"></v-tabs-slider>
    <v-tab href="#tab-cliente">Cliente<v-icon>account_box</v-icon></v-tab>
    <v-tab href="#tab-produto">Produtos<v-icon>spa</v-icon></v-tab>
    <v-tab-item id="tab-cliente" key="tabcliente">
      <v-layout column>
          <v-flex xs12>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-layout row>
                <v-flex xs12 sm12 md8>
                  <v-text-field
                    label="Cliente"
                    v-model="cliente.Nome"
                    readonly
                    text
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md2>
                  <v-text-field
                    label="Itens"
                    placeholder="Produtos"
                    v-model="total.Quantidade"
                    readonly
                  ></v-text-field>
                </v-flex>
                <v-flex xs6 sm6 md2>
                  <v-text-field
                    label="Total"
                    placeholder="Total"
                    v-model="total.Valor"
                    readonly
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs6 sm6 md4>
                  <v-select
                    :items="vencimentos"
                    label="Vencimentos"
                    v-model="model.Vencimento"
                    :rules="[rules.required]"
                  ></v-select>
                </v-flex>
                <v-flex xs6 sm6 md4>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="calendario"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="computedDateFormatted"
                      label="Data da Entrega"
                      persistent-hint
                      prepend-icon="event"
                      :rules="[rules.required]"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="date" no-title @input="calendario = false"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12 sm12 md8>
                  <v-textarea
                    name="input-7-1"
                    label="Observação"
                    v-model="model.Observacao"
                    hint="Coloque alguma instrução"
                  ></v-textarea>
                </v-flex>
                <v-flex xs6 sm6 md2>
                    <v-btn @click="gravar" depressed large color="primary">Finalizar</v-btn>
                    <v-btn @click="limpar" depressed large color="error">Cancelar</v-btn>
                </v-flex>
              </v-layout>
          </v-container>
        </v-form>
        </v-flex>
      </v-layout>
    </v-tab-item>
    <v-tab-item id="tab-produto" key="tabproduto">
       <v-container>
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
      </v-tab-item>
  </v-tabs>


</template>
<script>
export default {
  data() {
    return {
      vencimentos: [
        'À vista - 5 dias',
        'À Prazo - 30 dias',
        'À Prazo - 45 dias'
      ],
      calendario: false,
      date: null,
      dateFormatted: null,
      valid: false,
      model: {
        Vencimento: null,
        DataEntrega: null,
        Observacao: null
      },
      cliente: null,
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

      selected: [],
      colunas: [
        { text: '#', value: 'Id', sortable: false },
        { text: 'Produto', align: 'left', value: 'Nome' },
        { text: 'Categoria', align: 'left', value: 'Categoria' },
        { text: 'Quantidade', value: 'Quantidade' },
        { text: 'Valor', value: 'Valor' },
        { text: 'Total', value: 'Total' }
      ],
    };
  },
  mounted(){
    this.cliente = this.$store.getters.cliente;
  },
  methods: {
    gravar() {
      if (this.$refs.form.validate()) {
        const pedido = {
          ...this.model,
          ...this.total,
          Status: 'Criado',
          Cliente: this.cliente,
          Itens: this.resultado
        };
        this.$store.dispatch('enviarPedido', pedido);
        this.$router.push('/');
      }
    },
    criarPedido(){

    },
    limpar() {
      this.$refs.form.reset();
    },
    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  },
  watch: {
    date (val) {
      this.dateFormatted = this.formatDate(this.date)
      this.model.DataEntrega = this.date
    }
  },
  computed: {
    resultado() {
      return this.$store.getters.lista;
    },
    total(){
      let quantidade = 0;
      let total = 0;
      const lista = this.resultado;
      lista.forEach(element => {
        total+= element.Total;
        quantidade+= element.Quantidade;
      });
      return { Quantidade: quantidade,  Valor: total };
    },
    computedDateFormatted () {
        return this.formatDate(this.date)
    }
  }
};
</script>
