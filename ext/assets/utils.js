const r=async(s,t)=>{if(t.detectBy==="List")return;const e=new FormData;e.append("type",s),Object.keys(t).forEach(o=>e.append(o,t[o])),await fetch("https://www.az.lab.uec.ac.jp/~ywatanabe/PhishingDetector/api/v3/info.php",{mode:"cors",method:"POST",body:e})},i=async()=>{const s=await chrome.storage.local.get(["sendInfo"]).then(t=>t.sendInfo);return s===void 0?!1:s},w=async s=>{await chrome.storage.local.set({sendInfo:s})},u=async s=>{await chrome.storage.local.set({useAllowList:s})},h=async()=>{const s=await chrome.storage.local.get(["useAllowList"]).then(t=>t.useAllowList);return s===void 0?!1:s},f=async s=>{await chrome.storage.local.set({useBlockList:s})},g=async()=>{const s=await chrome.storage.local.get(["useBlockList"]).then(t=>t.useBlockList);return s===void 0?!1:s};var l=(s=>(s.Allow="Allow",s.Block="Block",s.Tmp="Tmp",s))(l||{});const n=async s=>{const t=await chrome.storage.local.get([`${s}list`]).then(e=>e[`${s}list`]);return t===void 0?[]:t},L=async(s,t)=>{const e=await n(s),o=[...new Set([...e,t])];await chrome.storage.local.set({[`${s}list`]:o})},d=async(s,t)=>{await chrome.storage.local.set({[`${s}list`]:t})},m=async(s,t,e=!1)=>{const a=(await n(s)).filter(c=>e?!c.includes(t):c!==t);a.length===1&&a[0]===null?await chrome.storage.local.set({[`${s}list`]:[]}):await chrome.storage.local.set({[`${s}list`]:a})};export{l as L,g as a,h as b,w as c,m as d,f as e,u as f,i as g,n as h,r,L as s,d as u};
