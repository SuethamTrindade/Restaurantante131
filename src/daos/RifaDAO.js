const KEY = 'rifa_data_v1';

// Dados iniciais simulados (para a rifa não parecer vazia no começo)
const INITIAL_SOLD = [5, 12, 44, 78, 99];

export const RifaDAO = {
  // Salva uma lista de novos bilhetes comprados
  saveTickets: (tickets) => {
    const currentData = RifaDAO.listMyTickets();
    const newData = [...currentData, ...tickets];
    localStorage.setItem(KEY, JSON.stringify(newData));
  },

  // Lista apenas os bilhetes que EU comprei
  listMyTickets: () => {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  },

  // Retorna TODOS os números vendidos (Meus + os do Sistema) para pintar de vermelho
  getAllSoldNumbers: () => {
    const myTickets = RifaDAO.listMyTickets();
    const myNumbers = myTickets.map(t => t.number);
    // Junta os meus comprados com os simulados do sistema
    return [...new Set([...INITIAL_SOLD, ...myNumbers])];
  }
};