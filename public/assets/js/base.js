/* AKNO base layer: tiny vanilla JS, deferred. UI + intro (Web Animations API). The motion layer (GSAP, Lenis, WebGL) loads on first interaction. */
(()=>{const d=document.documentElement,$=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)],rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ME=document.currentScript&&document.currentScript.src;
// menu
// menu (vanilla, CSS-driven open/close; see .mn rules)
const bu=$('#bu'),mn=$('#mn');if(bu&&mn){let open=false,tm;const sb=()=>innerWidth-d.clientWidth;
 const items=()=>[bu,...$$('a',mn)];
 const setM=o=>{if(o===open)return;open=o;clearTimeout(tm);bu.setAttribute('aria-expanded',o);bu.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');mn.inert=!o;mn.setAttribute('aria-hidden',!o);
  if(o){document.body.style.paddingRight=sb()?sb()+'px':'';d.classList.add('mn-o');d.style.overflow='hidden';window.__lenis&&__lenis.stop();setTimeout(()=>{const a=$('a',mn);a&&a.focus({preventScroll:true})},rm?0:300)}
  else{d.classList.remove('mn-o');d.style.overflow='';document.body.style.paddingRight='';window.__lenis&&__lenis.start()}};
 bu.addEventListener('click',()=>setM(!open));
 mn.addEventListener('click',e=>{if(e.target.closest('a'))setM(false)});
 const sc=$('.mn-sc');sc&&sc.addEventListener('click',()=>setM(false));
 addEventListener('keydown',e=>{if(!open)return;if(e.key==='Escape'){setM(false);bu.focus()}else if(e.key==='Tab'){const f=items(),i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){f[f.length-1].focus();e.preventDefault()}else if(!e.shiftKey&&i===f.length-1){f[0].focus();e.preventDefault()}}});
 addEventListener('pointerdown',e=>{if(open&&!mn.contains(e.target)&&!bu.contains(e.target))setM(false)});
 window.__menu=setM}
// legal details open from #hash
const oh=()=>{const t=location.hash&&document.getElementById(location.hash.slice(1));if(t&&t.tagName==='DETAILS'){t.open=true;setTimeout(()=>t.scrollIntoView({block:'center'}),60)}};addEventListener('hashchange',oh);addEventListener('load',oh);
// contact form: prefill ?service=, honest status
const fm=$('#fm');if(fm){const q=new URLSearchParams(location.search).get('service');if(q){const c=fm.querySelector(`[data-s="${q}"]`);if(c)c.checked=true}fm.addEventListener('submit',()=>{const s=$('#fm-st');if(s)s.textContent='Envoi en cours…'})}
// hero capsule cycles real captures
const ci=$$('.cap img');let k=0;if(ci.length){ci[0].classList.add('on');if(!rm)setInterval(()=>{ci[k].classList.remove('on');k=(k+1)%ci.length;ci[k].classList.add('on')},1800);}
// copilot carousel
const tb=$$('.tb'),sd=$$('.sd');let cur=0;if(sd.length){const go=i=>{cur=(i+sd.length)%sd.length;tb.forEach((b,j)=>{b.classList.toggle('on',j===cur);b.setAttribute('aria-selected',j===cur);b.tabIndex=j===cur?0:-1});sd.forEach((s,j)=>{s.classList.toggle('on',j===cur);s.setAttribute('aria-hidden',j!==cur)})};
$('.tbs')&&$('.tbs').addEventListener('keydown',e=>{const k={ArrowRight:1,ArrowLeft:-1}[e.key];if(k){go(cur+k);tb[cur].focus();e.preventDefault()}});
tb.forEach(b=>b.addEventListener('click',()=>go(+b.dataset.i)));$('.arw--p').addEventListener('click',()=>go(cur-1));$('.arw:not(.arw--p)').addEventListener('click',()=>go(cur+1));}
// copy email
const cp=$('#cpy');if(cp)cp.addEventListener('click',()=>{const done=()=>{cp.textContent='Adresse copiée';setTimeout(()=>cp.textContent='Copier l’adresse',1800)};navigator.clipboard?navigator.clipboard.writeText('aknoweb.contact@gmail.com').then(done,()=>location.href='mailto:aknoweb.contact@gmail.com'):location.href='mailto:aknoweb.contact@gmail.com'});
// header colour over dark parts
const hd=$('#hd'),darks=$$('.dk,.ft');const hu=()=>{const y=40;hd.classList.toggle('inv',darks.some(s=>{const r=s.getBoundingClientRect();return r.top<y&&r.bottom>y}))};window.__hu=hu;addEventListener('scroll',hu,{passive:true});hu();

