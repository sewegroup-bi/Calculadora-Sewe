let S = { type: 'NEWLOGO' };

function setType(t) {
  S.type = t;
  document.getElementById('tb-NEWLOGO').classList.toggle('active', t === 'NEWLOGO');
  document.getElementById('tb-CROSS').classList.toggle('active', t === 'CROSS');
  calc();
}

function changeU(d) {
  const el = document.getElementById('uQty');
  el.value = Math.max(1, (parseInt(el.value) || 0) + d);
  calc();
}

function f(v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

function calc() {
  const users = parseInt(document.getElementById('uQty').value) || 1;
  const sustQty = Math.ceil(users / 50);
  const sustBase = (S.type === 'CROSS') ? 0 : (sustQty * 799);
  
  const display = document.getElementById('sust-val-display');
  if(display) display.textContent = (S.type === 'CROSS') ? "Incluso" : f(sustBase);

  const impl = (S.type === 'NEWLOGO') ? 5000 : 0;
  const mrr = sustBase;

  document.getElementById('gb-impl').textContent = f(impl);
  document.getElementById('gb-mrr').textContent = f(mrr);
  document.getElementById('gb-total').textContent = "Total: " + f(impl + (mrr * 12));
}

window.onload = calc;
