/* Static-host compatibility. Visuals and motion remain owned by the recovered app. */
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  // A static host cannot serve Next's server-component navigation responses.
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target || anchor.hasAttribute('download')) return;
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    location.assign(url.href);
  }, true);

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const request = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (request.origin === location.origin && request.pathname.startsWith('/api/booking')) {
      if ((init?.method || 'GET').toUpperCase() !== 'GET') {
        return Promise.resolve(Response.json({error:'preview_only'}, {status:409}));
      }
      if(request.pathname === '/api/booking/event-type') return nativeFetch('/booking-preview.json');
      if(request.pathname === '/api/booking/slots') {
        const start = new Date(request.searchParams.get('from'));
        const end = new Date(request.searchParams.get('to'));
        const slots = [];
        const day = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
        for(let count=0; day<=end && count<36; count++,day.setUTCDate(day.getUTCDate()+1)) {
          if(day.getUTCDay()===0 || day.getUTCDay()===6) continue;
          for(const hour of [8,10,13,15]) {
            const date = new Date(day); date.setUTCHours(hour,0,0,0);
            if(date>start) slots.push({start:date.toISOString(),end:new Date(+date+1800000).toISOString()});
          }
        }
        return Promise.resolve(Response.json({slots}));
      }
    }
    // No analytics are sent to the reference site's reporting endpoint.
    if(request.pathname.startsWith('/_vercel/insights')) return Promise.resolve(new Response('',{status:200}));
    return nativeFetch(input,init);
  };

  const ready = () => {
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let productGesture=null;
    const discoverProduct=(stage,direction)=>{
      const deck=stage.closest('.deck-photos');
      const cards=deck?[...deck.querySelectorAll('.domani-product-card')]:[];
      const current=cards.indexOf(stage.closest('.domani-product-card'));
      const track=deck?.closest('section')?.firstElementChild;
      if(!track||current<0||cards.length<2)return;
      const next=(current+direction+cards.length)%cards.length;
      const range=Math.max(0,track.offsetHeight-window.innerHeight);
      const top=window.scrollY+track.getBoundingClientRect().top+range*((next+.96)/cards.length);
      window.scrollTo({top,behavior:reducedMotion.matches?'instant':'smooth'});
    };
    document.addEventListener('pointerdown',event=>{
      const stage=event.target.closest?.('.domani-product-stage');
      if(!stage||event.button!==0||!event.isPrimary)return;
      const image=stage.querySelector('.domani-pack');
      if(!image)return;
      image.getAnimations().filter(animation=>animation.effect?.getKeyframes().some(frame=>frame.transform)).forEach(animation=>animation.cancel());
      productGesture={stage,image,id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,dy:0};
      stage.setPointerCapture(event.pointerId);
    });
    document.addEventListener('pointermove',event=>{
      const gesture=productGesture;
      if(!gesture||event.pointerId!==gesture.id)return;
      gesture.dx=event.clientX-gesture.x;
      gesture.dy=event.clientY-gesture.y;
      if(reducedMotion.matches)return;
      const yaw=-18+gesture.dx*.65;
      const pitch=-7+Math.max(-12,Math.min(12,-gesture.dy*.06));
      const roll=Math.max(-9,Math.min(9,gesture.dx*.035));
      gesture.image.style.transform=`rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg) scale(1.035)`;
    },{passive:true});
    const settleProduct=(event,cancelled=false)=>{
      const gesture=productGesture;
      if(!gesture||event.pointerId!==gesture.id)return;
      productGesture=null;
      if(gesture.stage.hasPointerCapture(event.pointerId))gesture.stage.releasePointerCapture(event.pointerId);
      const from=gesture.image.style.transform||'none';
      gesture.image.style.transform='rotateX(-7deg) rotateY(-18deg)';
      if(!reducedMotion.matches)gesture.image.animate([{transform:from},{transform:'rotateX(-7deg) rotateY(-18deg) rotateZ(0deg) scale(1)'}],{duration:750,easing:'cubic-bezier(.16,1,.3,1)'});
      const threshold=Math.min(90,gesture.stage.clientWidth*.22);
      if(!cancelled&&Math.abs(gesture.dx)>threshold&&Math.abs(gesture.dx)>Math.abs(gesture.dy)*1.3)discoverProduct(gesture.stage,gesture.dx<0?1:-1);
    };
    document.addEventListener('pointerup',event=>settleProduct(event));
    document.addEventListener('pointercancel',event=>settleProduct(event,true));
    document.addEventListener('keydown',event=>{
      const stage=event.target.closest?.('.domani-product-stage');
      if(!stage||!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();
      discoverProduct(stage,event.key==='ArrowRight'?1:-1);
    });
    const panel = document.createElement('aside');
    panel.id = 'local-cookie-panel';
    panel.setAttribute('aria-label','Cookie preferences');
    panel.hidden = true;
    panel.innerHTML = '<p class="local-cookie-title">We use cookies</p><p class="local-cookie-copy">We use cookies to improve your experience. <a href="/dataprivacy">Privacy Policy</a></p><div class="local-cookie-actions"><button type="button" data-choice="necessary">Necessary only</button><button type="button" data-choice="all">Accept all</button></div>';
    document.body.append(panel);
    const open = () => { panel.hidden=false; };
    window.Cookiebot = {renew:open,show:open,consent:{necessary:true,preferences:false,statistics:false,marketing:false}};
    panel.addEventListener('click', event => {
      const button=event.target.closest('[data-choice]');
      if(!button) return;
      write('grace-local-consent',button.dataset.choice); panel.hidden=true;
    });
    document.addEventListener('click', event => {
      if(event.target.closest('button')?.textContent.trim().toLowerCase()==='cookie settings') open();
    });
    const observer=new MutationObserver(() => {
      if(!document.querySelector('[role="dialog"]')) {
        if(!read('grace-local-consent')) open();
        observer.disconnect();
      }
    });
    if(!read('grace-local-consent')) {
      if(document.querySelector('[role="dialog"]')) observer.observe(document.body,{childList:true,subtree:true});
      else open();
    }
    if(location.pathname.replace(/\/$/,'')==='/book') {
      const note=document.createElement('aside');
      note.className='local-booking-note';
      note.innerHTML='Preview calendar · sample availability. No appointments are created. <a href="https://calendly.com/aiworx-getoknow/grace-fashion-studio-demo" target="_blank" rel="noopener noreferrer">Open live calendar ↗</a>';
      document.body.append(note);
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
