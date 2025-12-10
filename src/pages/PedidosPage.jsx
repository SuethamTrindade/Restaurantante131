import { useEffect, useState } from 'react';
import { Card, Button, Drawer, message } from 'antd';
import PedidoForm from '../components/PedidoForm';
import PedidoTable from '../components/PedidoTable';
import { PedidoLocalDAO } from '../daos/pedidoLocalDAO';
import { ClienteLocalDAO } from '../daos/clienteLocalDAO';
import { PratoLocalDAO } from '../daos/pratoLocalDAO';

const pedidoDAO = new PedidoLocalDAO();
const clienteDAO = new ClienteLocalDAO();
const pratoDAO = new PratoLocalDAO();

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [clientesById, setClientesById] = useState({});
  const [pratosById, setPratosById] = useState({});
  const [open, setOpen] = useState(false);

  const load = () => {
    const ps = pedidoDAO.list();
    const cs = clienteDAO.list();
    const rs = pratoDAO.list();
    setPedidos(ps);
    setClientesById(Object.fromEntries(cs.map(c => [c.id, c])));
    setPratosById(Object.fromEntries(rs.map(r => [r.id, r])));
  };

  useEffect(() => { load(); }, []);

  const remove = (id) => { pedidoDAO.remove(id); message.success('Pedido excluído'); load(); };

  return (
    <Card title="Gerenciar Pedidos" style={{ marginBottom: 24 }}>
      <Button type="primary" onClick={() => setOpen(true)}>Novo Pedido</Button>
      <PedidoTable data={pedidos} clientesById={clientesById} pratosById={pratosById} onDelete={remove} />
      <Drawer title="Novo Pedido" open={open} onClose={() => setOpen(false)} width={520}>
        <PedidoForm
          pedidoDAO={pedidoDAO}
          clienteDAO={clienteDAO}
          pratoDAO={pratoDAO}
          onSaved={() => { setOpen(false); load(); }}
        />
      </Drawer>
    </Card>
  );
}