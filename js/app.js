/* ---------- DATA ---------- */
const PRODUCTS=[
 {id:'honey',name:'Mountain Honey',icon:'🍯',tagline:'Pure Mountain Harvest',cat:'Honey & Salajeet',
  desc:'Raw, unfiltered honey harvested from wildflower meadows above Karimabad — thick, aromatic and gently strained, never heated.',
  usage:'Store in a cool, dry place away from direct sunlight. Crystallization is natural — gently warm the jar in water to soften.',
  ingredients:'100% raw mountain honey.',
  variants:[{w:'250g',price:1200},{w:'500g',price:2200}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'in', pairs:['tea','apricots']},
 {id:'salajeet',name:'Salajeet',icon:'🪨',tagline:'Ancient Mountain Resin',cat:'Honey & Salajeet',
  desc:'Purified mineral resin collected from high-altitude rock seams, traditionally valued for vitality and stamina.',
  usage:'Store in the provided dark glass jar, tightly sealed, away from heat.',
  ingredients:'100% purified Shilajit resin.',
  variants:[{w:'50g',price:3500}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'in', pairs:['honey']},
 {id:'tea',name:'Wild Thyme Tea',icon:'🍵',tagline:'Highland Herbal Brew',cat:'Herbal Tea',
  desc:'Hand-picked wild thyme leaves, sun-dried and packed for a fragrant, soothing highland tea.',
  usage:'Steep 1 tsp in hot water for 4–5 minutes. Store sealed in a dry place.',
  ingredients:'100% wild thyme (Ziziphora).',
  variants:[{w:'80g',price:900}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'in', pairs:['honey','giftbox-mountain']},
 {id:'nuts',name:'Mountain Nuts (Mixed)',icon:'🌰',tagline:'Orchard-Fresh Mix',cat:'Dried Fruit & Nuts',
  desc:'A hand-mixed blend of walnuts, almonds and pine nuts grown in Hunza\'s terraced orchards.',
  usage:'Keep in an airtight container. Best consumed within 3 months of opening.',
  ingredients:'Walnuts, almonds, pine nuts.',
  variants:[{w:'250g',price:1400},{w:'500g',price:2600}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'in', pairs:['apricots']},
 {id:'apricots',name:'Dried Apricots',icon:'🍑',tagline:'Sun-Dried Sweetness',cat:'Dried Fruit & Nuts',
  desc:'Naturally sun-dried apricots with no added sugar — soft, tangy-sweet and full of mountain sunshine.',
  usage:'Store in a cool, airtight container.',
  ingredients:'100% sun-dried apricots.',
  variants:[{w:'250g',price:1100},{w:'500g',price:2000}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'in', pairs:['nuts','tea']},
 {id:'cherries',name:'Hunza Cherries',icon:'🍒',tagline:'Seasonal Orchard Pick',cat:'Fresh Seasonal Produce',
  desc:'Fresh cherries picked at peak season from Hunza\'s valley orchards.',
  usage:'Refrigerate and consume within a few days of delivery.',
  ingredients:'Fresh cherries.',
  variants:[{w:'500g',price:1800}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'out', pairs:['apricots']},
 {id:'apples',name:'Fresh Apples',icon:'🍎',tagline:'Highland Orchard Apples',cat:'Fresh Seasonal Produce',
  desc:'Crisp, naturally grown apples from Hunza\'s terraced highland orchards.',
  usage:'Store in a cool place; refrigerate for longer freshness.',
  ingredients:'Fresh apples.',
  variants:[{w:'2kg',price:1600}], origin:'Sourced from Hunza, Gilgit-Baltistan', stock:'out', pairs:['nuts']},
];
const GIFTBOXES=[
 {id:'giftbox-mountain',name:'Mountain Box',tier:'Entry',price:2800,contents:['Honey 250g','Dried Apricots 150g','Kraft gift box'],icon:'🎁'},
 {id:'giftbox-hunza',name:'Hunza Collection',tier:'Premium',price:5200,contents:['Honey 500g','Wild Thyme Tea','Dried Apricots','Mountain Nuts','Rigid gift box'],icon:'🎀',featured:true},
 {id:'giftbox-heritage',name:'Heritage Collection',tier:'Corporate / VIP',price:8900,contents:['Everything in Hunza Collection','Salajeet','Origin story insert card','Rigid box with wax seal'],icon:'👑'},
];
const CATS=['All','Honey & Salajeet','Dried Fruit & Nuts','Herbal Tea','Fresh Seasonal Produce'];

/* ---------- STATE ---------- */
let cart=JSON.parse(localStorage.getItem('gg_cart')||'[]');
function saveCart(){try{localStorage.setItem('gg_cart',JSON.stringify(cart));}catch(e){}}
function cartCount(){return cart.reduce((s,i)=>s+i.qty,0);}
function cartTotal(){return cart.reduce((s,i)=>s+i.qty*i.price,0);}
function addToCart(item){
  const existing=cart.find(c=>c.key===item.key);
  if(existing){existing.qty+=item.qty;}else{cart.push(item);}
  saveCart();renderCartCount();showToast(item.name+' added to cart');
}
function removeFromCart(key){cart=cart.filter(c=>c.key!==key);saveCart();render();}
function updateQty(key,delta){
  const it=cart.find(c=>c.key===key); if(!it)return;
  it.qty=Math.max(1,it.qty+delta); saveCart(); render();
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),1800);}
function renderCartCount(){
  const el=document.getElementById('cartcount');
  el.textContent=cartCount();
  el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
}
function fmt(n){return 'PKR '+n.toLocaleString();}

/* ---------- ROUTER ---------- */
function route(){
  clearInterval(window._heroTimer);
  const hash=location.hash||'#/';
  const [path,query]=hash.split('?');
  const app=document.getElementById('app');
  document.getElementById('navlinks').classList.remove('open');
  const dd=document.getElementById('productsdd'); if(dd) dd.classList.remove('open');
  window.scrollTo(0,0);
  if(path==='#/'||path==='') app.innerHTML=Home();
  else if(path==='#/shop') app.innerHTML=Shop(query?decodeURIComponent(query.replace('cat=','')):'All');
  else if(path.startsWith('#/product/')) app.innerHTML=ProductPage(path.split('/')[2]);
  else if(path==='#/gift-boxes') app.innerHTML=GiftBoxesPage();
  else if(path==='#/our-story') app.innerHTML=OurStory();
  else if(path==='#/about') app.innerHTML=AboutUs();
  else if(path==='#/corporate') app.innerHTML=Corporate();
  else if(path==='#/account') app.innerHTML=Account();
  else if(path==='#/cart') app.innerHTML=CartPage();
  else if(path==='#/checkout') app.innerHTML=Checkout();
  else if(path==='#/order-confirmation') app.innerHTML=OrderConf();
  else if(path==='#/contact') app.innerHTML=Contact();
  else if(path==='#/faqs') app.innerHTML=FAQs();
  else if(path==='#/return-policy') app.innerHTML=ReturnPolicyPage();
  else if(path==='#/policies') app.innerHTML=Policies();
  else app.innerHTML=NotFound();
  renderCartCount();
  bindDynamic();
  initReveal();
  heroInit();
  initTestimonialsSlider();
  initCounters();
  bindHomeTabs();
}
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}});
},{threshold:.15});
function initReveal(){document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));}
window.addEventListener('scroll',()=>{
  document.querySelector('header').classList.toggle('scrolled',window.scrollY>10);
});
window.addEventListener('hashchange',route);
document.addEventListener('click',e=>{
  const dd=document.getElementById('productsdd');
  if(dd && !dd.contains(e.target)) dd.classList.remove('open');
});

