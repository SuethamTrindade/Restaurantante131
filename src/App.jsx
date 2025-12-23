import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Avatar, message, FloatButton } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  GiftOutlined, 
  HomeOutlined, 
  TrophyOutlined,
  WhatsAppOutlined,
  UserOutlined
} from '@ant-design/icons';

// Importe sua nova página aqui
import RifaPage from './pages/RifaPage';
// Você pode manter ou remover as páginas antigas conforme necessário
// import ClientesPage from './pages/ClientesPage'; 

const { Header, Content, Footer } = Layout;

function AppMenu() {
  const location = useLocation();
  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: <Link to="/">Sorteio Atual</Link> },
    { key: '/meus-numeros', icon: <GiftOutlined />, label: <Link to="/meus-numeros">Meus Bilhetes</Link> },
    { key: '/premios', icon: <TrophyOutlined />, label: <Link to="/premios">Prêmios</Link> },
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
      style={{ flex: 1, minWidth: 0, justifyContent: 'center', background: 'transparent' }}
    />
  );
}

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 20px',
          background: '#001529',
          position: 'sticky', top: 0, zIndex: 1000
        }}>
          {/* Logo da Rifa */}
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
            <GiftOutlined style={{ color: '#52c41a' }} />
            <span>RifaDaSorte</span>
          </div>

          {/* Menu Central (Escondido em Mobile se necessário) */}
          <div style={{ flex: 1 }}>
            <AppMenu />
          </div>

          {/* Perfil */}
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} onClick={() => setOpen(true)} />
        </Header>

        <Content>
          <div className="site-layout-content">
            <Routes>
              {/* Rota principal agora é a Rifa */}
              <Route path="/" element={<RifaPage />} />
              
              {/* Placeholder para outras rotas */}
              <Route path="/meus-numeros" element={<div style={{textAlign:'center', marginTop: 50}}><h2>Seus bilhetes aparecerão aqui</h2></div>} />
              <Route path="/premios" element={<div style={{textAlign:'center', marginTop: 50}}><h2>Galeria de Prêmios</h2></div>} />
            </Routes>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#001529', color: 'rgba(255,255,255,0.6)' }}>
          RifaDaSorte ©2025 - Participe e Concorra!
        </Footer>

        {/* Drawer Lateral (Perfil) */}
        <Drawer title="Minha Conta" placement="right" onClose={() => setOpen(false)} open={open}>
          <p>Histórico de Compras</p>
          <p>Configurações</p>
          <Button danger block>Sair</Button>
        </Drawer>
        
        {/* Botão de Suporte Flutuante */}
        <FloatButton icon={<WhatsAppOutlined />} type="primary" style={{ right: 24, bottom: 100 }} tooltip="Suporte WhatsApp" />
      </Layout>
    </Router>
  );
}