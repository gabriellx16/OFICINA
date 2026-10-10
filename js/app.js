const ld=()=>{try{return JSON.parse(localStorage.getItem('ag'))}catch(e){return null}};
const S=ld()||{clientes:[],veiculos:[],os:[],agenda:[],estoque:[],fin:[],mov:[],seq:0};
S.cfg=S.cfg||DC;if(S.cfg.end==='Rua Exemplo, 123 - Centro, São Paulo - SP')S.cfg=DC;if(S.cfg.oferta===undefined)S.cfg.oferta='';
S.users=S.users||[{id:'u1',nome:'Administrador',email:'admin@autogest.com',senha:'admin123',role:'admin'},{id:'u2',nome:'Atendente Demo',email:'atendente@autogest.com',senha:'atendente123',role:'atendente'}];
const save=()=>{try{localStorage.setItem('ag',JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R=n=>(+n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const today=()=>new Date().toISOString().slice(0,10);
const D=d=>d?d.split('-').reverse().join('/'):'—';
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2500)};
const ST=['Aguardando avaliação','Em diagnóstico','Aguardando aprovação','Aguardando peças','Em execução','Concluída','Entregue','Cancelada'];
const cn=id=>S.clientes.find(c=>c.id==id)?.nome||'—',vn=id=>{const v=S.veiculos.find(c=>c.id==id);return v?v.placa+' · '+v.modelo:'—'};
const tot=o=>(+o.vpecas||0)+(+o.mao||0)-(+o.desc||0);
const M={
users:{t:'Usuários',f:[['nome','Nome','text',1],['email','E-mail de acesso','email',1],['senha','Senha (mín. 6)','password',1],['role','Perfil','sel:atendente|admin',1]],c:[['Nome',r=>esc(r.nome)],['E-mail',r=>esc(r.email)],['Perfil',r=>'<span class=b>'+(r.role=='admin'?'Administrador':'Atendente')+'</span>']]},
clientes:{t:'Clientes',f:[['nome','Nome completo / razão social','text',1],['doc','CPF/CNPJ (opcional)','text'],['tel','Telefone','tel',1],['email','E-mail','email'],['end','Endereço','text'],['obs','Observações','textarea']],
 c:[['Nome',r=>esc(r.nome)+(r.ativo===false?' <span class=b>inativo</span>':'')],['Telefone',r=>esc(r.tel)],['E-mail',r=>esc(r.email||'—')]]},
veiculos:{t:'Veículos',f:[['cid','Cliente responsável','ref:clientes',1],['placa','Placa','text',1],['marca','Marca','text',1],['modelo','Modelo','text',1],['ano','Ano','number'],['cor','Cor','text'],['km','Quilometragem','number'],['obs','Observações','textarea']],
 c:[['Placa',r=>esc(r.placa.toUpperCase())],['Veículo',r=>esc(r.marca+' '+r.modelo+' '+(r.ano||''))],['Cliente',r=>esc(cn(r.cid))],['OS',r=>S.os.filter(o=>o.vid==r.id).length]]},
os:{t:'Ordens de Serviço',f:[['cid','Cliente','ref:clientes',1],['vid','Veículo','ref:veiculos',1],['ent','Data de entrada','date',1],['km','Quilometragem','number'],['prob','Descrição do problema','textarea',1],['diag','Diagnóstico','textarea'],['serv','Serviços realizados/solicitados','textarea'],['pecas','Peças utilizadas','textarea'],['vpecas','Valor das peças (R$)','number'],['mao','Mão de obra (R$)','number'],['desc','Desconto (R$)','number'],['mec','Mecânico responsável','text'],['prazo','Prazo previsto','date'],['st','Status','sel:'+ST.join('|'),1],['obs','Observações','textarea']],
 c:[['Nº',r=>r.numero],['Cliente',r=>esc(cn(r.cid))],['Veículo',r=>esc(vn(r.vid))],['Entrada',r=>D(r.ent)],['Status',r=>'<span class=b>'+r.st+'</span>'],['Total',r=>R(tot(r))]],ver:1},
agenda:{t:'Agendamentos',f:[['cid','Cliente','ref:clientes',1],['vid','Veículo','ref:veiculos',1],['serv','Serviço desejado','text',1],['data','Data','date',1],['hora','Horário','time',1],['st','Situação','sel:Agendado|Confirmado|Em atendimento|Concluído|Cancelado',1],['obs','Observações','textarea']],
 c:[['Data',r=>D(r.data)],['Hora',r=>r.hora],['Cliente',r=>esc(cn(r.cid))],['Veículo',r=>esc(vn(r.vid))],['Serviço',r=>esc(r.serv)],['Situação',r=>'<span class=b>'+r.st+'</span>']]},
estoque:{t:'Estoque',f:[['cod','Código','text',1],['nome','Nome','text',1],['cat','Categoria','text'],['qtd','Quantidade disponível','number',1],['min','Estoque mínimo','number',1],['custo','Custo (R$)','number'],['preco','Preço de venda (R$)','number'],['forn','Fornecedor','text']],
 c:[['Código',r=>esc(r.cod)],['Produto',r=>esc(r.nome)],['Categoria',r=>esc(r.cat||'—')],['Qtd',r=>'<span class="b '+(r.qtd<=r.min?'low':'ok')+'">'+r.qtd+(r.qtd<=r.min?' · baixo':'')+'</span>'],['Preço',r=>R(r.preco)]]},
fin:{t:'Financeiro',f:[['tipo','Tipo','sel:Receita|Despesa',1],['desc','Descrição','text',1],['cat','Categoria','text'],['valor','Valor (R$)','number',1],['data','Vencimento / data','date',1],['forma','Forma de pagamento','sel:Pix|Dinheiro|Cartão de crédito|Cartão de débito|Boleto|Transferência'],['st','Situação','sel:Pendente|Pago',1]],
 c:[['Data',r=>D(r.data)],['Tipo',r=>'<span class="b '+(r.tipo=='Receita'?'ok':'low')+'">'+r.tipo+'</span>'],['Descrição',r=>esc(r.desc)],['Categoria',r=>esc(r.cat||'—')],['Valor',r=>R(r.valor)],['Situação',r=>r.st]]}
};
let v='dash',q='',me=null,lt='admin';try{me=S.users.find(u=>u.id==sessionStorage.getItem('ags'))||null}catch(e){}
const P={atendente:['dash','clientes','veiculos','os','agenda','estoque','site']},can=k=>me&&(me.role=='admin'||P.atendente.includes(k));
const F={de:'',ate:'',cat:''};
const NAV=[['dash','▦','Dashboard'],['clientes','☺','Clientes'],['veiculos','🚗','Veículos'],['os','🔧','Ordens de Serviço'],['agenda','📅','Agendamentos'],['estoque','📦','Estoque'],['fin','$','Financeiro'],['rel','📊','Relatórios'],['site','🌐','Site da Oficina'],['users','👥','Usuários']];
function render(){
 if(!me){$('#root').innerHTML=loginHtml();return}
 $('#root').innerHTML=`<div id=app><nav id=nv><div class=logo>${LOGO}<span>AutoGest <b>Pro</b></span></div>${NAV.filter(n=>can(n[0])).map(n=>`<a data-a=go data-v=${n[0]} class="${v==n[0]?'on':''}"><span>${n[1]}</span>${n[2]}</a>`).join('')}<a href="index.html" target="_blank"><span>↗</span>Ver site</a><a data-a=out><span>⏻</span>Sair</a></nav><main id=mn></main></div>`;view()}
function view(){const m=$('#mn');if(!m)return;if(!can(v))v='dash';const T={dash:'Dashboard',rel:'Relatórios',site:'Site da Oficina'};
m.innerHTML=`<div class=top><div><button class="btn s burger" data-a=burger>☰</button> <h1 style="display:inline">${T[v]||M[v].t}</h1></div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><small>${esc(me.nome)} · <span class=b>${me.role=='admin'?'Administrador':'Atendente'}</span></small>${M[v]?'<button class=btn data-a=new data-k='+v+'>+ Novo</button>':''}</div></div>`+(v=='dash'?dash():v=='rel'?rel():v=='site'?siteV():crud(v))}
function dash(){const mo=today().slice(0,7),f=S.fin.filter(x=>x.data.startsWith(mo));const sum=t=>f.filter(x=>x.tipo==t).reduce((a,x)=>a+ +x.valor,0);
 const K=[['Clientes cadastrados',S.clientes.filter(c=>c.ativo!==false).length],['Veículos cadastrados',S.veiculos.length],['OS abertas',S.os.filter(o=>!['Concluída','Entregue','Cancelada'].includes(o.st)).length],['Serviços em andamento',S.os.filter(o=>['Em diagnóstico','Em execução'].includes(o.st)).length],['Agendamentos do dia',S.agenda.filter(a=>a.data==today()&&a.st!='Cancelado').length],['Faturamento mensal',R(sum('Receita'))],['Despesas mensais',R(sum('Despesa'))],['Estoque baixo',S.estoque.filter(p=>p.qtd<=p.min).length]];
 return `<div class=grid>${K.map((k,i)=>`<div class="card kpi ${i>4?'a':''}"><small>${k[0]}</small><div>${k[1]}</div></div>`).join('')}</div>`+(S.clientes.length?'':'<div class="card empty">Nenhum registro ainda. Comece cadastrando um cliente. Todos os indicadores são calculados a partir dos dados salvos neste navegador.</div>')}
function lab(f,r){return f}
function rowsOf(k){let rows=S[k];
 if(k=='fin'){rows=rows.filter(x=>(!F.de||x.data>=F.de)&&(!F.ate||x.data<=F.ate)&&(!F.cat||(x.cat||'').toLowerCase().includes(F.cat.toLowerCase())))}
 if(k=='agenda'){const [a,b]=range();rows=rows.filter(x=>x.data>=a&&x.data<=b)}
 const s=q.toLowerCase();return rows.filter(r=>!s||JSON.stringify(r).toLowerCase().includes(s)||(r.cid&&cn(r.cid).toLowerCase().includes(s)))}
let AV='dia',AD=today();
function range(){const d=new Date(AD+'T12:00');const f=x=>x.toISOString().slice(0,10);if(AV=='dia')return[AD,AD];
 if(AV=='semana'){const s=new Date(d);s.setDate(d.getDate()-d.getDay());const e=new Date(s);e.setDate(s.getDate()+6);return[f(s),f(e)]}
 return[AD.slice(0,7)+'-01',AD.slice(0,7)+'-31']}
function tbody(k){const m=M[k],rows=rowsOf(k);if(k=='agenda')rows.sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora));
 if(!rows.length)return `<tr><td colspan=9 class=empty>Nenhum registro encontrado.</td></tr>`;
 return rows.map(r=>`<tr>${m.c.map(c=>`<td>${c[1](r)}</td>`).join('')}<td class=ac>${k=='estoque'?`<button class="btn sm s" data-a=mov data-id=${r.id} data-d=1>+ Entrada</button><button class="btn sm s" data-a=mov data-id=${r.id} data-d=-1>− Saída</button>`:''}${k=='fin'&&r.st=='Pendente'?`<button class="btn sm s" data-a=pay data-id=${r.id}>Marcar pago</button>`:''}${m.ver?`<button class="btn sm s" data-a=ver data-id=${r.id}>Ver / Imprimir</button>`:''}<button class="btn sm s" data-a=edit data-k=${k} data-id=${r.id}>Editar</button><button class="btn sm d" data-a=del data-k=${k} data-id=${r.id}>${k=='clientes'?(r.ativo===false?'Reativar':'Desativar'):'Excluir'}</button></td></tr>`).join('')}
