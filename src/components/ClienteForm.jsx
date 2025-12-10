import { Form, Input, Button, message, Select } from 'antd';
import { useState, useEffect } from 'react';

export default function ClienteForm({ dao, initialValues, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [cepOptions, setCepOptions] = useState([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = { ...values };
      const res = initialValues?.id
        ? await dao.update(initialValues.id, payload)
        : await dao.create(payload);

      message.success('Cliente salvo com sucesso');
      onSaved?.(res);
      form.resetFields();
    } catch {
      message.error('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const fetchCep = async (text) => {
    if (!text || text.length < 5) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${text}/json/`);
      const data = await res.json();
      if (data?.cep) {
        setCepOptions([
          {
            label: `${data.cep} - ${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''} - ${data.uf || ''}`,
            value: data.cep,
          }
        ]);
        // Preenche automaticamente o campo de endereço
        form.setFieldsValue({
          endereco: `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''} - ${data.uf || ''}`,
          numero: '',
        });
      } else {
        setCepOptions([]);
      }
    } catch {
      setCepOptions([]);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="telefone" label="Telefone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="cep"
        label="CEP"
        rules={[{ required: true, message: 'Informe o CEP' }]}
      >
        <Select
          showSearch
          placeholder="Digite o CEP"
          filterOption={false}
          onSearch={fetchCep}
          options={cepOptions}
        />
      </Form.Item>

      <Form.Item
        name="endereco"
        label="Endereço"
        rules={[{ required: true, message: 'Informe o endereço' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="numero"
        label="Número"
        rules={[{ required: true, message: 'Informe o número' }]}
      >
        <Input placeholder="Ex: 123, Ap 45" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        {initialValues?.id ? 'Atualizar' : 'Cadastrar'}
      </Button>
    </Form>
  );
}
