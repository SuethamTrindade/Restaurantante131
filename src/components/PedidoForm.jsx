import { Form, Select, InputNumber, Button, Card, Space, message, Row, Col } from 'antd';
import { useState, useEffect } from 'react';

export default function PedidoForm({ pedidoDAO, clienteDAO, pratoDAO, onSaved }) {
  const [form] = Form.useForm();
  const [clientes, setClientes] = useState([]);
  const [pratos, setPratos] = useState([]);
  const [itens, setItens] = useState([]);

  useEffect(() => {
    (async () => {
      setClientes(await clienteDAO.list());
      setPratos(await pratoDAO.list());
    })();
  }, []);

  const addItem = () =>
    setItens([...itens, { pratoId: null, quantidade: 1, precoUnitario: 0, ingredientesEditados: [], editando: true }]);

  const updateItem = (idx, patch) => {
    const next = [...itens];
    const current = next[idx];
    const updated = { ...current, ...patch };

    // Atualiza ingredientes e preço se o prato foi alterado
    if (patch.pratoId && patch.pratoId !== current.pratoId) {
      const prato = pratos.find((p) => p.id === patch.pratoId);
      updated.precoUnitario = prato?.preco || 0;
      updated.ingredientesEditados = [...(prato?.ingredientes || [])];
    }

    next[idx] = updated;
    setItens(next);
  };

  const removeItem = (idx) => setItens(itens.filter((_, i) => i !== idx));

  const total = itens.reduce((acc, i) => acc + i.quantidade * i.precoUnitario, 0);

  const save = async (values) => {
    const payload = {
      clienteId: values.clienteId,
      itens: itens.filter((i) => i.pratoId).map((i) => ({
        pratoId: i.pratoId,
        quantidade: i.quantidade,
        precoUnitario: i.precoUnitario,
        ingredientes: i.ingredientesEditados,
      })),
      data: new Date().toISOString(),
      valorTotal: total,
    };

    if (payload.itens.length === 0)
      return message.error('Adicione ao menos 1 item');

    await pedidoDAO.create(payload);
    message.success('Pedido registrado');

    setItens([]);
    form.resetFields();
    onSaved?.();
  };

  return (
    <Form form={form} layout="vertical" onFinish={save}>
      <Form.Item
        name="clienteId"
        label="Cliente"
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Selecione o cliente"
          options={clientes.map((c) => ({ value: c.id, label: c.nome }))}
        />
      </Form.Item>

      <Space direction="vertical" style={{ width: '100%' }}>
        {itens.map((item, idx) => {
          const pratoSelecionado = pratos.find((p) => p.id === item.pratoId);
          return (
            <Card
              key={idx}
              size="small"
              title={`Item ${idx + 1}`}
              extra={
                <Button danger size="small" onClick={() => removeItem(idx)}>
                  Remover
                </Button>
              }
            >
              {!item.editando ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{pratoSelecionado?.nome || 'Sem prato'}</strong>
                    <br />
                    Qtd: {item.quantidade}
                    <br />
                    Ingredientes: {item.ingredientesEditados.join(', ')}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>R$ {item.precoUnitario.toFixed(2)}</strong>
                    <br />
                    <Button size="small" onClick={() => updateItem(idx, { editando: true })}>
                      Editar item
                    </Button>
                  </div>
                </div>
              ) : (
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={11}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Selecione o prato"
                      value={item.pratoId}
                      onChange={(val) => updateItem(idx, { pratoId: val })}
                      options={pratos.map((p) => ({
                        value: p.id,
                        label: `${p.nome} (R$ ${p.preco})`,
                      }))}
                    />
                  </Col>

                  <Col xs={12} md={5}>
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      placeholder="Qtd"
                      value={item.quantidade}
                      onChange={(q) => updateItem(idx, { quantidade: q })}
                    />
                  </Col>

                  <Col xs={12} md={8} style={{ textAlign: 'right' }}>
                    <strong>R$ {item.precoUnitario.toFixed(2)}</strong>
                  </Col>

                  {pratoSelecionado && (
                    <Col span={24}>
                      <Select
                        mode="tags"
                        style={{ width: '100%', marginTop: 4 }}
                        value={item.ingredientesEditados}
                        onChange={(vals) => updateItem(idx, { ingredientesEditados: vals })}
                        options={pratoSelecionado.ingredientes.map((ing) => ({
                          value: ing,
                          label: ing,
                        }))}
                      />
                    </Col>
                  )}

                  <Col span={24} style={{ textAlign: 'right' }}>
                    <Button size="small" type="primary" onClick={() => updateItem(idx, { editando: false })}>
                      Concluir edição
                    </Button>
                  </Col>
                </Row>
              )}
            </Card>
          );
        })}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={addItem}>+ Adicionar item</Button>
          <h3 style={{ margin: 0 }}>Total: R$ {total.toFixed(2)}</h3>
        </div>
      </Space>

      <Button type="primary" htmlType="submit" block style={{ marginTop: 24 }}>
        Salvar Pedido
      </Button>
    </Form>
  );
}