// WhatsApp button: discreet, shows after the first screen on small viewports, hidden while the menu is open (CSS)
const wa=$('.wa');if(wa){const wu=()=>wa.classList.toggle('show',innerWidth>768||scrollY>innerHeight*.6);addEventListener('scroll',wu,{passive:true});addEventListener('resize',wu);wu()}
// intro (home, once per session). The hero text is painted on the first frame underneath, so LCP is not delayed by the overlay.
const pre=$('#pre'),EO='cubic-bezier(.19,1,.22,1)',EIO='cubic-bezier(.87,0,.13,1)';
const heroIn=del=>{if(rm)return;$$('.hero .ml i').forEach((l,i)=>l.animate([{transform:'translateY(105%) rotate(4deg)'},{transform:'none'}],{duration:1000,delay:del+i*90,easing:EO,fill:'backwards'}));
 const c=$('.hero .cap');c&&c.animate([{transform:'scale(0) rotate(-12deg)'},{transform:'none'}],{duration:1100,delay:del+350,easing:EO,fill:'backwards'});
 $$('.hero .rv').forEach((e,i)=>e.animate([{opacity:.01,transform:'translateY(36px)'},{opacity:1,transform:'none'}],{duration:900,delay:del+500+i*80,easing:EO,fill:'backwards'}))};
if(pre){if(d.classList.contains('no-pre')||rm){pre.remove()}else{try{sessionStorage.akIntro=1}catch(e){}
 const ak=$('.pre-ak'),tgt=$('.lg-b svg'),n=$('.pre-n'),bar=$('.pre-l i'),T0=performance.now();let fin=false,go2=false;tgt.style.opacity=0;
 const im=$$('img').filter(i=>i.loading!=='lazy'&&i.getBoundingClientRect().top<innerHeight*1.2);
 const end=()=>{if(fin)return;fin=true;pre.remove();tgt.style.opacity=''};setTimeout(end,2500);
 let P=0;const tick=()=>{if(fin)return;const t=(performance.now()-T0)/1000,real=im.length?im.filter(i=>i.complete).length/im.length:1,goal=Math.min(100,Math.max(real*100*Math.min(1,t/.9),t/.8*100));P+=(goal-P)*.3;if(goal>=100&&P>99.5)P=100;n.textContent=String(Math.round(P)).padStart(3,'0');bar.style.transform='scaleX('+P/100+')';
  if(P>=100&&t>.78&&!go2){go2=true;out()}else if(!go2)requestAnimationFrame(tick)};requestAnimationFrame(tick);
 const out=()=>{const a=ak.getBoundingClientRect(),b=tgt.getBoundingClientRect(),s=b.width/a.width;
  ak.animate([{transform:'translate(-50%,-50%)'},{transform:`translate(${b.left-a.left-a.width/2}px,${b.top-a.top-a.height/2}px) scale(${s})`}],{duration:550,easing:EIO,fill:'forwards'});
  $('.pre-f').animate([{opacity:1},{opacity:0,transform:'translateY(8px)'}],{duration:250,fill:'forwards'});
  const cl=(e,del,r)=>e.animate([{clipPath:`inset(0 0 0% 0${r?' round 0 0 0px 0px':''})`},{clipPath:`inset(0 0 100% 0${r?' round 0 0 40px 40px':''})`}],{duration:600,delay:del,easing:EIO,fill:'forwards'});
  cl($('.pre-w'),100,1);const lb=cl($('.pre-b'),190,0);
  setTimeout(()=>{tgt.style.opacity='';ak.style.opacity=0},430);heroIn(250);lb.finished.then(end,end)}}}
else if($('.hero'))heroIn(60);
// motion layer on first interaction
if(!rm&&ME&&window.Promise){const EV=['pointermove','pointerdown','wheel','touchstart','keydown','scroll'];const load=()=>{EV.forEach(e=>removeEventListener(e,load));const s=document.createElement('script');s.src=ME.replace(/base(\.min)?\.js.*$/,'fx.js');document.body.appendChild(s)};EV.forEach(e=>addEventListener(e,load,{passive:true,once:true}))}
})();
