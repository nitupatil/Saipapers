"use strict";
(function(){
  // Keep the browser address bar consistent with extensionless canonical links.
  // GitHub Pages serves matching .html files at the clean path.
  if (/\.html$/i.test(location.pathname)) {
    try {
      const cleanPath=location.pathname.replace(/\/index\.html$/i,"/").replace(/\.html$/i,"");
      history.replaceState(history.state,"",cleanPath+location.search+location.hash);
    } catch (_) { /* URLs still function with their legacy extension. */ }
  }
  const year=document.getElementById("current-year");
  if(year)year.textContent=String(new Date().getFullYear());

  const menu=document.getElementById("menu-toggle");
  const nav=document.getElementById("site-nav");
  function closeMenu(){if(!nav||!menu)return;nav.classList.remove("is-open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation menu");}
  if(menu&&nav){
    menu.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation menu":"Open navigation menu");});
    nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
  }

  /* All search suggestions are local, fast and linked to real static product pages. */
  const productIndex=[
    ["Chromo Barcode Labels","chromo-barcode-labels","Barcode labels","chromo barcode paper glossy matte retail stickers","chromo-barcode-labels/gallery/chromo-barcode-label-roll-studio-hero.webp"],
    ["Direct Thermal Labels","direct-thermal-labels","Thermal labels","thermal label rolls ribbon free billing shipping","direct-thermal-labels/gallery/direct-thermal-labels-studio-hero.webp"],
    ["Shipping Labels","shipping-labels","Shipping labels","courier labels 4x6 100x150 ecommerce parcel","shipping-labels/gallery/shipping-labels-studio-hero.webp"],
    ["Printed Barcode Labels","printed-barcode-labels","Barcode labels","printed barcode stickers QR inventory serial","printed-barcode-labels/gallery/printed-barcode-labels-studio-hero.webp"],
    ["Color Barcode Labels","color-barcode-labels","Printed labels","colour barcode labels colored stickers logo","color-barcode-labels/gallery/color-barcode-labels-multicolor-rolls.webp"],
    ["Printed Product Labels","printed-product-labels","Printed labels","packaging food cosmetics multicolor brand","printed-product-labels/gallery/printed-product-labels-studio-assortment.webp"],
    ["Barcode Printers","barcode-printers","Printers","thermal printer barcode printer machine","barcode-printers/tsc-printer-main.webp"],
    ["Plain Labels","plain-labels","Blank labels","plain blank labels rolls paper","plain-labels/gallery/plain-labels-studio-assortment.webp"],
    ["Security Labels","security-labels","Specialty labels","security labels tamper evident asset","printed-barcode-labels.webp"],
    ["Thermal Transfer Ribbons","thermal-transfer-ribbons","Printer consumables","ribbons wax resin transfer consumables","thermal-transfer-ribbons/gallery/thermal-transfer-ribbons-studio-hero.webp"],
    ["Custom Self Adhesive Labels","custom-self-adhesive-labels","Custom labels","adhesive labels customized sticker labels","color-barcode-labels.webp"]
  ];
  /* Shared search UI is mounted inside the existing header on every page. */
  const isProductPage=/\/products\/[^/]+(?:\.html)?$/i.test(location.pathname);
  if(isProductPage)document.body.classList.add("product-detail-page");
  const header=document.querySelector(".header-inner");
  if(header&&!isProductPage&&!document.getElementById("header-search-form")){
    const brand=header.querySelector(".brand");
    const root=brand&&brand.getAttribute("href")?.startsWith("../")?"../":"";
    const search=document.createElement("form");
    search.id="header-search-form";
    search.className="header-search";
    search.setAttribute("role","search");
    search.setAttribute("data-root",root);
    search.setAttribute("action",root+"shop");
    search.innerHTML='<div class="header-search-field"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input id="header-product-search" name="q" type="search" placeholder="Search barcode labels, printers..." autocomplete="off" aria-label="Search Sai Paper Product catalogue" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-controls="search-suggestions"><button class="header-search-go" type="submit">Search</button></div><ul id="search-suggestions" class="search-suggestions" role="listbox" aria-label="Product suggestions" hidden></ul>';
    if(brand)brand.insertAdjacentElement("afterend",search);else header.prepend(search);
  }
  const searchForm=document.getElementById("header-search-form");
  const searchInput=document.getElementById("header-product-search");
  const searchList=document.getElementById("search-suggestions");
  if(searchForm&&searchInput&&searchList){
    const root=searchForm.getAttribute("data-root")||"";
    let active=-1;
    let matches=[];
    const close=()=>{searchList.hidden=true;searchList.replaceChildren();searchInput.setAttribute("aria-expanded","false");searchInput.removeAttribute("aria-activedescendant");active=-1;};
    function draw(){
      const query=searchInput.value.trim().toLowerCase();
      matches=productIndex.filter(p=>(p[0]+" "+p[2]+" "+p[3]).toLowerCase().includes(query)).slice(0,6);
      active=-1;
      searchList.replaceChildren();
      const heading=document.createElement("li");heading.className="search-list-heading";heading.setAttribute("aria-hidden","true");heading.textContent=query?"Matching products":"Popular products";searchList.appendChild(heading);
      if(!matches.length){
        const empty=document.createElement("li");empty.className="search-list-empty";empty.textContent="No matching products. Press Enter to search the shop.";searchList.appendChild(empty);
      }
      matches.forEach((p,i)=>{
        const li=document.createElement("li");li.setAttribute("role","option");li.setAttribute("aria-selected","false");li.id="suggestion-"+i;li.className="search-list-item";
        const a=document.createElement("a");a.href=root+"products/"+p[1];a.tabIndex=-1;
        const icon=document.createElement("span");icon.className="suggestion-icon";icon.setAttribute("aria-hidden","true");
        const photo=document.createElement("img");photo.className="suggestion-image";photo.src=root+"assets/images/"+p[4];photo.alt="";photo.width=46;photo.height=46;photo.loading="lazy";photo.decoding="async";
        photo.addEventListener("error",()=>{photo.remove();icon.textContent="⌕";},{once:true});icon.appendChild(photo);
        const title=document.createElement("span");title.className="suggestion-info";
        const strong=document.createElement("strong");strong.textContent=p[0];
        const small=document.createElement("small");small.textContent=p[2];
        title.append(strong,small);
        const arrow=document.createElement("span");arrow.setAttribute("aria-hidden","true");arrow.textContent="↗";
        a.append(icon,title,arrow);li.appendChild(a);searchList.appendChild(li);
      });
      searchList.hidden=false;
      searchInput.setAttribute("aria-expanded","true");
    }
    function setActive(index){
      if(!matches.length)return;
      active=(index+matches.length)%matches.length;
      searchList.querySelectorAll('[role="option"]').forEach((el,i)=>{el.classList.toggle("is-current",i===active);el.setAttribute("aria-selected",String(i===active));});
      searchInput.setAttribute("aria-activedescendant","suggestion-"+active);
    }
    searchInput.addEventListener("focus",draw);
    searchInput.addEventListener("input",draw);
    searchInput.addEventListener("keydown",e=>{
      if(e.key==="Escape"){close();return;}
      if(e.key==="ArrowDown"){e.preventDefault();if(searchList.hidden)draw();setActive(active+1);return;}
      if(e.key==="ArrowUp"){e.preventDefault();if(searchList.hidden)draw();setActive(active-1);return;}
      if(e.key==="Enter"&&active>=0&&matches[active]){e.preventDefault();location.href=root+"products/"+matches[active][1];}
    });
    searchForm.addEventListener("submit",e=>{
      e.preventDefault();
      const q=searchInput.value.trim();
      if(active>=0&&matches[active])location.href=root+"products/"+matches[active][1];
      else if(q)location.href=root+"shop?q="+encodeURIComponent(q);
      else {searchInput.focus();draw();}
    });
    document.addEventListener("pointerdown",e=>{if(!searchForm.contains(e.target))close();});
    searchList.addEventListener("click",()=>close());
  }

  /* Mobile scroll-aware header: full at top, compact search/title on upward scroll. */
  const stickyHeader=document.querySelector(".site-header");
  if(stickyHeader){
    const mobileViewport=window.matchMedia("(max-width:850px)");
    let lastScrollY=Math.max(0,window.scrollY),scrollQueued=false;
    function updateMobileHeader(){
      const y=Math.max(0,window.scrollY);
      const navigationOpen=nav?.classList.contains("is-open");
      const searchFocused=searchForm?.contains(document.activeElement);
      if(!mobileViewport.matches||y<76||navigationOpen){
        stickyHeader.classList.remove("mobile-compact","mobile-scroll-hidden","mobile-compact-title");
        lastScrollY=y;
        return;
      }
      if(searchFocused){
        stickyHeader.classList.remove("mobile-scroll-hidden");
        stickyHeader.classList.add("mobile-compact");
        stickyHeader.classList.toggle("mobile-compact-title",!searchForm);
        lastScrollY=y;
        return;
      }
      const delta=y-lastScrollY;
      if(delta>7){
        stickyHeader.classList.add("mobile-scroll-hidden");
        stickyHeader.classList.remove("mobile-compact","mobile-compact-title");
        lastScrollY=y;
      }else if(delta< -7){
        stickyHeader.classList.remove("mobile-scroll-hidden");
        stickyHeader.classList.add("mobile-compact");
        stickyHeader.classList.toggle("mobile-compact-title",!searchForm);
        lastScrollY=y;
      }
    }
    window.addEventListener("scroll",()=>{
      if(scrollQueued)return;
      scrollQueued=true;
      window.requestAnimationFrame(()=>{scrollQueued=false;updateMobileHeader();});
    },{passive:true});
    window.addEventListener("resize",()=>{lastScrollY=Math.max(0,window.scrollY);if(!mobileViewport.matches)stickyHeader.classList.remove("mobile-compact","mobile-scroll-hidden","mobile-compact-title");});
    menu?.addEventListener("click",()=>window.requestAnimationFrame(updateMobileHeader));
    searchForm?.addEventListener("focusin",updateMobileHeader);
    window.addEventListener("pageshow",()=>{lastScrollY=Math.max(0,window.scrollY);stickyHeader.classList.remove("mobile-compact","mobile-scroll-hidden","mobile-compact-title");});
  }

  /* Product-only slideshow: rotate every 2s; pause on keyboard focus or reduced motion. */
  const carousel=document.getElementById("banner-carousel");
  if(carousel){
    const slides=Array.from(carousel.querySelectorAll(".banner-slide"));
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileBanner=window.matchMedia("(max-width:850px)");
    let index=0,timer=null,touchX=null;
    function ensure(i){
      if(!slides.length)return;
      const slide=slides[(i+slides.length)%slides.length];
      const img=mobileBanner.matches?slide.querySelector("img[data-mobile-src]"):slide.querySelector("img[data-src]");
      if(img){
        if(mobileBanner.matches){img.src=img.dataset.mobileSrc;img.removeAttribute("data-mobile-src");}
        else {img.src=img.dataset.src;img.removeAttribute("data-src");}
      }
    }
    function show(i){
      if(!slides.length)return;
      index=(i+slides.length)%slides.length;
      ensure(index);ensure(index+1);
      slides.forEach((slide,j)=>{
        const active=j===index;
        slide.classList.toggle("is-active",active);
        slide.setAttribute("aria-hidden",String(!active));
        slide.querySelectorAll("a").forEach(a=>{a.tabIndex=active?0:-1;});
      });
    }
    function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
    function start(){
      stop();
      if(slides.length>1&&!reduced&&!document.hidden&&!carousel.contains(document.activeElement))
        timer=window.setInterval(()=>show(index+1),2000);
    }
    carousel.addEventListener("focusin",stop);
    carousel.addEventListener("focusout",e=>{if(!carousel.contains(e.relatedTarget))start();});
    carousel.addEventListener("touchstart",e=>{touchX=e.changedTouches[0].screenX;},{passive:true});
    carousel.addEventListener("touchend",e=>{
      if(touchX===null)return;
      const delta=e.changedTouches[0].screenX-touchX;touchX=null;
      if(Math.abs(delta)>45){show(index+(delta<0?1:-1));start();}
    },{passive:true});
    document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();else start();});
    mobileBanner.addEventListener("change",()=>{ensure(index);ensure(index+1);});
    show(0);start();
  }

  /* Same-page form acknowledgement. Success is only shown after server postMessage. */
  const dialog=document.getElementById("enquiry-dialog");
  /* Acknowledgement panels stay in the current page; no browser tabs. */
  if(dialog&&!document.getElementById("enquiry-complete")){
    const content=dialog.querySelector(".dialog-body");
    if(content){const panel=document.createElement("section");panel.id="enquiry-complete";panel.className="enquiry-confirmation";panel.hidden=true;panel.setAttribute("role","status");panel.setAttribute("aria-live","polite");panel.innerHTML='<span class="confirmation-icon" aria-hidden="true">✓</span><h3>Enquiry submitted</h3><p>Your enquiry has been received.</p><button type="button" class="btn btn-red" data-close-enquiry>Close</button>';content.appendChild(panel);}
  }
  const popupForm=document.getElementById("enquiry-form");
  const productField=document.getElementById("enquiry-product");
  const typeField=document.getElementById("enquiry-type");
  const messageField=document.getElementById("enquiry-message");
  let activeRequest=null;
  let requestTimeout=null;
  let requestSlowTimer=null;
  const submitOverlay=document.createElement("dialog");
  submitOverlay.id="sai-submit-overlay";
  submitOverlay.className="sai-submit-dialog";
  submitOverlay.setAttribute("aria-labelledby","sai-submit-title");
  submitOverlay.setAttribute("aria-describedby","sai-submit-description");
  submitOverlay.innerHTML='<div class="sai-submit-card"><span class="sai-submit-orbit" aria-hidden="true"><svg viewBox="0 0 80 80" width="76" height="76" focusable="false"><rect x="14" y="22" width="52" height="37" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="m17 26 23 18 23-18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M40 5a35 35 0 0 1 35 35" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></span><span class="sai-submit-kicker">SAI PAPER PRODUCT</span><h2 id="sai-submit-title">Submitting your enquiry</h2><p id="sai-submit-description" role="status" aria-live="polite">Sending your details securely. Please keep this page open.</p><span class="sai-submit-progress" aria-hidden="true"><span></span></span><small>One request at a time • Please do not resubmit</small></div>';
  document.body.appendChild(submitOverlay);
  submitOverlay.addEventListener("cancel",event=>{if(activeRequest)event.preventDefault();});
  function showSubmitting(){
    const state=submitOverlay.querySelector("#sai-submit-description");
    if(state)state.textContent="Sending your details securely. Please keep this page open.";
    document.body.classList.add("sai-submitting");
    try{if(typeof submitOverlay.showModal==="function")submitOverlay.showModal();else submitOverlay.setAttribute("open","");}
    catch(_){submitOverlay.setAttribute("open","");}
    submitOverlay.focus();
    clearTimeout(requestSlowTimer);
    requestSlowTimer=window.setTimeout(()=>{
      if(activeRequest&&state)state.textContent="Google is taking longer than usual. Your request may already be processing; please do not send it again.";
    },12000);
  }
  function hideSubmitting(){
    clearTimeout(requestSlowTimer);requestSlowTimer=null;
    document.body.classList.remove("sai-submitting");
    try{if(submitOverlay.open&&typeof submitOverlay.close==="function")submitOverlay.close();else submitOverlay.removeAttribute("open");}
    catch(_){submitOverlay.removeAttribute("open");}
  }
  function recentKey(form,mobile){
    const product=String(form.elements.namedItem("product")?.value||"").trim().toLowerCase();
    const type=String(form.elements.namedItem("enquiry_type")?.value||"price");
    return product+"|"+type+"|"+mobile.slice(-4);
  }
  function recentEnquiry(){
    try{return JSON.parse(sessionStorage.getItem("sai-last-enquiry")||"null");}
    catch(_){return null;}
  }
  function rememberEnquiry(signature){
    try{sessionStorage.setItem("sai-last-enquiry",JSON.stringify({signature,ts:Date.now()}));}
    catch(_){}
  }
  function clearRecentEnquiry(){
    try{sessionStorage.removeItem("sai-last-enquiry");}
    catch(_){}
  }
  const targetOrigin=location.origin;
  const iframe=document.createElement("iframe");
  iframe.name="sai-enquiry-transport";
  iframe.id="sai-enquiry-transport";
  iframe.title="Enquiry delivery";
  iframe.setAttribute("aria-hidden","true");
  iframe.style.cssText="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0;left:-9999px";
  document.body.appendChild(iframe);
  const forms=Array.from(document.querySelectorAll('form[action*="script.google.com/macros/s/"]'));
  forms.forEach(form=>{const note=form.querySelector("#enquiry-status, .form-note");if(note)note.textContent="Your submission result will appear here. Please keep this page open.";});
  forms.filter(form=>form!==popupForm).forEach(form=>{
    if(form.parentElement.querySelector(".inline-enquiry-result"))return;
    const panel=document.createElement("section");panel.className="inline-enquiry-result";panel.hidden=true;panel.setAttribute("role","status");panel.setAttribute("aria-live","polite");
    panel.innerHTML='<span class="confirmation-icon" aria-hidden="true">✓</span><h3>Enquiry submitted</h3><p>Your enquiry has been received.</p><button type="button" class="btn btn-outline" data-new-enquiry>Send another enquiry</button>';
    form.insertAdjacentElement("afterend",panel);
    panel.querySelector("[data-new-enquiry]").addEventListener("click",()=>{panel.hidden=true;form.hidden=false;form.reset();setFeedback(form,"Enter your details to submit another price enquiry.","");});
  });
  function findFeedback(form){
    const node=form.querySelector("#enquiry-status")||form.parentElement.querySelector(".form-note");
    if(node){node.setAttribute("role","status");node.setAttribute("aria-live","polite");}
    return node;
  }
  function setFeedback(form,text,state){
    const node=findFeedback(form);
    if(node){node.textContent=text;node.dataset.state=state||"";}
  }
  function resetPopup(){
    if(!popupForm)return;
    popupForm.hidden=false;
    const complete=document.getElementById("enquiry-complete");if(complete)complete.hidden=true;
    const button=popupForm.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent="Request a Quote ↗";}
    const title=document.getElementById("enquiry-title");if(title)title.textContent="Request a quotation";
    setFeedback(popupForm,"Your submission stays on this page. We'll confirm receipt after the server responds.","");
  }
  function launchEnquiry(button){
    if(!dialog||!popupForm)return;
    resetPopup();
    const product=button.getAttribute("data-product")||"";
    const kind=button.getAttribute("data-enquiry-type")==="purchase"?"purchase":"price";
    if(product&&productField)productField.value=product;
    if(typeField)typeField.value=kind;
    const title=document.getElementById("enquiry-title");
    if(title)title.textContent=kind==="purchase"?"Purchase enquiry":"Request a quotation";
    if(messageField&&button.getAttribute("data-prefill-message"))messageField.value=button.getAttribute("data-prefill-message");
    if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
    document.body.classList.add("modal-open");
    popupForm.querySelector('input[name="name"]')?.focus({preventScroll:true});
  }
  document.addEventListener("click",e=>{
    const open=e.target.closest("[data-enquire]");
    if(open){e.preventDefault();launchEnquiry(open);return;}
    const close=e.target.closest("[data-close-enquiry]");
    if(close&&dialog){dialog.close();return;}
  });
  if(dialog){
    dialog.addEventListener("close",()=>document.body.classList.remove("modal-open"));
    dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  }
  function makeRequestId(){
    if(window.crypto&&crypto.getRandomValues){const bytes=new Uint32Array(3);crypto.getRandomValues(bytes);return "sp-"+Array.from(bytes).map(x=>x.toString(16)).join("-");}
    return "sp-"+Date.now()+"-"+Math.random().toString(36).slice(2);
  }
  function finish(ok,title,message){
    if(!activeRequest)return;
    const form=activeRequest.form;
    clearTimeout(requestTimeout);requestTimeout=null;activeRequest=null;
    hideSubmitting();
    const submit=form.querySelector('button[type="submit"]');if(submit)submit.disabled=false;
    if(ok===false)clearRecentEnquiry();
    if(ok){
      setFeedback(form,"Enquiry submitted — "+message,"success");
      if(form===popupForm){
        form.hidden=true;
        const complete=document.getElementById("enquiry-complete");
        if(complete){complete.hidden=false;complete.querySelector("h3").textContent=title||"Enquiry submitted";complete.querySelector("p").textContent=message||"Your enquiry has been received.";}
        const modalTitle=document.getElementById("enquiry-title");if(modalTitle)modalTitle.textContent="Enquiry submitted";
      }else{
        form.hidden=true;
        const result=form.parentElement.querySelector(".inline-enquiry-result");
        if(result){result.hidden=false;result.querySelector("h3").textContent=title||"Enquiry submitted";result.querySelector("p").textContent=message||"Your enquiry has been received.";}
      }
    }else if(ok===null){
      setFeedback(form,"This enquiry may already have reached our team. Please don't submit it again. For confirmation, contact us on WhatsApp.","notice");
      if(submit){submit.disabled=true;submit.textContent="Confirmation pending";}
    }else{
      setFeedback(form,message||"Unable to submit. Please check your details or contact us on WhatsApp.","error");
      if(submit)submit.textContent="Try Sending Again ↗";
    }
  }
  function validOrigin(origin){
    return origin==="https://script.googleusercontent.com"||
      origin==="https://script.google.com"||
      /^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(origin);
  }
  window.addEventListener("message",e=>{
    if(!activeRequest||!validOrigin(e.origin))return;
    const data=e.data;
    if(!data||typeof data!=="object"||data.type!=="SAI_PAPERS_ENQUIRY_RESULT"||data.request_id!==activeRequest.id)return;
    finish(data.status==="processing"?null:data.ok===true,String(data.title||""),String(data.message||""));
  });
  window.addEventListener("beforeunload",event=>{
    if(!activeRequest)return;
    event.preventDefault();
    event.returnValue="";
  });
  forms.forEach(form=>{
    form.removeAttribute("target");
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(activeRequest){setFeedback(form,"Another enquiry is still submitting. Please complete that request first.","error");return;}
      const field=form.elements.namedItem("mobile");
      let value=field?String(field.value).replace(/\D/g,""):"";
      if(value.length===12&&value.startsWith("91"))value=value.slice(2);
      if(!/^[6-9]\d{9}$/.test(value)){if(field){field.setCustomValidity("Enter a valid 10-digit Indian mobile number.");field.reportValidity();}return;}
      if(field){field.setCustomValidity("");field.value=value;}
      const signature=recentKey(form,value);
      const previous=recentEnquiry();
      if(previous&&previous.signature===signature&&Date.now()-previous.ts<180000){
        setFeedback(form,"A similar enquiry was recently submitted. It may already be in our inbox. Please contact our team on WhatsApp before resending.","notice");
        return;
      }
      const id=makeRequestId();
      let hidden=form.querySelector('input[name="request_id"]');
      if(!hidden){hidden=document.createElement("input");hidden.type="hidden";hidden.name="request_id";form.appendChild(hidden);}
      hidden.value=id;
      // Accept either old/new backend field naming, while avoiding duplicates.
      const previousRequirements=form.querySelector('input[name="requirements"]');
      const msg=form.elements.namedItem("message");
      if(msg&&!previousRequirements){const req=document.createElement("input");req.type="hidden";req.name="requirements";form.appendChild(req);}
      const req=form.elements.namedItem("requirements");if(req&&msg)req.value=msg.value;
      const btn=form.querySelector('button[type="submit"]');
      if(btn){btn.disabled=true;btn.textContent="Submitting…";}
      setFeedback(form,"Submitting your enquiry securely. Please keep this page open.","pending");
      activeRequest={id,form};
      rememberEnquiry(signature);
      showSubmitting();
      form.target=iframe.name;
      requestTimeout=window.setTimeout(()=>{
        finish(null,"Confirmation pending","Your enquiry may have been delivered, but we have not received a confirmation from Google. Please don't resend it. Contact us on WhatsApp if needed.");
      },45000);
      try{HTMLFormElement.prototype.submit.call(form);}
      catch(err){clearTimeout(requestTimeout);finish(false,"Unable to start enquiry","The submission could not start. Please try again.");}
    });
    const mobile=form.elements.namedItem("mobile");if(mobile)mobile.addEventListener("input",()=>mobile.setCustomValidity(""));
  });

  /* Shop search supports queries sent from the header. */
  const listingSearch=document.getElementById("product-search");
  const listingFilter=document.getElementById("product-filter");
  if(listingSearch||listingFilter){
    const initialQuery=new URLSearchParams(location.search).get("q");
    if(listingSearch&&initialQuery)listingSearch.value=initialQuery.slice(0,100);
    const cards=Array.from(document.querySelectorAll("[data-product-card]"));
    const count=document.getElementById("product-count"),empty=document.getElementById("no-results");
    function filterCards(){
      const q=listingSearch?listingSearch.value.toLowerCase().trim():"";
      const cat=listingFilter?listingFilter.value:"all";
      let visible=0;
      cards.forEach(card=>{
        const matches=(card.dataset.search||card.textContent).toLowerCase().includes(q)&&(cat==="all"||card.dataset.category===cat);
        card.classList.toggle("is-hidden",!matches);
        if(matches)visible++;
      });
      if(count)count.textContent=visible+" product"+(visible!==1?"s":"")+" found";
      if(empty)empty.hidden=visible!==0;
    }
    listingSearch?.addEventListener("input",filterCards);
    listingFilter?.addEventListener("change",filterCards);
    filterCards();
  }
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});
  const items=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:0.07});
    items.forEach(item=>observer.observe(item));
  }else items.forEach(item=>item.classList.add("is-visible"));
})();

