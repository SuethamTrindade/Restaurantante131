import { Table, Button, Popconfirm } from 'antd';

export default function ClienteTable({ data, onEdit, onDelete }) {
  const columns = [
    { title: 'Nome', dataIndex: 'nome' },
    { title: 'Telefone', dataIndex: 'telefone' },
    { title: 'CEP', dataIndex: 'cep' },
    {
      title: 'Endereço',
      render: (_, record) => (
        <div>
          <div>{record.endereco || 'Não informado'}</div>
          {record.numero && <div>Número: {record.numero}</div>}
        </div>
      )
    },
    {
      title: 'Ações',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => onEdit(record)}>Editar</Button>
          <Popconfirm title="Excluir?" onConfirm={() => onDelete(record.id)}>
            <Button danger size="small" style={{ marginLeft: 8 }}>Excluir</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      scroll={{ x: 'max-content' }}
    />
  );
}
