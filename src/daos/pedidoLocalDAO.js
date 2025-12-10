import { LocalStorageDAO } from './localStorageDAO';

/**
 * DAO para Pedidos usando LocalStorage
 * Encapsula todas as operações de CRUD
 */
export class PedidoLocalDAO extends LocalStorageDAO {
  constructor() {
    super('pedidos'); // chave usada no LocalStorage
  }
}