import Vue from 'vue';
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    cliente: {},
    clientes:[],
    produtos:[],
    lista:[],
    user: null
  },
  mutations : {
    setCliente(state, payload){
      state.cliente = payload;
    },
    setClientes(state, payload){
      state.clientes = payload;
    },
    incluirCliente(state, payload){
      state.clientes.push(payload);
    },
    setProdutos(state, payload){
      state.produtos = payload;
    },
    incluirProduto(state, payload){
      state.produtos.push(payload);
    },
    incluirPedido(state, payload){
      console.log('incluir')
      payload.Total = parseFloat(payload.Quantidade) * (parseFloat(payload.Valor) * (1 + parseFloat(payload.Desconto) / 100));

      const achou = state.lista.find(x => x.Id === payload.Id);
      if (achou) {
        achou.Quantidade = parseFloat(achou.Quantidade) + parseFloat(payload.Quantidade);
        achou.Total = parseFloat(achou.Quantidade) * (parseFloat(achou.Valor) * (1 + parseFloat(achou.Desconto) / 100))
      }
      else{
        state.lista.push(payload);
      }
    },
    alterarPedido(state, payload){
      console.log('alterou')
      payload.Total = parseFloat(payload.Quantidade) * (parseFloat(payload.Valor) * (1 + parseFloat(payload.Desconto) / 100));

      const achou = state.lista.find(x => x.Id === payload.Id);
      if (achou) {
        achou.Desconto = parseFloat(payload.Desconto);
        achou.Quantidade = parseFloat(payload.Quantidade);
        achou.Total = parseFloat(payload.Quantidade) * (parseFloat(payload.Valor) * (1 + parseFloat(payload.Desconto) / 100))
      }
      else{
        state.lista.push(payload);
      }
    },
    excluirPedido(state, payload){
      const achou = state.lista.find(x => x.Id === payload.Id);
      if (achou) {
        const index = this.resultado.indexOf(achou);
        state.resultado.splice(index, 1);
      }
    },
    limparPedido(state){
        state.lista = [];
        state.cliente= null;
    },
    setUsuario(state, payload){
      state.user = payload;
    }
  },
  actions: {
    informarCliente({commit}, payload){
      commit('setCliente', payload);
    },
    carregarClientes ({commit}){
      firebase.database().ref('clientes').once('value')
      .then((data) =>{
          const lista =[];
          const obj = data.val();
          for(let key in obj){
            lista.push({
              Id: key,
              Nome: obj[key].Nome
            });
          }
          commit('setClientes', lista);
      })
      .catch((error) =>{
        console.log(error);
      });
    },
    incluirCliente({commit}, payload){
      const cliente = {
         Nome: payload.Nome
      }

      firebase.database().ref('clientes')
      .push(cliente).then((data) =>{
        const key = data.key;

        commit('incluirCliente', {
          ...cliente,
          Id:key
        });
      }).catch((error) =>{
        console.log(error);
      });
    },
    carregarProdutos ({commit}){
      firebase.database().ref('produtos').once('value')
      .then((data) =>{
          const lista =[];
          const obj = data.val();
          for(let key in obj){
            lista.push({
              Id: key,
              Nome: obj[key].Nome,
              Categoria: obj[key].Categoria,
              Embalagem: obj[key].Embalagem,
              Unidade: obj[key].Unidade,
              Valor: obj[key].Valor
            });
          }
          commit('setProdutos', lista);
      })
      .catch((error) =>{
        console.log(error);
      });
    },
    // carregarPedidos({commit, state}){
    //   firebase.database().ref('pedidos/' + state.user.Id).on('value')
    //   .then((data) =>{
    //       const lista =[];
    //       const obj = data.val();
    //       for(let key in obj){
    //         lista.push({
    //           Id: key,
    //           Cliente: obj[key].Cliente.Nome,
    //           Status: obj[key].Status
    //         });
    //       }
    //       commit('setMeusPedidos', lista);
    //   })
    //   .catch((error) =>{
    //     console.log(error);
    //   });
    // },
    incluirProduto({commit}, payload){
      const produto = {
         Nome: payload.Nome,
         Categoria: payload.Categoria,
         Embalagem: payload.Embalagem,
         Unidade: payload.Unidade,
         Valor: payload.Valor,
      }

      firebase.database().ref('produtos')
      .push(produto).then((data) =>{
        const key = data.key;
        commit('incluirProduto', {
          ...produto,
          Id:key
        });
      }).catch((error) =>{
        console.log(error);
      });
    },

    incluirPedido({commit}, payload){
      const produto = {
         Id: payload.Id,
         Nome: payload.Nome,
         Categoria: payload.Categoria,
         Valor: payload.Valor,
         Quantidade: payload.Quantidade,
         Desconto: payload.Desconto,
         Total: 0
      }
      commit('incluirPedido', produto);
    },
    alterarPedido({commit}, payload){
      const produto = {
         ...payload
      }
      commit('alterarPedido', produto);
    },
    limparPedido({commit}){
      commit('limparPedido');
    },
    excluirPedido({commit}, payload){
      const produto = {
        ...payload
      }
      commit('excluirPedido', produto);
    },
    enviarPedido({commit, state}, payload){
      const pedido = {
        ...payload
      };

      firebase.database().ref('pedidos/' + state.user.id)
      .push(pedido).then((data) =>{
        const key = data.key;
        commit('limparPedido')

      }).catch((error) =>{
        console.log(error);
      });
    },

    autoLogin({commit}, payload){
      if(payload == null || payload == undefined){
        commit('setUsuario', usuario);
      }
      else{
        const usuario ={
          id: payload.uid
        }
        commit('setUsuario', usuario);
      }
    },

    criarUsuario({commit}, payload){
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.senha)
      .then(user => {
        const usuario ={
          id: user.uid
        }
        commit('setUsuario', usuario);
      }).catch(error =>{
        console.log(error);
      });

    },

    entrarUsuario({commit}, payload){
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.senha)
      .then(user => {
        const usuario ={
          id: user.uid
        }
        commit('setUsuario', usuario);
      }).catch(error =>{
        console.log(error);
      });
    },
    sair({commit}){
      firebase.auth().signOut()
      .then(user => {
        commit('setUsuario', null);
      }).catch(error =>{
        console.log(error);
      });
    }
  },
  getters: {
    user(state){
      return state.user
    },
    cliente(state){
      return state.cliente
    },
    clientes(state){
      return state.clientes.sort((a, b) => {
        return a.Nome > b.Nome;
      })
    },
    produtos(state){
      return state.produtos.sort((a, b) => {
        return a.Nome > b.Nome;
      })
    },
    lista(state){
      return state.lista.sort((a, b) => {
        return a.Nome > b.Nome;
      })
    },

    // loadedMeetups (state){
    //   return state.loadedMeetups.sort((a, b) => {
    //     return a.Nome > b.Nome;
    //   })
    // },
    // featureMeetups (state, getters){
    //   return getters.loadedMeetups.slice(0,5);
    // },
    // loadedMeetup (state){
    //   return (meetupId) => {
    //       return state.loadedMeetups.fund((meetup) =>{
    //         return meetup.id == meetupId;
    //       })
    //   }
    // }
  }
});
