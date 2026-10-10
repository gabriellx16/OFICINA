const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let raw=null;try{raw=JSON.parse(localStorage.getItem('ag'))}catch(e){}
const c=Object.assign({},DC,(raw&&raw.cfg)||{});
const $=s=>document.querySelector(s);
document.title=c.nome+' · '+c.slogan;
document.querySelectorAll('[data-f]').forEach(e=>e.textContent=c[e.dataset.f]||'');
document.querySelectorAll('[data-wa]').forEach(a=>a.href='https://wa.me/'+c.whats);
const lines=t=>String(t||'').split('\n').map(x=>x.trim()).filter(Boolean);
const op=lines(c.oferta);
const veicLine=op.find(x=>/^ve[ií]culos atendidos:/i.test(x));
const rest=op.filter(x=>x!==veicLine);
const pm=op.join(' ').match(/R\$\s?[\d.]+(?:,\d{2})?/);
if(pm){$('#preco').textContent=pm[0];$('#preco-f').textContent=pm[0]}
$('#promo').innerHTML=rest.map(x=>'<p>'+esc(x)+'</p>').join('');
if(!op.length)$('#oferta').style.display='none';
const vs=veicLine?veicLine.replace(/^[^:]+:/,'').replace(/\.$/,'').split(/,| e (?=[A-ZÁÉÍÓÚ])/).map(x=>x.trim()).filter(Boolean):[];
$('#veic').innerHTML=vs.map(x=>'<span>✔ '+esc(x)+'</span>').join('');
if(!vs.length)$('#veiculos').style.display='none';
const ic=['🔧','🛡️','📲','⚙️','🚗','🛢️'];
$('#svc').innerHTML=lines(c.servs).map((x,i)=>'<div class=s><i>'+ic[i%ic.length]+'</i><b>'+esc(x)+'</b></div>').join('');
const K=[['📍','Endereço',c.end,'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.end),'Ver no mapa'],['💬','WhatsApp',c.tel,'https://wa.me/'+c.whats,'Chamar agora'],['🕒','Atendimento',c.horario,'',''],['✉','E-mail',c.email,c.email?'mailto:'+c.email:'',''],['📷','Instagram',c.insta,'','']].filter(k=>k[2]);
$('#cards').innerHTML=K.map(k=>'<div class=card><div class=ic>'+k[0]+'</div><small>'+k[1]+'</small><b>'+esc(k[2])+'</b>'+(k[3]?'<a href="'+esc(k[3])+'" target="_blank" rel="noopener">'+(k[4]||'Abrir')+' →</a>':'')+'</div>').join('');
