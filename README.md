# Ingresso.Hack

Proof of Concept for an exploit in Ingresso.com, an event tickets website, that allowed
attackers to obtain personal information (name and government ID) and
steal valid event tickets.

The exploit has since been patched and this code is released in responsible disclosure.

[More details here.](http://gberger.me/blog/10/falha-seguranca-ingresso-com/)


## How It Worked

In the following URL, IdCliente is an incrementing 8-digit number (left-padding with 0 is required), 
starting at about 00001000 and going until about 09500000 (9.5 million).

```
https://carrinho.ingresso.com.br/iphone/ws/IngressoService.svc/rest/Lista_Venda_Geral_Cliente?IdCliente=00000000&pagas=true&IdPais=1&versaoAppMovel=2.0.5
```

Iterating this parameter allowed you to retrieve the list of sold tickets to 
the user with such ID. 

The list of sold tickets had, for each ticket, the event name, location, date, price,
quantity of tickets, and the ticket printing ID.

The printing ID, a GUID, could be put into the URL 

```
https://carrinho.ingresso.com/br/compra/ingresso/codbarra/cinema/codbarra_novo.asp?id=&idGuid={00000000-0000-0000-0000-000000000000}
```

to generate a printable ticket which could be taken to the event to obtain access.
The printable ticket also had the buyer's name, government ID (RG or CPF, in Brazil) and type
of ticket (which can sometimes leak personal information, such as having an account in a certain bank
or being of a certain age).


## Author

Guilherme Berger <guilherme.berger@gmail.com>

http://gberger.me
