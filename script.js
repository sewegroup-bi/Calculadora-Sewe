// ═══════════════════════════════════════════════════
//  DATA & PREÇOS ORIGINAIS
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
  const sustCard = document.getElementById('sust-base-card');
  const crossMsg = document.getElementById('sust-cross-msg');
  if (sustCard) sustCard.style.display = crossSustMsg ? 'none' : 'flex';
  if (crossMsg) crossMsg.style.display = crossSustMsg ? 'block' : 'none';
  
  const sustDisp = document.getElementById('sust-val-display');
  if (sustDisp) sustDisp.textContent = f(sustBase) + "/mês";
  
  const sustLbl = document.getElementById('sust-lbl-pacotes');
  if (sustLbl) sustLbl.textContent = S.type === 'NEWLOGO' ? `${pacotesCobrados} pacote(s) de R$ 799` : `${pacotesCobrados} pacote(s) extra(s)`;

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

  // Margem Interna
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
  
  // Resumo Sidebar
  if (document.getElementById('gb-impl')) document.getElementById('gb-impl').textContent = f(implFinal);
  if (document.getElementById('gb-mrr')) document.getElementById('gb-mrr').innerHTML = isProjeto ? '—' : `${f(mrrFinal)}<span style="font-size:11px">/mês</span>`;
  if (document.getElementById('gb-total')) document.getElementById('gb-total').textContent = f(grandTotal);
  if (document.getElementById('gb-arr')) document.getElementById('gb-arr').textContent  = f(grandTotal);
  if (document.getElementById('sb-cname')) document.getElementById('sb-cname').textContent = document.getElementById('cName').value||'—';

  // Renderiza Linhas Sidebar
  let ih='', mh='';
  prods.filter(p=>p.impl>0).forEach(p=> ih+=`<div class="sval-row"><span class="sval-lbl">${p.name}</span><span class="sval-val">${f(p.impl)}</span></div>`);
  prods.filter(p=>p.mrr>0).forEach(p=> mh+=`<div class="sval-row"><span class="sval-lbl">${p.name}</span><span class="sval-val">${f(p.mrr)}/mês</span></div>`);
  if(pacotesCobrados > 0) mh+=`<div class="sval-row sval-indent"><span class="sval-lbl">Sustentação (${pacotesCobrados}x pacote)</span><span class="sval-val">${f(sustBase)}/mês</span></div>`;
  if(devMRR>0) mh+=`<div class="sval-row sval-indent"><span class="sval-lbl">Desenvolvimento</span><span class="sval-val">${f(devMRR)}/mês</span></div>`;
  
  if (document.getElementById('impl-lines')) document.getElementById('impl-lines').innerHTML = ih || '<div style="text-align:center;color:var(--muted);font-size:11px">Sem produtos</div>';
  if (document.getElementById('mrr-lines')) document.getElementById('mrr-lines').innerHTML = mh || '<div style="text-align:center;color:var(--muted);font-size:11px">Sem recorrente</div>';
}

function gerarPDF(){ window.print(); }
function limpar(){ location.reload(); }


// ═══════════════════════════════════════════════════
//  PAINEL ADMIN (SISTEMA COMPLETO RESTAURADO)
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
