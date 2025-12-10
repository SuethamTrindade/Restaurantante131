import { Table, Button, Popconfirm, Tabs, Input } from "antd";
import { useState, useEffect } from "react";

export default function PedidoTable({ data, clientesById, pratosById, onDelete }) {
  const [ingredientesRemovidos, setIngredientesRemovidos] = useState([]);
  const [novoIngrediente, setNovoIngrediente] = useState("");

  // 🔥 Carrega os ingredientes removidos
  useEffect(() => {
    const todosIngredientes = data.flatMap((pedido) =>
      pedido.itens.flatMap((i) =>
        Array.isArray(i.ingredientes) ? i.ingredientes : []
      )
    );
    setIngredientesRemovidos(todosIngredientes);
  }, [data]);

  // ➕ Adicionar ingrediente manualmente
  const adicionarIngrediente = () => {
    if (novoIngrediente.trim() === "") return;

    setIngredientesRemovidos([...ingredientesRemovidos, novoIngrediente.trim()]);
    setNovoIngrediente("");
  };

  // ❌ Remover ingrediente específico
  const removerIngrediente = (index) => {
    const novaLista = ingredientesRemovidos.filter((_, i) => i !== index);
    setIngredientesRemovidos(novaLista);
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "data",
      render: (d) => new Date(d).toLocaleString("pt-BR"),
    },
    {
      title: "Cliente",
      dataIndex: "clienteId",
      render: (id) => clientesById[id]?.nome || "—",
    },
    {
      title: "Itens",
      dataIndex: "itens",
      render: (itens, pedido) =>
        itens.map((i, idx) => {
          const prato = pratosById[i.pratoId];
          const nome = prato?.nome || "Prato removido";
          const ingredientes = Array.isArray(i.ingredientes)
            ? i.ingredientes.join(", ")
            : "—";

          return (
            <div key={`${pedido.id}-${idx}`} style={{ marginBottom: 10 }}>
              <strong>{nome}</strong> ×{i.quantidade}
              <div style={{ fontSize: 12, color: "#555" }}>
                Ingredientes removidos: {ingredientes}
              </div>
            </div>
          );
        }),
    },
    {
      title: "Valor Total",
      dataIndex: "valorTotal",
      render: (v) => `R$ ${v.toFixed(2)}`,
    },
    {
      title: "Ações",
      render: (_, record) => (
        <Popconfirm title="Excluir pedido?" onConfirm={() => onDelete(record.id)}>
          <Button danger size="small">Excluir Pedido</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: "Pedidos",
          children: (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}
            />
          ),
        },
        {
          key: "2",
          label: "Ingredientes Removidos",
          children: (
            <div>
              <h3>Ingredientes Removidos</h3>

              {/* Campo de adicionar ingrediente */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <Input
                  placeholder="Adicionar ingrediente..."
                  value={novoIngrediente}
                  onChange={(e) => setNovoIngrediente(e.target.value)}
                />
                <Button type="primary" onClick={adicionarIngrediente}>
                  Adicionar
                </Button>
              </div>

              {ingredientesRemovidos.length === 0 ? (
                <p>Nenhum ingrediente removido.</p>
              ) : (
                <ul>
                  {ingredientesRemovidos.map((ing, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      {ing}

                      <Button
                        danger
                        size="small"
                        onClick={() => removerIngrediente(idx)}
                      >
                        Remover
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
