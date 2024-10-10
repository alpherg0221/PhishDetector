import{a as I,b as v,h as u,L as m}from"../assets/utils.js";chrome.runtime.onMessage.addListener((t,i,e)=>{switch(t.type){case"detection":return d().then(s=>e(s)),!0}});const d=async t=>{const i=await I(),e=await v(),s=await u(m.Allow),a=await u(m.Block),n=await u(m.Tmp).then(r=>r.map(l=>l.split("@")[0]));if(e&&s.includes(location.hostname))return{resFlag:"Safe",url:location.hostname,time:"0",detectBy:"List"};if(i&&a.includes(location.hostname))return{resFlag:"Phish",url:location.hostname,time:"0",detectBy:"List"};if(n.includes(location.hostname))return{resFlag:"_Phish",url:location.hostname,time:"0",detectBy:"List"};const o=3,b=performance.now()/1e3;let c="Safe";await T()||(c="NoPasswordForm",console.log("PhishDetector:NoPasswordForm"));const h=await q(),f=await F(),g=await C(),y=await P(),k=await H(),p=await W(),w=await D(),L=await N(),A=await O(),_=await R(),x=await B();if(c!=="NoPasswordForm"){console.log("PhishDetector : Start Detection");const r={copied:h,googleAnalytics:f,scriptTagCount:g,externalLinkPercentage:y,noTitle:k,samePageLink:p,iframeTagCount:w,tagCountInHeadTag:L,noDomainInInternalLink:A,invalidKiyaku:_,ipAddressInLink:x};console.log(r);const l=await chrome.runtime.sendMessage({type:"predict",...r});console.log(`PhishDetector : Result : ${l}`),console.log("PhishDetector : Finish Detection"),l>=.5?c="Phish":c="Safe"}return{resFlag:c,url:location.hostname,time:(performance.now()/1e3-b).toFixed(o),detectBy:"RealTime",copied:h,ga:f,script:g,extLink:y,noTitle:k,samePageLink:p,iframe:w,tagCountInHead:L,noDomainInInternalLink:A,invalidKiyaku:_,ipAddressInLink:x}},T=async()=>{let t=document.querySelectorAll('input[type="password"]').length,i=document.querySelectorAll('input[type="text"]').length;const e=document.querySelectorAll("iframe");for(const s of e)try{t+=s.contentWindow.document.querySelectorAll('input[type="password"]').length,i+=s.contentWindow.document.querySelectorAll('input[type="text"]').length}catch{}return t>=1||i>=5},S=async t=>{t.detectBy==="List"?location.assign(`${chrome.runtime.getURL("src/warning/index.html")}?url=${t.url}&resFlag=${t.resFlag}&time=${t.time}`):t.detectBy==="RealTime"&&location.assign(`${chrome.runtime.getURL("src/warning/index.html")}?url=${t.url}&resFlag=${t.resFlag}&time=${t.time}&ga=${t.ga}&copied=${t.copied}&script=${t.script}&extLink=${t.extLink}&noTitle=${t.noTitle}&samePageLink=${t.samePageLink}&iframe=${t.iframe}&tagCountInHead=${t.tagCountInHead}&noDomainInInternalLink=${t.noDomainInInternalLink}&invalidKiyaku=${t.invalidKiyaku}&ipAddressInLink=${t.ipAddressInLink}`)},q=async()=>document.documentElement.hasAttribute("data-scrapbook-source")||document.documentElement.outerHTML.includes("saved from url")?1:0,F=async()=>{const t="https://www.google-analytics.com/analytics.js",i="https://www.googletagmanager.com/gtag/js",e=document.documentElement.outerHTML;return e.includes(t)||e.includes(i)?1:0},C=async()=>{let t=document.querySelectorAll("script").length;const i=document.querySelectorAll("iframe");for(const e of i)try{t+=e.contentWindow.document.querySelectorAll("script").length}catch{}return t},P=async()=>{const t=Array.from(document.querySelectorAll("a[href]")),i=document.querySelectorAll("iframe");for(const a of i)try{t.push(...a.contentWindow.document.querySelectorAll("a[href]"))}catch{}let e=0,s=0;for(const a of t){let n=a.getAttribute("href");if(!(n===""||n.startsWith("#")))if(n.startsWith("http")||n.startsWith("//")){n.startsWith("//")&&(n=`${location.protocol}${n}`);let o=new URL(n).hostname;for(;document.cookie=`pd_test_key=pd_test_value; domain=${o};`,o.indexOf(".")!==-1;)o=o.substring(o.indexOf(".")+1);for(document.cookie.includes("pd_test_key=pd_test_value")?s++:e++,o=new URL(n).hostname;document.cookie=`pd_test_key=pd_test_value; domain=${o}; max-age=0;`,o.indexOf(".")!==-1;)o=o.substring(o.indexOf(".")+1)}else s++}return e+s>0?e*100/(e+s):0},H=async()=>{let t=document.querySelector("title");return t===null||t.text===""?1:0},W=async()=>{const t=["","#","#nothing","#null","#void","#doesnotexist","#whatever"],i=[...document.querySelectorAll("a[href]")].map(a=>a.getAttribute("href")),e={};for(const a in i)t.includes(a.toLowerCase())||a.toLowerCase().startsWith("javascript")||(e[a]=(e[a]||0)+1);let s=0;for(const a of i)s<e[a]&&(s=e[a]);return s},D=async()=>document.querySelectorAll("iframe").length,N=async()=>document.querySelector("head").childElementCount,O=async()=>{const t=[...document.querySelectorAll("*[href]")].map(n=>n.getAttribute("href")),i=[...document.querySelectorAll("*[src]")].map(n=>n.getAttribute("src")),e=[...t,...i];let s=0,a=0;for(let n of e)if(n.startsWith("http")||n.startsWith("//")){n.startsWith("//")&&(n=`${location.protocol}${n}`);let o=new URL(n).hostname;for(;document.cookie=`pd_test_key=pd_test_value; domain=${o};`,o.indexOf(".")!==-1;)o=o.substring(o.indexOf(".")+1);for(document.cookie.includes("pd_test_key=pd_test_value")&&s++,o=new URL(n).hostname;document.cookie=`pd_test_key=pd_test_value; domain=${o}; max-age=0;`,o.indexOf(".")!==-1;)o=o.substring(o.indexOf(".")+1)}else s++,a++;return s>0?a/s:0},R=async()=>{const t=[...document.querySelectorAll("a")].filter(e=>e.text.includes("規約")||e.text.includes("プライバシーポリシー")),i=t.filter(e=>e.hasAttribute("href")).filter(e=>!e.getAttribute("href").startsWith("#"));return t.length===i.length?1:0},B=async()=>{const t=/^.*((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]).*$/g,i=[...document.querySelectorAll("*[href]")].map(n=>n.getAttribute("href")),e=[...document.querySelectorAll("*[src]")].map(n=>n.getAttribute("src"));return[...i,...e].map(n=>t.test(n)).length>0?1:0},E=()=>{const t=document.documentElement,i={childList:!0,subtree:!0};new MutationObserver(s=>{s.forEach(a=>{a.addedNodes.forEach(n=>{n.nodeName.toLowerCase()==="input"&&d().then(async o=>{o.resFlag==="Phish"&&await S(o)})})})}).observe(t,i)};E();let $=0;const U=setInterval(async()=>{d().then(async t=>{t.resFlag==="Phish"&&await S(t)}).catch(t=>console.info(t)),$++,$===10&&clearInterval(U)},1e3);
