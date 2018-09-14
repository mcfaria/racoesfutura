<template>
  <!-- <v-container>
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
  </v-container> -->
  <v-layout row>
    <v-dialog
      v-model="cancelar"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Deseja cancelar?</v-card-title>
        <v-card-text>
          <p class="text-sm-left">{{selecionado.Cliente.Nome}}</p>
          <p class="text-sm-left">{{selecionado.Quantidade | quantidade}}</p>
          <p class="text-sm-left">{{selecionado.Valor | numerico}}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="cancelar = false"
          >
            Fechar
          </v-btn>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="cancelarPedido(selecionado)"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-flex xs12 sm10 offset-sm1>
      <v-card v-for="(item, index) in pedidos" :key="index">
        <v-card-title primary-title>
          <div>
            <div class="headline">{{item.Cliente.Nome}}</div>
            <span class="grey--text">{{item.Valor | numerico}} Quantidade: {{item.Quantidade | quantidade}}</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="red lighten-2" @click="cancelarListar(item)" >Cancelar</v-btn>
          <v-spacer></v-spacer>
          <v-btn icon @click="item.show = !item.show">
            <v-icon>{{ item.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-slide-y-transition>
          <v-card-text v-show="item.show">
            <v-layout row wrap v-for="(p) in item.Itens" :key="p.Id">
              <v-flex xs12 sm3>
                <p class="text-sm-left">{{p.Nome}}</p>
              </v-flex>
              <v-flex xs3 sm3>
                <p class="text-sm-right">{{p.Quantidade | quantidade}}</p>
              </v-flex>
              <v-flex xs3 sm3>
                <p class="text-sm-right">{{p.Desconto | numerico}}</p>
              </v-flex>
              <v-flex xs3 sm3>
                <p class="text-sm-right">{{p.Total | numerico}}</p>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-slide-y-transition>
      </v-card>
      <!-- <v-card>
        <v-list three-line>
          <template v-for="(item, index) in pedidos">
            <v-subheader v-if="index == 0" :key="index">
              Pedidos
            </v-subheader>

            <v-divider
              :key="index"
            ></v-divider>

            <v-list-tile :key="item.Id">
              <v-list-tile-content>
                <v-list-tile-title >{{item.Cliente.Nome}}</v-list-tile-title>
                <v-list-tile-sub-title class="text--primary">Status: {{ item.Status }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>Entregar em {{item.DataEntrega}}</v-list-tile-sub-title>
                <v-list-tile-sub-title><small>{{item.Observacao}}</small></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.Valor | numerico }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card> -->
    </v-flex>
  </v-layout>
</template>
<script>
import * as firebase from 'firebase'
export default {
  data () {
      return {
        cancelar: false,
        selecionado: {
          Cliente:{ Nome: ''},
          Valor:0,
          Quantidade:0
        },
        pedidos:[]
      }
    },
   mounted() {
      firebase.auth().onAuthStateChanged(user =>{
        if (user) {
          firebase.database().ref('pedidos/' + user.uid).once('value')
          .then((data) =>{
              const lista =[];
              const obj = data.val();
              for(let key in obj){
                console.log(key);
                lista.push({
                  Id: key,
                  ...obj[key],
                  show: false
                });
              }
              this.pedidos = lista;
          })
          .catch((error) =>{
            console.log(error);
          });
        } else {
          this.pedidos = [];
        }
      });
  },
  methods:{
    cancelarListar(item){
      this.selecionado = item;
      this.cancelar = true;
    },
    cancelarPedido(item){
      this.cancelar = false;
    }
  }
}
</script>