/* ---------- HOME PAGE DATA ---------- */
// Hero slides: replace these JPGs in assets/hero/ with your own photos (same file names).
const HERO_SLIDES=['assets/hero/mot1.jpg','assets/hero/mot3.jpg'];
const HOME_CATS=[
 {name:'H oney & Salajeet',img:'assets/cat/honey.jfif',link:'  #/shop?ca t=Honey%20%26%20Salajeet'},
 {name:'Dried Fruit & Nuts',img:'assets/cat/dryfruit.webp',link:'#/shop?cat=Dried%20Fruit%  20%26%20Nuts'},
 {name:'Herbal Tea',img:'assets/cat/herbaltea.jpg',link:'#/shop?cat=Herbal%20Tea'},
 {name:'Fresh Produce',img:'assets/cat/fresproduct.jfif',link:'#/shop?cat=Fresh%20Seasonal%20Produce'},
 {name:'Gift Boxes',img:'assets/cat/gift.jpg',link:'#/gift-boxes'},
 {name:'Corporate Gifting',img:'assets/cat/corporategift.jfif',link:'#/corporate-gifting'},
];
const WHY_POINTS=[
 ['🏔️','Direct from Hunza','We buy straight from growers and harvesters in Hunza — no middlemen, full traceability from orchard to jar.'],
 ['🍯','Small-Batch Freshness','Honey, herbs and dried fruit are packed in small batches so what reaches you is fresh, not warehouse-aged.'],
 ['🎁','Gift-Ready Packaging','From the Mountain Box to the Heritage Collection — beautifully packed and ready to give.'],
 ['🤝','Fair & Transparent','Fair prices for growers, honest prices for you, and a QR origin story on every pack.'],
];
// Facts about the store (not performance claims) — safe to show; update if the range changes.
// SAMPLE REVIEWS — replace with real customer reviews before launch, or set SHOW_REVIEWS to false.
const SHOW_REVIEWS=true;
const REVIEWS=[
 ['A','Ayesha K.','Customer','The honey tastes like real mountain honey. Packaging felt like a proper gift.'],
 ['H','Hamza M.','Customer','Ordered the Hunza Collection for family abroad. Delivery was quick and everything arrived intact.'],
 ['S','Sara T.','Customer','Loved the dried apricots and wild thyme tea. Easy ordering on WhatsApp too.'],
 ['R','Rehan A.','Corporate client','We used the Heritage Collection for client gifts — presentation was excellent.'],
];
const HOME_FAQS=[
 ['How does ordering work?','Add products to your cart and check out with Cash on Delivery, JazzCash / EasyPaisa, bank transfer or card — or choose "Order via WhatsApp" and confirm everything in chat.'],
 ['How long does delivery take?','Domestic orders typically arrive within 3–5 business days. International delivery times depend on destination and are shown at checkout.'],
 ['Are your products really from Hunza?','Yes. Everything is sourced directly from growers and harvesters in Hunza, Gilgit-Baltistan, and packs carry origin details.'],
 ['How should I store honey and dried fruit?','Keep them in a cool, dry place away from direct sunlight. Natural crystallization in honey is normal — warm the jar gently in water to soften it.'],
 ['Do you offer corporate or bulk gifting?','Yes. Our Heritage Collection is built for corporate gifting, and we quote bulk orders by quantity and timeline. Use the Corporate Gifting page to request a quote.'],
 ['What is your return policy for perishables?','Perishable items like honey and fresh fruit follow different return terms from dry goods. See Shipping & Returns for details.'],
];

