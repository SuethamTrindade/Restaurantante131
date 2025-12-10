export class LocalStorageDAO {
  constructor(key) {
    this.key = key;
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  list() {
    return JSON.parse(localStorage.getItem(this.key));
  }

  get(id) {
    return this.list().find(item => item.id === id) || null;
  }

  create(data) {
    const items = this.list();
    const entity = { ...data, id: crypto.randomUUID() };
    localStorage.setItem(this.key, JSON.stringify([...items, entity]));
    return entity;
  }

  update(id, patch) {
    const items = this.list();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    items[idx] = { ...items[idx], ...patch };
    localStorage.setItem(this.key, JSON.stringify(items));
    return items[idx];
  }

  remove(id) {
    const items = this.list().filter(i => i.id !== id);
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}