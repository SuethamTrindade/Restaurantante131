const CHAVE = "itensRestaurante";

export default class ItemDAO {

  listar() {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  }

  salvar(item) {
    const lista = this.listar();
    item.id = crypto.randomUUID();
    lista.push(item);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  atualizar(id, itemAtualizado) {
    const lista = this.listar();
    const index = lista.findIndex((i) => i.id === id);
    if (index === -1) return;

    lista[index] = { ...lista[index], ...itemAtualizado };
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  }

  remover(id) {
    const lista = this.listar();
    const novaLista = lista.filter((i) => i.id !== id);
    localStorage.setItem(CHAVE, JSON.stringify(novaLista));
  }

  buscarPorId(id) {
    return this.listar().find((i) => i.id === id);
  }
}
