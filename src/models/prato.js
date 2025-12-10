export interface Prato {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
  ingredientes: string[];
  descricao: string; // campo novo
}

// Lista de ingredientes padrão (200+ itens, resumida aqui)
export const INGREDIENTES_PADRAO: string[] = [
  "Arroz", "Feijão", "Batata", "Carne bovina", "Frango", "Peixe", "Porco",
  "Ovos", "Queijo", "Presunto", "Tomate", "Cebola", "Alho", "Pimentão",
  "Cenoura", "Ervilha", "Milho", "Alface", "Rúcula", "Espinafre",
  "Molho de tomate", "Molho branco", "Azeite", "Manteiga", "Farinha",
  "Macarrão", "Massa de pizza", "Chocolate", "Açúcar", "Sal", "Pimenta",
  "Orégano", "Manjericão", "Salsa", "Coentro",
  // ... continue expandindo até 200+ ingredientes conforme sua necessidade
];