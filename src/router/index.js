import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Usuario from '@/components/Usuario/Usuario'
import UsuarioCriar from '@/components/Usuario/UsuarioCriar'
import Entrar from '@/components/Usuario/Entrar'
import Perfil from '@/components/Usuario/Perfil'
import ProdutoLista from '@/components/Produto/ProdutoLista'
import ProdutoCriar from '@/components/Produto/ProdutoCriar'
import PedidoCriar from '@/components/Pedido/PedidoCriar'
import ClienteCriar from '@/components/Cliente/ClienteCriar'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/entrar',
      name: 'Entrar',
      component: Entrar
    },
    {
      path: '/usuario',
      name: 'Usuario',
      component: Usuario
    },
    {
      path: '/usuario/novo',
      name: 'Novo Usuario',
      component: UsuarioCriar
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil
    },
    {
      path: '/produto/listar',
      name: 'Produtos',
      component: ProdutoLista
    },
    {
      path: '/produto/novo',
      name: 'Novo Produto',
      component: ProdutoCriar
    },
    {
      path: '/pedido/novo',
      name: 'Novo Pedido',
      component: PedidoCriar
    },
    {
      path: '/cliente/novo',
      name: 'Novo Cliente',
      component: ClienteCriar
    }
  ],
  mode: 'history'

})
