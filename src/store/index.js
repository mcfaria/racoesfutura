import Vue from 'vue';
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    clientes:[],
    produtos:[],
    user: null
  },
  mutations : {
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

    setUsuario(state, payload){
      state.user = payload;
    }
  },
  actions: {
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
    incluirProduto({commit}, payload){
      const produto = {
         Nome: payload.Nome,
         Categoria: payload.Categoria,
         Embalagem: payload.Embalagem,
         Unidade: payload.Unidade,
         Valor: payload.Valor
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
