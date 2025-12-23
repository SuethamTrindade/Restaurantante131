import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para pegar o ID da URL
import { 
  Card, Button, Modal, message, Typography, Statistic, 
  Radio, Input, Form, Divider, Space, QRCode, Spin 
} from 'antd';
import { 
  CheckCircleOutlined, QrcodeOutlined, CreditCardOutlined, 
  CopyOutlined, ArrowLeftOutlined 
} from '@ant-design/icons';
import { RifaDAO } from '../daos/RifaDAO';

const { Title, Text } = Typography;

export default function RifaPage() {
  const { id } = useParams(); // Pega o ID da URL (ex: /rifa/1)
  const navigate = useNavigate();
  const [prize, setPrize] = useState(null);

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [soldNumbers, setSoldNumbers] = useState([]);
  
  // Estados do Modal de Pagamento
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardType, setCardType] = useState('credito');
  const [loading, setLoading] = useState(false);

  // Carrega dados do prêmio e números vendidos
  useEffect(() => {
    const p = RifaDAO.getPrizeById(id);
    if (!p) {
      message.error('Prêmio não encontrado');
      navigate('/');
      return;
    }
    setPrize(p);
    setSoldNumbers(RifaDAO.getSoldNumbers(p.id));
  }, [id, navigate]);

  if (!prize) return <div style={{textAlign: 'center', padding: 50}}><Spin size="large"/></div>;

  const totalValue = selectedNumbers.length * prize.price;

  const toggleNumber = (num) => {
    if (soldNumbers.includes(num)) {
      message.error('Número indisponível');
      return;
    }
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      const newTickets = selectedNumbers.map(num => ({
        prizeId: prize.id,
        prizeName: prize.name,
        number: num,
        trackingCode: `RF-${prize.id}-${num}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        method: paymentMethod,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Pago'
      }));

      RifaDAO.saveTickets(newTickets);
      setSoldNumbers([...soldNumbers, ...selectedNumbers]);
      setLoading(false);
      setIsModalOpen(false);
      setSelectedNumbers([]);

      Modal.success({
        title: 'Compra Realizada!',
        content: 'Verifique seus bilhetes no menu "Meus Bilhetes". Boa sorte!',
      });
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} style={{ marginBottom: 15 }}>
        Voltar para Prêmios
      </Button>

      <Card style={{ marginBottom: 20, textAlign: 'center', borderTop: '4px solid #1890ff' }}>
        <Title level={2}>{prize.image} {prize.name}</Title>
        <Text type="secondary">Clique nos números abaixo para selecionar.</Text>
        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <Statistic title="Preço" value={prize.price} precision={2} prefix="R$" />
          <Statistic title="Números" value={prize.totalNumbers} />
        </div>
      </Card>

      <div className="status-legend">
        <div className="legend-item"><span className="dot available"></span> Livre</div>
        <div className="legend-item"><span className="dot selected"></span> Seu</div>
        <div className="legend-item"><span className="dot sold"></span> Vendido</div>
      </div>

      <div className="numbers-grid">
        {Array.from({ length: prize.totalNumbers > 100 ? 100 : prize.totalNumbers }, (_, i) => i + 1).map((num) => {
          const isSold = soldNumbers.includes(num);
          const isSelected = selectedNumbers.includes(num);
          return (
            <div 
              key={num} 
              className={`number-btn ${isSold ? 'sold' : ''} ${isSelected ? 'selected' : ''}`} 
              onClick={() => toggleNumber(num)}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}
        {prize.totalNumbers > 100 && <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#888'}}>...e mais números...</div>}
      </div>

      {selectedNumbers.length > 0 && (
        <div className="floating-cart">
          <div className="cart-info">
            <span>{selectedNumbers.length} x R$ {prize.price}</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Total: R$ {totalValue.toFixed(2)}</span>
          </div>
          <Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
            Pagar Agora
          </Button>
        </div>
      )}

      {/* MODAL DE PAGAMENTO (QR CODE CORRIGIDO) */}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} title="Pagamento Seguro">
        <Radio.Group 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            style={{ width: '100%', marginBottom: 20 }} 
            buttonStyle="solid"
            size="large"
        >
          <Radio.Button value="pix" style={{ width: '50%', textAlign: 'center' }}><QrcodeOutlined /> PIX</Radio.Button>
          <Radio.Button value="card" style={{ width: '50%', textAlign: 'center' }}><CreditCardOutlined /> Cartão</Radio.Button>
        </Radio.Group>

        {paymentMethod === 'pix' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center' }}>
            {/* USO DO COMPONENTE NATIVO DO ANTD PARA EVITAR ERROS */}
            <QRCode value={`00020101021226580014BR.GOV.BCB.PIX${totalValue.toFixed(2)}`} size={200} />
            <Text type="secondary">Leia o QR Code acima no app do seu banco</Text>
            <Button icon={<CopyOutlined />}>Copiar Código PIX</Button>
          </div>
        )}

        {paymentMethod === 'card' && (
          <Form layout="vertical">
            <Form.Item label="Tipo"><Radio.Group value={cardType} onChange={e => setCardType(e.target.value)}><Radio value="credito">Crédito</Radio><Radio value="debito">Débito</Radio></Radio.Group></Form.Item>
            <Form.Item label="Número"><Input placeholder="0000 0000 0000 0000" prefix={<CreditCardOutlined />} /></Form.Item>
            <Space><Input placeholder="MM/AA" /><Input placeholder="CVV" /></Space>
          </Form>
        )}

        <Divider />
        <Button type="primary" block size="large" onClick={handleConfirmPayment} loading={loading}>Confirmar Pagamento</Button>
      </Modal>
    </div>
  );
}