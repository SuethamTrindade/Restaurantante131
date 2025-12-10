import { useEffect, useState } from 'react';
import { Table, Select, DatePicker, Statistic, Row, Col, Card } from 'antd';
import dayjs from 'dayjs';
import { PedidoLocalDAO } from '../daos/pedidoLocalDAO';
import { ClienteLocalDAO } from '../daos/clienteLocalDAO';

const pedidoDAO = new PedidoLocalDAO();
const clienteDAO = new ClienteLocalDAO();

export default function RelatorioPedidosPorCliente() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [range, setRange] = useState([null, null]);

  const load = () => {
    setPedidos(pedidoDAO.list());
    setClientes(clienteDAO.list());
  };

  useEffect(() => { load(); }, []);

  const filtered = pedidos.filter(p => {
    const byCliente = clienteId ? p.clienteId === clienteId : true;
    const d = dayjs(p.data);
    const byDate = range[0] && range[1] ? d.isAfter(range[0]) && d.isBefore(range[1]) : true;
    return byCliente && byDate;
  });

  const totalPedidos = filtered.length;
  const totalValor = filtered.reduce((acc, p) => acc + p.valorTotal, 0);

  const columns = [
    { title: 'Data', dataIndex: 'data', render: (d) => new Date(d).toLocaleDateString('pt-BR') },
    { title: 'Qtd Itens', dataIndex: 'itens', render: (itens) => itens.reduce((a, i) => a + i.quantidade, 0) },
    { title: 'Valor (R$)', dataIndex: 'valorTotal', render: (v) => v.toFixed(2) },
  ];

  return (
    <Card title="Relatório de Pedidos por Cliente">
      {/* Filtros */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Select
            allowClear
            placeholder="Filtrar por cliente"
            options={clientes.map(c => ({ value: c.id, label: c.nome }))}
            onChange={setClienteId}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} md={16}>
          <DatePicker.RangePicker style={{ width: '100%' }} onChange={(vals) => setRange(vals)} />
        </Col>
      </Row>

      {/* Cards de Estatística */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card><Statistic title="Pedidos" value={totalPedidos} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card><Statistic title="Valor total (R$)" value={totalValor.toFixed(2)} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card><Statistic title="Ticket médio (R$)" value={(totalPedidos ? (totalValor / totalPedidos) : 0).toFixed(2)} /></Card>
        </Col>
      </Row>

      {/* Tabela Responsiva */}
      <Table 
        rowKey="id" 
        columns={columns} 
        dataSource={filtered} 
        scroll={{ x: 600 }} 
      />
    </Card>
  );
}