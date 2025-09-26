// Carousel locked to maison/images/carousel/ and tolerant of jpg/jpeg/png (any case)
(function(){
  const track   = document.getElementById('track');
  const dotsWrap= document.getElementById('dots');
  const prev    = document.getElementById('prev');
  const next    = document.getElementById('next');

  if(!track) return;

  const MAX     = 10;
  const baseDir = 'images/carousel';
  const exts    = ['jpg','JPG','jpeg','JPEG','png','PNG'];
  const slides  = [];
  let i = 0, timer;

  function probe(src, ok, fail){
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = fail;
    img.src = src + `?v=${Date.now()}`; // cache-bust
  }

  function findExisting(n, done){
    let k = 0;
    (function loop(){
      if (k >= exts.length) return done(null);
      const src = `${baseDir}/img_${n}.${exts[k++]}`;
      probe(src, img => done(img), loop);
    })();
  }

  let pending = MAX, found = 0;
  for(let n=1;n<=MAX;n++){
    findExisting(n, img=>{
      if(img){
        img.alt = `Image ${n}`;
        slides.push(img);
        track.appendChild(img);
        found++;
      }
      if(--pending === 0) finalize();
    });
  }

  function finalize(){
    if(found === 0){
      track.innerHTML = '<div style="width:100%;height:380px;display:flex;align-items:center;justify-content:center;color:#555;background:#f3f4f6">Ajoutez des images nommées <code>img_1.jpg</code>… dans <code>maison/images/carousel/</code>.</div>';
      return;
    }

    // Set widths so each slide = viewport width
    track.style.width = `${slides.length * 100}%`;
    slides.forEach(im => { im.style.width = `${100 / slides.length}%`; });

    // Dots
    slides.forEach((_,idx)=>{
      const b=document.createElement('button');
      b.className='dot'+(idx===0?' active':'');
      b.type='button';
      b.setAttribute('aria-label',`Aller à la photo ${idx+1}`);
      b.addEventListener('click',()=>go(idx));
      dotsWrap.appendChild(b);
    });

    go(0);
    timer = setInterval(()=>go(i+1), 5000);
  }

  function go(n){
    if(!slides.length) return;
    i=(n+slides.length)%slides.length;
    track.style.transform = `translateX(${-i*100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d,idx)=>d.classList.toggle('active', idx===i));
  }

  prev?.addEventListener('click',()=>go(i-1));
  next?.addEventListener('click',()=>go(i+1));
  [prev,next,track].forEach(el=>{
    el?.addEventListener('mouseenter',()=>clearInterval(timer));
    el?.addEventListener('mouseleave',()=>timer=setInterval(()=>go(i+1),5000));
  });
})();
