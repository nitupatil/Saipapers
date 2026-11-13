"use strict";
(function(){
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
    ["Chromo Barcode Labels","chromo-barcode-labels","Barcode labels","chromo barcode paper glossy matte retail stickers"],
    ["Direct Thermal Labels","direct-thermal-labels","Thermal labels","thermal label rolls ribbon free billing shipping"],
    ["Shipping Labels","shipping-labels","Shipping labels","courier labels 4x6 100x150 ecommerce parcel"],
    ["Printed Barcode Labels","printed-barcode-labels","Barcode labels","printed barcode stickers QR inventory serial"],
    ["Color Barcode Labels","color-barcode-labels","Printed labels","colour barcode labels colored stickers logo"],
    ["Printed Product Labels","printed-product-labels","Printed labels","packaging food cosmetics multicolor brand"],
    ["Barcode Printers","barcode-printers","Printers","thermal printer barcode printer machine"],
    ["Plain Labels","plain-labels","Blank labels","plain blank labels rolls paper"],
    ["Security Labels","security-labels","Specialty labels","security labels tamper evident asset"],
    ["Thermal Transfer Ribbons","thermal-transfer-ribbons","Printer consumables","ribbons wax resin transfer consumables"],
    ["Custom Self Adhesive Labels","custom-self-adhesive-labels","Custom labels","adhesive labels customized sticker labels"]
  ];
  /* Shared search UI is mounted inside the existing header on every page. */
  const isProductPage=/\/products\/[^/]+\.html$/i.test(location.pathname);
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
    search.setAttribute("action",root+"shop.html");
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
        const a=document.createElement("a");a.href=root+"products/"+p[1]+".html";a.tabIndex=-1;
        const icon=document.createElement("span");icon.className="suggestion-icon";icon.setAttribute("aria-hidden","true");icon.textContent="⌕";
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
      if(e.key==="Enter"&&active>=0&&matches[active]){e.preventDefault();location.href=root+"products/"+matches[active][1]+".html";}
    });
    searchForm.addEventListener("submit",e=>{
      e.preventDefault();
      const q=searchInput.value.trim();
      if(active>=0&&matches[active])location.href=root+"products/"+matches[active][1]+".html";
      else if(q)location.href=root+"shop.html?q="+encodeURIComponent(q);
      else {searchInput.focus();draw();}
    });
    document.addEventListener("pointerdown",e=>{if(!searchForm.contains(e.target))close();});
    searchList.addEventListener("click",()=>close());
  }

  /* Product-only slideshow: rotate every 2s; pause on keyboard focus or reduced motion. */
  const carousel=document.getElementById("banner-carousel");
  if(carousel){
    const slides=Array.from(carousel.querySelectorAll(".banner-slide"));
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index=0,timer=null,touchX=null;
    function ensure(i){
      if(!slides.length)return;
      const img=slides[(i+slides.length)%slides.length].querySelector("img[data-src]");
      if(img){img.src=img.dataset.src;img.removeAttribute("data-src");}
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
    const button=popupForm.querySelector('button[type="submit"]');if(button){button.disabled=false;button.textContent="Send Price Enquiry ↗";}
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
    const submit=form.querySelector('button[type="submit"]');if(submit)submit.disabled=false;
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
    }else{
      setFeedback(form,message||"Unable to confirm submission. Please try again or contact us on WhatsApp.","error");
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
    finish(data.ok===true,String(data.title||""),String(data.message||""));
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
      const id=makeRequestId();
      let hidden=form.querySelector('input[name="request_id"]');
      if(!hidden){hidden=document.createElement("input");hidden.type="hidden";hidden.name="request_id";form.appendChild(hidden);}
      hidden.value=id;
      // Accept either old/new backend field naming, while avoiding duplicates.
      const previous=form.querySelector('input[name="requirements"]');
      const msg=form.elements.namedItem("message");
      if(msg&&!previous){const req=document.createElement("input");req.type="hidden";req.name="requirements";form.appendChild(req);}
      const req=form.elements.namedItem("requirements");if(req&&msg)req.value=msg.value;
      const btn=form.querySelector('button[type="submit"]');
      if(btn){btn.disabled=true;btn.textContent="Submitting…";}
      setFeedback(form,"Submitting your enquiry securely. Please keep this page open.","pending");
      activeRequest={id,form};
      form.target=iframe.name;
      requestTimeout=window.setTimeout(()=>{
        finish(false,"Confirmation unavailable","We couldn't confirm the email submission. Please check with our team on WhatsApp before resending, to avoid a duplicate enquiry.");
      },30000);
      HTMLFormElement.prototype.submit.call(form);
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
