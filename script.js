// ═══════════════════════════════════════════════════
//  DATA E CONFIGURAÇÕES ORIGINAIS
// ═══════════════════════════════════════════════════
const MINIMUMS = {
  NEWLOGO:   { mrrMin: 2800, implMin: 5000, label: 'New Logo' },
  NEWLOGOSH: { mrrMin: 1600, implMin: 5000, label: 'New Logo S/Hora' },
  CROSS:     { mrrMin: 1600, implMin: 0,    label: 'Cross'    },
};

const CAT = {
  COMERCIAL: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Comercial','Diário de Vendas','Clientes','Mapa de Vendas','Comparativos','Produtos','Relatórios'], NL:[4999,1299], CR:[2999,1299] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[6999,1699], CR:[4999,1699] }, addons:[{name:'Mapa de Prospecção', NL:[999,199], CR:[999,199]},{name:'Correlação de Vendas', NL:[999,199], CR:[999,199]},{name:'Produtos e Oportunidades', NL:[999,199], CR:[999,199]},{name:'Variação Faturamento', NL:[999,199], CR:[999,199]},{name:'Cross Selling', NL:[999,199], CR:[999,199]}] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Strategic — pacote completo'], NL:[9999,1999], CR:[6999,1849] }, addons:[{name:'Atendimento Carteira de Clientes', NL:[1999,299], CR:[1999,299]},{name:'Orçamento de Vendas', NL:[1999,299], CR:[1999,299]},{name:'Rentabilidade', NL:[1999,299], CR:[1999,299]},{name:'Informações Financeiras a Receber', NL:[1999,299], CR:[1999,299]}] },
    FOCO: { core: { name:'Foco da Equipe', prods:['Foco da Equipe'], NL:[4999,1299], CR:[999,299] }, addons:[{name:'Foco da Equipe (Addon)', NL:[4999,1299], CR:[999,199]}] },
  },
  FINANCEIRA: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Financeiro','Contas a Receber','Det. Contas a Receber','Contas a Pagar','Det. Contas a Pagar'], NL:[3999,1299], CR:[1999,1299] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[4999,1699], CR:[2999,1699] }, addons:[{name:'Avaliação Clientes', NL:[999,199], CR:[999,199]},{name:'Atrasos e Inadimplências', NL:[999,199], CR:[999,199]},{name:'Fluxo de Caixa', NL:[999,199], CR:[999,199]}] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Strategic — pacote completo'], NL:[19999,2999], CR:[19999,2999] }, addons:[{name:'Orçamento Financeiro', NL:[9999,699], CR:[9999,699]},{name:'DRE', NL:[19999,999],CR:[19999,999]}] },
  },
  SUPRIMENTOS: {
    SMART: { core: { name:'Smart Core', prods:['Estoque'], NL:[4999,1299], CR:[999,699] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Entradas','Aging Estoque','Rupturas'], NL:[3999,1699], CR:[1999,1699] }, addons:[] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Dashboard Suprimentos','Excesso de Estoque','Rupturas Avançada','Estoque Desbalanceado','Necessidade de Transferências','Necessidade de Compras'], NL:[19999,2699], CR:[19999,2699] }, addons:[] },
  },
  BENEFICIOS: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Benefícios','Regras','Rebates','Price Protection','Stock Rotation'], NL:[1999,1299], CR:[1999,949] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[1999,949], CR:[1999,949] }, addons:[] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Validação Sellin','Validação Sellout'], NL:[6999,2599], CR:[6999,2599] }, addons:[{name:'Solar', NL:[1999,949], CR:[1999,949]}] },
  },
  POSVENDA: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Pós-Venda','Desempenho','Relatórios'], NL:[3999,1299], CR:[1999,949] }, addons:[] },
  },
  PROJETO: null,
};

const S = { type:'NEWLOGO', suite:'COMERCIAL', tier:'SMART', sel:{}, dev:'SIM' };
let S_parcelas = 1;

window.onload=()=>{
  document.getElementById('cDate').value = new Date().toISOString().split('T')[0];
  setDev('SIM'); renderTiers(); renderProds(); calc();
};

