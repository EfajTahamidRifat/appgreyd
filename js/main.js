gsap.registerPlugin(ScrollTrigger);
const FRAMES=210,FPS=30,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,touch=matchMedia('(hover:none)').matches;

/* ---------- Filipino copy (English lives in the HTML) ---------- */
const FIL={n1:'Gawa',n2:'Serbisyo',n3:'Gumawa',n4:'Portfolio',n5:'CEO',n6:'Kontak',live:'On air: tumatanggap na ng kampanya para sa 2026',
hp:'Marketing, produksyon at software para sa mga brand sa Pilipinas, mula TV screen hanggang cellphone ng customer mo.',cta:'Simulan ang proyekto',cta2:'Tingnan ang serbisyo',
s1:'Dinadala namin ang brand mo sa entablado.',s2:'Ipinagmamalaking media partner ng The Singing Lodi ng TV5.',s3:'Mag-scroll pabalik, mari-rewind.',
sh:'Aming mga pangunahing serbisyo',a1d:'Mga kampanyang aabot sa tamang tao.',a2d:'Mga kolaborasyon sa brand, celebrity at sponsor.',a3d:'Content, posting at komunidad, kami na ang bahala.',a4d:'Shoots, palabas at events kasama ang BWORK Productions.',a5d:'Lumabas sa Google at panatilihin ang traffic.',a6d:'Mababait na team na sasagot sa mga customer mo.',
bh:'Bago: gumagawa na rin kami ng software.',b1:'Paggawa ng app',more:'…at marami pa. Sabihin mo lang ang kailangan mo.',ph:'Mga kamakailang proyekto',
p1:'Pambansang talent search sa TV5, Hunyo hanggang Setyembre 2026.',p2:'Online charity show para sa PARC Foundation.',p3:'Produksyon at sponsorship marketing para sa RSM.',p4:'Content at ad campaigns sa lahat ng social platforms.',p5:'Content, partnerships at social ads para sa paglago ng brand.',p6:'Digital at partnership marketing, pati ad management.',
ch:'Aming mga kliyente',ich:'Mga koneksyon sa industriya',new:'Bago',role:'Founder at CEO',c1:'Nagsimula sa ABS-CBN (2012 hanggang 2015) bilang coordinator at researcher ng It\u2019s Showtime.',c2:'Sumunod ang Viva Entertainment, mga event sa World Trade Center Philippines, at digital marketing para sa mga online brand.',c3:'Pinamunuan ang partnerships at media deals sa UTOL at RSM Entertainment.',c4:'Ngayon, pinapatakbo niya ang Apgreyd para palaguin ang mga brand gamit ang matatalinong ideya at matibay na pakikipagtulungan.',
awk:'Parangal · 2025',awh:'Most Outstanding Businessman of the Year',awd:'Kinilala bilang isa sa mga pinagkakatiwalaang digital marketing services sa Pilipinas.',awm:'Nobyembre 23, 2025 · Lancaster Hotel Mandaluyong',
th:'Ang team',m0:'General Manager',m3:'Head ng Human Resources',ft:'May brand ka bang palalaguin? Mag-usap tayo.'};
const tEls=$$('[data-t]');tEls.forEach(e=>e.dataset.en=e.innerHTML);
function setLang(l,animate=true){
  const go=()=>{tEls.forEach(e=>e.innerHTML=(l==='fil'&&FIL[e.dataset.t])||e.dataset.en);document.documentElement.lang=l==='fil'?'fil':'en';buildCrawl(l)};
  $$('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===l));localStorage.setItem('apg-lang',l);
  animate&&!reduce?gsap.timeline().to(tEls,{autoAlpha:0,y:-8,duration:.18,stagger:{amount:.15}}).add(go).to(tEls,{autoAlpha:1,y:0,duration:.3,stagger:{amount:.2}}):go();
}
$$('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));

/* ---------- Smooth scroll ---------- */
const lenis=new Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});
let vel=0;lenis.on('scroll',e=>{ScrollTrigger.update();vel=e.velocity});gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a=>a.onclick=e=>{e.preventDefault();lenis.scrollTo(a.getAttribute('href'),{offset:0})});

