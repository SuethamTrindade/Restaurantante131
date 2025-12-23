import React, { useState } from 'react';
import { Card, Table, Statistic, Row, Col, Typography, Input, Button, message } from 'antd';
import { DollarCircleOutlined, ShoppingCartOutlined, UserOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { RifaDAO } from '../daos/RifaDAO';

const { Title } = Typography;

export default function AdminPage() {
  // --- SISTEMA DE BLOQUEIO ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // DEFINA SUA SENHA AQUI
  const SENHA_SECRETA = "admin123";

  const handleLogin = () => {
    if (passwordInput === SENHA_SECRETA) {
      setIsAuthenticated(true);
      message.success('Acesso Autorizado!');
    } else {
      message.error('Senha Incorreta!');
    }
  };

  // Se não tiver senha, mostra tela de bloqueio
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
        <Card>
          <LockOutlined style={{ fontSize: 40, color: '#1890ff', marginBottom: 20 }} />
          <Title level={3}>Área Restrita</Title>
          <Input.Password 
            placeholder="Senha do Administrador" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onPressEnter={handleLogin}
            style={{ marginBottom: 20 }}
          />
          <Button type="primary" block onClick={handleLogin} icon={<UnlockOutlined />}>
            Entrar
          </Button>
        </Card>
      </div>
    );
  }

  // --- CONTEÚDO DO PAINEL (Só aparece se tiver senha) ---
  
  const allSales = RifaDAO.listMyTickets(); 
  
  const totalMoney = allSales.reduce((acc, item) => {
    // Tenta pegar o preço do prêmio se salvo, senão usa valor padrão
    const price = item.price || (item.prizeName?.includes('iPhone') ? 10 : 50); 
    return acc + price;
  }, 0);
  
  const totalTickets = allSales.length;

  const columns = [
    { title: 'Prêmio', dataIndex: 'prizeName', key: 'prizeName' },
    { title: 'Número', dataIndex: 'number', key: 'number' },
    { title: 'Método', dataIndex: 'method', key: 'method' },
    { title: 'Valor', dataIndex: 'price', key: 'price', render: (val) => `R$ ${val || '-'}` },
    { title: 'Código', dataIndex: 'trackingCode', key: 'trackingCode' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={2} style={{margin: 0}}>Painel Administrativo</Title>
        <Button onClick={() => setIsAuthenticated(false)}>Bloquear Tela</Button>
      </div>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Faturamento Total" 
              value={totalMoney} 
              precision={2} 
              prefix="R$" 
              valueStyle={{ color: '#3f8600' }}
              icon={<DollarCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Bilhetes Vendidos" value={totalTickets} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Visitantes Online" value={1} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="Últimas Vendas">
        <Table dataSource={allSales} columns={columns} rowKey="trackingCode" />
      </Card>
    </div>
  );
}