import React from 'react';
import { Card, Table, Statistic, Row, Col, Typography } from 'antd';
import { DollarCircleOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { RifaDAO } from '../daos/RifaDAO';

const { Title } = Typography;

export default function AdminPage() {
  const allSales = RifaDAO.listMyTickets(); // Na vida real, pegaria TODOS do banco
  
  // Cálculos básicos
  const totalMoney = allSales.reduce((acc, item) => acc + (item.prizeName === 'iPhone 15 Pro Max' ? 10 : 50), 0);
  const totalTickets = allSales.length;

  const columns = [
    { title: 'Prêmio', dataIndex: 'prizeName', key: 'prizeName' },
    { title: 'Número', dataIndex: 'number', key: 'number' },
    { title: 'Método', dataIndex: 'method', key: 'method' },
    { title: 'Data', dataIndex: 'date', key: 'date' },
    { title: 'Código', dataIndex: 'trackingCode', key: 'trackingCode' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Painel Administrativo</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card><Statistic title="Faturamento Total" value={totalMoney} precision={2} prefix="R$" icon={<DollarCircleOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Bilhetes Vendidos" value={totalTickets} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="Clientes Ativos" value={1} prefix={<UserOutlined />} /></Card>
        </Col>
      </Row>

      <Card title="Últimas Vendas">
        <Table dataSource={allSales} columns={columns} rowKey="trackingCode" />
      </Card>
    </div>
  );
}