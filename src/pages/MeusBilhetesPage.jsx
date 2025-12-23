import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Typography, Button, Empty } from 'antd';
import { RifaDAO } from '../daos/RifaDAO';
import { Link } from 'react-router-dom';
import { HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function MeusBilhetesPage() {
  const [bilhetes, setBilhetes] = useState([]);

  useEffect(() => {
    // Carrega os bilhetes salvos ao abrir a página
    setBilhetes(RifaDAO.listMyTickets());
  }, []);

  const columns = [
    {
      title: 'Número',
      dataIndex: 'number',
      key: 'number',
      render: (num) => <Tag color="blue" style={{fontSize: 16, padding: '5px 10px'}}>#{num.toString().padStart(2, '0')}</Tag>
    },
    {
      title: 'Código de Rastreio',
      dataIndex: 'trackingCode',
      key: 'trackingCode',
      render: (code) => (
        <div>
          <Text strong copyable>{code}</Text>
          <div style={{fontSize: 10, color: '#888'}}>ID Único de Segurança</div>
        </div>
      )
    },
    {
      title: 'Pagamento',
      key: 'payment',
      render: (_, record) => (
        <span>
          {record.method === 'pix' ? '💠 PIX' : `💳 ${record.cardType || 'Cartão'}`}
        </span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: () => <Tag icon={<CheckCircleOutlined />} color="success">Confirmado</Tag>
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Title level={2}>🎟️ Meus Bilhetes</Title>
          <Text type="secondary">Confira abaixo seus números da sorte e códigos de validação.</Text>
        </div>

        {bilhetes.length > 0 ? (
          <Table 
            dataSource={bilhetes} 
            columns={columns} 
            rowKey="trackingCode" 
            pagination={{ pageSize: 5 }}
            scroll={{ x: 600 }}
          />
        ) : (
          <Empty 
            description="Você ainda não comprou bilhetes." 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Link to="/">
              <Button type="primary" icon={<HomeOutlined />}>Comprar Agora</Button>
            </Link>
          </Empty>
        )}
      </Card>
    </div>
  );
}