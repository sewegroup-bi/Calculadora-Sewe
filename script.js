// DATA & CONFIGS
const MINIMUMS = {
  NEWLOGO:   { mrrMin: 2800, implMin: 5000, label: 'New Logo' },
  CROSS:     { mrrMin: 1600, implMin: 0,    label: 'Cross'    },
};

// ... (Mantenha o objeto CAT original aqui) ...

// NOVA LÓGICA DE USUÁRIOS
function userPrice(qty) {
  const pacotes = Math.ceil(qty / 50) || 1;
  return { p: 0, lbl: pacotes + " Pacote(s) de 50 users" }; 
}

function calc() {
  const users = parseInt(document.getElementById('uQty').value) || 0;
  const dImpl = parseFloat(document.getElementById('dImpl').value) || 0;
  const dMRR  = parseFloat(document.getElementById('dMRR').value) || 0;

  // Cálculo de Sustentação Base (R$ 799 por bloco de 50 usuários)
  const sustQty = Math.max(1, Math.ceil(users / 50));
  const sustBase = (S.type === 'CROSS') ? 0 : (sustQty * 799);
  
  // Atualiza exibição do card de sustentação
  const sustDisp = document.getElementById('sust-val-display');
  if(sustDisp) sustDisp.textContent = (S.type === 'CROSS') ? "Já incluso" : f(sustBase);

  // Totais
  let implGross = 0, mrrProds = 0;
  Object.values(S.sel).forEach(p => { implGross += p.impl; mrrProds += p.mrr; });

  const mrrGross = (S.suite === 'PROJETO') ? 0 : (mrrProds + sustBase + (S.dev === 'SIM' ? 750 : 0));
  
  const implFinal = implGross * (1 - dImpl / 100);
  const mrrFinal = mrrGross * (1 - dMRR / 100);

  // Atualiza Sidebar e PDF (Lembre-se de atualizar as funções de renderização para refletir isso)
  updateUI(implFinal, mrrFinal, users, sustBase);
}

// ... (Mantenha todas as outras funções de Admin e PDF aqui) ...
