export interface ItemPedido {
  pratoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  itens: ItemPedido[];
  data: string;
  valorTotal: number;
}