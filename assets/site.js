
(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.14,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  // counters
  function fmt(v,dec){ return v>=1000 ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec); }
  function count(el){
    var t=parseFloat(el.dataset.count),dec=parseInt(el.dataset.dec||'0',10),pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';
    if(reduced){el.textContent=pre+fmt(t,dec)+suf;return;}
    var s=null,d=1600;
    function step(ts){if(!s)s=ts;var p=Math.min((ts-s)/d,1);var e=1-Math.pow(1-p,3);el.textContent=pre+fmt(t*e,dec)+suf;if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);cio.unobserve(e.target);}});},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el);});

  // generic grow-on-view (hbars width, vbars height)
  function grow(container){
    container.classList.add('play');
    container.querySelectorAll('.hbar-fill').forEach(function(f,i){ setTimeout(function(){ f.style.width=f.dataset.w+'%'; }, i*100); });
    container.querySelectorAll('.vbar').forEach(function(b){ b.style.height=b.dataset.h+'%'; });
    container.querySelectorAll('.rg-fill').forEach(function(f,i){ setTimeout(function(){ f.style.width=f.dataset.w+'%'; }, i*80); });
  }
  var gio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){grow(e.target);gio.unobserve(e.target);}});},{threshold:.35});
  document.querySelectorAll('.hbars,.vbars,.region').forEach(function(el){gio.observe(el);});

  // donut
  var dio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    e.target.querySelectorAll('circle').forEach(function(c){ c.setAttribute('stroke-dasharray', c.dataset.dash); });
    dio.unobserve(e.target);
  }});},{threshold:.4});
  document.querySelectorAll('.donut').forEach(function(el){dio.observe(el);});

  // line draw
  var lio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    e.target.querySelectorAll('.lc-line,.lc-area,.lc-dot').forEach(function(p){ p.classList.add('in'); });
    lio.unobserve(e.target);
  }});},{threshold:.3});
  document.querySelectorAll('.linechart').forEach(function(el){lio.observe(el);});

  // hero scroll twist + fade
  if(!reduced){
    var hc=document.querySelector('.hero-content');
    if(hc){
      var ticking=false;
      function twist(){
        var p=Math.min(window.scrollY/(window.innerHeight*0.72),1);
        var rx=p*17, rot=p*9, sc=1-p*0.3, ty=p*-26, bl=p*9;
        hc.style.transform='perspective(1100px) rotateX('+rx+'deg) rotate('+rot+'deg) scale('+sc+') translateY('+ty+'px)';
        hc.style.opacity=Math.max(0,1-p*1.25).toFixed(3);
        hc.style.filter='blur('+bl.toFixed(2)+'px)';
        ticking=false;
      }
      window.addEventListener('scroll',function(){ if(!ticking){requestAnimationFrame(twist);ticking=true;} },{passive:true});
      twist();
    }
  }

  // hero avatar 3D tilt
  if(!reduced){
    var av=document.getElementById('heroAvatar');
    var hero=document.querySelector('.hero');
    if(av&&hero){
      hero.addEventListener('pointermove',function(e){
        var r=hero.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-0.5;
        var y=(e.clientY-r.top)/r.height-0.5;
        av.style.transform='rotateY('+(x*16)+'deg) rotateX('+(-y*16)+'deg)';
      });
      hero.addEventListener('pointerleave',function(){ av.style.transform='rotateY(0deg) rotateX(0deg)'; });
    }
  }

  // hero parallax
  if(!reduced){
    var orbs=document.querySelectorAll('.orb,.phero-glow .o');
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      if(y<window.innerHeight*1.3){ orbs.forEach(function(o,i){ o.style.transform='translateY('+(y*(0.06+(i*0.04)))+'px)'; }); }
    },{passive:true});
  }
})();