/* ---------- PAGE BUILDERS ---------- */
function Home(){
 const tabs=['Featured',...CATS.slice(1)];
 const featured=PRODUCTS.filter(p=>p.stock!=='out').slice(0,6);
 const marquee=[...HOME_CATS,...HOME_CATS].map(c=>`<a class="catcard" href="${c.link}" style="background-image:url('${c.img}')"><span>${c.name}</span></a>`).join('');
 return `
 <section class="hero" id="hero">
   <div class="hero-track" id="heroTrack">${HERO_SLIDES.map(s=>`<div class="hero-slide" style="background-image:url('${s}')"></div>`).join('')}</div>
   <div class="hero-overlay"></div>
   <div class="container hero-content">
     <span class="kicker">GASHGIRAN SOUVENIR</span>
     <h1>Taste the mountains of Hunza.</h1>
     <p>Honey, herbs, dried fruit and gift-ready collections — sourced straight from the orchards and meadows of Hunza, and delivered to your door.</p>
     <div class="ctas">
       <button class="pill pill-primary" onclick="location.hash='#/shop'">Shop Products</button>
       <a class="pill pill-glass" href="https://wa.me/923000000000" target="_blank" rel="noopener">Order on WhatsApp</a>
     </div>
   </div>
   <button class="hero-arrow prev" aria-label="Previous slide">‹</button>
   <button class="hero-arrow next" aria-label="Next slide">›</button>
   <div class="hero-dots">${HERO_SLIDES.map((_,i)=>`<button class="hero-dot" aria-label="Slide ${i+1}"></button>`).join('')}</div>
 </section>

 <section class="pad cats reveal"><div class="container">
   <div class="sectionhead"><span class="eyebrow">Product Categories</span><h2>Mountain Harvests, Curated for Every Table</h2><p>Slide through our core categories below. Click any category to browse products.</p></div>
 </div>
 <div class="marquee"><div class="marquee-track">${marquee}</div></div>
 </section>

 <section class="pad why reveal" style="background:var(--green-pale)"><div class="container">
   <div class="whygrid">
     <div>
       <span class="eyebrow">/ Why Gashgiran Souvenir?</span>
       <h2>Why choose us?</h2>
       <p class="lead">Built for people who want the real taste of Hunza — fresh, traceable, fairly priced and beautifully packed.</p>
       <div class="whyimg" style="background-image:url('assets/wy.jpg')"></div>
       <div class="ctas"><button class="pill pill-primary" onclick="location.hash='#/shop'">Explore Products</button><button class="pill pill-outline" onclick="location.hash='#/our-story'">Our Story</button></div>
     </div>
     <div class="whytext" style="display:flex;align-items:center;height:100%;min-height:340px;padding:12px 0 0;"><p style="margin:0;font-size:17px;line-height:1.8;color:#405344;">At Gashgiran Souvenir, we bring the real taste of Hunza to your table with honest sourcing, small-batch care, and gift-worthy presentation. Every product is selected directly from growers and harvesters in the region, packed with care, and delivered with the transparency our customers expect from mountain-origin products.</p></div>
   </div>
 </div></section>

 <section class="pad featured reveal" style="background:#fff"><div class="container">
   <div class="sectionhead"><span class="eyebrow">Products</span><h2>Featured Products from the Mountains</h2><p>A curated selection of our most loved products.</p></div>
   <div class="filters center" id="hometabs">${tabs.map((t,i)=>`<button class="fpill ${i===0?'active':''}" data-tab="${t}">${t}</button>`).join('')}</div>
   <div class="productslider">
     <button class="review-arrow product-prev" aria-label="Previous products">‹</button>
     <div class="productviewport">
       <div class="producttrack" id="homegrid">${featured.map(ProductCard).join('')}</div>
     </div>
     <button class="review-arrow product-next" aria-label="Next products">›</button>
   </div>
   <div style="text-align:center;margin-top:28px;"><button class="pill pill-dark" onclick="location.hash='#/shop'">View All Products</button></div>
 </div></section>

 <section class="pad reveal" style="background:var(--green-pale)"><div class="container">
   <div class="sectionhead"><span class="eyebrow">Gift Boxes</span><h2>Gift Boxes for Every Occasion</h2><p>Three tiers, built for every kind of gifting.</p></div>
   <div class="giftgrid">${GIFTBOXES.map(GiftCard).join('')}</div>
 </div></section>

 ${SHOW_REVIEWS?`<section class="pad reveal"><div class="container">
   <div class="sectionhead"><span class="eyebrow">Testimonials</span><h2>What Our Customers Say</h2></div>
   <div class="reviewslider">
     <button class="review-arrow review-prev" aria-label="Previous testimonial">‹</button>
     <div class="reviewviewport">
       <div class="reviewtrack">${REVIEWS.map(r=>`<div class="card review"><div class="avatar">${r[0]}</div><h3>${r[1]}</h3><div class="role">${r[2]}</div><p>${r[3]}</p></div>`).join('')}</div>
     </div>
     <button class="review-arrow review-next" aria-label="Next testimonial">›</button>
   </div>
   <div class="reviewdots">${REVIEWS.map((_,i)=>`<button class="review-dot ${i===0?'active':''}" aria-label="Show testimonial ${i+1}"></button>`).join('')}</div>
 </div></section>`:''}

 <section class="pad faqsec reveal" style="background:var(--green-pale)"><div class="container" style="max-width:820px;">
   <div class="sectionhead"><span class="eyebrow">FAQ</span><h2>Frequently Asked Questions</h2><p>Everything you need to know about ordering, delivery and our products.</p></div>
   ${HOME_FAQS.map(f=>`<details class="faqitem"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}
 </div></section>

 <div class="ctaband reveal" style="background-image:linear-gradient(rgba(10,38,20,.86),rgba(10,38,20,.86)),url('assets/hero/hero4.jpg');"><div class="container">
   <h2>Ready for a taste of Hunza?</h2>
   <p style="max-width:44ch;margin:0 auto 22px;color:#d9e8db;">Place your order in minutes, or chat with us on WhatsApp — we'll help you choose.</p>
   <div class="ctas" style="justify-content:center;"><button class="pill pill-primary" onclick="location.hash='#/shop'">Place an Order</button><a class="pill pill-glass" href="https://wa.me/923000000000" target="_blank" rel="noopener">Chat on WhatsApp</a></div>
 </div></div>
 `;
}

/* ---------- HOME INTERACTIONS ---------- */
function heroInit(){
  const hero=document.getElementById('hero'); if(!hero) return;
  const track=document.getElementById('heroTrack');
  const slides=[...hero.querySelectorAll('.hero-slide')], dots=[...hero.querySelectorAll('.hero-dot')];
  const n=slides.length; let i=0;
  function go(k){
    i=(k+n)%n; track.style.transform=`translateX(-${i*100}%)`;
    slides.forEach((s,j)=>s.classList.toggle('active',j===i));
    dots.forEach((d,j)=>d.classList.toggle('active',j===i));
  }
  const stop=()=>clearInterval(window._heroTimer);
  const start=()=>{stop();window._heroTimer=setInterval(()=>go(i+1),5500);};
  hero.querySelector('.prev').onclick=()=>{go(i-1);start();};
  hero.querySelector('.next').onclick=()=>{go(i+1);start();};
  dots.forEach((d,j)=>d.onclick=()=>{go(j);start();});
  let x0=null;
  hero.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;x0=e.clientX;});
  hero.addEventListener('pointerup',e=>{
    if(x0===null)return; const dx=e.clientX-x0; x0=null;
    if(Math.abs(dx)>50){go(dx<0?i+1:i-1);start();}
  });
  hero.addEventListener('mouseenter',stop); hero.addEventListener('mouseleave',start);
  go(0); start();
}
function initTestimonialsSlider(){
  const slider=document.querySelector('.reviewslider');
  if(!slider || slider.dataset.initialized==='true') return;
  const track=slider.querySelector('.reviewtrack');
  const cards=[...slider.querySelectorAll('.review')];
  const prev=slider.querySelector('.review-prev');
  const next=slider.querySelector('.review-next');
  const dots=[...slider.querySelectorAll('.review-dot')];
  if(!cards.length) return;
  let index=0;
  function getVisibleCount(){
    if(window.innerWidth < 560) return 1;
    if(window.innerWidth < 1000) return 2;
    return 3;
  }
  function updateSlider(){
    const visible=getVisibleCount();
    const maxIndex=Math.max(0,cards.length-visible);
    if(index>maxIndex) index=maxIndex;
    const gap=parseFloat(getComputedStyle(track).gap || 0);
    const cardWidth=cards[0].getBoundingClientRect().width + gap;
    track.style.transform=`translateX(-${index*cardWidth}px)`;
    dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));
  }
  function step(delta){
    const visible=getVisibleCount();
    const maxIndex=Math.max(0,cards.length-visible);
    if(delta>0){ index=(index>=maxIndex?0:index+1); }
    else { index=(index<=0?maxIndex:index-1); }
    updateSlider();
  }
  prev.addEventListener('click',()=>step(-1));
  next.addEventListener('click',()=>step(1));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{index=i; updateSlider();}));
  slider.addEventListener('mouseenter',()=>clearInterval(window._reviewsTimer));
  slider.addEventListener('mouseleave',()=>{clearInterval(window._reviewsTimer); window._reviewsTimer=setInterval(()=>step(1),5000);});
  window.addEventListener('resize',updateSlider);
  slider.dataset.initialized='true';
  window._reviewsTimer=setInterval(()=>step(1),5000);
  updateSlider();
}
function initCounters(){
  const els=document.querySelectorAll('.count'); if(!els.length) return;
  const io=new IntersectionObserver(entries=>entries.forEach(en=>{
    if(!en.isIntersecting) return; io.unobserve(en.target);
    const el=en.target, target=+el.dataset.target, t0=performance.now(), dur=1400;
    (function tick(t){
      const p=Math.min((t-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(target*e);
      if(p<1) requestAnimationFrame(tick);
    })(t0);
  }),{threshold:.4});
  els.forEach(el=>io.observe(el));
}
function initProductSlider(){
  const slider=document.querySelector('.productslider');
  if(!slider) return;
  const track=slider.querySelector('.producttrack');
  const cards=[...track.children];
  if(!cards.length) return;
  const prev=slider.querySelector('.product-prev');
  const next=slider.querySelector('.product-next');
  let index=0;

  function visibleCount(){
    if(window.innerWidth < 560) return 1;
    if(window.innerWidth < 920) return 2;
    if(window.innerWidth < 1200) return 3;
    return 4;
  }

  function update(){
    const count=visibleCount();
    const maxIndex=Math.max(0,cards.length-count);
    if(index>maxIndex) index=maxIndex;
    const gap=parseFloat(getComputedStyle(track).gap || 0);
    const cardWidth=cards[0].getBoundingClientRect().width + gap;
    track.style.transform=`translateX(-${index*cardWidth}px)`;
    if(prev) prev.disabled=index===0;
    if(next) next.disabled=index>=maxIndex;
  }

  function step(delta){
    const count=visibleCount();
    const maxIndex=Math.max(0,cards.length-count);
    index=delta>0 ? Math.min(maxIndex,index+1) : Math.max(0,index-1);
    update();
  }

  prev.onclick=()=>step(-1);
  next.onclick=()=>step(1);
  window.addEventListener('resize',update, { once: false });
  update();
}

function bindHomeTabs(){
  const tabs=document.getElementById('hometabs'); if(!tabs) return;
  tabs.querySelectorAll('.fpill').forEach(btn=>btn.onclick=()=>{
    tabs.querySelectorAll('.fpill').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const t=btn.dataset.tab;
    const list=t==='Featured'?PRODUCTS.filter(p=>p.stock!=='out').slice(0,6):PRODUCTS.filter(p=>p.cat===t);
    const g=document.getElementById('homegrid');
    g.innerHTML=list.map(ProductCard).join('');
    g.classList.remove('swap'); void g.offsetWidth; g.classList.add('swap');
    initProductSlider();
  });
}

function ProductCard(p){
 return `<div class="card prodcard" onclick="location.hash='#/product/${p.id}'">
   <div class="prodicon">${p.icon}</div>
   <div class="prodname">${p.name}</div>
   <div class="proddesc">${p.tagline}</div>
   ${p.stock==='out'?'<div class="seasonal">Seasonal — currently unavailable</div>':`<div class="price">${fmt(p.variants[0].price)}</div>`}
 </div>`;
}
function GiftCard(g){
 return `<div class="card giftcard ${g.featured?'premium':''}">
   ${g.featured?'<span class="badge" style="position:absolute;top:-12px;">Most Popular</span>':''}
   <div style="font-size:34px">${g.icon}</div>
   <h3>${g.name}</h3><div class="badge">${g.tier}</div>
   <ul>${g.contents.map(c=>`<li>${c}</li>`).join('')}</ul>
   <div class="price" style="font-size:18px;margin:10px 0;">${fmt(g.price)}</div>
   <button class="pill pill-primary" style="width:100%;justify-content:center;" onclick="addToCart({key:'${g.id}',name:'${g.name}',variant:g.tier,qty:1,price:${g.price},icon:'${g.icon}'})">Add to Cart</button>
 </div>`;
}
function Shop(activeCat){
 activeCat=activeCat||'All';
 const list=activeCat==='All'?PRODUCTS:PRODUCTS.filter(p=>p.cat===activeCat);
 return `<div class="container pad">
   <div class="sectionhead" style="margin-bottom:20px;"><h2 style="color:var(--green-deep)">Products</h2></div>
   <div class="filters" id="filterrow">${CATS.map(c=>`<button class="fpill ${c===activeCat?'active':''}" data-cat="${c}">${c}</button>`).join('')}</div>
   <div class="grid" id="shopgrid">${list.map(ProductCard).join('')}</div>
 </div>`;
}
function ProductPage(id){
 const p=PRODUCTS.find(x=>x.id===id);
 if(!p) return NotFound();
 const pairs=(p.pairs||[]).map(pid=>PRODUCTS.find(x=>x.id===pid)||GIFTBOXES.find(x=>x.id===pid)).filter(Boolean);
 return `<div class="container pad">
  <div class="crumb"><a href="#/shop">Shop</a> / ${p.name}</div>
  <div class="pdgrid">
    <div class="pdphoto">${p.icon}</div>
    <div>
      <h1 style="color:var(--green-deep)">${p.name}</h1>
      <p class="mono" style="color:var(--coral-deep);">${p.tagline}</p>
      <p style="font-size:13px;color:#666;">Net Weight: <span id="pd-weight">${p.variants[0].w}</span> · ${p.origin}</p>
      ${p.stock==='out'?'<div class="seasonal" style="margin:10px 0;">⚠ Seasonal — currently unavailable</div>':''}
      <div class="price" id="pd-price" style="font-size:22px;margin:10px 0;">${fmt(p.variants[0].price)}</div>
      <p>${p.desc}</p>
      <label>Variant / Weight</label>
      <div class="varrow" id="pd-variants">
        ${p.variants.map((v,i)=>`<button class="varbtn ${i===0?'active':''}" data-w="${v.w}" data-price="${v.price}">${v.w}</button>`).join('')}
      </div>
      <label>Quantity</label>
      <div class="qtyrow">
        <button class="qtybtn" id="pd-minus">−</button>
        <span id="pd-qty" class="mono">1</span>
        <button class="qtybtn" id="pd-plus">+</button>
      </div>
      <button class="pill pill-primary" id="pd-add" ${p.stock==='out'?'disabled style="opacity:.5;cursor:not-allowed;"':''}>${p.stock==='out'?'Unavailable':'Add to Cart'}</button>
      <details><summary>Usage & storage info</summary><p style="font-size:14px;">${p.usage}</p></details>
      <details><summary>Ingredients</summary><p style="font-size:14px;">${p.ingredients}</p></details>
    </div>
  </div>
  ${pairs.length?`<div class="pad"><h3 style="color:var(--green-deep)">Pairs well with</h3><div class="grid">${pairs.map(x=>x.contents?GiftCard(x):ProductCard(x)).join('')}</div></div>`:''}
 </div>
 <input type="hidden" id="pd-id" value="${p.id}"><input type="hidden" id="pd-icon" value="${p.icon}">`;
}
function GiftBoxesPage(){
 return `<div class="container pad">
   <div class="sectionhead"><h2 style="color:var(--green-deep)">Gift Boxes</h2><p>From everyday gifting to corporate VIP collections — pick a tier below.</p></div>
   <div class="giftgrid reveal">${GIFTBOXES.map(GiftCard).join('')}</div>
   <div class="card" style="margin-top:30px;background:var(--green-pale);">
     <p style="font-size:13px;color:#3a4a3c;">Gift boxes are bundled kits — each includes individually-sourced components. Need a custom quantity for an event or corporate order? <a href="#/corporate" style="color:var(--coral-deep);font-weight:600;">Visit Corporate & Bulk Gifting →</a></p>
   </div>
 </div>`;
}
function OurStory(){
 return `<div class="container pad" style="max-width:1000px;">
   <div class="story-shell">
     <div class="story-hero card">
       <div class="story-kicker">Our Story</div>
       <h1 style="color:var(--green-deep); margin:0;">A mountain idea that returned.</h1>
       <p>Gashgiran started with an idea in 2019 — a simple way to bring the culture, craftsmanship, and natural richness of Pakistan’s mountains closer to people who value authentic products.</p>
     </div>

     <div class="story-grid">
       <div class="story-card card">
         <h3>Where it began</h3>
         <p>While exploring the potential of Gilgit-Baltistan, we imagined a simple way to connect people with the products, traditions, and craftsmanship of Pakistan’s mountains.</p>
         <p>We pitched the idea to the National Incubator (NI) Pakistan in 2019, but it was not selected. Due to circumstances at the time, we could not continue the venture, and Gashgiran was put on hold.</p>
       </div>

       <div class="story-card card accent">
         <h3>Why it mattered</h3>
         <p>But the idea never disappeared.</p>
         <p>Over the years, our journey through tourism brought us closer to mountain communities, farmers, artisans, and local producers. We began to see the mountains differently — not only as breathtaking destinations, but as places rich in natural products, traditional craftsmanship, local flavors, and stories.</p>
       </div>
     </div>

     <div class="story-quote card">
       <span class="quote-mark">“</span>
       <p>Gashgiran is more than a store. It is an idea that waited for its time.</p>
     </div>

     <div class="story-grid single">
       <div class="story-card card">
         <h3>Today</h3>
         <p>So, Gashgiran is back.</p>
         <p>Today, our vision is simple: to bring authentic mountain products from Pakistan closer to you.</p>
         <p>From natural products and dry fruits to handcrafted goods and meaningful souvenirs, we carefully seek products that have a genuine connection to the places and people behind them.</p>
       </div>
     </div>

     <div class="story-footer card">
       <h3>From the mountains of Pakistan to your doorstep.</h3>
     </div>
   </div>
 </div>`;
}
function Corporate(){
 return `<div class="container pad">
  <div style="max-width:700px;">
   <h1 style="color:var(--green-deep)">Corporate & Bulk Gifting</h1>
   <p>Client gifts, employee appreciation, events — the Heritage Collection is our flagship corporate offering, and we can tailor volume orders to your budget and timeline.</p>
  </div>
  <div class="pdgrid reveal" style="margin-top:20px;">
   <div class="card"><h3>Heritage Collection</h3><p style="font-size:14px;">Everything in the Hunza Collection, plus Salajeet, an origin story insert card, and a rigid box sealed with wax — our flagship corporate gift.</p><div class="price">${fmt(GIFTBOXES[2].price)} <span class="mono" style="font-size:12px;color:#888;">/ unit, before bulk pricing</span></div></div>
   <div class="card">
    <h3>Request a Bulk Quote</h3>
    <form id="bulkform">
      <label>Company name</label><input required name="company">
      <label>Contact info (email/phone)</label><input required name="contact">
      <label>Estimated quantity</label><input required name="qty" placeholder="e.g. 50 units">
      <label>Occasion</label><input name="occasion" placeholder="e.g. Eid client gifting">
      <label>Delivery timeline</label><input name="timeline" placeholder="e.g. within 3 weeks">
      <button type="submit" class="pill pill-primary" style="width:100%;justify-content:center;">Request Custom Quote</button>
    </form>
   </div>
  </div>
 </div>`;
}
function CartPage(){
 if(!cart.length) return `<div class="container pad"><div class="empty"><h2>Your cart is empty</h2><button class="pill pill-primary" onclick="location.hash='#/shop'">Shop the Harvest</button></div></div>`;
 return `<div class="container pad">
  <h1 style="color:var(--green-deep)">Your Cart</h1>
  <div class="pdgrid">
   <div>
    ${cart.map(i=>`<div class="cartrow">
      <div class="ic">${i.icon||'🎁'}</div>
      <div style="flex:1"><strong>${i.name}</strong><div class="mono" style="font-size:12px;color:#888;">${i.variant||''}</div></div>
      <button class="qtybtn" onclick="updateQty('${i.key}',-1)">−</button>
      <span class="mono">${i.qty}</span>
      <button class="qtybtn" onclick="updateQty('${i.key}',1)">+</button>
      <div class="price" style="width:90px;text-align:right;">${fmt(i.qty*i.price)}</div>
      <button onclick="removeFromCart('${i.key}')" style="border:none;background:none;cursor:pointer;color:#c00;">✕</button>
    </div>`).join('')}
   </div>
   <div class="cartsummary">
     <div class="sumrow"><span>Subtotal</span><strong>${fmt(cartTotal())}</strong></div>
     <div class="sumrow" style="color:#666;"><span>Shipping</span><span>Calculated at checkout</span></div>
     <label>Coupon code</label><input placeholder="Enter code (e.g. GASHGIRAN10)">
     <button class="pill pill-primary" style="width:100%;justify-content:center;" onclick="location.hash='#/checkout'">Proceed to Checkout</button>
   </div>
  </div>
 </div>`;
}
function Checkout(){
 if(!cart.length) return `<div class="container pad"><div class="empty"><h2>Your cart is empty</h2></div></div>`;
 return `<div class="container pad">
  <h1 style="color:var(--green-deep)">Checkout</h1>
  <div class="pdgrid">
   <form id="checkoutform">
     <h3>Contact & Shipping</h3>
     <label>Full name</label><input required name="name">
     <label>Phone number</label><input required name="phone" placeholder="03XX-XXXXXXX">
     <label>Email (for order confirmation)</label><input required type="email" name="email">
     <label>Delivery address</label><textarea required name="address" rows="3"></textarea>
     <label>Shipping region</label>
     <select name="region"><option>Domestic — flat rate</option><option>Domestic — remote area</option><option>International</option></select>
     <h3>Payment Method</h3>
     <div class="radiorow" id="payrow">
       <div class="radiopill active" data-pay="Cash on Delivery">💵 Cash on Delivery</div>
       <div class="radiopill" data-pay="JazzCash / EasyPaisa">📱 JazzCash / EasyPaisa</div>
       <div class="radiopill" data-pay="Bank Transfer">🏦 Bank Transfer</div>
       <div class="radiopill" data-pay="Card (Stripe)">💳 Card (int'l)</div>
       <div class="radiopill" data-pay="WhatsApp Order">💬 Order via WhatsApp</div>
     </div>
     <div id="paydetails">
       <p style="font-size:13px;color:#666;">Pay in cash when your order is delivered to your door.</p>
     </div>
     <button type="submit" class="pill pill-primary" style="width:100%;justify-content:center;">Place Order</button>
   </form>
   <div class="cartsummary">
     <h4>Order Summary</h4>
     ${cart.map(i=>`<div class="sumrow"><span>${i.name} × ${i.qty}</span><span>${fmt(i.qty*i.price)}</span></div>`).join('')}
     <div class="sumrow" style="border-top:1px solid #cfe0d0;padding-top:10px;font-size:16px;"><strong>Total</strong><strong>${fmt(cartTotal())}</strong></div>
   </div>
  </div>
 </div>`;
}
const PAY_DETAILS={
 'Cash on Delivery':`<p style="font-size:13px;color:#666;">Pay in cash when your order is delivered to your door.</p>`,
 'JazzCash / EasyPaisa':`<label>Mobile wallet provider</label>
   <select name="wallet"><option>JazzCash</option><option>EasyPaisa</option></select>
   <label>Wallet mobile number</label><input name="walletnum" placeholder="03XX-XXXXXXX">
   <p style="font-size:13px;color:#666;">You'll receive a payment request on your mobile to approve after placing the order.</p>`,
 'Bank Transfer':`<div class="card" style="background:var(--green-pale);margin-bottom:12px;">
     <p style="font-size:13px;margin:0;"><strong>Account Title:</strong> Gashgiran Souvenir<br><strong>Bank:</strong> Meezan Bank<br><strong>IBAN:</strong> PK00 MEZN 0000 0000 1234 5678</p>
   </div>
   <label>Upload payment screenshot / receipt</label><input type="file" name="proof">
   <p style="font-size:13px;color:#666;">Your order will be confirmed manually within 24 hours of receiving payment.</p>`,
 'Card (Stripe)':`<label>Card number</label><input name="cardnum" placeholder="4242 4242 4242 4242">
   <div style="display:flex;gap:10px;"><input name="exp" placeholder="MM/YY"><input name="cvc" placeholder="CVC"></div>
   <p style="font-size:13px;color:#666;">Secure card payment for international & diaspora customers, processed via Stripe.</p>`,
 'WhatsApp Order':`<div class="card" style="background:#e9f9ee;margin-bottom:12px;">
     <p style="font-size:13px;margin:0;">Skip the form — send us your order and delivery details on WhatsApp, then confirm your preferred payment method (cash, JazzCash, EasyPaisa or bank transfer) right there in the chat.</p>
   </div>
   <button type="button" class="pill" style="background:#25D366;color:#fff;width:100%;justify-content:center;" onclick="sendWhatsAppOrder()">💬 Continue on WhatsApp</button>
   <p style="font-size:12px;color:#888;margin-top:8px;">This opens WhatsApp with your cart pre-filled — you can still click "Place Order" below once you're done chatting, to keep a record on our side too.</p>`
};
function sendWhatsAppOrder(){
  const co=document.getElementById('checkoutform');
  const name=co&&co.name.value?co.name.value:'';
  const phone=co&&co.phone.value?co.phone.value:'';
  const address=co&&co.address.value?co.address.value:'';
  const lines=cart.map(i=>`• ${i.name} (${i.variant||''}) × ${i.qty} — ${fmt(i.qty*i.price)}`).join('\n');
  const msg=`Hi Gashgiran! I'd like to place this order:\n\n${lines}\n\nTotal: ${fmt(cartTotal())}`+
    (name?`\n\nName: ${name}`:'')+(phone?`\nPhone: ${phone}`:'')+(address?`\nDelivery address: ${address}`:'')+
    `\n\nI'll confirm my payment method here on WhatsApp.`;
  window.open(`https://wa.me/923000000000?text=${encodeURIComponent(msg)}`,'_blank');
}
function OrderConf(){
 const o=JSON.parse(localStorage.getItem('gg_last_order')||'{}');
 const itemLines=(o.items||[]).map(i=>`• ${i.name} (${i.variant||''}) × ${i.qty}`).join('\n');
 const waText=encodeURIComponent(`Hi Gashgiran! Following up on my order ${o.id||''} (${o.pay||''}) — total ${o.total?fmt(o.total):''}.\n${itemLines}`);
 return `<div class="container pad"><div class="empty">
   <div style="font-size:52px;">✅</div>
   <h2 style="color:var(--green-deep)">Thank you! Your order is confirmed.</h2>
   <p>Order #${o.id||''} · Payment method: <strong>${o.pay||''}</strong></p>
   <p style="font-size:13px;color:#666;">📧 A confirmation email has been sent to ${o.email||'your inbox'}.</p>
   ${o.pay==='Bank Transfer'?'<p style="font-size:13px;color:var(--coral-deep);">We\'ll confirm your order manually once your transfer is received.</p>':''}
   ${o.pay==='WhatsApp Order'?'<p style="font-size:13px;color:var(--coral-deep);">We\'ll confirm your payment method and delivery details with you on WhatsApp.</p>':''}
   <p class="mono" style="color:var(--coral-deep);">Status: Processing → Shipped → Delivered</p>
   <a class="pill" style="background:#25D366;color:#fff;margin:6px;" href="https://wa.me/923000000000?text=${waText}" target="_blank">💬 Message us on WhatsApp</a>
   <button class="pill pill-primary" style="margin:6px;" onclick="location.hash='#/shop'">Continue Shopping</button>
 </div></div>`;
}
function Contact(){
 return `<div class="container pad" style="max-width:600px;">
  <h1 style="color:var(--green-deep)">Contact Us</h1>
  <form id="contactform">
    <label>Name</label><input required name="name">
    <label>Email</label><input required type="email" name="email">
    <label>Message</label><textarea required rows="4" name="message"></textarea>
    <button type="submit" class="pill pill-primary" style="width:100%;justify-content:center;">Send Message</button>
  </form>
  <p style="margin-top:20px;font-size:14px;">Or reach us directly on <a style="color:var(--coral-deep);font-weight:600;" href="https://wa.me/923000000000" target="_blank">WhatsApp →</a></p>
 </div>`;
}
function FAQs(){
 const faqs=[['What are your shipping times?','Domestic orders typically arrive within 3–5 business days; international timelines vary by destination.'],
 ['Do you offer Cash on Delivery?','Yes — COD is available for domestic orders and is our most commonly used payment method.'],
 ['How should I store honey and dried fruit?','Store in a cool, dry place away from direct sunlight. Crystallized honey can be gently warmed to soften.'],
 ['What is your return policy for perishables?','Perishable items like honey and fresh fruit have different return terms than dry goods — see our Shipping & Returns Policy.']];
 return `<div class="container pad reveal" style="max-width:700px;"><h1 style="color:var(--green-deep)">FAQs</h1>
   ${faqs.map(f=>`<details class="faqrow" style="border:none;"><summary>${f[0]}</summary><p style="font-size:14px;color:#555;">${f[1]}</p></details>`).join('')}
 </div>`;
}
function ReturnPolicyPage(){
 return `<div class="container pad" style="max-width:900px;">
  <div class="policy-wrap">
    <div class="policy-header card">
      <div class="crumb"><a href="#/">Home</a> / Return & Refund Policy</div>
      <h1 style="color:var(--green-deep)">Return & Refund Policy</h1>
      <p class="policy-summary">We want you to be happy with every order. Because most of our products are food, the rules below protect both your health and the quality of what we send. <strong>Last updated: October 2026</strong></p>
      <p class="policy-highlight"><strong>Quick summary:</strong> if your order arrives damaged, leaking, wrong or incomplete, message us on WhatsApp within <strong>48 hours</strong> of delivery with photos and we will replace it or refund you.</p>
      <div class="policy-actions">
        <a class="pill pill-primary" href="https://wa.me/923000000000" target="_blank" rel="noopener">Message on WhatsApp</a>
        <a class="pill pill-outline" href="#/contact">Contact Page</a>
      </div>
    </div>

    <div class="policy-card">
      <div class="policy-number">1</div>
      <h3>When you can return or claim a refund</h3>
      <ul>
        <li>The item arrived <strong>damaged, leaking or spoiled</strong>.</li>
        <li>You received the <strong>wrong product</strong>, wrong size/weight, or a missing item.</li>
        <li>The product is clearly <strong>different from its description</strong> on the website.</li>
      </ul>
    </div>

    <div class="policy-card">
      <div class="policy-number">2</div>
      <h3>How to report a problem</h3>
      <ol>
        <li>Contact us on <a href="https://wa.me/923000000000" target="_blank" rel="noopener">WhatsApp</a> or through the <a href="#/contact">Contact page</a> within <strong>48 hours of delivery</strong>.</li>
        <li>Send your order number (e.g. GG-12345) and clear photos of the product and its packaging.</li>
        <li>We review your claim and reply within 1–2 business days.</li>
      </ol>
    </div>

    <div class="policy-card">
      <div class="policy-number">3</div>
      <h3>What we cannot accept back</h3>
      <ul>
        <li><strong>Opened or used</strong> honey, tea, nuts, dried fruit and other food items — for hygiene and safety reasons.</li>
        <li><strong>Fresh seasonal produce</strong> (cherries, apples) — it is perishable, so claims are only accepted for damage or spoilage reported within 48 hours.</li>
        <li>Change-of-mind returns on food products.</li>
        <li>Natural variation in colour, crystallisation of honey, or taste differences between seasonal batches — these are normal for natural products.</li>
      </ul>
    </div>

    <div class="policy-card">
      <div class="policy-number">4</div>
      <h3>Replacement or refund</h3>
      <p>Once a claim is approved we will, at your choice where stock allows, <strong>send a replacement</strong> or <strong>issue a refund</strong>. For damaged or wrong items we cover the return/replacement delivery cost.</p>
    </div>

    <div class="policy-card">
      <div class="policy-number">5</div>
      <h3>How refunds are paid</h3>
      <p>You paid by:</p>
      <ul>
        <li><strong>Cash on Delivery:</strong> Refund goes to the bank account or JazzCash / EasyPaisa number you provide.</li>
        <li><strong>JazzCash / EasyPaisa:</strong> The same wallet.</li>
        <li><strong>Bank Transfer:</strong> The account you paid from.</li>
        <li><strong>Card:</strong> The original card.</li>
      </ul>
      <p>Refunds are processed within <strong>5–7 business days</strong> of approval; card refunds may take longer depending on your bank.</p>
    </div>

    <div class="policy-card">
      <div class="policy-number">6</div>
      <h3>Gift boxes & corporate orders</h3>
      <p>Gift boxes follow the same rules — report any damage or missing contents within 48 hours. Custom and bulk corporate orders are agreed individually; please confirm return terms with us when you request your quote.</p>
    </div>

    <div class="policy-card">
      <div class="policy-number">7</div>
      <h3>Order changes & cancellations</h3>
      <p>You can cancel or change an order before it is dispatched by contacting us on WhatsApp. Once an order has shipped it can no longer be cancelled.</p>
    </div>

    <div class="policy-footer card">
      <p><a href="https://wa.me/923000000000" target="_blank" rel="noopener" class="policy-link">Contact us on WhatsApp</a></p>
      <p><a href="#/policies" class="policy-link secondary">Shipping & Other Policies</a></p>
    </div>
  </div>
 </div>`;
}
function Policies(){
 return `<div class="container pad" style="max-width:700px;">
  <h1 style="color:var(--green-deep)">Shipping, Returns & Policies</h1>
  <h3>Shipping & Returns</h3><p style="font-size:14px;">Domestic shipping is flat-rate or weight-based depending on region; international shipping is calculated at checkout. Perishable goods (honey, fresh fruit) follow different return terms than dry goods due to shelf-life.</p>
  <h3>Privacy Policy</h3><p style="font-size:14px;">We collect only the information needed to process and deliver your order, and never sell customer data to third parties.</p>
  <h3>Terms of Service</h3><p style="font-size:14px;">By ordering from Gashgiran Souvenir, you agree to our order, payment and delivery terms as outlined at checkout.</p>
 </div>`;
}
function AboutUs(){
 return `<div class="container pad" style="max-width:800px;">
   <h1 style="color:var(--green-deep)">About Us</h1>
   <p>Gashgiran Souvenir is a small-batch food and gifting brand built around one idea: honest, traceable products straight from the mountains of Hunza, Gilgit-Baltistan — honey, herbs, dried fruit and heritage-inspired gift collections.</p>
   <p>We work directly with local growers and harvesters, keeping our supply chain short so every jar can be traced back to the orchard or meadow it came from.</p>
   <div class="mapcard" style="margin:26px 0;">
     <h4 style="color:#fff">What we stand for</h4>
     <div class="pin"><span class="leaf">🍃</span> Authenticity — no middlemen, no fillers</div>
     <div class="pin"><span class="leaf">🍃</span> Traceability — every batch linked to its source</div>
     <div class="pin"><span class="leaf">🍃</span> Community — fair prices for mountain growers</div>
   </div>
   <h2 style="color:var(--green-deep)">Corporate Social Responsibility</h2>
   <div class="grid reveal" style="grid-template-columns:repeat(3,1fr);">
     <div class="card"><div class="csricon" style="font-size:30px;">🤝</div><h3 style="font-size:16px;">Fair Grower Partnerships</h3><p style="font-size:13px;color:#555;">We pay Hunza's honey harvesters and orchard families directly and transparently, above traditional middleman rates.</p></div>
     <div class="card"><div class="csricon" style="font-size:30px;">🌱</div><h3 style="font-size:16px;">Sustainable Sourcing</h3><p style="font-size:13px;color:#555;">Small-batch harvesting practices that protect Hunza's orchards, meadows and highland ecosystems for future seasons.</p></div>
     <div class="card"><div class="csricon" style="font-size:30px;">📦</div><h3 style="font-size:16px;">Low-Impact Packaging</h3><p style="font-size:13px;color:#555;">Kraft and recyclable packaging wherever possible, minimizing waste across our gift box collections.</p></div>
     <div class="card"><div class="csricon" style="font-size:30px;">🎓</div><h3 style="font-size:16px;">Community Investment</h3><p style="font-size:13px;color:#555;">A share of proceeds supports skill-building and education initiatives for families in the growing communities we source from.</p></div>
     <div class="card"><div class="csricon" style="font-size:30px;">📍</div><h3 style="font-size:16px;">Traceability & Trust</h3><p style="font-size:13px;color:#555;">Our "Meet Gashgiran" QR concept lets customers trace a product back to its origin story — accountability built in.</p></div>
     <div class="card"><div class="csricon" style="font-size:30px;">🏔️</div><h3 style="font-size:16px;">Rooted in Hunza</h3><p style="font-size:13px;color:#555;">Every collection is designed to celebrate — and give back to — the mountain communities that make it possible.</p></div>
   </div>
 </div>`;
}
function Account(){
 const orders=[{id:'GG-48213',date:'12 Sep 2026',status:'Delivered',total:2200},{id:'GG-47990',date:'02 Sep 2026',status:'Shipped',total:5200}];
 const addresses=[{label:'Home',line:'House 12, Sadpara Road, Skardu, Gilgit-Baltistan'},{label:'Office',line:'Netzing Technology, AJK, Pakistan'}];
 const wishlist=PRODUCTS.slice(0,3);
 return `<div class="container pad">
   <h1 style="color:var(--green-deep)">My Account</h1>
   <div class="filters" id="acctTabs">
     <button class="fpill active" data-tab="orders">Order History</button>
     <button class="fpill" data-tab="addresses">Saved Addresses</button>
     <button class="fpill" data-tab="wishlist">Wishlist</button>
   </div>
   <div id="acct-orders">
     ${orders.map(o=>`<div class="cartrow"><div class="ic">📦</div><div style="flex:1"><strong>${o.id}</strong><div class="mono" style="font-size:12px;color:#888;">${o.date}</div></div><span class="badge">${o.status}</span><div class="price" style="width:100px;text-align:right;">${fmt(o.total)}</div></div>`).join('')}
   </div>
   <div id="acct-addresses" style="display:none;">
     ${addresses.map(a=>`<div class="card" style="margin-bottom:14px;"><strong>${a.label}</strong><p style="font-size:14px;color:#555;">${a.line}</p></div>`).join('')}
     <button class="pill pill-outline">+ Add New Address</button>
   </div>
   <div id="acct-wishlist" style="display:none;">
     <div class="grid">${wishlist.map(ProductCard).join('')}</div>
   </div>
 </div>`;
}
function NotFound(){
 return `<div class="container pad"><div class="empty"><h1>404</h1><p>Page not found.</p><button class="pill pill-primary" onclick="location.hash='#/'">Back Home</button></div></div>`;
}