function sumFin(){const rows=rowsOf('fin'),s=(t,st)=>rows.filter(x=>x.tipo==t&&(!st||x.st==st)).reduce((a,x)=>a+ +x.valor,0);
 const K=[['Faturamento (receitas)',s('Receita')],['Recebido',s('Receita','Pago')],['A receber',s('Receita','Pendente')],['Despesas',s('Despesa')],['A pagar',s('Despesa','Pendente')],['Lucro estimado',s('Receita')-s('Despesa')],['Fluxo de caixa (realizado)',s('Receita','Pago')-s('Despesa','Pago')]];
 return `<div class=grid>${K.map(k=>`<div class="card kpi a"><small>${k[0]}</small><div>${R(k[1])}</div></div>`).join('')}</div>`}
function crud(k){return (k=='fin'?sumFin().replace('<div class=grid>','<div class=grid id=sf>'):'')+`<div class=tools><input placeholder="Pesquisar..." value="${esc(q)}" data-a=search data-k=${k}>`+
 (k=='fin'?`<input type=date value="${F.de}" data-a=flt data-f=de title="De"><input type=date value="${F.ate}" data-a=flt data-f=ate title="Até"><input placeholder="Categoria" value="${esc(F.cat)}" data-a=flt data-f=cat>`:'')+
 (k=='agenda'?`<select data-a=av><option value=dia ${AV=='dia'?'selected':''}>Dia</option><option value=semana ${AV=='semana'?'selected':''}>Semana</option><option value=mes ${AV=='mes'?'selected':''}>Mês</option></select><input type=date value="${AD}" data-a=ad>`:'')+
 `</div><div class=tw><table><thead><tr>${M[k].c.map(c=>`<th>${c[0]}</th>`).join('')}<th>Ações</th></tr></thead><tbody id=tb>${tbody(k)}</tbody></table></div>`}
