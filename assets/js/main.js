
"use strict";
(function(){
  var year=document.getElementById("current-year");
  if(year){year.textContent=String(new Date().getFullYear());}
  var menu=document.getElementById("menu-toggle");
  var nav=document.getElementById("site-nav");
  function closeMenu(){if(!nav||!menu)return;nav.classList.remove("is-open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation menu");}
  if(menu&&nav){menu.addEventListener("click",function(){var opened=nav.classList.toggle("is-open");menu.setAttribute("aria-expanded",String(opened));menu.setAttribute("aria-label",opened?"Close navigation menu":"Open navigation menu");});nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",closeMenu);});}
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu();});
  var dialog=document.getElementById("enquiry-dialog");
  var form=document.getElementById("enquiry-form");
  var productField=document.getElementById("enquiry-product");
  var typeField=document.getElementById("enquiry-type");
  var messageField=document.getElementById("enquiry-message");
  function launchEnquiry(button){
    if(!dialog||!form)return;
    var product=button.getAttribute("data-product")||"";
    var kind=button.getAttribute("data-enquiry-type")==="purchase"?"purchase":"price";
    if(product&&productField){productField.value=product;}
    if(typeField)typeField.value=kind;
    var dialogTitle=document.getElementById("enquiry-title");
    if(dialogTitle)dialogTitle.textContent=kind==="purchase"?"Purchase enquiry":"Request a quotation";
    if(messageField&&button.getAttribute("data-prefill-message"))messageField.value=button.getAttribute("data-prefill-message");
    var note=document.getElementById("enquiry-status");if(note)note.textContent="";
    if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
    document.body.classList.add("modal-open");
    var nameInput=form.querySelector('input[name="name"]');
    if(nameInput)window.setTimeout(function(){nameInput.focus();},30);
  }
  document.addEventListener("click",function(e){
    var open=e.target.closest("[data-enquire]");if(open){e.preventDefault();launchEnquiry(open);return;}
    var close=e.target.closest("[data-close-enquiry]");if(close&&dialog){dialog.close();return;}
  });
  if(dialog){
    dialog.addEventListener("close",function(){document.body.classList.remove("modal-open");});
    dialog.addEventListener("click",function(e){if(e.target===dialog)dialog.close();});
  }
  if(form){
    form.addEventListener("submit",function(e){
      var phone=form.elements.namedItem("mobile");
      var v=phone?String(phone.value).replace(/\D/g,""):"";
      if(v.length===12&&v.slice(0,2)==="91")v=v.slice(2);
      if(!/^[6-9]\d{9}$/.test(v)){e.preventDefault();if(phone){phone.setCustomValidity("Enter a valid 10-digit Indian mobile number.");phone.reportValidity();}return;}
      if(phone){phone.setCustomValidity("");phone.value=v;}
      var status=document.getElementById("enquiry-status");
      if(status)status.textContent="Your enquiry will open a confirmation page in a new tab. Please verify the result there. If the new tab is blocked, allow pop-ups and try again.";
    });
    var mobileInput=form.elements.namedItem("mobile");
    if(mobileInput)mobileInput.addEventListener("input",function(){mobileInput.setCustomValidity("");});
  }
  var search=document.getElementById("product-search");
  var filter=document.getElementById("product-filter");
  if(search||filter){
    var cards=Array.prototype.slice.call(document.querySelectorAll("[data-product-card]"));
    var count=document.getElementById("product-count");
    var noResults=document.getElementById("no-results");
    function applyFilter(){
      var q=search?search.value.toLowerCase().trim():"";
      var cat=filter?filter.value:"all";
      var visible=0;
      cards.forEach(function(card){
        var text=(card.getAttribute("data-search")||card.textContent).toLowerCase();
        var matches=text.indexOf(q)!==-1&&(cat==="all"||card.getAttribute("data-category")===cat);
        card.classList.toggle("is-hidden",!matches);
        if(matches)visible++;
      });
      if(count)count.textContent=visible+" product"+(visible!==1?"s":"")+" found";
      if(noResults)noResults.hidden=visible!==0;
    }
    if(search)search.addEventListener("input",applyFilter);
    if(filter)filter.addEventListener("change",applyFilter);
    applyFilter();
  }
  if("IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(x){if(x.isIntersecting){x.target.classList.add("is-visible");io.unobserve(x.target);}});},{threshold:0.08});
    document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
  } else {document.querySelectorAll(".reveal").forEach(function(el){el.classList.add("is-visible");});}
})();
