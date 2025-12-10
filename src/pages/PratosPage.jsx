import { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import PratoForm from '../components/PratoForm';
import PratoTable from '../components/PratoTable';
import { PratoLocalDAO } from '../daos/pratoLocalDAO';

const dao = new PratoLocalDAO();

export default function PratosPage() {
  const [pratos, setPratos] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => setPratos(dao.list());

  useEffect(() => { load(); }, []);

  const save = () => { setEditing(null); load(); };
  const remove = (id) => { dao.remove(id); message.success('Prato excluído'); load(); };

  return (
    <Card title="Gerenciar Pratos" style={{ marginBottom: 24 }}>
      <PratoForm dao={dao} initialValues={editing} onSaved={save} />
      <PratoTable data={pratos} onEdit={setEditing} onDelete={remove} />
    </Card>
  );
}