function opts(f,val,cid){let o=[];const t=f[2];
 if(t.startsWith('sel:'))o=t.slice(4).split('|').map(x=>[x,x]);
 else if(t=='ref:clientes')o=S.clientes.filter(c=>c.ativo!==false||c.id==val).map(c=>[c.id,c.nome]);
 else o=S.veiculos.filter(x=>!cid||x.cid==cid).map(x=>[x.id,x.placa+' · '+x.modelo]);
 return (f[3]&&!t.startsWith('sel:')||t.startsWith('ref')?'<option value="">Selecione...</option>':'')+o.map(x=>`<option value="${esc(x[0])}" ${x[0]==val?'selected':''}>${esc(x[1])}</option>`).join('')}
function form(k,id){const m=M[k],r=id?S[k].find(x=>x.id==id):{ent:today(),data:today(),st:k=='os'?ST[0]:k=='agenda'?'Agendado':k=='fin'?'Pendente':'',tipo:'Receita'};
 const need=k=='veiculos'||k=='os'||k=='agenda'?(S.clientes.length?'':'<div class=warn>Cadastre um cliente antes.</div>'):'';
 $('#dlg').innerHTML=`<h2 style="margin-top:0">${id?'Editar':'Novo'} · ${m.t}</h2>${need}<form id=ff data-k=${k} data-id=${id||''}><div class=two>${m.f.map(f=>{const t=f[2],w=t=='textarea'?'w':'',val=r[f[0]]??'';
 const inp=t=='textarea'?`<textarea name=${f[0]} rows=2 ${f[3]?'required':''}>${esc(val)}</textarea>`:(t.startsWith('sel:')||t.startsWith('ref:'))?`<select name=${f[0]} ${f[3]?'required':''}>${opts(f,val,f[0]=='vid'?r.cid:0)}</select>`:`<input name=${f[0]} type=${t} ${t=='number'?'step=0.01 min=0':''} ${f[0]=='placa'?'pattern="[A-Za-z]{3}[0-9][A-Za-z0-9][0-9]{2}" title="Ex.: ABC1D23" maxlength=7':''} ${f[3]?'required':''} value="${esc(val)}">`;
 return `<label class="${w}">${f[1]}${f[3]?' *':''}${inp}</label>`}).join('')}</div><div style="display:flex;gap:8px;justify-content:flex-end"><button type=button class="btn s" data-a=close>Cancelar</button><button class=btn>Salvar</button></div></form>`;$('#dlg').showModal();
 const c=$('#ff [name=cid]'),vv=$('#ff [name=vid]');if(c&&vv)c.onchange=()=>{vv.innerHTML=opts(['vid','','ref:veiculos',1],'',c.value)}}
