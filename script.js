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
    FOCO: { core: { name:'Foco da Equipe', prods:['Foco da Equipe'], NL:[4999,1299], CR:[999,299] }, addons:[{name:'Foco da Equipe (Addon)', NL:[4999,1299], CR:[999,199]}] }
  },
  FINANCEIRA: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Financeiro','Contas a Receber','Det. Contas a Receber','Contas a Pagar','Det. Contas a Pagar'], NL:[3999,1299], CR:[1999,1299] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[4999,1699], CR:[2999,1699] }, addons:[{name:'Avaliação Clientes', NL:[999,199], CR:[999,199]},{name:'Atrasos e Inadimplências', NL:[999,199], CR:[999,199]},{name:'Fluxo de Caixa', NL:[999,199], CR:[999,199]}] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Strategic — pacote completo'], NL:[19999,2999], CR:[19999,2999] }, addons:[{name:'Orçamento Financeiro', NL:[9999,699], CR:[9999,699]},{name:'DRE', NL:[19999,999],CR:[19999,999]}] }
  },
  SUPRIMENTOS: {
    SMART: { core: { name:'Smart Core', prods:['Estoque'], NL:[4999,1299], CR:[999,699] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Entradas','Aging Estoque','Rupturas'], NL:[3999,1699], CR:[1999,1699] }, addons:[] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Dashboard Suprimentos','Excesso de Estoque','Rupturas Avançada','Estoque Desbalanceado','Necessidade de Transferências','Necessidade de Compras'], NL:[19999,2699], CR:[19999,2699] }, addons:[] }
  },
  BENEFICIOS: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Benefícios','Regras','Rebates','Price Protection','Stock Rotation'], NL:[1999,1299], CR:[1999,949] }, addons:[] },
    SCALE: { core: { name:'Scale Core', prods:['Scale — pacote completo'], NL:[1999,949], CR:[1999,949] }, addons:[] },
    STRATEGIC: { core: { name:'Strategic Core', prods:['Validação Sellin','Validação Sellout'], NL:[6999,2599], CR:[6999,2599] }, addons:[{name:'Solar', NL:[1999,949], CR:[1999,949]}] }
  },
  POSVENDA: {
    SMART: { core: { name:'Smart Core', prods:['Dashboard Pós-Venda','Desempenho','Relatórios'], NL:[3999,1299], CR:[1999,949] }, addons:[] }
  },
  PROJETO: null
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
  if(!tierData){ document.getElementById('ptbody').innerHTML=''; return; }
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
function f(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
function escQ(s){ return s.replace(/'/g,"\\'"); }
function clearErr(el){ if(el.value.trim()) el.style.borderColor=''; }

// ═══════════════════════════════════════════════════
//  CALCULA A NOVA REGRA DE USUÁRIOS
// ═══════════════════════════════════════════════════
function calc(){
  const users  = parseInt(document.getElementById('uQty').value)||1;
  const dImpl  = Math.max(0,Math.min(100,parseFloat(document.getElementById('dImpl').value)||0));
  const dMRR   = Math.max(0,Math.min(100,parseFloat(document.getElementById('dMRR').value)||0));

  let pacotesTotais = Math.ceil(users / 50);
  if (pacotesTotais < 1) pacotesTotais = 1;
  
  let pacotesCobrados = 0;
  if (S.type === 'NEWLOGO') {
      pacotesCobrados = pacotesTotais; 
  } else {
      pacotesCobrados = Math.max(0, pacotesTotais - 1); 
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

  const crossSustMsg = (S.type === 'CROSS' && pacotesCobrados === 0);
  const sustCard = document.getElementById('sust-base-card');
  const crossMsg = document.getElementById('sust-cross-msg');
  if (sustCard) sustCard.style.display = crossSustMsg ? 'none' : 'flex';
  if (crossMsg) crossMsg.style.display = crossSustMsg ? 'block' : 'none';
  
  const sustDisp = document.getElementById('sust-val-display');
  if (sustDisp) sustDisp.textContent = f(sustBase) + "/mês";
  
  const sustLbl = document.getElementById('sust-lbl-pacotes');
  if (sustLbl) sustLbl.textContent = S.type === 'NEWLOGO' ? `${pacotesCobrados} pacote(s) de R$ 799` : `${pacotesCobrados} pacote(s) extra(s)`;

  const implFinal = implGross * (1 - dImpl/100);
  const mrrFinal  = mrrGross  * (1 - dMRR/100);
  const grandTotal = isProjeto ? implFinal : implFinal + mrrFinal*12;

  function faixaInfo(pct,campo){
    if(pct===0) return{cls:'ok',txt:`✅ ${campo}: Consultor (0%)`};
    if(pct<=15) return{cls:'ok',txt:`✅ ${campo}: Consultor (${pct}%)`};
    if(pct<=35) return{cls:'warn',txt:`⚠️ ${campo}: Diretor (${pct}%)`};
    return{cls:'danger',txt:`🚨 ${campo}: Comitê (${pct}%)`};
  }
  if (document.getElementById('dfx-impl')){
      document.getElementById('dfx-impl').className = `dfx ${faixaInfo(dImpl,'Impl.').cls}`;
      document.getElementById('dfx-impl').textContent = faixaInfo(dImpl,'Impl.').txt;
  }
  if (document.getElementById('dfx-mrr')){
      document.getElementById('dfx-mrr').className = `dfx ${faixaInfo(dMRR,'MRR').cls}`;
      document.getElementById('dfx-mrr').textContent = faixaInfo(dMRR,'MRR').txt;
  }

  const da=document.getElementById('disc-alert');
  if(da){
      if(dImpl>35||dMRR>35){ da.style.display='flex'; da.className='alert danger'; da.innerHTML='🚨 Desconto > 35%: requer aprovação do Comitê de Ofertas.'; } 
      else if(dImpl>15||dMRR>15){ da.style.display='flex'; da.className='alert warn'; da.innerHTML='⚠️ Desconto > 15%: requer aprovação do Diretor Sewe.'; } 
      else { da.style.display='none'; }
  }

  const minKey = S.type==='NEWLOGO'?'NEWLOGO':'CROSS';
  const arrMin = isProjeto ? projCusto : (MINIMUMS[minKey].implMin + MINIMUMS[minKey].mrrMin*12);
  const lucrat = grandTotal>0 ? ((grandTotal - arrMin) / grandTotal) * 100 : 0;
  
  if (document.getElementById('mp-arr')) document.getElementById('mp-arr').textContent = f(grandTotal);
  if (document.getElementById('mp-arr-min')) document.getElementById('mp-arr-min').textContent = (isProjeto && implFinal>0) ? (((implFinal - projCusto) / implFinal) * 100).toFixed(1)+'%' : lucrat.toFixed(1)+'%';
  if (document.getElementById('mp-mrr-neg')) document.getElementById('mp-mrr-neg').textContent  = f(mrrFinal)+'/mês';
  if (document.getElementById('mp-mrr-min')) document.getElementById('mp-mrr-min').textContent  = f(MINIMUMS[minKey].mrrMin)+'/mês';
  if (document.getElementById('mp-impl-neg')) document.getElementById('mp-impl-neg').textContent = f(implFinal);
  if (document.getElementById('mp-impl-min')) document.getElementById('mp-impl-min').textContent = f(isProjeto ? projCusto : arrMin);
  
  if (document.getElementById('mp-bar')){
      const barPct = Math.max(0, Math.min(100, lucrat));
      document.getElementById('mp-bar').style.width = barPct+'%';
  }
  
  if (document.getElementById('gb-impl')) document.getElementById('gb-impl').textContent = f(implFinal);
  if (document.getElementById('gb-mrr')) document.getElementById('gb-mrr').innerHTML = isProjeto ? '—' : `${f(mrrFinal)}<span style="font-size:11px">/mês</span>`;
  if (document.getElementById('gb-total')) document.getElementById('gb-total').textContent = f(grandTotal);
  if (document.getElementById('gb-arr')) document.getElementById('gb-arr').textContent  = f(grandTotal);
  if (document.getElementById('sb-cname')) document.getElementById('sb-cname').textContent = document.getElementById('cName').value||'—';

  let ih='', mh='';
  prods.filter(p=>p.impl>0).forEach(p=> ih+=`<div class="sval-row"><span class="sval-lbl">${p.name}</span><span class="sval-val">${f(p.impl)}</span></div>`);
  prods.filter(p=>p.mrr>0).forEach(p=> mh+=`<div class="sval-row"><span class="sval-lbl">${p.name}</span><span class="sval-val">${f(p.mrr)}/mês</span></div>`);
  if(pacotesCobrados > 0) mh+=`<div class="sval-row sval-indent"><span class="sval-lbl">Sustentação (${pacotesCobrados}x pacote)</span><span class="sval-val">${f(sustBase)}/mês</span></div>`;
  if(devMRR>0) mh+=`<div class="sval-row sval-indent"><span class="sval-lbl">Desenvolvimento</span><span class="sval-val">${f(devMRR)}/mês</span></div>`;
  
  if (document.getElementById('impl-lines')) document.getElementById('impl-lines').innerHTML = ih || '<div style="text-align:center;color:var(--muted);font-size:11px">Sem produtos</div>';
  if (document.getElementById('mrr-lines')) document.getElementById('mrr-lines').innerHTML = mh || '<div style="text-align:center;color:var(--muted);font-size:11px">Sem recorrente</div>';
}

// ═══════════════════════════════════════════════════
//  GERA O PDF DA PROPOSTA OFICIAL (DOCUMENTO EXTERNO)
// ═══════════════════════════════════════════════════
function gerarPDF(){
  const reqFields = [{id:'cName',label:'Nome do Cliente'},{id:'cContact',label:'Contato'},{id:'cConsult',label:'Consultor Responsável'}];
  const missing = reqFields.filter(fx=>{ const el = document.getElementById(fx.id); return !el || !el.value.trim(); });
  if(missing.length>0){
    reqFields.forEach(fx=>{ const el=document.getElementById(fx.id); if(el) el.style.borderColor = el.value.trim() ? 'var(--border)' : 'var(--danger)'; });
    alert('⚠️ Preencha os campos obrigatórios antes de gerar a proposta:\n\n' + missing.map(fx=>'• '+fx.label).join('\n'));
    return;
  }
  reqFields.forEach(fx=>{ const el = document.getElementById(fx.id); if(el) el.style.borderColor=''; });

  const cname   = document.getElementById('cName').value || '—';
  const contact = document.getElementById('cContact') ? document.getElementById('cContact').value : '—';
  const consult = document.getElementById('cConsult') ? document.getElementById('cConsult').value : '—';
  const cdate   = document.getElementById('cDate') ? document.getElementById('cDate').value : '';
  const notes   = document.getElementById('propNotes') ? document.getElementById('propNotes').value : '';
  const dImpl   = parseFloat(document.getElementById('dImpl').value) || 0;
  const dMRR    = parseFloat(document.getElementById('dMRR').value) || 0;
  const dReason = document.getElementById('dReason') ? document.getElementById('dReason').value : '';
  
  const users   = parseInt(document.getElementById('uQty').value) || 1;
  let pacotesTotais = Math.ceil(users / 50);
  if (pacotesTotais < 1) pacotesTotais = 1;
  let pacotesCobrados = S.type === 'NEWLOGO' ? pacotesTotais : Math.max(0, pacotesTotais - 1);
  const sustVal = pacotesCobrados * 799;

  const prods   = Object.values(S.sel);
  const devMRR  = S.dev==='SIM' ? 750 : 0;
  const isProjeto = S.suite==='PROJETO';
  const projHoras   = isProjeto && document.getElementById('projHoras') ? (parseInt(document.getElementById('projHoras').value)||0) : 0;
  const projValHora = isProjeto && document.getElementById('projValHora') ? (parseFloat(document.getElementById('projValHora').value)||275) : 0;
  const projDesc    = isProjeto && document.getElementById('projDesc') ? document.getElementById('projDesc').value : '';
  const projImplGross = projHoras * projValHora;

  let implGross=0, mrrProds=0;
  prods.forEach(p=>{ implGross+=p.impl; mrrProds+=p.mrr; });
  implGross += projImplGross;

  const mrrGross = isProjeto ? 0 : (mrrProds + sustVal + devMRR);
  const implFinal = implGross * (1 - dImpl/100);
  const mrrFinal  = mrrGross  * (1 - dMRR/100);

  const dateStr = cdate ? new Date(cdate+'T00:00:00').toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
  const suiteName = {COMERCIAL:'Comercial',FINANCEIRA:'Financeira',SUPRIMENTOS:'Suprimentos',BENEFICIOS:'Benefícios',POSVENDA:'Pós-Venda'};
  const suiteColor= {COMERCIAL:'#dbeafe|#1d4ed8',FINANCEIRA:'#d1fae5|#065f46',SUPRIMENTOS:'#ede9fe|#6d28d9',BENEFICIOS:'#fee2e2|#b91c1c',POSVENDA:'#fef3c7|#92400e'};

  const prodRows = prods.map(p=>{
    const sc = p.suite ? suiteColor[p.suite]||'#f3f4f6|#374151' : '';
    const [bg,fg] = sc ? sc.split('|') : ['#f3f4f6','#374151'];
    const tag = p.suite ? `<span style="background:${bg};color:${fg};font-size:8px;font-weight:700;padding:2px 7px;border-radius:10px;text-transform:uppercase;margin-right:6px">${suiteName[p.suite]||p.suite}</span>` : '';
    const typetag = `<span style="background:#f0f9ff;color:#0369a1;border:1px solid #bae6fd;font-size:8px;font-weight:700;padding:1px 6px;border-radius:8px;margin-left:4px">${p.isAddon?'Add-on':'Core'}</span>`;
    return `<tr><td>${tag}${p.name}${typetag}</td><td style="text-align:right">${p.impl>0?f(p.impl):'—'}</td><td style="text-align:right">${f(p.mrr)}<span style="font-size:9px">/mês</span></td></tr>`;
  }).join('');

  let lblSustentacao = S.type === 'NEWLOGO' 
    ? `Sustentação Base + Licenciamento (${pacotesCobrados}x pacote até 50 usuários)` 
    : `Sustentação Adicional (${pacotesCobrados}x pacote extra)`;
  if(S.type === 'CROSS' && pacotesCobrados === 0){ lblSustentacao = `Sustentação & Licenciamento (Cota inicial Cross inclusa)`; }

  const infraRows = `
    <tr style="background:#fafbfc"><td style="color:#555;font-size:10px">${lblSustentacao}</td><td style="text-align:right;color:#555;font-size:10px">—</td><td style="text-align:right;color:#555;font-size:10px">${sustVal > 0 ? f(sustVal) : 'R$ 0,00'}<span style="font-size:9px">/mês</span></td></tr>
    ${devMRR>0 ? `<tr style="background:#fafbfc"><td style="color:#555;font-size:10px">Pacote Desenvolvimento (+5h/mês)</td><td style="text-align:right;color:#555;font-size:10px">—</td><td style="text-align:right;color:#555;font-size:10px">${f(devMRR)}<span style="font-size:9px">/mês</span></td></tr>` : ''}
    ${dImpl>0 ? `<tr><td style="color:#dc2626;font-size:10px" colspan="2">Desconto Implantação (${dImpl}%)${dReason?' — '+dReason:''}</td><td style="text-align:right;color:#dc2626;font-size:10px">−${f(implGross*dImpl/100)}</td></tr>` : ''}
    ${dMRR>0  ? `<tr><td style="color:#dc2626;font-size:10px" colspan="2">Desconto Recorrência (${dMRR}%)</td><td style="text-align:right;color:#dc2626;font-size:10px">−${f(mrrGross*dMRR/100)}<span style="font-size:9px">/mês</span></td></tr>` : ''}`;

  const parcelasAtuais = typeof S_parcelas !== 'undefined' ? S_parcelas : 1;
  const parcelaTexto = parcelasAtuais === 1 ? 'À vista — 7 dias após assinatura' : `${parcelasAtuais}× de ${f(implFinal/parcelasAtuais)} sem juros`;

  let bodyHTML = '';
  if(isProjeto){
    const projFinal = projImplGross*(1-dImpl/100);
    bodyHTML = `
      <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:10px;padding:18px 20px;margin-bottom:16px;page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:20px">
          <div><div style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#0e2a5c">🔨 Desenvolvimento Sewe Group</div><div style="font-size:12px;color:#555;margin-top:5px">${projHoras} horas × R$ ${projValHora}/h</div>${projDesc?`<div style="font-size:11px;color:#444;margin-top:10px;padding-top:10px;border-top:1px solid #d1fae5;line-height:1.6"><strong>Escopo:</strong><br>${projDesc}</div>`:''}</div>
          <div style="text-align:right;flex-shrink:0">${dImpl>0?`<div style="font-size:11px;color:#dc2626">Desconto ${dImpl}%: −${f(projImplGross*dImpl/100)}</div>`:''}<div style="font-family:'Sora',sans-serif;font-size:20px;font-weight:800;color:#0e2a5c">${f(projFinal)}</div></div>
        </div>
      </div>
      <div style="background:#0e2a5c;border-radius:10px;padding:16px 24px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="color:rgba(255,255,255,.6);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px">Investimento Total do Projeto</div><div style="font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff">${f(projFinal)}</div></div>
      <div style="background:#f8f9fc;border-radius:10px;padding:16px 20px;page-break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7b8199;margin-bottom:12px">CONDIÇÕES COMERCIAIS</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">💳</span><div><strong style="display:block;color:#0e2a5c">Pagamento</strong>100% antecipado ou conforme contrato</div></div><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">📅</span><div><strong style="display:block;color:#0e2a5c">Prazo de Execução</strong>A definir após kick-off do projeto</div></div><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">⏱</span><div><strong style="display:block;color:#0e2a5c">Validade</strong>15 dias úteis</div></div><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">➕</span><div><strong style="display:block;color:#0e2a5c">Horas excedentes</strong>R$ 275/h com aprovação prévia</div></div></div></div>
      ${notes?`<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-top:14px;font-size:11px;page-break-inside:avoid"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#92400e;margin-bottom:6px">OBSERVAÇÕES</div>${notes.replace(/\n/g,'<br>')}</div>`:''}`;
  } else {
    bodyHTML = `
      <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0e2a5c;margin-bottom:10px;display:flex;align-items:center;gap:8px">OFERTA NEGOCIADA<span style="flex:1;height:1px;background:#e5e7eb;display:block"></span></div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:14px;page-break-inside:avoid">
        <thead><tr><th style="background:#0e2a5c;color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 14px;text-align:left;-webkit-print-color-adjust:exact;print-color-adjust:exact">Solução</th><th style="background:#0e2a5c;color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 14px;text-align:right;-webkit-print-color-adjust:exact;print-color-adjust:exact">Implantação</th><th style="background:#0e2a5c;color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:10px 14px;text-align:right;-webkit-print-color-adjust:exact;print-color-adjust:exact">Recorrência</th></tr></thead>
        <tbody>
          ${prodRows}${infraRows}
          <tr style="background:#0e2a5c;-webkit-print-color-adjust:exact;print-color-adjust:exact"><td style="padding:12px 14px;color:#fff;font-weight:700;font-size:12px"><strong>TOTAL</strong></td><td style="padding:12px 14px;text-align:right;color:#0ab5a0;font-weight:700;font-size:14px;font-family:'Sora',sans-serif">${f(implFinal)}</td><td style="padding:12px 14px;text-align:right;color:#0ab5a0;font-weight:700;font-size:14px;font-family:'Sora',sans-serif">${f(mrrFinal)}<span style="font-size:10px">/mês</span></td></tr>
        </tbody>
      </table>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;page-break-inside:avoid">
        <div style="background:#0e2a5c;border-radius:10px;padding:16px 20px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.6);margin-bottom:6px">IMPLANTAÇÃO</div><div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:#fff;line-height:1">${f(implFinal)}</div><div style="font-size:9px;color:rgba(255,255,255,.5);margin-top:4px">Cobrança única</div></div>
        <div style="background:#0ab5a0;border-radius:10px;padding:16px 20px;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,.7);margin-bottom:6px">RECORRÊNCIA MENSAL</div><div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:#fff;line-height:1">${f(mrrFinal)}</div><div style="font-size:9px;color:rgba(255,255,255,.6);margin-top:4px">por mês</div></div>
      </div>
      <div style="background:#f8f9fc;border-radius:10px;padding:16px 20px;page-break-inside:avoid">
        <div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7b8199;margin-bottom:12px">CONDIÇÕES COMERCIAIS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">💳</span><div><strong style="display:block;color:#0e2a5c">Pagamento Implantação</strong>${parcelaTexto}</div></div><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">🚀</span><div><strong style="display:block;color:#0e2a5c">Implantação</strong>Até 30 dias úteis após liberação do banco de dados</div></div><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">⏱</span><div><strong style="display:block;color:#0e2a5c">Validade</strong>15 dias úteis a partir desta data</div></div><div style="display:flex;gap:10px;font-size:11px;line-height:1.5"><span style="font-size:16px">🔄</span><div><strong style="display:block;color:#0e2a5c">Renovação</strong>Automática anual, salvo aviso 30 dias antes</div></div></div>
      </div>
      ${notes?`<div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-top:14px;font-size:11px;page-break-inside:avoid"><div style="font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#92400e;margin-bottom:6px">OBSERVAÇÕES</div>${notes.replace(/\n/g,'<br>')}</div>`:''}`;
  }

  const clientesList = ['MULTISEG','TRANSOL','INTERSAT','PET LINE','PPA','KGMlan','MPE DISTRIBUIDORA','SEVENTH','ROUTE 66','PROPECUÁRIA','SECURICAM','GRUPO SERVSEG','FRAHM','SDE','BELLFONE','GLOBALVET','PET SOCIETY','MOCELIN'].map(c=>`<span style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:4px;padding:3px 9px;font-size:8px;font-weight:700;color:rgba(255,255,255,.45);letter-spacing:.8px;text-transform:uppercase">${c}</span>`).join('');

  const win = window.open('','_blank');
  win.document.write(`<!DOCTYPE html>
<html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Sora:wght@700;800&family=Chakra+Petch:wght@700;800&display=swap" rel="stylesheet"><title>Proposta Sewe Group — ${cname}</title>
<style>
@page { size: A4 landscape; margin: 0; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
html, body { width: 297mm; font-family: 'Inter', sans-serif; color: #1a1d2e; background: #fff; font-size: 12px; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
script, noscript, #print-trigger { display: none !important; }
.capa { width: 297mm; height: 210mm; background: linear-gradient(135deg, #0a1628 0%, #0d2137 55%, #082028 100%) !important; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; break-after: page; break-inside: avoid; page-break-after: always; page-break-inside: avoid; }
.capa-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 10% 60%, rgba(10,181,160,.18) 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(10,60,120,.28) 0%, transparent 50%) !important; }
.capa-s { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-family: 'Chakra Petch', sans-serif; font-size: 480px; font-weight: 800; color: rgba(10,181,160,.07) !important; line-height: 1; pointer-events: none; user-select: none; letter-spacing: -10px; }
.capa-top { position: relative; z-index: 2; padding: 28px 44px; display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 12px }
.logo-s { font-family: 'Chakra Petch', sans-serif; font-size: 32px; font-weight: 800; color: #0ab5a0 !important; border: 2.5px solid #0ab5a0 !important; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 8px; flex-shrink: 0; }
.logo-nome { color: #fff !important; font-family: 'Sora', sans-serif; font-size: 16px; font-weight: 800; letter-spacing: 3px; line-height: 1.1 }
.logo-tag  { color: #0ab5a0 !important; font-size: 8px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px }
.capa-data { color: rgba(255,255,255,.45) !important; font-size: 11px }
.capa-mid { position: absolute; z-index: 2; left: 44px; right: 44px; top: 50%; transform: translateY(-50%); }
.capa-barra { width: 3px; height: 52px; background: #0ab5a0 !important; margin-bottom: 18px; border-radius: 2px }
.capa-tipo  { color: #0ab5a0 !important; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px }
.capa-titulo { color: #fff !important; font-family: 'Sora', sans-serif; font-size: 48px; font-weight: 800; line-height: 1.05; margin-bottom: 10px }
.capa-cliente { color: rgba(255,255,255,.65) !important; font-family: 'Sora', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase }
.capa-bottom { position: relative; z-index: 2; padding: 18px 44px; border-top: 1px solid rgba(255,255,255,.07); display: flex; justify-content: space-between; align-items: center; }
.capa-validade { color: rgba(255,255,255,.4) !important; font-size: 10px }
.capa-consult  { color: rgba(255,255,255,.6) !important; font-size: 11px; text-align: right }
.capa-consult strong { color: #fff !important; display: block; font-size: 12px }
.pagina { width: 297mm; padding: 20px 32px; break-before: page; break-after: page; break-inside: avoid; page-break-before: always; page-break-after: always; page-break-inside: avoid; }
.pagina-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #0e2a5c; margin-bottom: 16px; }
.ph-right { text-align: right; font-size: 10px; color: #7b8199 }
.ph-right strong { font-size: 12px; font-weight: 700; color: #0e2a5c; display: block }
.logo-s-sm { font-family: 'Chakra Petch', sans-serif; font-size: 18px; font-weight: 800; color: #0ab5a0 !important; border: 2px solid #0ab5a0 !important; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 5px; }
.cliente-box { background: #f5f6fa !important; border-radius: 10px; padding: 12px 16px; display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 16px; border-left: 4px solid #0e2a5c !important; break-inside: avoid; page-break-inside: avoid; }
.cb-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7b8199; display: block; margin-bottom: 2px }
.cb-val   { font-size: 13px; font-weight: 700; color: #0e2a5c }
.rodape { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #e5e7eb; margin-top: 16px; font-size: 9px; color: #aaa; break-inside: avoid; page-break-inside: avoid; }
.rodape-logo { font-family: 'Chakra Petch', sans-serif; font-size: 11px; font-weight: 700; color: #0e2a5c; letter-spacing: 1px }
.arte { width: 297mm; min-height: 210mm; background: #0a1628 !important; color: #fff !important; position: relative; overflow: hidden; break-before: page; break-inside: avoid; page-break-before: always; page-break-inside: avoid; }
.arte-s { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-family: 'Chakra Petch', sans-serif; font-size: 460px; font-weight: 800; color: rgba(10,181,160,.05) !important; line-height: 1; pointer-events: none; user-select: none; }
.arte-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; border-bottom: 1px solid rgba(255,255,255,.07); position: relative; z-index: 1; }
.arte-badge { background: rgba(10,181,160,.15) !important; border: 1px solid rgba(10,181,160,.4) !important; color: #0ab5a0 !important; font-size: 8px; font-weight: 700; padding: 4px 12px; border-radius: 20px; letter-spacing: .8px; text-transform: uppercase; }
.arte-hl { padding: 14px 32px 10px; position: relative; z-index: 1 }
.arte-bar { width: 3px; height: 36px; background: #0ab5a0 !important; margin-bottom: 10px; border-radius: 2px }
.arte-titulo { font-family: 'Sora', sans-serif; font-size: 19px; font-weight: 800; line-height: 1.2; margin-bottom: 5px }
.arte-teal { color: #0ab5a0 !important }
.arte-sub  { font-size: 10px; color: rgba(255,255,255,.5) !important; line-height: 1.5 }
.arte-stats { display: flex; align-items: center; background: rgba(10,181,160,.1) !important; border-top: 1px solid rgba(10,181,160,.2); border-bottom: 1px solid rgba(10,181,160,.2); padding: 10px 32px; position: relative; z-index: 1; break-inside: avoid; page-break-inside: avoid; }
.arte-stat { text-align: center; flex: 1 }
.arte-stat-n { font-family: 'Sora', sans-serif; font-size: 17px; font-weight: 800; color: #0ab5a0 !important; line-height: 1 }
.arte-stat-l { font-size: 7px; color: rgba(255,255,255,.5) !important; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px; font-weight: 600 }
.arte-div    { width: 1px; height: 26px; background: rgba(255,255,255,.15) !important; flex-shrink: 0 }
.arte-slabel { font-size: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px; color: rgba(10,181,160,.8) !important; padding: 8px 32px 6px; display: flex; align-items: center; gap: 8px; position: relative; z-index: 1; }
.arte-slabel::before { content: ''; width: 14px; height: 1.5px; background: #0ab5a0 !important; border-radius: 1px; flex-shrink: 0 }
.arte-difs { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,.08) !important; margin: 0 32px; border-radius: 8px; overflow: hidden; position: relative; z-index: 1; break-inside: avoid; page-break-inside: avoid; }
.arte-dif { background: #0d2137 !important; padding: 12px 14px }
.arte-dif-icon  { font-size: 15px; margin-bottom: 4px; display: block }
.arte-dif-title { font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 700; margin-bottom: 3px; color: #fff !important }
.arte-dif-text  { font-size: 9px; color: rgba(255,255,255,.5) !important; line-height: 1.45 }
.arte-impacts { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin: 0 32px; position: relative; z-index: 1; break-inside: avoid; page-break-inside: avoid; }
.arte-impact { background: linear-gradient(135deg,#0ab5a0,#0890a0) !important; border-radius: 8px; padding: 12px; text-align: center }
.arte-impact-n { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #fff !important; line-height: 1 }
.arte-impact-l { font-size: 8px; color: rgba(0,0,0,.45) !important; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; font-weight: 700 }
.arte-clients  { display: flex; flex-wrap: wrap; gap: 4px; padding: 0 32px; position: relative; z-index: 1 }
.arte-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 32px; margin-top: 10px; background: rgba(10,181,160,.1) !important; border-top: 1px solid rgba(10,181,160,.25) !important; position: relative; z-index: 1; break-inside: avoid; page-break-inside: avoid; }
.arte-footer-cta     { font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 700; color: #fff !important; margin-bottom: 5px }
.arte-footer-contact { display: flex; gap: 12px; font-size: 9px; color: rgba(255,255,255,.55) !important }
</style></head>
<body>
<div class="capa"><div class="capa-bg"></div><div class="capa-s">S</div><div class="capa-top"><div class="logo"><div class="logo-s">S</div><div><div class="logo-nome">SEWE GROUP</div><div class="logo-tag">Inteligência no seu negócio!</div></div></div><div class="capa-data">${dateStr}</div></div><div class="capa-mid"><div class="capa-barra"></div><div class="capa-tipo">Proposta Comercial</div><div class="capa-titulo">Sewe BI</div><div class="capa-cliente">${cname}</div></div><div class="capa-bottom"><div class="capa-validade">Válida por 15 dias úteis &bull; ${dateStr}</div><div class="capa-consult"><strong>${consult}</strong>Consultor Responsável</div></div></div>
<div class="pagina"><div class="pagina-header"><div class="logo"><div class="logo-s-sm">S</div><div><div style="font-family:'Sora',sans-serif;font-size:12px;font-weight:800;color:#0e2a5c;letter-spacing:2px">SEWE GROUP</div><div style="color:#0ab5a0;font-size:7px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px">Inteligência no seu negócio!</div></div></div><div class="ph-right"><strong>Proposta Comercial — Sewe BI</strong><br>${dateStr} &bull; Válida 15 dias úteis</div></div><div class="cliente-box"><div><span class="cb-label">Cliente</span><span class="cb-val">${cname}</span></div><div><span class="cb-label">Contato</span><span class="cb-val">${contact}</span></div><div><span class="cb-label">Consultor Responsável</span><span class="cb-val">${consult}</span></div></div>${bodyHTML}<div class="rodape"><span class="rodape-logo">SEWE GROUP</span><span>sewe@seweconsultoria.com.br &bull; +55 48 98470-4389</span><span>Gerado em ${new Date().toLocaleDateString('pt-BR')}</span></div></div>
<div class="arte"><div class="arte-s">S</div><div class="arte-header"><div class="logo"><div class="logo-s" style="width:36px;height:36px;font-size:22px">S</div><div><div style="font-family:'Sora',sans-serif;font-size:12px;font-weight:800;letter-spacing:3px;color:#fff">SEWE GROUP</div><div style="font-size:7px;color:#0ab5a0;letter-spacing:2px;text-transform:uppercase;margin-top:1px;font-weight:600">Inteligência no seu negócio!</div></div></div><div class="arte-badge">Por que fechar com a Sewe?</div></div><div class="arte-hl"><div class="arte-bar"></div><div class="arte-titulo">Mais de <span class="arte-teal">200 distribuidores</span><br>já tomam decisões com inteligência</div><div class="arte-sub">Desde 2020, ajudamos distribuidores de todo o Brasil a transformar dados em crescimento real.</div></div><div class="arte-stats"><div class="arte-stat"><div class="arte-stat-n">+200</div><div class="arte-stat-l">Clientes ativos</div></div><div class="arte-div"></div><div class="arte-stat"><div class="arte-stat-n">+3B</div><div class="arte-stat-l">em negócios/ano</div></div><div class="arte-div"></div><div class="arte-stat"><div class="arte-stat-n">+500</div><div class="arte-stat-l">Cidades atendidas</div></div><div class="arte-div"></div><div class="arte-stat"><div class="arte-stat-n">5 ★</div><div class="arte-stat-l">Google Reviews</div></div><div class="arte-div"></div><div class="arte-stat"><div class="arte-stat-n">100%</div><div class="arte-stat-l">Atendimento humano</div></div></div><div class="arte-slabel">NOSSOS DIFERENCIAIS</div><div class="arte-difs"><div class="arte-dif"><div class="arte-dif-icon">🏆</div><div class="arte-dif-title">Especialistas em Distribuidores</div><div class="arte-dif-text">Focados exclusivamente no seu mercado. KPIs, problemas e oportunidades do setor de distribuição.</div></div><div class="arte-dif"><div class="arte-dif-icon">⚡</div><div class="arte-dif-title">Qlik Sense — Líder Mundial</div><div class="arte-dif-text">Plataforma de BI líder global. Dashboards em tempo real, self-service analytics e alertas automáticos.</div></div><div class="arte-dif"><div class="arte-dif-icon">🚀</div><div class="arte-dif-title">Implantação em até 30 dias</div><div class="arte-dif-text">Do contrato ao primeiro dashboard em 30 dias úteis. Integração com ERP e suporte inclusos.</div></div><div class="arte-dif"><div class="arte-dif-icon">🧩</div><div class="arte-dif-title">Soluções Modulares</div><div class="arte-dif-text">Comece pelo que você precisa. Expanda com Comercial, Financeiro, Suprimentos, Pós-Venda e Benefícios.</div></div><div class="arte-dif"><div class="arte-dif-icon">🤝</div><div class="arte-dif-title">Customer Success Dedicado</div><div class="arte-dif-text">Suporte via WhatsApp, tickets internos, treinamento contínuo e CSM acompanhando sua evolução.</div></div><div class="arte-dif"><div class="arte-dif-icon">💡</div><div class="arte-dif-title">Classificado como OPEX</div><div class="arte-dif-text">Abate no IR. Expertise de time Sênior sem risco trabalhista, por uma fração do custo interno.</div></div></div><div class="arte-slabel" style="margin-top:10px">IMPACTO REAL NOS CLIENTES</div><div class="arte-impacts"><div class="arte-impact"><div class="arte-impact-n">98%</div><div class="arte-impact-l">mais precisão nas decisões</div></div><div class="arte-impact"><div class="arte-impact-n">50%</div><div class="arte-impact-l">menos tempo de resposta do gestor</div></div><div class="arte-impact"><div class="arte-impact-n">30%</div><div class="arte-impact-l">de redução de churn de clientes</div></div></div><div class="arte-slabel" style="margin-top:10px">QUEM JÁ CONFIA NA SEWE</div><div class="arte-clients">${clientesList}</div><div class="arte-footer"><div><div class="arte-footer-cta">Pronto para transformar dados em crescimento?</div><div class="arte-footer-contact"><span>📱 +55 48 98470-4389</span><span>✉️ sewe@seweconsultoria.com.br</span><span>📍 Florianópolis, SC — Atendimento Nacional</span></div></div><div class="logo-s" style="width:40px;height:40px;font-size:26px">S</div></div></div>
<div style="display:none" id="print-trigger"><scr'+'ipt>window.onload=()=>setTimeout(()=>{window.print();},600);<\\/scr'+'ipt></div>
</body></html>`);
  win.document.close();
}


// ═══════════════════════════════════════════════════
//  ADMIN SYSTEM (MANTER INTACTO)
// ═══════════════════════════════════════════════════
const ADMIN_PWD   = 'sewe2026';
const STORAGE_KEY = 'sewe_cat_v1';
const STORAGE_USR = 'sewe_usr_v1';

const SUITE_META = {
  COMERCIAL:   { label:'🛒 Comercial',   tiers:['SMART','SCALE','STRATEGIC','FOCO'] },
  FINANCEIRA:  { label:'💰 Financeira',  tiers:['SMART','SCALE','STRATEGIC'] },
  SUPRIMENTOS: { label:'📦 Suprimentos', tiers:['SMART','SCALE','STRATEGIC'] },
  BENEFICIOS:  { label:'🎁 Benefícios',  tiers:['SMART','SCALE','STRATEGIC'] },
  POSVENDA:    { label:'🤝 Pós-Venda',   tiers:['SMART'] },
};

let adminSuite = 'COMERCIAL';
let adminDraft = null; 

function abrirAdmin(){
  document.getElementById('admin-overlay').style.display='flex';
  document.getElementById('admin-login').style.display='block';
  document.getElementById('admin-panel').style.display='none';
  document.getElementById('admin-pwd-input').value='';
  document.getElementById('admin-pwd-err').style.display='none';
  setTimeout(()=>document.getElementById('admin-pwd-input').focus(),100);
}

function fecharAdmin(){
  document.getElementById('admin-overlay').style.display='none';
  adminDraft=null;
}

function checkAdminPwd(){
  const v = document.getElementById('admin-pwd-input').value;
  if(v===ADMIN_PWD){
    document.getElementById('admin-login').style.display='none';
    const panel = document.getElementById('admin-panel');
    panel.style.display='flex';
    adminDraft = JSON.parse(JSON.stringify(CAT)); 
    renderAdminTabs();
    renderAdminSuite(adminSuite);
  } else {
    document.getElementById('admin-pwd-err').style.display='block';
    document.getElementById('admin-pwd-input').select();
  }
}

function renderAdminTabs(){
  const tabs = document.getElementById('admin-tabs');
  tabs.innerHTML = Object.entries(SUITE_META).map(([key,meta])=>`
    <button onclick="renderAdminSuite('${key}')" id="atab-${key}"
      style="padding:13px 22px;border:none;background:${adminSuite===key?'#f5f6fa':'#fff'};
      border-bottom:3px solid ${adminSuite===key?'#0e2a5c':'transparent'};
      color:${adminSuite===key?'#0e2a5c':'#7b8199'};font-size:12px;font-weight:700;
      cursor:pointer;white-space:nowrap;letter-spacing:.3px;transition:all .15s">
      ${meta.label}
    </button>
  `).join('')
  + `<button onclick="renderAdminRegras()" id="atab-REGRAS"
      style="padding:13px 22px;border:none;background:${adminSuite==='REGRAS'?'#f5f6fa':'#fff'};
      border-bottom:3px solid ${adminSuite==='REGRAS'?'#0e2a5c':'transparent'};
      color:${adminSuite==='REGRAS'?'#0e2a5c':'#7b8199'};font-size:12px;font-weight:700;
      cursor:pointer;white-space:nowrap;letter-spacing:.3px">
      📋 Política Comercial
    </button>`;
}

function renderAdminSuite(suite){
  adminSuite = suite;
  renderAdminTabs();
  const meta = SUITE_META[suite];
  const suiteData = adminDraft[suite];
  let html = `<div style="display:flex;flex-direction:column;gap:20px">`;

  meta.tiers.forEach(tier=>{
    const td = suiteData[tier];
    if(!td) return;
    const tierLabel = {SMART:'Smart',SCALE:'Scale',STRATEGIC:'Strategic',FOCO:'Foco da Equipe'}[tier]||tier;
    const tierColor = {SMART:'#3b82f6',SCALE:'#8b5cf6',STRATEGIC:'#f59e0b',FOCO:'#10b981'}[tier]||'#666';

    html+=`
    <div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden">
      <div style="padding:14px 20px;background:#fafbfc;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:10px">
        <span style="background:${tierColor};color:#fff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:.5px">${tierLabel}</span>
        <span style="font-size:13px;font-weight:700;color:#0e2a5c">${td.core.name}</span>
      </div>
      <div style="padding:16px 20px">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#7b8199;margin-bottom:10px">CORE — Preços</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          ${pricePairFields(suite,tier,'core',null,'NL')}
          ${pricePairFields(suite,tier,'core',null,'CR')}
        </div>
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#7b8199;margin-bottom:8px">PRODUTOS INCLUSOS NO CORE</div>
        <div id="prods-${suite}-${tier}" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
          ${td.core.prods.map((p,i)=>`
            <div style="display:flex;align-items:center;gap:8px">
              <input type="text" value="${escH(p)}" onchange="updateProd('${suite}','${tier}',${i},this.value)"
                style="flex:1;padding:7px 10px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:12px;outline:none">
              <button onclick="removeProd('${suite}','${tier}',${i})" style="color:#dc2626;background:#fee2e2;border:none;width:26px;height:26px;border-radius:6px;cursor:pointer;font-size:13px;flex-shrink:0">×</button>
            </div>`).join('')}
        </div>
        <button onclick="addProd('${suite}','${tier}')" style="font-size:11px;color:#0e2a5c;background:#e8edf8;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600">+ Adicionar produto</button>

        ${td.addons.length>0 || true ? `
        <div style="margin-top:18px;padding-top:18px;border-top:1px solid #f0f2f8">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#7b8199;margin-bottom:10px">ADD-ONS</div>
          <div id="addons-${suite}-${tier}" style="display:flex;flex-direction:column;gap:8px">
            ${td.addons.map((a,i)=>`
              <div style="background:#fafbfc;border:1px solid #f0f2f8;border-radius:8px;padding:12px 14px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                  <input type="text" value="${escH(a.name)}" onchange="updateAddonName('${suite}','${tier}',${i},this.value)"
                    style="flex:1;padding:7px 10px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:12px;outline:none;font-weight:600">
                  <button onclick="removeAddon('${suite}','${tier}',${i})" style="color:#dc2626;background:#fee2e2;border:none;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:15px;flex-shrink:0">×</button>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                  ${pricePairFields(suite,tier,'addon',i,'NL')}
                  ${pricePairFields(suite,tier,'addon',i,'CR')}
                </div>
              </div>`).join('')}
          </div>
          <button onclick="addAddon('${suite}','${tier}')" style="font-size:11px;color:#8b5cf6;background:#f3f0ff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600;margin-top:8px">+ Adicionar add-on</button>
        </div>` : ''}
      </div>
    </div>`;
  });

  html+=`</div>`;
  document.getElementById('admin-content').innerHTML=html;
}

function pricePairFields(suite, tier, type, addonIdx, nlcr){
  const isAddon = type==='addon';
  const src = isAddon ? adminDraft[suite][tier].addons[addonIdx] : adminDraft[suite][tier].core;
  const vals = src[nlcr];
  const labelColor = nlcr==='NL' ? '#0e2a5c' : '#7b8199';
  const bgColor = nlcr==='NL' ? '#f0f4ff' : '#f9fafb';
  return `
    <div style="background:${bgColor};border-radius:8px;padding:12px 14px">
      <div style="font-size:10px;font-weight:800;color:${labelColor};letter-spacing:1px;margin-bottom:10px">${nlcr==='NL'?'NEW LOGO':'CROSS / UPSELL'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <label style="font-size:9px;color:#7b8199;font-weight:700;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">Implantação (R$)</label>
          <input type="number" value="${vals[0]}" min="0" step="1"
            onchange="updatePrice('${suite}','${tier}','${type}',${addonIdx},'${nlcr}',0,+this.value)"
            style="width:100%;padding:7px 8px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:12px;font-weight:600;outline:none;box-sizing:border-box">
        </div>
        <div>
          <label style="font-size:9px;color:#7b8199;font-weight:700;display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px">MRR/mês (R$)</label>
          <input type="number" value="${vals[1]}" min="0" step="1"
            onchange="updatePrice('${suite}','${tier}','${type}',${addonIdx},'${nlcr}',1,+this.value)"
            style="width:100%;padding:7px 8px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:12px;font-weight:600;outline:none;box-sizing:border-box">
        </div>
      </div>
    </div>`;
}

function renderAdminRegras(){
  adminSuite='REGRAS';
  renderAdminTabs();
  const politica = [
    { num:'1', titulo:'VISÃO GERAL', cor:'#3b82f6', itens:[['', 'A Sewe Group oferece soluções de gestão baseadas em dados voltadas para distribuidores.']]},
    { num:'2', titulo:'FLEXIBILIZAÇÃO COMERCIAL', cor:'#ef4444', itens:[['Até 15%', 'Autonomia do consultor — sem aprovação adicional.'],['15% a 35%', 'Requer aprovação do Diretor Comercial.'],['Acima de 35%', 'Requer aprovação do Comitê de Ofertas.']]}
  ];
  const secoes = politica.map(s => {
    const rows = s.itens.map(item => `<tr><td style="padding:11px 16px;font-size:11px;font-weight:700;color:#0e2a5c;border-bottom:1px solid #f0f2f8;width:200px">${item[0]}</td><td style="padding:11px 16px;font-size:12px;color:#374151;border-bottom:1px solid #f0f2f8">${item[1]}</td></tr>`).join('');
    return `<div style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;margin-bottom:16px"><div style="padding:14px 20px;border-left:4px solid ${s.cor};display:flex;align-items:center;gap:12px;background:#fafbfc;border-bottom:1px solid #e5e7eb"><span style="background:${s.cor};color:#fff;font-size:10px;font-weight:800;padding:3px 9px;border-radius:20px">${s.num}</span><span style="font-family:Sora,sans-serif;font-size:13px;font-weight:800;color:#0e2a5c">${s.titulo}</span></div><table style="width:100%;border-collapse:collapse">${rows}</table></div>`;
  }).join('');
  document.getElementById('admin-content').innerHTML = `<div style="max-width:820px;margin:0 auto"><div style="background:#0e2a5c;border-radius:12px;padding:24px 28px;color:#fff;margin-bottom:20px"><div style="font-family:Sora,sans-serif;font-size:18px;font-weight:800">🧾 Política Comercial</div></div>${secoes}</div>`;
}

function updatePrice(suite,tier,type,addonIdx,nlcr,pos,val){
  if(type==='core') adminDraft[suite][tier].core[nlcr][pos]=val;
  else adminDraft[suite][tier].addons[addonIdx][nlcr][pos]=val;
}
function updateAddonName(suite,tier,i,val){ adminDraft[suite][tier].addons[i].name=val; }
function updateProd(suite,tier,i,val){ adminDraft[suite][tier].core.prods[i]=val; }
function removeProd(suite,tier,i){ adminDraft[suite][tier].core.prods.splice(i,1); renderAdminSuite(suite); }
function addProd(suite,tier){ adminDraft[suite][tier].core.prods.push('Novo produto'); renderAdminSuite(suite); }
function removeAddon(suite,tier,i){ adminDraft[suite][tier].addons.splice(i,1); renderAdminSuite(suite); }
function addAddon(suite,tier){ adminDraft[suite][tier].addons.push({name:'Novo add-on',NL:[0,0],CR:[0,0]}); renderAdminSuite(suite); }

function salvarAdmin(){
  Object.assign(CAT, adminDraft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminDraft));
  const btn=document.querySelector('[onclick="salvarAdmin()"]');
  const orig=btn.innerHTML; btn.innerHTML='✅ Salvo!'; btn.style.background='#16a34a';
  setTimeout(()=>{btn.innerHTML=orig;btn.style.background='#0ab5a0';},2000);
  renderTiers(); renderProds(); calc();
}

function resetarAdmin(){
  if(!confirm('Restaurar todos os preços para os valores padrão?')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

(function loadSaved(){
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    try{
      const parsed=JSON.parse(saved);
      Object.keys(parsed).forEach(suite=>{
        if(CAT[suite]&&parsed[suite]) Object.assign(CAT[suite], parsed[suite]);
      });
    }catch(e){ console.warn('Erro ao carregar preços salvos',e); }
  }
})();

function escH(s){ return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
