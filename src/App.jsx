import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Avatar, List, message, Divider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  UserOutlined, 
  CoffeeOutlined, 
  ShoppingCartOutlined, 
  BarChartOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  EditOutlined
} from '@ant-design/icons';

// Seus componentes (mantendo as importações)
import PratosPage from './pages/PratosPage';
import ClientesPage from './pages/ClientesPage';
import PedidosPage from './pages/PedidosPage';
import RelatorioPedidosPorCliente from './pages/RelatorioPedidosPorCliente';

const { Header, Content, Footer } = Layout;

// Componente do Menu Principal
function AppMenu() {
  const location = useLocation();
  
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/clientes') return '1';
    if (path === '/') return '2';
    if (path === '/pedidos') return '3';
    if (path === '/relatorio') return '4';
    return '2';
  };

  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: <Link to="/clientes">Clientes</Link> },
    { key: '2', icon: <CoffeeOutlined />, label: <Link to="/">Pratos</Link> },
    { key: '3', icon: <ShoppingCartOutlined />, label: <Link to="/pedidos">Pedidos</Link> },
    { key: '4', icon: <BarChartOutlined />, label: <Link to="/relatorio">Relatórios</Link> },
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[getSelectedKey()]}
      items={menuItems}
      style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
    />
  );
}

export default function App() {
  // Estado para controlar se a aba (Drawer) está aberta ou fechada
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleLogout = () => {
    message.loading('Saindo do sistema...', 1)
      .then(() => message.success('Logout realizado com sucesso!'));
    onClose();
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        {/* HEADER PROFISSIONAL */}
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', // Separa os itens
          padding: '0 24px',
          background: '#001529',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'sticky', top: 0, zIndex: 1000, width: '100%'
        }}>
          
          {/* 1. LADO ESQUERDO: LOGO */}
          <div className="logo-area" style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
            <AppstoreOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px' }} />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap' }}>
              Restaurante Admin
            </span>
          </div>

          {/* 2. CENTRO: MENU DE NAVEGAÇÃO */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <AppMenu />
          </div>

          {/* 3. LADO DIREITO: AÇÕES E PERFIL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '100px', justifyContent: 'flex-end' }}>
            {/* Botão de Notificação (Decorativo) */}
            <Button 
              type="text" 
              icon={<BellOutlined style={{ color: 'white', fontSize: '18px' }} />} 
              onClick={() => message.info('Sem novas notificações')}
            />
            
            {/* O BOTÃO QUE ABRE A ABA DE OPÇÕES */}
            <Button
              type="primary"
              shape="circle"
              icon={<SettingOutlined />}
              onClick={showDrawer}
              size="large"
              style={{ border: 'none', boxShadow: '0 0 10px rgba(24,144,255, 0.5)' }}
            />
          </div>
        </Header>

        {/* CONTEÚDO PRINCIPAL */}
        <Content>
          <div className="site-layout-content">
            <Routes>
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/" element={<PratosPage />} />
              <Route path="/pedidos" element={<PedidosPage />} />
              <Route path="/relatorio" element={<RelatorioPedidosPorCliente />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', color: '#888' }}>
          Sistema de Gestão de Restaurante ©2025
        </Footer>

        {/* A ABA LATERAL (DRAWER) DE OPÇÕES */}
        <Drawer
          title="Painel do Usuário"
          placement="right"
          onClose={onClose}
          open={open}
          width={320}
        >
          {/* Cabeçalho do Perfil na Aba */}
          <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
            <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: '16px' }} />
            <h3 style={{ margin: 0 }}>Administrador</h3>
            <p style={{ color: '#888' }}>admin@restaurante.com</p>
            <Button size="small" icon={<EditOutlined />} style={{ marginTop: '8px' }}>Editar Perfil</Button>
          </div>

          <Divider />

          {/* Lista de Opções */}
          <List
            itemLayout="horizontal"
            dataSource={[
              { title: 'Configurações Gerais', icon: <SettingOutlined /> },
              { title: 'Segurança e Senha', icon: <SafetyCertificateOutlined /> },
              { title: 'Preferências de Notificação', icon: <BellOutlined /> },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={item.icon} style={{ backgroundColor: '#f0f2f5', color: '#555' }} />}
                  title={<a onClick={() => message.info(`Abrindo ${item.title}...`)}>{item.title}</a>}
                />
              </List.Item>
            )}
          />

          {/* Rodapé da Aba com Botão Sair */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '24px', left: 0, borderTop: '1px solid #f0f0f0' }}>
            <Button 
              type="primary" 
              danger 
              block 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              size="large"
            >
              Sair do Sistema
            </Button>
          </div>
        </Drawer>

      </Layout>
    </Router>
  );
}