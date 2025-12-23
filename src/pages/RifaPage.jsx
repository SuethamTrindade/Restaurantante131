import React, { useState, useEffect } from 'react';
import { 
  Card, Button, Modal, message, Typography, Statistic, 
  Radio, Input, Form, Divider, Space, QRCode 
} from 'antd';
import { 
  CheckCircleOutlined, 
  QrcodeOutlined, 
  CreditCardOutlined, 
  CopyOutlined,
  LockOutlined,
  BankOutlined
} from '@ant-design/icons';
import { RifaDAO } from '../daos/RifaDAO'; // Importe o novo DAO

const { Title, Text } = Typography;

export default function RifaPage() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [cardType, setCardType] = useState('credito'); // Estado para Crédito/Débito
  const [loading, setLoading] = useState(false);
  
  // Estado dos números já vendidos (carregado do DAO)
  const [soldNumbers, setSoldNumbers] = useState([]);

  // Carrega números vendidos ao iniciar
  useEffect(() => {
    setSoldNumbers(RifaDAO.getAllSoldNumbers());
  }, []);

  const totalValue = selectedNumbers.length * 10;

  const toggleNumber = (num) => {
    if (soldNumbers.includes(num)) {
      message.error('Este número já foi vendido!');
      return;
    }
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleCheckoutClick = () => {
    if (selectedNumbers.length === 0) return;
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    
    setTimeout(() => {
      // 1. Gerar os Bilhetes com Código de Rastreio
      const newTickets = selectedNumbers.map(num => ({
        number: num,
        // Gera um código tipo: RF-NUMERO-ALEATORIO (ex: RF-10-X9D2)
        trackingCode: `RF-${num}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        method: paymentMethod,
        cardType: paymentMethod === 'card' ? (cardType === 'credito' ? 'Crédito' : 'Débito') : null,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'Pago'
      }));

      // 2. Salvar no "Banco de Dados" (LocalStore)
      RifaDAO.saveTickets(newTickets);

      // 3. Atualizar a tela
      setSoldNumbers(RifaDAO.getAllSoldNumbers()); // Atualiza os vermelhos
      setLoading(false);
      setIsModalOpen(false);
      setSelectedNumbers([]);

      Modal.success({
        title: 'Compra Confirmada!',
        content: (
          <div>
            <p>Seus {newTickets.length} bilhetes foram gerados com sucesso.</p>
            <p>Acesse o menu <b>"Meus Bilhetes"</b> para ver seus códigos de rastreio.</p>
          </div>
        ),
      });
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      <Card style={{ marginBottom: 20, textAlign: 'center', borderTop: '4px solid #1890ff' }}>
        <Title level={2}>🍀 Rifa do iPhone 15 Pro</Title>
        <Text type="secondary">Escolha seus números e pague com PIX, Crédito ou Débito.</Text>
        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <Statistic title="Valor por Número" value={10} precision={2} prefix="R$" />
          <Statistic title="Prêmio" value="iPhone 15" prefix="📱" />
        </div>
      </Card>

      <div className="status-legend">
        <div className="legend-item"><span className="dot available"></span> Disponível</div>
        <div className="legend-item"><span className="dot selected"></span> Selecionado</div>
        <div className="legend-item"><span className="dot sold"></span> Vendido</div>
      </div>

      <div className="numbers-grid">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
          const isSold = soldNumbers.includes(num);
          const isSelected = selectedNumbers.includes(num);
          let className = 'number-btn';
          if (isSold) className += ' sold';
          else if (isSelected) className += ' selected';

          return (
            <div key={num} className={className} onClick={() => toggleNumber(num)}>
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}
      </div>

      {selectedNumbers.length > 0 && (
        <div className="floating-cart">
          <div className="cart-info">
            <span style={{ fontSize: '14px', opacity: 0.8 }}>{selectedNumbers.length} números</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>R$ {totalValue.toFixed(2)}</span>
          </div>
          <Button type="primary" size="large" icon={<CheckCircleOutlined />} onClick={handleCheckoutClick}>
            Pagar Agora
          </Button>
        </div>
      )}

      {/* MODAL DE PAGAMENTO */}
      <Modal
        title="Finalizar Compra"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
        centered
      >
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
           <Text type="secondary">Total a pagar: <b style={{ color: '#1890ff', fontSize: 18 }}>R$ {totalValue.toFixed(2)}</b></Text>
        </div>

        {/* Escolha PIX ou CARTÃO */}
        <Radio.Group 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)} 
          style={{ width: '100%', marginBottom: 20 }}
          buttonStyle="solid"
          size="large"
        >
          <Radio.Button value="pix" style={{ width: '50%', textAlign: 'center' }}>
            <QrcodeOutlined /> PIX
          </Radio.Button>
          <Radio.Button value="card" style={{ width: '50%', textAlign: 'center' }}>
            <CreditCardOutlined /> Cartão
          </Radio.Button>
        </Radio.Group>

        <Divider style={{ margin: '12px 0' }} />

        {/* --- OPÇÃO PIX --- */}
        {paymentMethod === 'pix' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 15 }}>
            <Text>Escaneie o QR Code:</Text>
            <div style={{ padding: 10, border: '1px solid #eee', borderRadius: 8, alignSelf: 'center' }}>
              <QRCode value={`PIX-TESTE-${totalValue}`} size={160} />
            </div>
            <Button icon={<CopyOutlined />} onClick={() => message.success('Código copiado!')}>
              Copiar Código PIX
            </Button>
            <Text type="secondary" style={{ fontSize: 12 }}>Aprovação imediata</Text>
          </div>
        )}

        {/* --- OPÇÃO CARTÃO (CRÉDITO / DÉBITO) --- */}
        {paymentMethod === 'card' && (
          <Form layout="vertical">
            {/* SELEÇÃO CRÉDITO OU DÉBITO */}
            <Form.Item label="Função do Cartão" required style={{ marginBottom: 12 }}>
              <Radio.Group 
                value={cardType} 
                onChange={e => setCardType(e.target.value)}
                block
                optionType="button"
              >
                <Radio value="credito">Crédito</Radio>
                <Radio value="debito">Débito</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Número do Cartão" required style={{ marginBottom: 12 }}>
              <Input prefix={<CreditCardOutlined />} placeholder="0000 0000 0000 0000" />
            </Form.Item>
            
            <Space>
              <Form.Item label="Validade" required style={{ marginBottom: 12 }}>
                <Input placeholder="MM/AA" style={{ width: 100 }} />
              </Form.Item>
              <Form.Item label="CVV" required style={{ marginBottom: 12 }}>
                <Input placeholder="123" style={{ width: 80 }} />
              </Form.Item>
            </Space>

            <Form.Item label="Nome no Cartão" required style={{ marginBottom: 12 }}>
              <Input placeholder="Como está no cartão" />
            </Form.Item>
          </Form>
        )}

        <Divider />

        <Button 
          type="primary" 
          block 
          size="large" 
          onClick={handleConfirmPayment}
          loading={loading}
          style={{ height: '50px', fontWeight: 'bold' }}
        >
          {paymentMethod === 'pix' ? 'Já fiz o pagamento' : `Pagar com ${cardType === 'credito' ? 'Crédito' : 'Débito'}`}
        </Button>
      </Modal>
    </div>
  );
}