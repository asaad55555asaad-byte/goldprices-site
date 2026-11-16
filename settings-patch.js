/* يقرأ settings.json ويطبّقه على الموقع. يُحمَّل بعد السكربت الرئيسي في index.html */
(function(){
  let CFG=null;
  const BASE=MT.slice();
  const _render=render, _news=news;
  const lum=h=>{const n=parseInt(h.slice(1),16);return ((n>>16)*299+((n>>8&255)*587)+((n&255)*114))/1000};

  function data(){
    if(!CFG)return;
    const ms=CFG.metals||{};
    const ex=(CFG.extra||[]).map(e=>({id:String(e.id||'').toUpperCase().replace(/[^A-Z0-9]/g,''),name:e.name,price:Number(e.price),visible:e.visible!==false}))
      .filter(e=>e.id&&e.name&&e.price>0&&!BASE.some(b=>b.k===e.id));
    ex.forEach(e=>{T.ar[e.id]=e.name;T.en[e.id]=e.name;S.px[e.id]=e.price;CH[e.id]=0});
    const all=BASE.concat(ex.map(e=>({k:e.id,p:[999],hide:!e.visible})));
    const vis=all.filter(m=>m.hide?false:!(ms[m.k]&&ms[m.k].visible===false));
    MT.splice(0,MT.length,...vis);
    BASE.forEach(m=>{const c=ms[m.k];if(c&&c.mode==='manual'&&Number(c.manual)>0)S.px[m.k]=Number(c.manual)});
  }

  function dom(){
    const s=CFG&&CFG.site;if(!s)return;
    const hd=document.querySelector('#app header');if(!hd)return;
    const h=hd.querySelector('h1'),p=hd.querySelector('p');
    if(s.title&&h)h.textContent=s.title;
    if(s.subtitle&&p)p.textContent=s.subtitle;
    if(s.announcement&&s.announcement.trim())hd.insertAdjacentHTML('afterend','<div class="msg">'+esc(s.announcement)+'</div>');
    if(/^#[0-9a-f]{6}$/i.test(s.accent||'')){
      const r=document.documentElement.style;
      r.setProperty('--gold',s.accent);
      r.setProperty('--on',lum(s.accent)>150?'#000':'#fff');
    }
  }

  render=function(){data();_render();dom();};

  news=function(t){
    const pin=(CFG&&CFG.news||[]).filter(n=>n&&n.title).map(n=>({title:n.title,link:n.link||'#',src:n.text||'',date:n.date}));
    if(!pin.length)return _news(t);
    const saved=NEWS,a=(saved&&saved[S.lang])||[];
    NEWS=Object.assign({},saved,{[S.lang]:pin.concat(a)});
    const html=_news(t);
    NEWS=saved;
    return html;
  };

  fetch('settings.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(j){CFG=j;render()}}).catch(()=>{});
})();