function printOS(o){const c=S.clientes.find(x=>x.id==o.cid)||{};return `<h2>AutoGest Pro · ${o.numero}</h2><p><b>Status:</b> ${o.st} · <b>Entrada:</b> ${D(o.ent)} · <b>Prazo:</b> ${D(o.prazo)}</p><p><b>Cliente:</b> ${esc(c.nome)} ${esc(c.tel)}<br><b>Veículo:</b> ${esc(vn(o.vid))} · <b>Km:</b> ${o.km||'—'}<br><b>Mecânico:</b> ${esc(o.mec||'—')}</p><p><b>Problema:</b> ${esc(o.prob)}</p><p><b>Diagnóstico:</b> ${esc(o.diag||'—')}</p><p><b>Serviços:</b> ${esc(o.serv||'—')}</p><p><b>Peças:</b> ${esc(o.pecas||'—')}</p><p>Peças: ${R(o.vpecas)} · Mão de obra: ${R(o.mao)} · Desconto: ${R(o.desc)}</p><h3>Total: ${R(tot(o))}</h3><p>${esc(o.obs||'')}</p>`}
const RT={os:'Ordens de serviço',serv:'Serviços realizados',fat:'Faturamento',desp:'Despesas',est:'Estoque',cli:'Clientes',hist:'Histórico de veículos'};let RS='os',RD={de:'',ate:''};
const inR=d=>(!RD.de||d>=RD.de)&&(!RD.ate||d<=RD.ate);
function rdata(){const h=(a,b)=>({h:a,r:b});switch(RS){
 case'os':return h(['Nº','Entrada','Cliente','Veículo','Status','Total'],S.os.filter(o=>inR(o.ent)).map(o=>[o.numero,D(o.ent),cn(o.cid),vn(o.vid),o.st,tot(o).toFixed(2)]));
 case'serv':return h(['Nº','Entrada','Cliente','Serviços','Total'],S.os.filter(o=>['Concluída','Entregue'].includes(o.st)&&inR(o.ent)).map(o=>[o.numero,D(o.ent),cn(o.cid),o.serv||'',tot(o).toFixed(2)]));
 case'fat':case'desp':{const t=RS=='fat'?'Receita':'Despesa';return h(['Data','Descrição','Categoria','Situação','Valor'],S.fin.filter(x=>x.tipo==t&&inR(x.data)).map(x=>[D(x.data),x.desc,x.cat||'',x.st,(+x.valor).toFixed(2)]))}
 case'est':return h(['Código','Produto','Qtd','Mínimo','Custo','Preço'],S.estoque.map(p=>[p.cod,p.nome,p.qtd,p.min,p.custo||0,p.preco||0]));
 case'cli':return h(['Nome','Telefone','E-mail','Situação'],S.clientes.map(c=>[c.nome,c.tel,c.email||'',c.ativo===false?'Inativo':'Ativo']));
 default:return h(['Veículo','Cliente','OS','Entrada','Status','Total'],S.os.filter(o=>inR(o.ent)).map(o=>[vn(o.vid),cn(o.cid),o.numero,D(o.ent),o.st,tot(o).toFixed(2)]))}}
