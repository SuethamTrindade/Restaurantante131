const KEY_TICKETS = 'rifa_tickets_v2';
const KEY_PRIZES = 'rifa_prizes_v1';

// Prêmios iniciais (Se você for Admin, poderia editar isso futuramente)
const INITIAL_PRIZES = [
  { id: 1, name: 'iPhone 15 Pro Max', price: 10, image: '📱', totalNumbers: 100 },
  { id: 2, name: 'Honda Civic 2024', price: 50, image: '🚗', totalNumbers: 500 },
  { id: 3, name: 'Pix de R$ 5.000', price: 2, image: '💸', totalNumbers: 1000 },
];

export const RifaDAO = {
  // --- FUNÇÕES DE BILHETES ---
  saveTickets: (tickets) => {
    const currentData = RifaDAO.listMyTickets();
    const newData = [...currentData, ...tickets];
    localStorage.setItem(KEY_TICKETS, JSON.stringify(newData));
  },

  listMyTickets: () => {
    const data = localStorage.getItem(KEY_TICKETS);
    return data ? JSON.parse(data) : [];
  },

  // Pega números vendidos de um prêmio específico (ID)
  getSoldNumbers: (prizeId) => {
    const allTickets = RifaDAO.listMyTickets(); // Aqui simularíamos buscar do servidor todos
    // Filtra apenas os bilhetes deste prêmio específico
    return allTickets
      .filter(t => t.prizeId === prizeId)
      .map(t => t.number);
  },

  // --- FUNÇÕES DE PRÊMIOS ---
  getPrizes: () => {
    return INITIAL_PRIZES;
  },

  getPrizeById: (id) => {
    return INITIAL_PRIZES.find(p => p.id === parseInt(id));
  }
};