/* ---------- Frame sequence (scroll-scrubbed video) ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d'),imgs=new Array(FRAMES),pad=n=>String(n+1).padStart(3,'0');
const load=i=>new Promise(r=>{const im=new Image();im.onload=im.onerror=()=>{imgs[i]=im;r()};im.src=`frames/f${pad(i)}.webp`});
let cur=0;
function draw(i){let k=i;while(k>0&&!(imgs[k]&&imgs[k].naturalWidth))k--;const im=imgs[k];if(!im||!im.naturalWidth)return;
  if(cv.width!==im.naturalWidth){cv.width=im.naturalWidth;cv.height=im.naturalHeight}ctx.drawImage(im,0,0)}

/* ---------- Preloader, then the intro ---------- */
(async()=>{
  const head=[...Array(20).keys()],p={v:0};let done=0;
  const bump=()=>{const t=Math.round(++done/(head.length+1)*100);gsap.to(p,{v:t,duration:.4,onUpdate:()=>{$('#preN').textContent=Math.round(p.v);$('#preBar').style.width=p.v+'%'}})};
  await Promise.all([...head.map(i=>load(i).then(bump)),document.fonts.ready.then(bump)]);
  draw(0);
  $$('.ln>span').forEach(s=>{s.innerHTML=[...s.textContent].map(c=>`<em style="display:inline-block;font-style:normal">${c===' '?'&nbsp;':c}</em>`).join('')});
  const saved=localStorage.getItem('apg-lang');if(saved==='fil')setLang('fil',false);
  gsap.timeline({onComplete:init})
    .to('#pre',{yPercent:-100,duration:.9,ease:'power4.inOut',delay:.3})
    .from('.ln em',{yPercent:120,rotate:8,duration:.9,ease:'power4.out',stagger:.03},'-=.35')
    .from('.onair,.hero-p,.hero-cta,.nav',{autoAlpha:0,y:20,duration:.7,stagger:.08},'-=.7')
    .from('.fl',{autoAlpha:0,scale:.9,y:60,duration:1,stagger:.12,ease:'power3.out'},'-=.8');
  for(let i=20;i<FRAMES;i++)await load(i); // rest streams in the background
})();

