import { Table, Button, Popconfirm } from 'antd';

export default function PratoTable({ data, onEdit, onDelete }) {
  const columns = [
    { title: 'Nome', dataIndex: 'nome' },
    { title: 'Categoria', dataIndex: 'categoria' },
    { title: 'Preço', dataIndex: 'preco', render: (v) => `R$ ${v.toFixed(2)}` },
    { title: 'Ingredientes', dataIndex: 'ingredientes', render: (arr) => arr.join(', ') },
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
      scroll={{ x: 'max-content' }} // <--- Adicionado para responsividade
    />
  );
}