/* AKNO motion layer, loaded after the first interaction so GSAP, Lenis and WebGL stay off the critical rendering path */
(()=>{const d=document.documentElement,$=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)],rm=matchMedia('(prefers-reduced-motion: reduce)').matches,hd=$('#hd');
if(rm||window.__akfx)return;window.__akfx=1;
// fluid background (written from scratch): domain-warped noise in AKNO blues
const cv=$('#fx'),gl=cv&&cv.getContext('webgl',{antialias:false,powerPreference:'low-power'});const S={mx:.7,my:.5,tx:.7,ty:.5,s:0};let draw=()=>{};
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
}catch(e){draw=()=>{}}
// render loop: paused when the tab is hidden or a dark panel fully covers the viewport (the fluid is then invisible)
const darks=$$('.dk,.ft');let on=false;const covered=()=>darks.some(s=>{const r=s.getBoundingClientRect();return r.top<=0&&r.bottom>=innerHeight});
const loop=()=>{if(!document.hidden&&!covered()){draw();if(!on){on=true;cv.classList.add('on')}}requestAnimationFrame(loop)};if(gl)requestAnimationFrame(loop);
addEventListener('pointermove',e=>{S.tx=e.clientX/innerWidth;S.ty=1-e.clientY/innerHeight},{passive:true});
gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({lerp:.09});window.__lenis=lenis;lenis.on('scroll',ScrollTrigger.update);lenis.on('scroll',()=>window.__hu&&__hu());gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=a.getAttribute('href').length>1&&$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-90,duration:1.3})}}));
// char split (keeps nested elements such as the capsule, keeps words unbreakable)
const split=el=>{const out=[];[...el.childNodes].forEach(n=>{if(n.nodeType!==3)return;const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.append(w);return}const ws=document.createElement('span');ws.className='w';[...w].forEach(ch=>{const c=document.createElement('span');c.className='ch';c.textContent=ch;ws.append(c);out.push(c)});f.append(ws)});n.replaceWith(f)});return out};
const below=e=>e.getBoundingClientRect().top>innerHeight*.98;
const sts=$$('.st').filter(h=>!h.closest('.pg-h')&&below(h));sts.forEach(h=>$$('i',h).forEach(i=>{i.style.transform='none';i._c=split(i)}));
const chs=sel=>$$(sel).flatMap(i=>i._c||[]);
{const c0=chs('.st i');c0.length&&gsap.set(c0,{yPercent:115,rotate:6})}
// only content still below the fold gets a reveal; what is already on screen stays put
$$('main .rv').forEach(e=>{if(!below(e))e.classList.add('in')});
// hero leaves: lines drift apart at different speeds
if($('.hero'))[['.m0',-70],['.m1',-30],['.m2',-120]].forEach(([s,x])=>gsap.to(s,{xPercent:x/10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}}));
// staircase titles, char by char
sts.forEach(h=>gsap.to(chs('.st i').filter(c=>h.contains(c)),{yPercent:0,rotate:0,duration:1.15,ease:'expo.out',stagger:.025,scrollTrigger:{trigger:h,start:'top 82%',once:true}}));
ScrollTrigger.batch('main .rv:not(.in)',{start:'top 88%',once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:1.1,ease:'expo.out',stagger:.09})});
// light -> dark: the black panel opens from an inset rounded window
const mob=innerWidth<769;
$$('.dk,.ft').forEach(s=>gsap.fromTo(s,{clipPath:`inset(0% ${mob?3:6}% 0% ${mob?3:6}% round ${mob?28:56}px)`},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:s,start:'top bottom',end:'top 15%',scrub:true}}));
// cinematic stack (desktop only): covered card recedes by scale + slight blur; dim veil capped at 10%
const resetStackCards=()=>{$$('.sc').forEach(c=>{const cc=$('.sc-c',c);gsap.set(cc,{scale:1,yPercent:0,filter:'none',clearProps:'transform,filter'});$$('.dim',cc).forEach(d=>d.remove())})};
const stackMmq=gsap.matchMedia();
stackMmq.add('(min-width: 769px)',()=>{const cards=$$('.sc');cards.forEach((c,i)=>{const cc=$('.sc-c',c);const dim=document.createElement('i');dim.className='dim';cc.append(dim);
 if(i<cards.length-1)gsap.timeline({scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top 110px',scrub:true}}).to(cc,{scale:.9,yPercent:-3,filter:'blur(1.5px)',ease:'none'},0).to(dim,{opacity:.1,ease:'none'},0);
});return()=>{resetStackCards()}});
stackMmq.add('(max-width: 768px)',()=>{resetStackCards();return()=>{}});
// featured project: window opens, image settles
$$('.wc--b').forEach(ft=>{gsap.fromTo(ft,{clipPath:'inset(14% 10% 14% 10% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 28px)',ease:'none',scrollTrigger:{trigger:ft,start:'top 95%',end:'top 25%',scrub:true}});
gsap.fromTo($('.wc-i',ft),{scale:1.25},{scale:1,ease:'none',scrollTrigger:{trigger:ft,start:'top 95%',end:'top 25%',scrub:true}})});
// work cards rise in staggered columns
if(!mob)$$('.wg .wc').forEach((c,i)=>gsap.from(c,{y:i%2?160:80,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'top 40%',scrub:true}}));
// magnetic buttons (fine pointers)
if(matchMedia('(pointer:fine)').matches){$$('.pb,.bu,.arw').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.28,duration:.5,ease:'power3'})});b.addEventListener('pointerleave',()=>gsap.to(b,{x:0,y:0,duration:.7,ease:'elastic.out(1,.45)'}))})}
// header hides on scroll down
let ly=0;lenis.on('scroll',({scroll})=>{if(Math.abs(scroll-ly)<6)return;hd.style.transform=scroll>ly&&scroll>300&&!d.classList.contains('mn-o')?'translateY(-120%)':'';ly=scroll});
addEventListener('load',()=>ScrollTrigger.refresh());
})();