function rel(){const d=rdata();return `<div class=tools><select data-a=rs>${Object.entries(RT).map(e=>`<option value=${e[0]} ${RS==e[0]?'selected':''}>${e[1]}</option>`).join('')}</select><input type=date value="${RD.de}" data-a=rd data-f=de><input type=date value="${RD.ate}" data-a=rd data-f=ate><button class="btn s" data-a=csv>Exportar CSV</button><button class=btn data-a=prn>Imprimir / PDF</button></div><div class=tw><table><thead><tr>${d.h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${d.r.length?d.r.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join(''):'<tr><td class=empty colspan=9>Sem dados no período.</td></tr>'}</tbody></table></div>`}
function loginHtml(){const c=S.cfg;
return `<div id=login><div class=hero><a class=back href="index.html">← Voltar ao site</a><div><div class=logo>${LOGO}<span>${esc(c.nome)}</span></div><h2>Painel de gestão</h2><p>${esc(c.slogan)}. Clientes, ordens de serviço, estoque e financeiro em um só lugar.</p></div><small>Protótipo visual</small></div>
<div class=lf><form id=lf novalidate><h1>Acesso à gestão</h1><div class=tabs><button type=button data-a=lt data-t=admin class="${lt=='admin'?'on':''}">Administrador</button><button type=button data-a=lt data-t=atendente class="${lt=='atendente'?'on':''}">Atendente</button></div>
<div class=warn>Protótipo sem segurança real. Demo: ${lt=='admin'?'admin@autogest.com / admin123':'atendente@autogest.com / atendente123'}</div>
<label>E-mail<input id=em type=email></label><label>Senha<input id=pw type=password></label><div class=err id=er></div>
<button class=btn style="width:100%" id=lb>Entrar na Gestão</button><p><a href="#" data-a=forgot>Esqueci minha senha</a></p></form></div></div>`}
function siteV(){const c=S.cfg,I=(k,l,t='text',x='')=>`<label>${l}<input name=${k} type=${t} value="${esc(c[k])}" ${['email','insta'].includes(k)?'':'required'} ${x}></label>`;
return `<div class=card><form id=cf><div class=two>${I('nome','Nome da oficina')}${I('slogan','Slogan')}${I('end','Endereço completo')}${I('horario','Horário de funcionamento')}${I('tel','Telefone','tel')}${I('whats','WhatsApp (DDI+DDD+número, só números)','text','inputmode=numeric')}${I('email','E-mail de contato','email')}${I('insta','Instagram')}<label class=w>Sobre a oficina<textarea name=sobre rows=3>${esc(c.sobre)}</textarea></label><label class=w>Oferta / promoção em destaque (opcional)<textarea name=oferta rows=4>${esc(c.oferta)}</textarea></label><label class=w>Serviços oferecidos (um por linha)<textarea name=servs rows=5>${esc(c.servs)}</textarea></label></div><div style="display:flex;justify-content:flex-end"><button class=btn>Salvar alterações</button></div></form></div><p class=empty>Estas informações aparecem na página inicial do site. <a href="index.html" target="_blank">Abrir página inicial</a>. E-mail e Instagram são opcionais e só aparecem se preenchidos.</p>`}
const A={
 lt:d=>{lt=d.t;render()},
 go:d=>{if(!can(d.v))return;v=d.v;q='';$('#nv')?.classList.remove('open');render()},burger:()=>$('#nv').classList.toggle('open'),
 out:()=>{me=null;try{sessionStorage.removeItem('ags')}catch(e){}render()},
 forgot:()=>toast('Protótipo: a recuperação por e-mail exigiria um serviço real de autenticação.'),
 new:d=>form(d.k),edit:d=>form(d.k,d.id),close:()=>$('#dlg').close(),
 del:d=>{const r=S[d.k].find(x=>x.id==d.id);if(d.k=='clientes'){r.ativo=r.ativo===false;toast(r.ativo?'Cliente reativado':'Cliente desativado')}else{if(d.k=='users'&&(d.id==me.id||!S.users.some(x=>x.role=='admin'&&x.id!=d.id)))return toast('Não é possível excluir o próprio usuário ou o último administrador');if(!confirm('Excluir este registro? Esta ação não pode ser desfeita.'))return;S[d.k]=S[d.k].filter(x=>x.id!=d.id);toast('Registro excluído')}save();view()},
 pay:d=>{S.fin.find(x=>x.id==d.id).st='Pago';save();view();toast('Marcado como pago')},
 mov:d=>{const p=S.estoque.find(x=>x.id==d.id),n=parseInt(prompt((d.d>0?'Quantidade de entrada':'Quantidade de saída')+' ('+p.nome+'):'),10);if(!(n>0))return;if(d.d<0&&n>p.qtd)return toast('Saída maior que o estoque disponível');p.qtd+=n*d.d;S.mov.push({id:uid(),pid:p.id,q:n*d.d,data:today()});save();view();toast('Movimentação registrada')},
 ver:d=>{$('#dlg').innerHTML=printOS(S.os.find(x=>x.id==d.id))+'<div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn s" data-a=close>Fechar</button><button class=btn data-a=pro data-id='+d.id+'>Imprimir / PDF</button></div>';$('#dlg').showModal()},
 pro:d=>{$('#prt').innerHTML=printOS(S.os.find(x=>x.id==d.id));$('#dlg').close();setTimeout(()=>window.print(),50)},
 prn:()=>{const d=rdata();$('#prt').innerHTML=`<h2>${RT[RS]}</h2><table border=1 cellpadding=5 style="border-collapse:collapse;width:100%"><tr>${d.h.map(x=>`<th>${x}</th>`).join('')}</tr>${d.r.map(r=>`<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table>`;setTimeout(()=>window.print(),50)},
 csv:()=>{const d=rdata(),t=[d.h,...d.r].map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(';')).join('\n');try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));a.download='relatorio-'+RS+'.csv';a.click()}catch(e){}try{navigator.clipboard.writeText(t).then(()=>toast('CSV copiado para a área de transferência'))}catch(e){toast('Exportação indisponível neste ambiente')}},
 rs:(d,e)=>{RS=e.target.value;view()},rd:(d,e)=>{RD[d.f]=e.target.value;view()},av:(d,e)=>{AV=e.target.value;view()},ad:(d,e)=>{AD=e.target.value||today();view()},
 flt:(d,e)=>{F[d.f]=e.target.value;if(d.f!='cat')view();else{$('#tb').innerHTML=tbody('fin');$('#sf').outerHTML=sumFin().replace('<div class=grid>','<div class=grid id=sf>')}},
 search:(d,e)=>{q=e.target.value;$('#tb').innerHTML=tbody(d.k)}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||['INPUT','SELECT'].includes(b.tagName))return;if(b.tagName=='A')e.preventDefault();A[b.dataset.a]?.(b.dataset,e)});
document.addEventListener('input',e=>{const b=e.target.closest('[data-a=search],[data-a=flt]');if(b&&b.type!='date')A[b.dataset.a](b.dataset,e)});
document.addEventListener('change',e=>{const b=e.target.closest('[data-a]');if(b&&['INPUT','SELECT'].includes(b.tagName)&&b.dataset.a!='search'&&!(b.dataset.a=='flt'&&b.dataset.f=='cat'))A[b.dataset.a]?.(b.dataset,e)});
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target;
 if(f.id=='cf'){const o={};new FormData(f).forEach((x,n)=>o[n]=x.trim());o.whats=o.whats.replace(/\D/g,'');if(o.whats.length<10)return toast('WhatsApp inválido (use DDI+DDD+número)');S.cfg=o;save();toast('Informações do site salvas');return}
 if(f.id=='lf'){const em=$('#em').value.trim().toLowerCase(),pw=$('#pw').value;if(!/^\S+@\S+\.\S+$/.test(em))return $('#er').textContent='Informe um e-mail válido.';if(pw.length<6)return $('#er').textContent='A senha deve ter ao menos 6 caracteres.';
  const b=$('#lb');b.textContent='Entrando...';b.disabled=true;setTimeout(()=>{const u=S.users.find(x=>x.email.toLowerCase()==em&&x.senha==pw&&x.role==lt);if(!u){b.textContent='Entrar na Gestão';b.disabled=false;$('#er').textContent='E-mail ou senha incorretos para este perfil.';return}me=u;v='dash';try{sessionStorage.setItem('ags',u.id)}catch(x){}render()},600);return}
 if(f.id=='ff'){const k=f.dataset.k,o={};new FormData(f).forEach((x,n)=>o[n]=x);
  if(k=='users'){if(o.senha.length<6)return toast('A senha deve ter ao menos 6 caracteres');if(S.users.some(x=>x.email.toLowerCase()==o.email.toLowerCase()&&x.id!=f.dataset.id))return toast('E-mail já cadastrado');if(f.dataset.id&&o.role!='admin'&&!S.users.some(x=>x.role=='admin'&&x.id!=f.dataset.id))return toast('Mantenha ao menos um administrador')}
  if(k=='os'&&o.cid&&o.vid&&S.veiculos.find(x=>x.id==o.vid)?.cid!=o.cid)return toast('O veículo não pertence ao cliente selecionado');
  if(k=='veiculos')o.placa=o.placa.toUpperCase();
  if(f.dataset.id){Object.assign(S[k].find(x=>x.id==f.dataset.id),o)}else{o.id=uid();if(k=='os')o.numero='OS-'+String(++S.seq).padStart(4,'0');if(k=='clientes')o.ativo=true;S[k].push(o)}
  save();$('#dlg').close();view();toast('Salvo com sucesso')}});
render();
