const MINIMUMS = {
  NEWLOGO: { mrrMin: 2800, implMin: 5000 },
  CROSS: { mrrMin: 1600, implMin: 0 }
};

// Objeto CAT completo conforme o original
const CAT = {
  COMERCIAL: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Comercial'], NL:[4999,1299], CR:[2999,1299] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale Completo'], NL:[6999,1699], CR:[4999,1699] }, addons:[{name:'Mapa Prospecção', NL:[999,199], CR:[999,199]}] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Strategic Completo'], NL:[9999,1999], CR:[6999,1849] }, addons:[] }
  },
  FINANCEIRA: { SMART: { core: { name:'Smart Financeiro', prods:['Fluxo de Caixa'], NL:[3999,1299], CR:[1999,1299] }, addons:[] } },
  // ... adicione as outras suítes conforme seu original
};

let S = { type:'NEWLOGO', suite:'COMERCIAL', tier:'SMART', sel:{}, dev:'SIM' };
let S_parcelas = 1;

window.onload = () => {
  document.getElementById('cDate').value = new Date().toISOString().split('T')[0];
  renderTiers(); renderProds(); calc();
};

function setType(t) { S.type=t; S.sel={}; calc(); renderProds(); }
function setSuite(s) { S.suite=s; S.tier='SMART'; renderTiers(); renderProds(); calc(); }
function setTier(t) { S.tier=t; renderTiers(); renderProds(); }

function renderTiers() {
  const suiteData = CAT[S.suite]; if(!suiteData) return;
  let h = ''; Object.keys(suiteData).forEach(t => {
    h += `<div class="ttab ${S.tier===t?'active smart':''}" onclick="setTier('${t}')">${t}</div>`;
  });
  document.getElementById('tier-tabs-wrap').innerHTML = h;
}

function renderProds() {
  const tierData = CAT[S.suite] ? CAT[S.suite][S.tier] : null;
  if(!tierData) return;
  const tk = S.type==='NEWLOGO' ? 0 : 2; // Index do CAT
  let h = '';
  // Core
  h += `<tr><td><input type="checkbox" onchange="toggle('core', ${tierData.core.NL[0]}, ${tierData.core.NL[1]}, '${tierData.core.name}')"></td><td>${tierData.core.name}</td><td>CORE</td><td>${f(tierData.core.NL[0])}</td><td>${f(tierData.core.NL[1])}</td></tr>`;
  document.getElementById('ptbody').innerHTML = h;
}

function toggle(id, impl, mrr, name) {
  if(S.sel[id]) delete S.sel[id]; else S.sel[id] = {impl, mrr, name};
  calc();
}

function changeU(d) {
  const el = document.getElementById('uQty');
  el.value = Math.max(1, parseInt(el.value) + d);
  calc();
}

function setDev(v) { S.dev = v; calc(); }

function calc() {
  const users = parseInt(document.getElementById('uQty').value) || 1;
  const dImpl = parseFloat(document.getElementById('dImpl').value) || 0;
  const dMRR = parseFloat(document.getElementById('dMRR').value) || 0;

  // NOVA REGRA: R$ 799 por bloco de 50 usuários
  const sustQty = Math.ceil(users / 50);
  const sustBase = (S.type==='CROSS') ? 0 : (sustQty * 799);
  
  document.getElementById('sust-val-display').textContent = f(sustBase) + "/mês";

  let implGross = 0, mrrProds = 0;
  Object.values(S.sel).forEach(p => { implGross += p.impl; mrrProds += p.mrr; });

  const mrrGross = mrrProds + sustBase + (S.dev==='SIM'?750:0);
  const implFinal = implGross * (1 - dImpl/100);
  const mrrFinal = mrrGross * (1 - dMRR/100);

  document.getElementById('gb-impl').textContent = f(implFinal);
  document.getElementById('gb-mrr').textContent = f(mrrFinal);
  document.getElementById('gb-total').textContent = f(implFinal + (mrrFinal * 12));
  
  // Margem
  const arr = implFinal + (mrrFinal * 12);
  document.getElementById('mp-arr').textContent = f(arr);
}

function f(v) { return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
function gerarPDF() { window.print(); }
function limpar() { location.reload(); }
