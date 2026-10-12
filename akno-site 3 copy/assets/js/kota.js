(()=>{const d=document.documentElement,$=(s,c=document)=>c.querySelector(s),$$=s=>[...document.querySelectorAll(s)],rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
// fluid background (written from scratch): domain-warped noise in AKNO blues
const cv=$('#fx'),gl=cv.getContext('webgl',{antialias:false});const S={mx:.7,my:.5,tx:.7,ty:.5,s:0};let draw=()=>{};
if(gl)try{const fs=`precision highp float;uniform vec2 R,MS;uniform float T,SC;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=uv*vec2(R.x/R.y,1.)*1.6;float t=T*.05+SC*.6;
 vec2 q=vec2(fb(p+t),fb(p+vec2(5.2,1.3)-t));vec2 r=vec2(fb(p+3.*q+vec2(1.7,9.2)+t*1.4+(MS-.5)*.6),fb(p+3.*q+vec2(8.3,2.8)-t));float f=fb(p+2.6*r);
 vec3 c=vec3(.957,.957,.972);
 float L=smoothstep(.62,1.,uv.x+.05*sin(SC*2.))*smoothstep(.2,.55,uv.y);float L2=smoothstep(.2,1.,uv.x);
 float band=smoothstep(.35,.85,f+uv.x*.55-.25);
 c=mix(c,vec3(.82,.87,1.),band*.75);
 c=mix(c,vec3(.20,.78,1.),smoothstep(.55,.95,r.x+uv.x*.4-.15)*.8*L2);
 c=mix(c,vec3(.12,.06,1.),smoothstep(.58,1.,r.y+uv.x*.5-.12)*.95*L);
 c=mix(c,vec3(.04,.02,.42),smoothstep(.78,1.05,r.y*f*1.5+uv.x*.35)*.7*L);
 c=mix(c,vec3(.60,.40,1.),smoothstep(.66,.98,q.x*1.1+uv.y*.2)*.5);
 float sp=pow(max(0.,1.-length((uv-MS)*vec2(R.x/R.y,1.))*1.6),3.);c+=vec3(.1,.12,.25)*sp*L;
 c+=(h(gl_FragCoord.xy+fract(T)*40.)-.5)*.04;gl_FragColor=vec4(c,1.);}`;
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw gl.getShaderInfoLog(o);return o};
const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pg);gl.useProgram(pg);
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
const uR=gl.getUniformLocation(pg,'R'),uT=gl.getUniformLocation(pg,'T'),uM=gl.getUniformLocation(pg,'MS'),uS=gl.getUniformLocation(pg,'SC');const t0=performance.now();
draw=()=>{const r=Math.min(devicePixelRatio||1,1.5)*.6,W=innerWidth*r|0,H=innerHeight*r|0;if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;gl.viewport(0,0,W,H)}S.mx+=(S.tx-S.mx)*.03;S.my+=(S.ty-S.my)*.03;gl.uniform2f(uR,W,H);gl.uniform1f(uT,rm?40:(performance.now()-t0)/1000+40);gl.uniform2f(uM,S.mx,S.my);S.s+=(scrollY/innerHeight-S.s)*.05;gl.uniform1f(uS,S.s);gl.drawArrays(gl.TRIANGLES,0,3)};
}catch(e){console.warn(e)}
let vis=true;const loop=()=>{if(vis)draw();if(!rm)requestAnimationFrame(loop)};loop();addEventListener('resize',()=>rm&&draw());
addEventListener('pointermove',e=>{S.tx=e.clientX/innerWidth;S.ty=1-e.clientY/innerHeight});
const mn=$('#mn');if(mn)mn.hidden=true;
// legal details open from #hash
const oh=()=>{const t=location.hash&&document.getElementById(location.hash.slice(1));if(t&&t.tagName==='DETAILS'){t.open=true;setTimeout(()=>t.scrollIntoView({block:'center'}),60)}};addEventListener('hashchange',oh);addEventListener('load',oh);
// contact form: prefill ?service=, honest status
const fm=$('#fm');if(fm){const q=new URLSearchParams(location.search).get('service');if(q){const c=fm.querySelector(`[data-s="${q}"]`);if(c)c.checked=true}fm.addEventListener('submit',()=>{const s=$('#fm-st');if(s)s.textContent='Envoi en cours…'})}
// hero capsule cycles real captures
const ci=$$('.cap img');let k=0;if(ci.length){ci[0].classList.add('on');if(!rm)setInterval(()=>{ci[k].classList.remove('on');k=(k+1)%ci.length;ci[k].classList.add('on')},1800);}
// copilot carousel
const tb=$$('.tb'),sd=$$('.sd');let cur=0;if(sd.length){const go=i=>{cur=(i+sd.length)%sd.length;tb.forEach((b,j)=>{b.classList.toggle('on',j===cur);b.setAttribute('aria-selected',j===cur)});sd.forEach((s,j)=>s.classList.toggle('on',j===cur))};
tb.forEach(b=>b.addEventListener('click',()=>go(+b.dataset.i)));$('.arw--p').addEventListener('click',()=>go(cur-1));$('.arw:not(.arw--p)').addEventListener('click',()=>go(cur+1));}
// copy email
const cp=$('#cpy');if(cp)cp.addEventListener('click',()=>{const done=()=>{cp.textContent='Adresse copiée';setTimeout(()=>cp.textContent='Copier l’adresse',1800)};navigator.clipboard?navigator.clipboard.writeText('aknoweb.contact@gmail.com').then(done,()=>location.href='mailto:aknoweb.contact@gmail.com'):location.href='mailto:aknoweb.contact@gmail.com'});
// header colour over dark parts
const hd=$('#hd'),darks=$$('.dk,.ft');const hu=()=>{const y=40;hd.classList.toggle('inv',darks.some(s=>{const r=s.getBoundingClientRect();return r.top<y&&r.bottom>y}))};addEventListener('scroll',hu,{passive:true});hu();
if(rm||!window.gsap){$('#pre')&&$('#pre').remove();return}
d.classList.add('js');gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({lerp:.09});window.__lenis=lenis;lenis.on('scroll',ScrollTrigger.update);lenis.on('scroll',hu);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=a.getAttribute('href').length>1&&$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-90,duration:1.3})}}));
// char split (keeps nested elements such as the capsule, keeps words unbreakable)
const split=el=>{const out=[];[...el.childNodes].forEach(n=>{if(n.nodeType!==3)return;const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.append(w);return}const ws=document.createElement('span');ws.className='w';[...w].forEach(ch=>{const c=document.createElement('span');c.className='ch';c.textContent=ch;ws.append(c);out.push(c)});f.append(ws)});n.replaceWith(f)});return out};
$$('.ml i,.st i').forEach(i=>{i.style.transform='none';i._c=split(i)});
const chs=sel=>$$(sel).flatMap(i=>i._c);
gsap.set(chs('.ml i,.st i'),{yPercent:115,rotate:6});
// hero: first second
const pre=$('#pre'),intro=pre&&!d.classList.contains('no-pre')&&!rm;
const heroIn=(tl,at)=>tl.to(chs('.ml i'),{yPercent:0,rotate:0,duration:1,ease:'expo.out',stagger:{each:.018}},at)
 .fromTo('.cap',{scale:0,rotate:-12},{scale:1,rotate:0,duration:1.1,ease:'expo.out',clearProps:'width,transform,scale,rotate'},'<.35')
 .to('.hero .rv',{opacity:1,y:0,duration:.9,stagger:.08,ease:'expo.out'},'<.15');
