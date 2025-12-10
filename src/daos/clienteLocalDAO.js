import { LocalStorageDAO } from './localStorageDAO';

/**
 * DAO para Clientes usando LocalStorage
 * Encapsula todas as operações de CRUD
 */
export class ClienteLocalDAO extends LocalStorageDAO {
  constructor() {
    super('clientes'); // chave usada no LocalStorage
  }
}