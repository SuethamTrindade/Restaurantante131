import React, { useState } from 'react';
import { Layout, Menu, Drawer, Avatar, Button, FloatButton } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  GiftOutlined, HomeOutlined, TrophyOutlined, 
  WhatsAppOutlined, UserOutlined, DashboardOutlined 
} from '@ant-design/icons';
import './App.css';

// Importação das Páginas
import PremiosPage from './pages/PremiosPage';
import RifaPage from './pages/RifaPage';
import MeusBilhetesPage from './pages/MeusBilhetesPage';
import AdminPage from './pages/AdminPage';

const { Header, Content, Footer } = Layout;

function AppMenu() {
  const location = useLocation();
  // Se estiver na rota /admin, mostra menu de admin
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ background: 'transparent', flex: 1, justifyContent: 'center' }}
        items={[
          { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
          { key: '/', icon: <HomeOutlined />, label: <Link to="/">Voltar ao Site</Link> },
        ]}
      />
    );
  }

  // MENU DO CLIENTE (O botão de Admin sumiu daqui!)
  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} style={{ background: 'transparent', flex: 1, justifyContent: 'center' }}
      items={[
        { key: '/', icon: <HomeOutlined />, label: <Link to="/">Prêmios</Link> },
        { key: '/meus-numeros', icon: <GiftOutlined />, label: <Link to="/meus-numeros">Meus Bilhetes</Link> },
      ]}
    />
  );
}

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', background: '#001529', position: 'sticky', top: 0, zIndex: 1000 }}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GiftOutlined style={{ color: '#52c41a' }} />
            <span>RifaDaSorte</span>
          </div>

          <div style={{ flex: 1 }}>
            <AppMenu />
          </div>

          {/* O menu de perfil continua aqui */}
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} onClick={() => setOpen(true)} />
        </Header>

        <Content>
          <div className="site-layout-content">
            <Routes>
              {/* ÁREA DO CLIENTE */}
              <Route path="/" element={<PremiosPage />} />
              <Route path="/rifa/:id" element={<RifaPage />} />
              <Route path="/meus-numeros" element={<MeusBilhetesPage />} />
              
              {/* ÁREA DO ADMIN (Protegida) */}
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.6)' }}>
          RifaDaSorte ©2025
        </Footer>

        {/* Drawer Lateral (Perfil) */}
        <Drawer title="Minha Conta" placement="right" onClose={() => setOpen(false)} open={open}>
          <p>Editar Perfil</p>
          <p>Histórico</p>
          {/* Botão secreto para você entrar no admin */}
          <Link to="/admin" onClick={() => setOpen(false)}>
            <Button type="dashed" block style={{marginBottom: 10, marginTop: 20}}>Área Restrita</Button>
          </Link>
          <Button danger block>Sair</Button>
        </Drawer>
        
        <FloatButton icon={<WhatsAppOutlined />} type="primary" style={{ right: 24, bottom: 80 }} tooltip="Suporte" />
      </Layout>
    </Router>
  );
}