const MINIMUMS = { NEWLOGO: { mrrMin: 2800, implMin: 5000 }, CROSS: { mrrMin: 1600, implMin: 0 } };
const CAT = {
  COMERCIAL: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Comercial','Diário de Vendas','Clientes','Mapa de Vendas','Comparativos','Produtos','Relatórios'], NL:[4999,1299], CR:[2999,1299] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[6999,1699], CR:[4999,1699] }, addons:[{name:'Mapa de Prospecção', NL:[999,199], CR:[999,199]},{name:'Correlação de Vendas', NL:[999,199], CR:[999,199]},{name:'Produtos e Oportunidades', NL:[999,199], CR:[999,199]},{name:'Variação Faturamento', NL:[999,199], CR:[999,199]},{name:'Cross Selling', NL:[999,199], CR:[999,199]}] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Strategic — pacote completo'], NL:[9999,1999], CR:[6999,1849] }, addons:[{name:'Atendimento Carteira de Clientes', NL:[1999,299], CR:[1999,299]},{name:'Orçamento de Vendas', NL:[1999,299], CR:[1999,299]},{name:'Rentabilidade', NL:[1999,299], CR:[1999,299]},{name:'Informações Financeiras a Receber', NL:[1999,299], CR:[1999,299]}] },
    FOCO: { core: { name:'Foco da Equipe', prods:['Foco da Equipe'], NL:[4999,1299], CR:[999,299] }, addons:[{name:'Foco da Equipe (Addon)', NL:[4999,1299], CR:[999,199]}] }
  },
  FINANCEIRA: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Financeiro','Contas a Receber','Contas a Pagar'], NL:[3999,1299], CR:[1999,1299] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[4999,1699], CR:[2999,1699] }, addons:[{name:'Avaliação Clientes', NL:[999,199], CR:[999,199]},{name:'Atrasos e Inadimplências', NL:[999,199], CR:[999,199]},{name:'Fluxo de Caixa', NL:[999,199], CR:[999,199]}] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Strategic — pacote completo'], NL:[19999,2999], CR:[19999,2999] }, addons:[{name:'Orçamento Financeiro', NL:[9999,699], CR:[9999,699]},{name:'DRE', NL:[19999,999], CR:[19999,999]}] }
  },
  SUPRIMENTOS: {
    SMART: { core: { name:'Smart Core', prods:['Estoque'], NL:[4999,1299], CR:[999,699] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Entradas','Aging Estoque','Rupturas'], NL:[3999,1699], CR:[1999,1699] }, addons:[] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Dashboard Suprimentos','Excesso de Estoque'], NL:[19999,2699], CR:[19999,2699] }, addons:[] }
  },
  BENEFICIOS: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Benefícios','Rebates'], NL:[1999,1299], CR:[1999,949] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[1999,949], CR:[1999,949] }, addons:[] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Validação Sellin'], NL:[6999,2599], CR:[6999,2599] }, addons:[{name:'Solar', NL:[1999,949], CR:[1999,949]}] }
  },
  POSVENDA: { SMART: { core: { name:'Smart Core', prods:['Dashboard Pós-Venda'], NL:[3999,1299], CR:[1999,949] }, addons:[] } },
  PROJETO: null
};

let S = { type: 'NEWLOGO', suite: 'COMERCIAL', tier: 'SMART', sel: {}, dev: 'SIM' };
let S_parcelas = 1;

window.onload = () => {
  document.getElementById('cDate').value = new Date().toISOString().split('T')[0];
  renderTiers(); renderProds(); calc();
};

function setType(t) { S.type = t; S.sel = {}; renderTiers(); renderProds(); calc(); }
function setSuite(s) { S.suite = s; S.tier = 'SMART'; document.getElementById('projeto-card').style.display = (s==='PROJETO'?'block':'none'); renderTiers(); renderProds(); calc(); }
function setTier(t) { S.tier = t; renderTiers(); renderProds(); }

function renderTiers() {
  const sd = CAT[S.suite]; if(!sd) return;
  let h = ''; Object.keys(sd).forEach(t => {
    const active = S.tier === t ? 'active smart' : '';
    h += `<div class="ttab ${active}" onclick="setTier('${t}')">${t}</div>`;
  });
  document.getElementById('tier-tabs-wrap').innerHTML = h;
}

function renderProds() {
  const td = CAT[S.suite] ? CAT[S.suite][S.tier] : null;
  if(!td) { document.getElementById('ptbody').innerHTML = ''; return; }
  const tk = S.type === 'NEWLOGO' ? 'NL' : 'CR';
  let h = `<tr><td><input type="checkbox" onchange="toggle('core', ${td.core[tk][0]}, ${td.core[tk][1]}, '${td.core.name}')"></td><td><strong>${td.core.name}</strong></td><td>CORE</td><td>${f(td.core[tk][0])}</td><td>${f(td.core[tk][1])}</td></tr>`;
  td.addons.forEach((a, i) => {
    h += `<tr><td><input type="checkbox" onchange="toggle('a${i}', ${a[tk][0]}, ${a[tk][1]}, '${a.name}')"></td><td>${a.name}</td><td>ADDON</td><td>${f(a[tk][0])}</td><td>${f(a[tk][1])}</td></tr>`;
  });
  document.getElementById('ptbody').innerHTML = h;
}

function toggle(id, impl, mrr, name) { if(S.sel[id]) delete S.sel[id]; else S.sel[id] = {impl, mrr, name}; calc(); }
function changeU(d) { const el = document.getElementById('uQty'); el.value = Math.max(1, parseInt(el.value) + d); calc(); }
function setDev(v) { S.dev = v; calc(); }
function f(v) { return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }

function calc() {
  const users = parseInt(document.getElementById('uQty').value) || 1;
  const dImpl = parseFloat(document.getElementById('dImpl').value) || 0;
  const dMRR = parseFloat(document.getElementById('dMRR').value) || 0;

  const sustQty = Math.ceil(users / 50);
  const sustBase = (S.type === 'CROSS') ? 0 : (sustQty * 799);
  document.getElementById('sust-val-display').textContent = f(sustBase);

  let implG = 0, mrrP = 0;
  Object.values(S.sel).forEach(p => { implG += p.impl; mrrP += p.mrr; });
  if(S.suite === 'PROJETO') {
    const pTot = (parseInt(document.getElementById('projHoras').value)||0) * (parseInt(document.getElementById('projValHora').value)||0);
    implG += pTot; document.getElementById('projTotal').textContent = f(pTot);
  }

  const mrrG = mrrP + sustBase + (S.dev === 'SIM' ? 750 : 0);
  const implF = implG * (1 - dImpl/100);
  const mrrF = mrrG * (1 - dMRR/100);

  document.getElementById('gb-impl').textContent = f(implF);
  document.getElementById('gb-mrr').textContent = f(mrrF) + "/mês";
  document.getElementById('gb-total').textContent = f(implF + (mrrF * 12));
  document.getElementById('mp-arr').textContent = f(implF + (mrrF * 12));
  
  // Sidebar Lines
  let ih = '', mh = '';
  Object.values(S.sel).forEach(p => { 
    if(p.impl > 0) ih += `<div class="sval-row"><span>${p.name}</span><span>${f(p.impl)}</span></div>`;
    if(p.mrr > 0) mh += `<div class="sval-row"><span>${p.name}</span><span>${f(p.mrr)}</span></div>`;
  });
  document.getElementById('impl-lines').innerHTML = ih || 'Selecione produtos';
  document.getElementById('mrr-lines').innerHTML = mh || 'Selecione produtos';
}
