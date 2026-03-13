// CONFIGURAÇÕES INICIAIS
const MINIMUMS = { NEWLOGO: { mrrMin: 2800, implMin: 5000 }, CROSS: { mrrMin: 1600, implMin: 0 } };
let S = { type: 'NEWLOGO', suite: 'COMERCIAL', tier: 'SMART', sel: {}, dev: 'SIM' };
let S_parcelas = 1;

// FUNÇÃO DE USUÁRIOS (Nova Regra: Pacotes de 50)
function userPrice(qty) {
    const pacotes = Math.ceil(qty / 50) || 1;
    return { p: 0, lbl: pacotes + " Pacote(s) de 50 users" };
}

function calc() {
    const users = parseInt(document.getElementById('uQty').value) || 0;
    const dImpl = parseFloat(document.getElementById('dImpl').value) || 0;
    const dMRR = parseFloat(document.getElementById('dMRR').value) || 0;

    // Sustentação Base (R$ 799 por bloco de 50 usuários)
    const sustQty = Math.max(1, Math.ceil(users / 50));
    const sustBase = (S.type === 'CROSS') ? 0 : (sustQty * 799);
    
    const sustDisp = document.getElementById('sust-val-display');
    if (sustDisp) sustDisp.textContent = (S.type === 'CROSS') ? "Incluso no Contrato" : f(sustBase);

    let implGross = 0, mrrProds = 0;
    Object.values(S.sel).forEach(p => { implGross += p.impl; mrrProds += p.mrr; });

    const mrrGross = (S.suite === 'PROJETO') ? 0 : (mrrProds + sustBase + (S.dev === 'SIM' ? 750 : 0));
    const implFinal = implGross * (1 - dImpl / 100);
    const mrrFinal = mrrGross * (1 - dMRR / 100);

    // Atualização Visual
    document.getElementById('gb-impl').textContent = f(implFinal);
    document.getElementById('gb-mrr').textContent = f(mrrFinal) + "/mês";
    document.getElementById('gb-total').textContent = f(implFinal + (mrrFinal * 12));
    document.getElementById('uTotalMRR').textContent = "Incluso";
}

// FORMATADOR
function f(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

// FUNÇÕES DE INTERFACE (Setters)
function setType(t) { S.type = t; calc(); }
function changeU(d) { 
    const el = document.getElementById('uQty');
    el.value = Math.max(0, parseInt(el.value) + d);
    calc(); 
}

// GERAÇÃO DE PDF E ADMIN (Simplificados para o exemplo, manter funções originais se necessário)
function gerarPDF() { window.print(); }
function abrirAdmin() { document.getElementById('admin-overlay').style.display = 'flex'; }
function fecharAdmin() { document.getElementById('admin-overlay').style.display = 'none'; }
