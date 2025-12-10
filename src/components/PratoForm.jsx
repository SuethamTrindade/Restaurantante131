import { Form, Input, InputNumber, Select, Button, message, Row, Col } from 'antd';
import { useState, useEffect } from 'react';

export default function PratoForm({ dao, initialValues, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      const clone = {
        ...initialValues,
        ingredientes: [...(initialValues.ingredientes || [])],
      };
      form.setFieldsValue(clone);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        nome: values.nome.trim(),
        preco: Number(values.preco),
        categoria: values.categoria,
        ingredientes: values.ingredientes || [],
      };

      let res;
      if (initialValues?.id) {
        res = await dao.update(initialValues.id, payload);
        message.success('Prato atualizado com sucesso');
      } else {
        res = await dao.create(payload);
        message.success('Prato cadastrado com sucesso');
      }

      onSaved?.(res);
      form.resetFields();
    } catch {
      message.error('Erro ao salvar prato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="nome" label="Nome do Prato" rules={[{ required: true }]}>
        <Input placeholder="Ex: Lasanha" />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item name="preco" label="Preço" rules={[{ required: true }]}>
            <InputNumber prefix="R$" style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="categoria" label="Categoria" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'Entrada', label: 'Entrada' },
                { value: 'Principal', label: 'Principal' },
                { value: 'Sobremesa', label: 'Sobremesa' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="ingredientes" label="Ingredientes">
        <Select
          mode="tags"
          tokenSeparators={[',']}
          placeholder="Digite ou selecione os ingredientes"
          options={[
            { value: 'Arroz', label: 'Arroz' },
            { value: 'Feijão', label: 'Feijão' },
            { value: 'Batata', label: 'Batata' },
            { value: 'Carne bovina', label: 'Carne bovina' },
            { value: 'Frango', label: 'Frango' },
            { value: 'Peixe', label: 'Peixe' },
            { value: 'Porco', label: 'Porco' },
            { value: 'Ovos', label: 'Ovos' },
            { value: 'Queijo', label: 'Queijo' },
            { value: 'Presunto', label: 'Presunto' },
            { value: 'Tomate', label: 'Tomate' },
            { value: 'Cebola', label: 'Cebola' },
            { value: 'Alho', label: 'Alho' },
            { value: 'Pimentão', label: 'Pimentão' },
            { value: 'Cenoura', label: 'Cenoura' },
            { value: 'Ervilha', label: 'Ervilha' },
            { value: 'Milho', label: 'Milho' },
            { value: 'Alface', label: 'Alface' },
            { value: 'Rúcula', label: 'Rúcula' },
            { value: 'Espinafre', label: 'Espinafre' },
            { value: 'Molho de tomate', label: 'Molho de tomate' },
            { value: 'Molho branco', label: 'Molho branco' },
            { value: 'Azeite', label: 'Azeite' },
            { value: 'Manteiga', label: 'Manteiga' },
            { value: 'Farinha', label: 'Farinha' },
            { value: 'Macarrão', label: 'Macarrão' },
            { value: 'Massa de pizza', label: 'Massa de pizza' },
            { value: 'Chocolate', label: 'Chocolate' },
            { value: 'Açúcar', label: 'Açúcar' },
            { value: 'Sal', label: 'Sal' },
            { value: 'Pimenta', label: 'Pimenta' },
            { value: 'Orégano', label: 'Orégano' },
            { value: 'Manjericão', label: 'Manjericão' },
            { value: 'Salsa', label: 'Salsa' },
            { value: 'Coentro', label: 'Coentro' },
          ]}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={loading}>
        {initialValues?.id ? 'Salvar alterações' : 'Cadastrar'}
      </Button>
    </Form>
  );
}