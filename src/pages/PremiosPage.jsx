import React from 'react';
import { Card, Button, Row, Col, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RifaDAO } from '../daos/RifaDAO';

const { Title, Text } = Typography;

export default function PremiosPage() {
  const navigate = useNavigate();
  const prizes = RifaDAO.getPrizes();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2}>🏆 Escolha seu Prêmio</Title>
        <Text type="secondary">Participe das nossas rifas ativas e boa sorte!</Text>
      </div>

      <Row gutter={[24, 24]}>
        {prizes.map((prize) => (
          <Col xs={24} sm={12} md={8} key={prize.id}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: 150, background: '#f0f2f5', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center', fontSize: 60 
                }}>
                  {prize.image}
                </div>
              }
              actions={[
                <Button type="primary" onClick={() => navigate(`/rifa/${prize.id}`)}>
                  Comprar Bilhetes
                </Button>
              ]}
            >
              <Card.Meta
                title={prize.name}
                description={
                  <div>
                    <Tag color="green">R$ {prize.price.toFixed(2)} / número</Tag>
                    <div style={{marginTop: 10}}>Sorteio pela Loteria Federal</div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}