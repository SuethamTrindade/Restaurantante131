import { Spin } from 'antd';

/**
 * Componente Loader
 * Exibe um spinner centralizado para indicar carregamento
 */
export default function Loader({ tip = 'Carregando...', size = 'large' }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '150px'
    }}>
      <Spin size={size} tip={tip} />
    </div>
  );
}