function setType(t){
  S.type=t; S.sel={};
  ['NEWLOGO','CROSS'].forEach(x=>document.getElementById('tb-'+x).classList.toggle('active',x===t));
  document.getElementById('type-alert-txt').textContent = t==='NEWLOGO' 
    ? 'New Logo: implantação completa + recorrência mensal. MRR mínimo: R$ 2.800 | Implantação mínima: R$ 5.000.'
    : 'Cross/Upsell: preços diferenciados para clientes com contrato ativo. MRR mínimo: R$ 1.600 | Sem implantação mínima.';
  renderTiers(); renderProds(); calc();
}

function setSuite(s){
  S.suite=s; S.tier='SMART';
  document.querySelectorAll('.suite-btn').forEach(b=>b.classList.remove('sel'));
  document.getElementById('sb-'+s).classList.add('sel');
  const isProjeto = s==='PROJETO';
  document.getElementById('projeto-card').style.display = isProjeto ? 'block' : 'none';
  document.getElementById('tier-tabs-wrap').style.display = isProjeto ? 'none' : '';
  document.getElementById('ptbody').closest('table').style.display = isProjeto ? 'none' : '';
  renderTiers(); renderProds(); calc();
}

function renderTiers(){
  const suiteData = CAT[S.suite]; if(!suiteData) return;
  const tierMeta={ SMART:{lbl:'⚡ Smart',cls:'smart'}, SCALE:{lbl:'📈 Scale',cls:'scale'}, STRATEGIC:{lbl:'🏆 Strategic',cls:'strategic'}, FOCO:{lbl:'👥 Foco',cls:'other'} };
  let h='<div class="tier-tabs">';
  Object.keys(suiteData).forEach(t=>{
    const m=tierMeta[t]||{lbl:t,cls:'other'};
    const a=S.tier===t?'active':'';
    h+=`<div class="ttab ${m.cls} ${a}" onclick="setTier('${t}')">${m.lbl}</div>`;
  });
  h+='</div>';
  document.getElementById('tier-tabs-wrap').innerHTML=h;
}

function setTier(t){ S.tier=t; renderTiers(); renderProds(); }

function renderProds(){
  if(S.suite==='PROJETO'){ document.getElementById('ptbody').innerHTML=''; return; }
  const tierData=CAT[S.suite][S.tier];
  const typeKey=S.type==='NEWLOGO'?'NL':'CR';
  let h='';
  const ck=`${S.suite}-${S.tier}-CORE`;
  const cd=tierData.core;
  h+=`<tr><td><input class="pchk" type="checkbox" ${S.sel[ck]?'checked':''} onchange="toggle('${ck}',${cd[typeKey][0]},${cd[typeKey][1]},'${escQ(cd.name)}',false)"></td><td><strong>${cd.name}</strong><div style="font-size:10px;color:var(--muted);margin-top:1px">${cd.prods.join(' · ')}</div></td><td><span class="badge-core">CORE</span></td><td class="pimpl">${f(cd[typeKey][0])}</td><td class="pval">${f(cd[typeKey][1])}/mês</td></tr>`;
  (tierData.addons||[]).forEach((a,i)=>{
    const ak=`${S.suite}-${S.tier}-ADDON-${i}`;
    h+=`<tr><td><input class="pchk" type="checkbox" ${S.sel[ak]?'checked':''} onchange="toggle('${ak}',${a[typeKey][0]},${a[typeKey][1]},'${escQ(a.name)}',true)"></td><td style="padding-left:18px">${a.name}</td><td><span class="badge-addon">ADD-ON</span></td><td class="pimpl">${f(a[typeKey][0])}</td><td class="pval">${f(a[typeKey][1])}/mês</td></tr>`;
  });
  document.getElementById('ptbody').innerHTML=h;
}

