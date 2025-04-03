"use strict";
var formularioItem = document.getElementById('formularioItem');
var listaItens = document.getElementById('listaItens');
var InputItem = document.getElementById('item');
var carregarItens = function () {
    var itens = localStorage.getItem('itens');
    return itens ? JSON.parse(itens) : [];
};
var salvarItens = function (itens) {
    localStorage.setItem('itens', JSON.stringify(itens));
};
var adicionarItem = function (nome) {
    if (verificarItem(nome)) {
        alert("O item ".concat(nome, " j\u00E1 foi adicionado na lista de compras. Digite um item que voc\u00EA ainda n\u00E3o adicionou na lista, por favor."));
        return; // Retorna aqui para não adicionar o item
    }
    var itens = carregarItens();
    var novoItem = {
        id: new Date().toISOString(),
        nome: nome
    };
    itens.push(novoItem);
    salvarItens(itens);
};
var removerItem = function (id) {
    var itens = carregarItens();
    var itensAtualizados = itens.filter(function (item) { return item.id !== id; });
    salvarItens(itensAtualizados);
};
var verificarItem = function (nome) {
    var itens = carregarItens();
    return itens.some(function (item) { return item.nome === nome; });
};
var editarItem = function (id, novoNome) {
    var itens = carregarItens();
    var item = itens.find(function (item) { return item.id === id; });
    if (verificarItem(novoNome)) {
        alert("J\u00E1 existe um item com o nome ".concat(novoNome, ", por favor escolha outro nome para esse item que voc\u00EA deseja editar"));
        return;
    }
    ;
    if (item) {
        item.nome = novoNome;
        salvarItens(itens);
    }
};
var renderizarItens = function () {
    var itens = carregarItens();
    listaItens.innerHTML = '';
    itens.forEach(function (item) {
        var listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = item.nome;
        // Criando o botão de remover
        var botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', function (e) {
            e.stopPropagation(); // Para evitar que o clique no botão também remova o item
            removerItem(item.id);
            renderizarItens();
        });
        // Adicionando o botão ao listItem
        listItem.appendChild(botaoRemover);
        // Adicionando eventos para editar o item
        listItem.addEventListener('dblclick', function () {
            var novoNome = prompt('Editar item:', item.nome);
            if (novoNome !== null)
                editarItem(item.id, novoNome);
            renderizarItens();
        });
        listaItens.appendChild(listItem);
    });
};
formularioItem.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = InputItem.value.trim();
    if (nome) {
        verificarItem(nome);
        adicionarItem(nome);
        InputItem.value = '';
        renderizarItens();
    }
});
renderizarItens();
