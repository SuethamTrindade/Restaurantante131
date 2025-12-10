export class HttpDAO {
  constructor(baseUrl, resource) {
    this.baseUrl = baseUrl;
    this.resource = resource;
  }

  async list() {
    const res = await fetch(`${this.baseUrl}/${this.resource}`);
    return res.json();
  }

  async get(id) {
    const res = await fetch(`${this.baseUrl}/${this.resource}/${id}`);
    return res.ok ? res.json() : null;
  }

  async create(data) {
    const res = await fetch(`${this.baseUrl}/${this.resource}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async update(id, data) {
    const res = await fetch(`${this.baseUrl}/${this.resource}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async remove(id) {
    await fetch(`${this.baseUrl}/${this.resource}/${id}`, { method: 'DELETE' });
  }
}