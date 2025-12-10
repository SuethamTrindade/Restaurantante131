import { LocalStorageDAO } from './localStorageDAO';

export class PratoLocalDAO extends LocalStorageDAO {
  constructor() {
    super('pratos');
  }
}