if(rm){pre&&pre.remove();gsap.set(chs('.ml i'),{yPercent:0,rotate:0});gsap.set('.hero .rv',{opacity:1,y:0});gsap.set('.cap',{clearProps:'all'})}
else if(!intro){pre&&pre.remove();gsap.set('.hd',{opacity:0});const t0=gsap.timeline({delay:.05}).to('.hd',{opacity:1,duration:.6});if($('.hero'))heroIn(t0,0)}
else{try{sessionStorage.akIntro=1}catch(e){}
 const ak=$('.pre-ak'),pa=ak.querySelector('path'),L=pa.getTotalLength(),tgt=$('.lg-b svg'),T0=performance.now();
 gsap.set(pa,{strokeDasharray:L,strokeDashoffset:L});gsap.set(tgt,{opacity:0});d.style.overflow='hidden';
 const im=$$('img').filter(i=>i.loading!=='lazy'&&i.getBoundingClientRect().top<innerHeight*1.2);let ld=0;const done=()=>im.filter(i=>i.complete).length;
 const P={v:0},n=$('.pre-n'),bar=$('.pre-l i'),draw=()=>{n.textContent=String(Math.round(P.v)).padStart(3,'0');bar.style.transform='scaleX('+P.v/100+')'};
 // progress = real image loading, eased; forced to 100 by 1.15s at the latest
 const tick=()=>{const t=(performance.now()-T0)/1000,real=im.length?done()/im.length:1,goal=Math.min(100,Math.max(real*100*Math.min(1,t/.9),Math.min(100,t/.8*100)));P.v+=(goal-P.v)*.3;if(goal>=100&&P.v>99.5)P.v=100;draw();return P.v>=100};
 let fin=false;const end=()=>{if(fin)return;fin=true;gsap.ticker.remove(loop);pre.remove();gsap.set(tgt,{opacity:1});d.style.overflow='';gsap.set('.hd',{opacity:1});gsap.set(chs('.ml i'),{yPercent:0,rotate:0});gsap.set('.hero .rv',{opacity:1,y:0});gsap.set('.cap',{clearProps:'all'})};
 setTimeout(()=>{if(!fin)end()},2500); // hard cap
 const tl=gsap.timeline({paused:true});
 tl.to(pa,{strokeDashoffset:0,duration:.55,ease:'power2.inOut'})
  .to(pa,{fillOpacity:1,duration:.22,ease:'power1.in'},'-=.08').set(pa,{strokeWidth:0,stroke:'none',strokeDasharray:'none'})
  const t2=gsap.timeline({paused:true});t2.add(()=>{const a=ak.getBoundingClientRect(),b=tgt.getBoundingClientRect();gsap.set(ak,{xPercent:0,yPercent:0,x:a.left,y:a.top,left:0,top:0,width:a.width});gsap.to(ak,{x:b.left,y:b.top,width:b.width,duration:.55,ease:'expo.inOut'})})
  .to('.pre-f',{opacity:0,y:8,duration:.25},'<')
  .to('.pre-w',{clipPath:'inset(0 0 100% 0 round 0 0 40px 40px)',duration:.6,ease:'expo.inOut'},'<.1')
  .to('.pre-b',{clipPath:'inset(0 0 100% 0)',duration:.6,ease:'expo.inOut'},'<.09')
  .to('.hd',{opacity:1,duration:.3},'<.25').add(()=>{gsap.set(tgt,{opacity:1});gsap.set(ak,{opacity:0})},'<.08');
 heroIn(t2,'<-.05');t2.add(end);
 gsap.set('.hd',{opacity:0});gsap.set(['.pre-w','.pre-b'],{clipPath:'inset(0 0 0% 0 round 0 0 0px 0px)'});tl.play();
 const loop=()=>{if(tick()&&!tl.isActive()&&tl.progress()===1&&t2.paused()&&t2.progress()===0){t2.play()}};gsap.ticker.add(loop);
 tl.eventCallback('onUpdate',null);
}
// hero leaves: lines drift apart at different speeds
if($('.hero'))[['.m0',-70],['.m1',-30],['.m2',-120]].forEach(([s,x])=>gsap.to(s,{xPercent:x/10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}}));
// staircase titles, char by char
$$('.st').forEach(h=>gsap.to(chs('.st i').filter(c=>h.contains(c)),{yPercent:0,rotate:0,duration:1.15,ease:'expo.out',stagger:.025,scrollTrigger:{trigger:h,start:'top 82%',once:true}}));
ScrollTrigger.batch('main .rv:not(.hero .rv)',{start:'top 88%',once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:1.1,ease:'expo.out',stagger:.09})});
// light -> dark: the black panel opens from an inset rounded window
const mob=innerWidth<769;
$$('.dk,.ft').forEach(s=>gsap.fromTo(s,{clipPath:`inset(0% ${mob?3:6}% 0% ${mob?3:6}% round ${mob?28:56}px)`},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:s,start:'top bottom',end:'top 15%',scrub:true}}));
// cinematic stack: covered card recedes by scale + slight blur; dim veil capped at 10%
const cards=$$('.sc');cards.forEach((c,i)=>{const cc=$('.sc-c',c);const dim=document.createElement('i');dim.className='dim';cc.append(dim);
 if(i<cards.length-1)gsap.timeline({scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top 110px',scrub:true}}).to(cc,{scale:.9,yPercent:-3,filter:'blur(1.5px)',ease:'none'},0).to(dim,{opacity:.1,ease:'none'},0);
});
// featured project: window opens, image settles
$$('.wc--b').forEach(ft=>{gsap.fromTo(ft,{clipPath:'inset(14% 10% 14% 10% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 28px)',ease:'none',scrollTrigger:{trigger:ft,start:'top 95%',end:'top 25%',scrub:true}});
gsap.fromTo($('.wc-i',ft),{scale:1.25},{scale:1,ease:'none',scrollTrigger:{trigger:ft,start:'top 95%',end:'top 25%',scrub:true}})});
// work cards rise in staggered columns
if(!mob)$$('.wg .wc').forEach((c,i)=>gsap.from(c,{y:i%2?160:80,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'top 40%',scrub:true}}));
if(matchMedia('(pointer:fine)').matches){
 $$('.pb,.arw').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.28,duration:.5,ease:'power3'})});b.addEventListener('pointerleave',()=>gsap.to(b,{x:0,y:0,duration:.7,ease:'elastic.out(1,.45)'}))})}
// header hides on scroll down
let ly=0;lenis.on('scroll',({scroll})=>{if(Math.abs(scroll-ly)<6)return;hd.style.transform=scroll>ly&&scroll>300&&!d.classList.contains('ak-menu-open')?'translateY(-120%)':'';ly=scroll});
addEventListener('load',()=>ScrollTrigger.refresh());
})();
