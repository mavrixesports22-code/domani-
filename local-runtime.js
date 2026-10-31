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
