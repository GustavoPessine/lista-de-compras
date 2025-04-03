interface Item {
    id: string;
    nome: string;
}

const formularioItem = document.getElementById('formularioItem') as HTMLFormElement;
const listaItens = document.getElementById('listaItens') as HTMLUListElement;
const InputItem = document.getElementById('item') as HTMLInputElement;

const carregarItens = (): Item[] => {
    const itens = localStorage.getItem('itens');
    return itens ? JSON.parse(itens) : [];
};

const salvarItens = (itens: Item[]): void => {
    localStorage.setItem('itens', JSON.stringify(itens))
};

const adicionarItem = (nome: string): void => {
    if(verificarItem(nome)) {
        alert(`O item ${nome} já foi adicionado na lista de compras. Digite um item que você ainda não adicionou na lista, por favor.`);
        return; // Retorna aqui para não adicionar o item
    }
    
    const itens = carregarItens();
    const novoItem: Item = {
        id: new Date().toISOString(),
        nome
    };

    itens.push(novoItem);
    salvarItens(itens);
};

const removerItem = (id: string) => {
    const itens = carregarItens();
    const itensAtualizados = itens.filter(item => item.id !== id);
    salvarItens(itensAtualizados);
};

const verificarItem = (nome: string): boolean => {
    const itens = carregarItens();
    return itens.some(item => item.nome === nome);
};

const editarItem = (id: string, novoNome: string) => {
    const itens = carregarItens();
    const item = itens.find(item => item.id === id);

    if(verificarItem(novoNome)) {
        alert(`Já existe um item com o nome ${novoNome}, por favor escolha outro nome para esse item que você deseja editar`);
        return
    };

    if (item) {
        item.nome = novoNome;
        salvarItens(itens);
    }
};

const renderizarItens = function () {
    const itens = carregarItens();
    listaItens.innerHTML = '';
    itens.forEach(function (item) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = item.nome;

        // Criando o botão de remover
        const botaoRemover = document.createElement('button');
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
            const novoNome = prompt('Editar item:', item.nome);
            if (novoNome !== null)
                editarItem(item.id, novoNome);
            renderizarItens();
        });

        listaItens.appendChild(listItem);
    });
};

formularioItem.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = InputItem.value.trim();
    if(nome) {
        verificarItem(nome);
        adicionarItem(nome);
        InputItem.value = '';
        renderizarItens();
    }
});

renderizarItens();








