import{r as i,n as e,T as c,S as n,o as t,p as d,R as h}from"../../assets/ThemeProvider-Bl4GeOl4.js";import{J as r,U as f,O as m}from"../../assets/utils-D-rbZ92i.js";import{T as x}from"../../assets/Toggle-BUIFOYYg.js";const g=()=>{const[l,o]=i.useState(!1);return i.useEffect(()=>{r().then(s=>o(s))},[]),e.jsx(e.Fragment,{children:e.jsx(c,{style:{minHeight:"100vh",display:"grid",justifyItems:"center",backgroundColor:"#e9e9e9"},children:e.jsxs(n,{horizontalAlign:"center",tokens:{childrenGap:20},style:{paddingTop:"50px"},children:[e.jsxs(n,{horizontal:!0,horizontalAlign:"center",verticalAlign:"center",tokens:{childrenGap:20},children:[e.jsx("img",{src:"/icon/icon48.svg",alt:"BrandIcon",width:48,height:48}),e.jsx(t,{style:{fontSize:"2.5em"},children:"PhishDetector for Chrome Extension"})]}),e.jsx(t,{style:{fontSize:"2em",fontWeight:"bold",paddingTop:25},children:" 使用方法 "}),e.jsxs(n,{horizontalAlign:"center",children:[e.jsx(t,{style:{fontSize:"1.5em"},children:"パスワード入力フォームがあるページにアクセスすると、自動で検出処理を実行します。"}),e.jsx(t,{style:{fontSize:"1.5em"},children:"フィッシングサイトを検出すると、警告画面が表示されます。"})]}),e.jsx(t,{style:{fontSize:"2em",fontWeight:"bold",paddingTop:25},children:" 設定 "}),e.jsx(x,{checked:l,label:e.jsx(t,{style:{fontSize:"1.5em",fontWeight:"bolder"},children:"検出精度向上のため、検出時の情報を開発者に送信する"}),inlineLabel:!0,onText:" ",offText:" ",onChange:async(s,a)=>{await f(a??!1),o(await r())}}),e.jsx(m,{onClick:()=>chrome.runtime.sendMessage({type:"close"}),children:"設定を保存してページを閉じる"})]})})})};d.createRoot(document.getElementById("root")).render(e.jsx(h.StrictMode,{children:e.jsx(g,{})}));
