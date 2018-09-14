import Vue from "vue";
import numeral from 'numeral'
// load a locale
numeral.register('locale', 'pt-br', {
  delimiters: {
      thousands: '.',
      decimal: ','
  },
  abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
  },
  ordinal : function (number) {
      return number === 1 ? 'er' : 'ème';
  },
  currency: {
      symbol: 'R$ '
  }
});
numeral.locale('pt-br');

Vue.filter('numerico', (value) =>{
  if(value == null || value == undefined)
    return '-';
  return numeral(value).format('$0,0.00');
}
);

Vue.filter('quantidade', (value) =>{
  if(value == null || value == undefined)
    return '';
  return numeral(value).format('0,0');
}
);



// Vue.filter('periodo', (dados, datas) =>{
//   if(datas == null || datas == undefined)
//     return dados;

//   // const inicio = datas[0];
//   // const fim = datas[1];

//   const lista =[];
//   //const obj = data.val();
//   for(let ano in dados){
//     console.log(ano);
//   }
//   return dados;
// }
// );

// Vue.filter('horagrid', (value) =>{
//   if(value == null || value == undefined)
//     return '-';

//   if(value.hour == null || value.hour == undefined)
//     return '-';
//   return value.hour;
// }
// );


// Vue.filter('diasemana', (value) =>{
//   if(value == null || value == undefined)
//     return '-';
//   console.log(value);
//   const valor = moment(value).format('YYYY');
//   console.log(valor);
//   return valor;
// }
// );
