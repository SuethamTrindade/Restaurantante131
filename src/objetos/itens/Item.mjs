export default class Item {
  constructor(id = null, nome = '', preco = 0, categoria = '') {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
  }
}
