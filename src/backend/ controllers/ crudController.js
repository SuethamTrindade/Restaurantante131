module.exports = (dao) => ({
  list: async (req, res) => res.json(await dao.list()),
  get: async (req, res) => {
    const item = await dao.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  },
  create: async (req, res) => res.status(201).json(await dao.create(req.body)),
  update: async (req, res) => res.json(await dao.update(req.params.id, req.body)),
  remove: async (req, res) => { await dao.remove(req.params.id); res.status(204).end(); },
});