/* Printer gallery: select scene, browse images, enlarge without loading a gallery library. */
(function initBarcodePrinterGallery(){
  const gallery=document.getElementById("printer-gallery");
  if(!gallery)return;
  const image=document.getElementById("printer-gallery-main");
  const title=document.getElementById("printer-gallery-title");
  const description=document.getElementById("printer-gallery-description");
  const count=document.getElementById("printer-gallery-count");
  const thumbs=Array.from(gallery.querySelectorAll("[data-printer-thumb]"));
  const modal=document.getElementById("printer-gallery-lightbox");
  const modalImage=document.getElementById("printer-lightbox-image");
  const modalCaption=document.getElementById("printer-lightbox-caption");
  if(!image||!thumbs.length)return;
  let active=0;
  function select(index){
    active=(index+thumbs.length)%thumbs.length;
    const thumb=thumbs[active];
    image.src=thumb.dataset.image;
    image.alt=thumb.dataset.alt||"Desktop barcode printer example";
    if(title)title.textContent=thumb.dataset.title||"Product view";
    if(description)description.textContent=thumb.dataset.description||"";
    if(count)count.textContent=(active+1)+" / "+thumbs.length;
    thumbs.forEach((b,i)=>{
      const selected=i===active;
      b.classList.toggle("is-selected",selected);
      b.setAttribute("aria-pressed",String(selected));
    });
    thumb.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"});
    if(modal&&modal.open&&modalImage){
      modalImage.src=image.src;
      modalImage.alt=image.alt;
      if(modalCaption)modalCaption.textContent=thumb.dataset.title||"Product view";
    }
  }
  thumbs.forEach((thumb,i)=>thumb.addEventListener("click",()=>select(i)));
  gallery.querySelector("#printer-gallery-prev")?.addEventListener("click",()=>select(active-1));
  gallery.querySelector("#printer-gallery-next")?.addEventListener("click",()=>select(active+1));
  gallery.querySelector("#printer-gallery-zoom")?.addEventListener("click",()=>{
    if(!modal||!modalImage)return;
    modalImage.src=image.src;
    modalImage.alt=image.alt;
    if(modalCaption)modalCaption.textContent=thumbs[active].dataset.title||"Product view";
    if(typeof modal.showModal==="function")modal.showModal();
  });
  gallery.querySelector("[data-close-printer-lightbox]")?.addEventListener("click",()=>modal?.close());
  modal?.addEventListener("click",event=>{if(event.target===modal)modal.close();});
  gallery.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){
      if(!gallery.contains(document.activeElement))return;
      event.preventDefault();select(active+(event.key==="ArrowRight"?1:-1));
    }
  });
})();
