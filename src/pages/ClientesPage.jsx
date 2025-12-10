import { useEffect, useState } from 'react';
import { Card, message } from 'antd';
import ClienteForm from '../components/ClienteForm';
import ClienteTable from '../components/ClienteTable';
import { ClienteLocalDAO } from '../daos/clienteLocalDAO';

const dao = new ClienteLocalDAO();

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => setClientes(dao.list());

  useEffect(() => { load(); }, []);

  const save = () => { setEditing(null); load(); };
  const remove = (id) => { dao.remove(id); message.success('Cliente excluído'); load(); };

  return (
    <Card title="Gerenciar Clientes" style={{ marginBottom: 24 }}>
      <ClienteForm dao={dao} initialValues={editing} onSaved={save} />
      <ClienteTable data={clientes} onEdit={setEditing} onDelete={remove} />
    </Card>
  );
}