import React, { useState } from 'react';
import { Card, Button, Badge, Modal, message, Typography, Statistic } from 'antd';
import { ShoppingCartOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Simulação de números já vendidos (ex: 5, 10, 55)
const SOLD_NUMBERS = [5, 12, 44, 78, 99];

export default function RifaPage() {
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  // Função para alternar seleção
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

  const handleCheckout = () => {
    if (selectedNumbers.length === 0) return;
    Modal.success({
      title: 'Reserva Realizada!',
      content: `Você reservou os números: ${selectedNumbers.join(', ')}. Valor total: R$ ${(selectedNumbers.length * 10).toFixed(2)}`,
      onOk: () => setSelectedNumbers([]),
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Cabeçalho da Rifa */}
      <Card style={{ marginBottom: 20, textAlign: 'center', borderTop: '4px solid #1890ff' }}>
        <Title level={2}>🍀 Rifa do iPhone 15 Pro</Title>
        <Text type="secondary">Escolha seus números da sorte abaixo!</Text>
        <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', gap: 20 }}>
          <Statistic title="Valor do Número" value={10} precision={2} prefix="R$" />
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
            <div 
              key={num} 
              className={className} 
              onClick={() => toggleNumber(num)}
            >
              {num.toString().padStart(2, '0')}
            </div>
          );
        })}
      </div>

      {/* Barra Flutuante de Compra */}
      {selectedNumbers.length > 0 && (
        <div className="floating-cart">
          <div className="cart-info">
            <span style={{ fontSize: '16px' }}>Selected: <b>{selectedNumbers.length}</b></span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total: R$ {(selectedNumbers.length * 10).toFixed(2)}</span>
          </div>
          <Button type="primary" size="large" icon={<CheckCircleOutlined />} onClick={handleCheckout}>
            Finalizar Compra
          </Button>
        </div>
      )}
    </div>
  );
}