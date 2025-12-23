import React, { useState } from 'react';
import { 
  Card, Button, Modal, message, Typography, Statistic, 
  Radio, Input, Form, Divider, Space, QRCode 
} from 'antd';
import { 
  CheckCircleOutlined, 
  QrcodeOutlined, 
  CreditCardOutlined, 
  CopyOutlined,
  LockOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Simulação de números já vendidos
const SOLD_NUMBERS = [5, 12, 44, 78, 99];

export default function RifaPage() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [loading, setLoading] = useState(false);

  // Calcula o total
  const totalValue = selectedNumbers.length * 10;

  // Selecionar número
  const toggleNumber = (num) => {
    if (SOLD_NUMBERS.includes(num)) {
      message.error('Este número já foi vendido!');
      return;
    }
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  // Abrir Modal de Pagamento
  const handleCheckoutClick = () => {
    if (selectedNumbers.length === 0) return;
    setIsModalOpen(true);
  };

  // Simular Processamento do Pagamento
  const handleConfirmPayment = () => {
    setLoading(true);
    // Simula delay de rede (2 segundos)
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedNumbers([]); // Limpa seleção
      
      Modal.success({
        title: 'Pagamento Aprovado!',
        content: (
          <div>
            <p>Seus números foram confirmados com sucesso.</p>
            <p>Boa sorte no sorteio!</p>
            <Text type="secondary" style={{fontSize: 12}}>ID da Transação: #TX{Math.floor(Math.random()*10000)}</Text>
          </div>
        ),
      });
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      {/* Cabeçalho */}
      <Card style={{ marginBottom: 20, textAlign: 'center', borderTop: '4px solid #1890ff' }}>
        <Title level={2}>🍀 Rifa do iPhone 15 Pro</Title>
        <Text type="secondary">Escolha seus números e pague com PIX ou Cartão.</Text>
        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <Statistic title="Valor por Número" value={10} precision={2} prefix="R$" />
          <Statistic title="Prêmio" value="iPhone 15" prefix="📱" />
        </div>
      </Card>

      {/* Legenda */}
      <div className="status-legend">
        <div className="legend-item"><span className="dot available"></span> Disponível</div>
        <div className="legend-item"><span className="dot selected"></span> Selecionado</div>
        <div className="legend-item"><span className="dot sold"></span> Vendido</div>
      </div>

      {/* Grade de Números */}
      <div className="numbers-grid">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => {
          const isSold = SOLD_NUMBERS.includes(num);
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

      {/* Barra Flutuante */}
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
        title={null} // Título personalizado abaixo
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={400}
        centered
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>Finalizar Compra</Title>
          <Text type="secondary">Total a pagar: <b style={{ color: '#1890ff' }}>R$ {totalValue.toFixed(2)}</b></Text>
        </div>

        {/* Seleção do Método */}
        <Radio.Group 
          value={paymentMethod} 
          onChange={(e) => setPaymentMethod(e.target.value)} 
          style={{ width: '100%', marginBottom: 20 }}
          buttonStyle="solid"
        >
          <Radio.Button value="pix" style={{ width: '50%', textAlign: 'center' }}>
            <QrcodeOutlined /> PIX
          </Radio.Button>
          <Radio.Button value="card" style={{ width: '50%', textAlign: 'center' }}>
            <CreditCardOutlined /> Cartão
          </Radio.Button>
        </Radio.Group>

        <Divider />

        {/* Conteúdo Dinâmico: PIX */}
        {paymentMethod === 'pix' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
            <Text>Escaneie o QR Code para pagar:</Text>
            
            {/* Componente QRCode do Ant Design */}
            <div style={{ padding: 10, border: '1px solid #eee', borderRadius: 8 }}>
              <QRCode 
                value={`00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426655440000520400005303986540${totalValue.toFixed(2)}5802BR5913Rifa Da Sorte6008Brasilia62070503***6304E2CA`} 
                size={180} 
                icon="https://cdn-icons-png.flaticon.com/512/10095/10095393.png" // Ícone do PIX opcional
              />
            </div>

            <Button icon={<CopyOutlined />} onClick={() => message.success('Código PIX copiado!')}>
              Copia e Cola
            </Button>
            
            <Text type="secondary" style={{ fontSize: 12 }}>
              <LockOutlined /> Aprovação imediata
            </Text>
          </div>
        )}

        {/* Conteúdo Dinâmico: Cartão */}
        {paymentMethod === 'card' && (
          <Form layout="vertical">
            <Form.Item label="Número do Cartão" required>
              <Input prefix={<CreditCardOutlined />} placeholder="0000 0000 0000 0000" />
            </Form.Item>
            <Space>
              <Form.Item label="Validade" required>
                <Input placeholder="MM/AA" style={{ width: 100 }} />
              </Form.Item>
              <Form.Item label="CVV" required>
                <Input placeholder="123" style={{ width: 80 }} />
              </Form.Item>
            </Space>
            <Form.Item label="Nome no Cartão" required>
              <Input placeholder="Como está no cartão" />
            </Form.Item>
          </Form>
        )}

        <Divider />

        {/* Botão Final de Ação */}
        <Button 
          type="primary" 
          block 
          size="large" 
          onClick={handleConfirmPayment}
          loading={loading}
          style={{ height: '45px', fontSize: '16px' }}
        >
          {paymentMethod === 'pix' ? 'Já fiz o pagamento' : `Pagar R$ ${totalValue.toFixed(2)}`}
        </Button>

      </Modal>
    </div>
  );
}