/* ---------- DYNAMIC BINDINGS PER PAGE ---------- */
function bindDynamic(){
 const hash=location.hash||'#/';
 // shop filters
 const frow=document.getElementById('filterrow');
 if(frow && document.getElementById('shopgrid')){
   frow.querySelectorAll('.fpill').forEach(btn=>btn.onclick=()=>{
     frow.querySelectorAll('.fpill').forEach(b=>b.classList.remove('active'));
     btn.classList.add('active');
     const cat=btn.dataset.cat;
     const list=cat==='All'?PRODUCTS:PRODUCTS.filter(p=>p.cat===cat);
     document.getElementById('shopgrid').innerHTML=list.map(ProductCard).join('');
   });
 }
 // account tabs
 const atabs=document.getElementById('acctTabs');
 if(atabs){
   atabs.querySelectorAll('.fpill').forEach(btn=>btn.onclick=()=>{
     atabs.querySelectorAll('.fpill').forEach(b=>b.classList.remove('active'));
     btn.classList.add('active');
     ['orders','addresses','wishlist'].forEach(t=>document.getElementById('acct-'+t).style.display=(t===btn.dataset.tab?'block':'none'));
   });
 }
 // product detail
 if(hash.startsWith('#/product/')){
   const id=document.getElementById('pd-id').value;
   const p=PRODUCTS.find(x=>x.id===id);
   let qty=1, variant=p.variants[0];
   const priceEl=document.getElementById('pd-price'), weightEl=document.getElementById('pd-weight'), qtyEl=document.getElementById('pd-qty');
   document.querySelectorAll('.varbtn').forEach(b=>b.onclick=()=>{
     document.querySelectorAll('.varbtn').forEach(x=>x.classList.remove('active'));
     b.classList.add('active');
     variant=p.variants.find(v=>v.w===b.dataset.w);
     priceEl.textContent=fmt(variant.price*qty); weightEl.textContent=variant.w;
   });
   document.getElementById('pd-minus').onclick=()=>{qty=Math.max(1,qty-1);qtyEl.textContent=qty;priceEl.textContent=fmt(variant.price*qty);};
   document.getElementById('pd-plus').onclick=()=>{qty++;qtyEl.textContent=qty;priceEl.textContent=fmt(variant.price*qty);};
   const addBtn=document.getElementById('pd-add');
   if(addBtn && p.stock!=='out') addBtn.onclick=()=>addToCart({key:p.id+'-'+variant.w,name:p.name,variant:variant.w,qty:qty,price:variant.price,icon:p.icon});
 }
 // corporate bulk form
 const bulk=document.getElementById('bulkform');
 if(bulk) bulk.onsubmit=e=>{e.preventDefault();showToast('Quote request sent — our team will contact you shortly.');bulk.reset();};
 // contact form
 const cf=document.getElementById('contactform');
 if(cf) cf.onsubmit=e=>{e.preventDefault();showToast('Message sent — thank you!');cf.reset();};
 // checkout payment pills + submit
 const payrow=document.getElementById('payrow');
 if(payrow) payrow.querySelectorAll('.radiopill').forEach(p=>p.onclick=()=>{
   payrow.querySelectorAll('.radiopill').forEach(x=>x.classList.remove('active'));
   p.classList.add('active');
   const pd=document.getElementById('paydetails');
   if(pd) pd.innerHTML=PAY_DETAILS[p.dataset.pay]||'';
 });
 const co=document.getElementById('checkoutform');
 if(co) co.onsubmit=e=>{
   e.preventDefault();
   const payEl=payrow.querySelector('.radiopill.active');
   const order={id:'GG-'+Math.floor(10000+Math.random()*89999),pay:payEl?payEl.dataset.pay:'Cash on Delivery',email:co.email.value,total:cartTotal(),items:cart.map(i=>({name:i.name,variant:i.variant,qty:i.qty,price:i.price}))};
   localStorage.setItem('gg_last_order',JSON.stringify(order));
   cart=[];saveCart();location.hash='#/order-confirmation';
 };
}

route();