function buildCrawl(l){
  const names=['a1','a2','a3','a4','a5','a6','b2','b3','b4','b5'].map(k=>{const e=$(`[data-t="${k}"]`);return e?e.textContent:k});
  const el=$('#crawl');el.textContent=(names.join('   //   ')+'   //   ').repeat(3);
}
function init(){
  buildCrawl();
  gsap.to('#crawl',{xPercent:-33.3,duration:40,ease:'none',repeat:-1});

  /* hero parallax: scroll depth + mouse */
  $$('.fl').forEach(f=>gsap.to(f,{y:+f.dataset.s*10,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}}));
  if(!touch)addEventListener('mousemove',e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    $$('.fl').forEach((f,i)=>gsap.to(f.querySelector('img'),{x:x*-(18+i*10),y:y*-(14+i*8),duration:1,ease:'power2.out'}))});
  gsap.to('.hero-h',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

  /* the scroll-scrubbed stage: eased playhead so 30fps never stutters */
  const tc=$('#tc'),dir=$('#dir'),sI=$('#scrubI');let target=0,pos=0,sc=1,lastDir=1;
  ScrollTrigger.create({trigger:'#stage',start:'top top',end:'bottom bottom',onUpdate:s=>{
    const pr=s.progress;target=gsap.utils.clamp(0,1,(pr-.05)/.9)*(FRAMES-1);if(s.direction)lastDir=s.direction;sI.style.transform=`scaleX(${pr})`;
    [['.k1',.14,.32],['.k2',.42,.6],['.k3',.72,.9]].forEach(([k,a,b])=>{
      const o=pr<a||pr>b?0:1;gsap.to(k,{opacity:o,x:o?0:pr<a?60:-60,duration:.5,ease:'power3.out',overwrite:true})});
    dir.textContent=lastDir<0?'\u25C0\u25C0 REWIND':'PLAY \u25B6'}});
  gsap.ticker.add(()=>{pos+=(target-pos)*.14;const f=Math.round(pos);
    if(f!==cur){cur=f;draw(f);const sec=f/FPS;tc.textContent=`00:${String(Math.floor(sec)).padStart(2,'0')}:${String(f%FPS).padStart(2,'0')}`}
    sc+=((1+Math.min(Math.abs(vel)*.004,.06))-sc)*.1;cv.style.transform=`scale(${sc})`});
  gsap.fromTo('#screen',{clipPath:'inset(30% 24% 30% 24% round 18px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',
    scrollTrigger:{trigger:'#stage',start:'top top',end:'+=90%',scrub:true}});
  gsap.set('.k1,.k2,.k3',{opacity:0});

  /* services: image follows the cursor */
  const peek=$('#peek'),pi=peek.querySelector('img'),px=gsap.quickTo(peek,'x',{duration:.5,ease:'power3'}),py=gsap.quickTo(peek,'y',{duration:.5,ease:'power3'});
  $$('#rows li').forEach(li=>{
    li.onmouseenter=()=>{pi.src=li.dataset.img;gsap.to(peek,{opacity:1,scale:1,rotate:-3,duration:.35,ease:'back.out(2)'})};
    li.onmouseleave=()=>gsap.to(peek,{opacity:0,scale:.6,duration:.25});
    li.onmousemove=e=>{px(e.clientX+30);py(e.clientY-100)};
  });
  gsap.from('#rows li',{y:60,opacity:0,stagger:.08,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'#rows',start:'top 80%'}});

  /* build: neon terminal that reacts to the list */
  const S={
    app:['app --new "your-brand"','\u2713 iOS + Android from one codebase','\u2713 push notifications, payments, login','\u2713 ready for the app stores'],
    web:['site --build','\u2713 fast, mobile-first, easy to edit','\u2713 online booking, shops, landing pages','\u2713 SEO set up from day one'],
    ai:['agent --start "support"','\u2713 reads your FAQs and product data','\u2713 answers customers in English and Filipino','\u2713 hands off to a human when needed'],
    sw:['build --custom "ops-dashboard"','\u2713 orders, staff, reports in one place','\u2713 replaces the spreadsheets','\u2713 made to fit how you work'],
    tg:['bot --deploy telegram','\u2713 AI replies, bookings, order taking','\u2713 broadcasts to your community','\u2713 live in days, not months'],
    mp:['partner --match "your-brand"','\u2713 TV, radio, events and digital','\u2713 sponsor and media placements','\u2713 talk to us about your campaign']};
  const tb=$('#termB'),tt=$('#termT');let typer;
  function show(k){$$('#tech li').forEach(l=>l.classList.toggle('on',l.dataset.k===k));tt.textContent=S[k][0].split(' ')[0];
    const txt=S[k].map((l,i)=>i?l:'$ '+l).join('\n'),o={n:0};typer&&typer.kill();
    typer=gsap.to(o,{n:txt.length,duration:reduce?0:txt.length/70,ease:'none',onUpdate:()=>tb.textContent=txt.slice(0,Math.round(o.n))})}
  $$('#tech li').forEach(li=>{li.onmouseenter=li.onclick=()=>show(li.dataset.k);
    ScrollTrigger.create({trigger:li,start:'top 55%',end:'bottom 55%',onToggle:s=>s.isActive&&show(li.dataset.k)})});
  show('app');

  /* portfolio */
  $$('.port article').forEach(a=>{
    gsap.from(a.querySelector('.im'),{clipPath:'inset(100% 0 0 0)',duration:1.1,ease:'power4.out',scrollTrigger:{trigger:a,start:'top 85%'}});
    gsap.fromTo(a.querySelector('img'),{yPercent:-8},{yPercent:8,ease:'none',scrollTrigger:{trigger:a,start:'top bottom',end:'bottom top',scrub:true}});
  });

  /* logo marquees, speed up with scroll velocity */
  /* industry connections only; clients are a fixed grid in the HTML */
  const L=[...Array(16)].map((_,i)=>`IC_${i+1}`);
  const fill=(el,list)=>el.innerHTML=[...list,...list,...list,...list].map(n=>`<div><img src="img/${n}.png" alt="" loading="lazy"></div>`).join('');
  fill($('#mq1'),L.slice(0,8));fill($('#mq2'),L.slice(8));
  gsap.from('.cl li',{y:40,opacity:0,stagger:.08,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.cl',start:'top 85%'}});
  const mqs=$$('.mq-t').map((m,i)=>gsap.fromTo(m,{xPercent:i?-50:0},{xPercent:i?0:-50,duration:45,ease:'none',repeat:-1}));
  let boost=0;lenis.on('scroll',e=>boost=Math.min(8,Math.abs(e.velocity)*.35));
  gsap.ticker.add(()=>{boost*=.94;mqs.forEach(t=>t.timeScale(1+boost))});

  /* ceo, team, contact */
  gsap.from('.ceo-i',{clipPath:'inset(0 100% 0 0)',duration:1.2,ease:'power4.out',scrollTrigger:{trigger:'.ceo',start:'top 70%'}});
  gsap.from('.ceo-t>*',{y:40,opacity:0,stagger:.1,duration:.8,scrollTrigger:{trigger:'.ceo-t',start:'top 75%'}});
  gsap.from('.tg>div',{y:80,opacity:0,stagger:.12,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.tg',start:'top 85%'}});
  gsap.from('.contact h2,.big',{yPercent:60,opacity:0,stagger:.1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.contact',start:'top 70%'}});

  /* nav hides on scroll down */
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>gsap.to('#nav',{yPercent:s.direction>0&&s.scroll()>300?-100:0,duration:.35,overwrite:true})});

  /* cursor */
  if(!touch){const cx=gsap.quickTo('#cur','x',{duration:.15}),cy=gsap.quickTo('#cur','y',{duration:.15});
    addEventListener('mousemove',e=>{cx(e.clientX);cy(e.clientY)});
    $$('a,button,#rows li,#tech li').forEach(e=>{e.addEventListener('mouseenter',()=>gsap.to('#cur',{scale:3.2,duration:.3,ease:'back.out(2)'}));e.addEventListener('mouseleave',()=>gsap.to('#cur',{scale:1,duration:.25}))})}

  /* extra motion */
  gsap.to('#prog',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
  gsap.to('.hero-h',{'--wd':64,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  $$('h2[data-t]').forEach(h=>{h.innerHTML=h.textContent.split(' ').map(w=>`<span class="wm"><i>${w}</i></span>`).join(' ');
    gsap.from(h.querySelectorAll('i'),{yPercent:115,duration:.9,ease:'power4.out',stagger:.07,scrollTrigger:{trigger:h,start:'top 88%'}})});
  const band=$('#band');band.innerHTML='<span>Basta Marketing,</span><span>Kami Na!</span>'.repeat(4);
  const bt=gsap.to(band,{xPercent:-50,duration:30,ease:'none',repeat:-1}),bsk=gsap.quickSetter(band,'skewX','deg');let sk=0;
  const spin=gsap.to('.badge',{rotation:360,duration:14,ease:'none',repeat:-1});
  gsap.ticker.add(()=>{sk+=(gsap.utils.clamp(-14,14,-vel*.8)-sk)*.12;bsk(sk);bt.timeScale(1+Math.abs(vel)*.25);spin.timeScale(1+Math.abs(vel)*.3)});
  gsap.from('#tech li',{x:-70,opacity:0,stagger:.09,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'#tech',start:'top 80%'}});
  if(!touch){
    $$('.btn,.big').forEach(b=>{const qx=gsap.quickTo(b,'x',{duration:.4,ease:'power3'}),qy=gsap.quickTo(b,'y',{duration:.4,ease:'power3'});
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();qx((e.clientX-r.left-r.width/2)*.25);qy((e.clientY-r.top-r.height/2)*.35)});
      b.addEventListener('mouseleave',()=>{qx(0);qy(0)})});
    $$('.port article').forEach(a=>{const im=a.querySelector('.im');
      a.addEventListener('mousemove',e=>{const r=a.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(im,{rotateY:x*14,rotateX:-y*14,duration:.5,ease:'power2.out'})});
      a.addEventListener('mouseleave',()=>gsap.to(im,{rotateX:0,rotateY:0,duration:.8,ease:'elastic.out(1,.5)'}))})}
  ScrollTrigger.refresh();
}