function toggle(k,impl,mrr,name,isAddon){ if(S.sel[k]) delete S.sel[k]; else S.sel[k]={impl,mrr,name,isAddon,suite:S.suite,tier:S.tier}; calc(); }
function changeHoras(d){ const el=document.getElementById('projHoras'); el.value=Math.max(0,(parseInt(el.value)||0)+d); calc(); }
function changeU(d){ const el=document.getElementById('uQty'); el.value=Math.max(1,(parseInt(el.value)||0)+d); calc(); }
function setDev(v){ S.dev=v; ['NAO','SIM','NAOSE','HORA'].forEach(x=>document.getElementById('dev-'+x).classList.toggle('active',x===v)); calc(); }
function setParcelas(n){ S_parcelas = n; document.querySelectorAll('.parcela-btn').forEach(b=>b.classList.toggle('active', +b.dataset.p === n)); calc(); }

// ═══════════════════════════════════════════════════
//  CALCULA A NOVA REGRA DE USUÁRIOS
// ═══════════════════════════════════════════════════
function calc(){
  const users  = parseInt(document.getElementById('uQty').value)||1;
  const dImpl  = Math.max(0,Math.min(100,parseFloat(document.getElementById('dImpl').value)||0));
  const dMRR   = Math.max(0,Math.min(100,parseFloat(document.getElementById('dMRR').value)||0));

  // Lógica dos Pacotes de Sustentação
  let pacotesTotais = Math.ceil(users / 50);
  if (pacotesTotais < 1) pacotesTotais = 1;
  
  let pacotesCobrados = 0;
  if (S.type === 'NEWLOGO') {
      pacotesCobrados = pacotesTotais; // Todos os pacotes são cobrados
  } else {
      pacotesCobrados = Math.max(0, pacotesTotais - 1); // 1º pacote já incluso no Cross
  }
  const sustBase = pacotesCobrados * 799;

  let implGross=0, mrrProds=0;
  const prods=Object.values(S.sel);
  prods.forEach(p=>{implGross+=p.impl; mrrProds+=p.mrr;});

  const isProjeto = S.suite==='PROJETO';
  let projImplGross=0, projCusto=0;
  if(isProjeto){
    const horas = parseInt(document.getElementById('projHoras').value)||0;
    const valHora = parseFloat(document.getElementById('projValHora').value)||275;
    projImplGross = horas * valHora; projCusto = horas * 150;
    document.getElementById('projTotal').textContent = f(projImplGross);
    document.getElementById('proj-min-alert').style.display = valHora < 150 ? 'flex' : 'none';
    implGross += projImplGross;
  }

  const devMRR = S.dev==='SIM' ? 750 : 0;
  const mrrGross = isProjeto ? 0 : mrrProds + sustBase + devMRR;

  // Atualiza Visual do Card de Sustentação/Usuários
  const crossSustMsg = (S.type === 'CROSS' && pacotesCobrados === 0);
  document.getElementById('sust-base-card').style.display = crossSustMsg ? 'none' : 'flex';
  document.getElementById('sust-cross-msg').style.display = crossSustMsg ? 'block' : 'none';
  document.getElementById('sust-val-display').textContent = f(sustBase) + "/mês";
  document.getElementById('sust-lbl-pacotes').textContent = `${pacotesCobrados} pacote(s) extra(s)`;

  // Descontos e Total
  const implFinal = implGross * (1 - dImpl/100);
  const mrrFinal  = mrrGross  * (1 - dMRR/100);
  const grandTotal = isProjeto ? implFinal : implFinal + mrrFinal*12;

  // Faixas de Desconto
  function faixaInfo(pct,campo){
    if(pct===0) return{cls:'ok',txt:`✅ ${campo}: Consultor (0%)`};
    if(pct<=15) return{cls:'ok',txt:`✅ ${campo}: Consultor (${pct}%)`};
    if(pct<=35) return{cls:'warn',txt:`⚠️ ${campo}: Diretor (${pct}%)`};
    return{cls:'danger',txt:`🚨 ${campo}: Comitê (${pct}%)`};
  }
  document.getElementById('dfx-impl').className = `dfx ${faixaInfo(dImpl,'Impl.').cls}`;
  document.getElementById('dfx-impl').textContent = faixaInfo(dImpl,'Impl.').txt;
  document.getElementById('dfx-mrr').className = `dfx ${faixaInfo(dMRR,'MRR').cls}`;
  document.getElementById('dfx-mrr').textContent = faixaInfo(dMRR,'MRR').txt;

  const da=document.getElementById('disc-alert');
  if(dImpl>35||dMRR>35){ da.style.display='flex'; da.className='alert danger'; da.innerHTML='🚨 Desconto > 35%: requer aprovação do Comitê de Ofertas.'; } 
  else if(dImpl>15||dMRR>15){ da.style.display='flex'; da.className='alert warn'; da.innerHTML='⚠️ Desconto > 15%: requer aprovação do Diretor Sewe.'; } 
  else { da.style.display='none'; }

  // Margem Interna
  const minKey = S.type==='NEWLOGO'?'NEWLOGO':'CROSS';
  const arrMin = isProjeto ? projCusto : (MINIMUMS[minKey].implMin + MINIMUMS[minKey].mrrMin*12);
  const lucrat = grandTotal>0 ? ((grandTotal - arrMin) / grandTotal) * 100 : 0;
  
  document.getElementById('mp-arr').textContent = f(grandTotal);
  document.getElementById('mp-arr-min').textContent = (isProjeto && implFinal>0) ? (((implFinal - projCusto) / implFinal) * 100).toFixed(1)+'%' : lucrat.toFixed(1)+'%';
  document.getElementById('mp-mrr-neg').textContent  = f(mrrFinal)+'/mês';
  document.getElementById('mp-mrr-min').textContent  = f(MINIMUMS[minKey].mrrMin)+'/mês';
  document.getElementById('mp-impl-neg').textContent = f(implFinal);
  document.getElementById('mp-impl-min').textContent = f(isProjeto ? projCusto : arrMin);
  
  const barPct = Math.max(0, Math.min(100, lucrat));
  document.getElementById('mp-bar').style.width = barPct+'%';
  
  // Resumo Sidebar
  document.getElementById('gb-impl').textContent = f(implFinal);
  document.getElementById('gb-mrr').innerHTML = isProjeto ? '—' : `${f(mrrFinal)}<span style="font-size:11px">/mês</span>`;
  document.getElementById('gb-total').textContent = f(grandTotal);
  document.getElementById('gb-arr').textContent  = f(grandTotal);
  document.getElementById('sb-cname').textContent = document.getElementById('cName').value||'—';

  // Renderiza Linhas Sidebar
  let ih='', mh='';
  prods.filter(p=>p.impl>0).forEach(p=> ih+=`<div class="sval-row"><span class="sval-lbl">${p.name}</span><span class="sval-val">${f(p.impl)}</span></div>`);
  prods.filter(p=>p.mrr>0).forEach(p=> mh+=`<div class="sval-row"><span class="sval-lbl">${p.name}</span><span class="sval-val">${f(p.mrr)}/mês</span></div>`);
  if(pacotesCobrados > 0) mh+=`<div class="sval-row sval-indent"><span class="sval-lbl">Sustentação (${pacotesCobrados}x pacote)</span><span class="sval-val">${f(sustBase)}/mês</span></div>`;
  if(devMRR>0) mh+=`<div class="sval-row sval-indent"><span class="sval-lbl">Desenvolvimento</span><span class="sval-val">${f(devMRR)}/mês</span></div>`;
  
  document.getElementById('impl-lines').innerHTML = ih || '<div style="text-align:center;color:var(--muted);font-size:11px">Sem produtos</div>';
  document.getElementById('mrr-lines').innerHTML = mh || '<div style="text-align:center;color:var(--muted);font-size:11px">Sem recorrente</div>';
}

function gerarPDF(){ window.print(); }
function limpar(){ location.reload(); }
function f(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function escQ(s){ return s.replace(/'/g,"\\'"); }
function abrirAdmin(){ document.getElementById('admin-overlay').style.display='flex'; }
function fecharAdmin(){ document.getElementById('admin-overlay').style.display='none'; }
// Mantenha as outras funções de Admin que já estavam no arquivo... (renderAdminSuite, etc)
