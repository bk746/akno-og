// Service panels — GSAP, transform/opacity only. Each loop ≈5s, plays only in view.
(()=>{if(!window.gsap)return;const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const X='expo.out',SP='elastic.out(1,.6)';
const mob=()=>innerWidth<769;
const fit=()=>$$('.sc-a').forEach(p=>{const s=$('.stg',p);if(!s)return;const refH=mob()?Math.min(330,p.clientHeight):400;const k=mob()?.95:.84;gsap.set(s,{scale:Math.min(p.clientWidth/440,refH/400)*k})});fit();addEventListener('resize',fit);
const sheen=(s,t,at)=>t.fromTo($$('.sheen',s),{xPercent:-130},{xPercent:130,duration:1.1,ease:'power2.inOut',stagger:.06},at);
const B={
web(s){const v=$$('.v',s),hi=$$('.w-hi img',s),Z=[60,30,0,10,20,40];let k=0;
 const tl=gsap.timeline({repeat:-1,onRepeat:()=>{gsap.set(hi,{opacity:0});k=(k+1)%hi.length;gsap.set(hi[k],{opacity:1})}});
 gsap.set(v,{z:i=>Z[i]});gsap.set(hi.slice(1),{opacity:0});
 tl.fromTo(v,{z:-420,y:(i)=>[-60,-20,40,60,80,120][i],rotationX:28,opacity:0},{z:i=>Z[i],y:0,rotationX:0,opacity:1,duration:1.3,ease:X,stagger:.1})
 .fromTo($('.w-ht',s).children,{opacity:0,x:-14},{opacity:1,x:0,duration:.6,ease:X,stagger:.07},.6);sheen(s,tl,1.5);
 tl.to(v,{z:i=>Z[i]*2.4,duration:1.4,ease:'sine.inOut'},1.8).addLabel('end',3.3)
 .to(v,{z:i=>Z[i]+160,y:i=>[-30,-12,10,20,26,40][i],opacity:0,duration:.8,ease:'power3.in',stagger:{each:.05,from:'end'}},4.1);return tl},
ux(s){const card=$('.u-card',s),wf=$$('.u-wf i',s),cols=$$('.u-cols i',s),fill=$('.u-fill',s),ln=$$('.u-t span',s),btn=$('.u-btn',s),cur=$('.u-cur',s),rip=$('.u-rip',s),slot=$('.u-slot',s);
 const tl=gsap.timeline({repeat:-1,repeatDelay:.2});
 tl.fromTo(card,{z:-200,rotationX:18,opacity:0},{z:0,rotationX:0,opacity:1,duration:.9,ease:X})
 .fromTo(wf,{scaleX:0,scaleY:.04,opacity:1},{scaleX:1,duration:.5,ease:'power3.out',stagger:.08},.3).to(wf,{scaleY:1,duration:.45,ease:'power3.out',stagger:.08},.65)
 .fromTo(cols,{scaleY:0,transformOrigin:'50% 0'},{scaleY:1,duration:.6,ease:X,stagger:.04},1.25)
 .fromTo(fill,{opacity:0},{opacity:1,duration:.4},1.75).fromTo(ln,{opacity:0,y:14},{opacity:1,y:0,duration:.6,ease:X,stagger:.08},1.85).to(wf,{opacity:0,duration:.3},1.85)
 .to(cols,{opacity:0,duration:.4},2.3).fromTo($('.u-blue',s),{opacity:0,scale:1.15},{opacity:1,scale:1,duration:.8,ease:X},2.35).fromTo($('.u-c',s),{opacity:.2},{opacity:1,duration:.6},2.45)
 .fromTo(btn,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.6,ease:SP},2.6).fromTo(slot,{opacity:0},{opacity:1,duration:.3},2.8)
 .fromTo(cur,{x:0,y:0,opacity:0},{opacity:1,duration:.2},2.7).to(cur,{x:-190,y:-84,duration:.8,ease:'power3.inOut'},2.75)
 .to(cur,{scale:.82,duration:.1},3.6).fromTo(rip,{scale:.3,opacity:.9},{scale:2.4,opacity:0,duration:.6,ease:'power2.out'},3.6).to($('.u-ring',s),{opacity:1,duration:.15},3.6)
 .to([btn,cur,rip],{x:'+=190',duration:.85,ease:'power3.inOut'},3.75).to(btn,{rotation:-3,duration:.3,yoyo:true,repeat:1},3.75)
 .to(cur,{scale:1,duration:.15},4.6).to(slot,{opacity:0,duration:.2},4.6).fromTo(btn,{scale:1},{scale:1.06,duration:.15,yoyo:true,repeat:1},4.6).to($('.u-ring',s),{opacity:0,duration:.3},4.8).addLabel('end',4.9)
 .to(card,{z:120,opacity:0,duration:.6,ease:'power3.in'},5.6).set([btn,cur,rip],{x:0,y:0,rotation:0});return tl},
seo(s){const q=$('.s-q',s),T='création site web Annecy',rs=$$('.s-r',s),P=[3,0,1,2],o={n:0},bars=$$('.s-bars i',s);
 const tl=gsap.timeline({repeat:-1,repeatDelay:.2});gsap.set(rs,{y:i=>P[i]*82});
 tl.fromTo($('.s-bar',s),{z:-160,opacity:0,y:-12},{z:30,opacity:1,y:0,duration:.8,ease:X}).fromTo(o,{n:0},{n:T.length,duration:1.1,ease:'none',onUpdate:()=>q.textContent=T.slice(0,Math.round(o.n))},.35)
 .fromTo(rs,{opacity:0,z:-120,x:-20},{opacity:1,z:0,x:0,duration:.7,ease:X,stagger:.07},1.5)
 .fromTo([$('.s-map',s),$('.s-ch',s)],{opacity:0,z:-180,y:24},{opacity:1,z:20,y:0,duration:.8,ease:X,stagger:.1},1.6)
 .to(rs,{y:i=>i*82,duration:1,ease:'expo.inOut'},2.3).to(rs[0],{z:70,duration:.5,ease:'power2.out'},2.3).to(rs[0],{z:30,duration:.8,ease:SP},2.9).fromTo($('.s-hal',s),{opacity:0},{opacity:1,duration:.5},2.9)
 .fromTo($('.pin',s),{y:-70,opacity:0},{y:0,opacity:1,duration:.9,ease:'bounce.out'},2.5).fromTo($('.pulse',s),{scale:.4,opacity:.9},{scale:3,opacity:0,duration:1.1,ease:'power2.out'},3.3)
 .fromTo($('.s-cov',s),{scaleX:1},{scaleX:0,duration:1.2,ease:'power2.inOut'},2.6).fromTo($('.s-dot',s),{opacity:0,scale:0},{opacity:1,scale:1,duration:.5,ease:SP},3.7)
 .fromTo(bars,{scaleY:0,transformOrigin:'50% 100%'},{scaleY:1,duration:.8,ease:X,stagger:.07},2.8);sheen(s,tl,3.9);
 tl.addLabel('end',4.6).to([$('.s-bar',s),...rs,$('.s-map',s),$('.s-ch',s)],{opacity:0,z:-100,duration:.6,ease:'power3.in',stagger:.03},5.3);return tl},
rf(s){const scr=$('.r-scr',s),win=$('.r-win',s),nw=$('.r-new',s),sc=$('.r-scan',s),it=$$('.rn-n,.rn-h p span,.rn-h .cta,.rn-g div',s),old=$('.r-old',s);gsap.set(win,{xPercent:-100});gsap.set(nw,{xPercent:100});
 const tl=gsap.timeline({repeat:-1,repeatDelay:.2});
 tl.fromTo(scr,{z:-220,rotationY:-14,opacity:0},{z:0,rotationY:0,opacity:1,duration:1,ease:X}).fromTo(old,{opacity:.85},{opacity:1,duration:.15,yoyo:true,repeat:3},.6)
 .fromTo(win,{xPercent:-100},{xPercent:0,duration:1.5,ease:'expo.inOut'},1.3).fromTo(nw,{xPercent:100},{xPercent:0,duration:1.5,ease:'expo.inOut'},1.3)
 .fromTo(sc,{x:0,opacity:1},{x:()=>(scr.clientWidth||423)-3,duration:1.5,ease:'expo.inOut'},1.3).to(sc,{opacity:0,duration:.3},2.8)
 .fromTo(it,{opacity:0,y:12},{opacity:1,y:0,duration:.7,ease:X,stagger:.06},2.3).to(scr,{rotationY:6,z:40,duration:1.4,ease:'sine.inOut'},2.6);sheen(s,tl,3.2);
 tl.addLabel('end',4.4).to(scr,{opacity:0,z:-160,duration:.6,ease:'power3.in'},5.1);return tl}};
$$('.sc-a').forEach(p=>{const s=$('.stg',p),lt=$('.lt',p),tl=B[s.dataset.k](s);
 gsap.set(lt,{x:p.clientWidth*.7,y:p.clientHeight*.25});
 if(rm){tl.pause(tl.labels.end);const q=$('.s-q',s);if(q)q.textContent='création site web Annecy';return}tl.pause();
 const io=new IntersectionObserver(([e])=>e.isIntersecting?tl.play():tl.pause(),{threshold:.15});io.observe(p);
 // light + gentle tilt follow the pointer; idle drift otherwise
 const lx=gsap.quickTo(lt,'x',{duration:1.2,ease:'power3'}),ly=gsap.quickTo(lt,'y',{duration:1.2,ease:'power3'}),rx=gsap.quickTo(s,'rotationX',{duration:1,ease:'power3'}),ry=gsap.quickTo(s,'rotationY',{duration:1,ease:'power3'});
 const idle=gsap.to(lt,{x:p.clientWidth*.3,y:p.clientHeight*.7,duration:6,ease:'sine.inOut',yoyo:true,repeat:-1});
 if(!mob()){p.parentNode.addEventListener('pointermove',e=>{const r=p.getBoundingClientRect();idle.pause();lx(e.clientX-r.left);ly(e.clientY-r.top);ry(((e.clientX-r.left)/r.width-.5)*10);rx(-((e.clientY-r.top)/r.height-.5)*8)});
 p.parentNode.addEventListener('pointerleave',()=>{rx(0);ry(0);idle.resume()})}});
})();
