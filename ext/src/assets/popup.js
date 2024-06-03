import{n as ae,N as te,r as i,y as re,t as oe,Z as le,_ as d,$ as V,L as ce,w as de,a0 as ge,a1 as Z,H as P,h as R,C as me,a2 as ue,a3 as he,a4 as fe,x as xe,g as q,b as J,a as K,j as s,T as ve,S as W,c as M,a5 as G,s as pe,d as Se,e as we,a6 as be,a7 as Be,V as ke,f as Le,R as ye}from"../../assets/utils.js";import{T as O}from"../../assets/Toggle.js";import{u as Ne}from"../../assets/useBoolean.js";import{I as Q,i as Ce}from"../../assets/index.js";import{P as _e,D as X}from"../../assets/PrimaryButton.js";var Ie=function(e){ae(o,e);function o(l){var r=e.call(this,l)||this;return r.state={isRendered:te()===void 0},r}return o.prototype.componentDidMount=function(){var l=this,r=this.props.delay;this._timeoutId=window.setTimeout(function(){l.setState({isRendered:!0})},r)},o.prototype.componentWillUnmount=function(){this._timeoutId&&clearTimeout(this._timeoutId)},o.prototype.render=function(){return this.state.isRendered?i.Children.only(this.props.children):null},o.defaultProps={delay:0},o}(i.Component),n;(function(e){e[e.info=0]="info",e[e.error=1]="error",e[e.blocked=2]="blocked",e[e.severeWarning=3]="severeWarning",e[e.success=4]="success",e[e.warning=5]="warning"})(n||(n={}));var L,Te=(L={},L[n.info]="Info",L[n.warning]="Info",L[n.error]="ErrorBadge",L[n.blocked]="Blocked2",L[n.severeWarning]="Warning",L[n.success]="Completed",L),We="MessageBar",je=de(),Ae=function(e){switch(e){case n.blocked:case n.error:case n.severeWarning:return"assertive"}return"polite"},Me=function(e){switch(e){case n.blocked:case n.error:case n.severeWarning:return"alert"}return"status"},Y=i.forwardRef(function(e,o){var l=Ne(!1),r=l[0],f=l[1].toggle,x=re("MessageBar"),g=e.actions,I=e.className,B=e.children,k=e.overflowButtonAriaLabel,v=e.dismissIconProps,T=e.styles,p=e.theme,j=e.messageBarType,t=j===void 0?n.info:j,m=e.onDismiss,c=m===void 0?void 0:m,E=e.isMultiline,S=E===void 0?!0:E,u=e.truncated,w=e.dismissButtonAriaLabel,A=e.messageBarIconProps,b=e.role,a=e.delayedRender,D=a===void 0?!0:a,z=e.expandButtonProps,$=e.onExpandButtonToggled,H=$===void 0?void 0:$,ee=i.useCallback(function(){f(),H&&H(!r)},[r,H,f]),ne=oe(e,le,["className","role"]),h=je(T,{theme:p,messageBarType:t||n.info,onDismiss:c!==void 0,actions:g!==void 0,truncated:u,isMultiline:S,expandSingleLine:r,className:I}),se={iconName:r?"DoubleChevronUp":"DoubleChevronDown"},ie=g||c?{"aria-describedby":x,role:"region"}:{},F=g?i.createElement("div",{className:h.actions},g):null,U=c?i.createElement(Q,{disabled:!1,className:h.dismissal,onClick:c,iconProps:v||{iconName:"Clear"},title:w,ariaLabel:w}):null;return i.createElement("div",d({ref:o,className:h.root},ie),i.createElement("div",{className:h.content},i.createElement("div",{className:h.iconContainer,"aria-hidden":!0},A?i.createElement(V,d({},A,{className:ce(h.icon,A.className)})):i.createElement(V,{iconName:Te[t],className:h.icon})),i.createElement("div",{className:h.text,id:x,role:b||Me(t),"aria-live":Ae(t)},i.createElement("span",d({className:h.innerText},ne),D?i.createElement(Ie,null,i.createElement("span",null,B)):i.createElement("span",null,B))),!S&&!F&&u&&i.createElement("div",{className:h.expandSingleLine},i.createElement(Q,d({disabled:!1,className:h.expand,onClick:ee,iconProps:se,ariaLabel:k,"aria-expanded":r},z))),!S&&F,!S&&U&&i.createElement("div",{className:h.dismissSingleLine},U),S&&U),S&&F)});Y.displayName=We;var y,N,C,_,Ee={root:"ms-MessageBar",error:"ms-MessageBar--error",blocked:"ms-MessageBar--blocked",severeWarning:"ms-MessageBar--severeWarning",success:"ms-MessageBar--success",warning:"ms-MessageBar--warning",multiline:"ms-MessageBar-multiline",singleline:"ms-MessageBar-singleline",dismissalSingleLine:"ms-MessageBar-dismissalSingleLine",expandingSingleLine:"ms-MessageBar-expandingSingleLine",content:"ms-MessageBar-content",iconContainer:"ms-MessageBar-icon",text:"ms-MessageBar-text",innerText:"ms-MessageBar-innerText",dismissSingleLine:"ms-MessageBar-dismissSingleLine",expandSingleLine:"ms-MessageBar-expandSingleLine",dismissal:"ms-MessageBar-dismissal",expand:"ms-MessageBar-expand",actions:"ms-MessageBar-actions",actionsSingleline:"ms-MessageBar-actionsSingleLine"},ze=(y={},y[n.error]="errorBackground",y[n.blocked]="errorBackground",y[n.success]="successBackground",y[n.warning]="warningBackground",y[n.severeWarning]="severeWarningBackground",y[n.info]="infoBackground",y),Pe=(N={},N[n.error]="errorIcon",N[n.blocked]="errorIcon",N[n.success]="successIcon",N[n.warning]="warningIcon",N[n.severeWarning]="severeWarningIcon",N[n.info]="infoIcon",N),Re=(C={},C[n.error]="#ff0000",C[n.blocked]="#ff0000",C[n.success]="#bad80a",C[n.warning]="#fff100",C[n.severeWarning]="#ff0000",C[n.info]="WindowText",C),De=(_={},_[n.error]="#e81123",_[n.blocked]="#e81123",_[n.success]="#107c10",_[n.warning]="#966400",_[n.severeWarning]="#d83b01",_[n.info]="WindowText",_),He=function(e){var o,l,r,f,x,g,I,B,k,v,T,p=e.theme,j=e.className,t=e.onDismiss,m=e.truncated,c=e.isMultiline,E=e.expandSingleLine,S=e.messageBarType,u=S===void 0?n.info:S,w=p.semanticColors,A=p.fonts,b=he(0,fe),a=ge(Ee,p),D={fontSize:Z.xSmall,height:10,lineHeight:"10px",color:w.messageText,selectors:(o={},o[P]=d(d({},R()),{color:"WindowText"}),o)},z=[me(p,{inset:1,highContrastStyle:{outlineOffset:"-6px",outline:"1px solid Highlight"},borderColor:"transparent"}),{flexShrink:0,width:32,height:32,padding:"8px 12px",selectors:{"& .ms-Button-icon":D,":hover":{backgroundColor:"transparent"},":active":{backgroundColor:"transparent"}}}];return{root:[a.root,A.medium,u===n.error&&a.error,u===n.blocked&&a.blocked,u===n.severeWarning&&a.severeWarning,u===n.success&&a.success,u===n.warning&&a.warning,c?a.multiline:a.singleline,!c&&t&&a.dismissalSingleLine,!c&&m&&a.expandingSingleLine,{background:w[ze[u]],boxSizing:"border-box",color:w.messageText,minHeight:32,width:"100%",display:"flex",wordBreak:"break-word",selectors:(l={".ms-Link":{color:w.messageLink,selectors:{":hover":{color:w.messageLinkHovered}}}},l[P]=d(d({},R()),{background:"transparent",border:"1px solid ".concat(Re[u]),color:"WindowText"}),l[ue]={border:"1px solid ".concat(De[u])},l)},c&&{flexDirection:"column"},j],content:[a.content,(r={display:"flex",width:"100%",lineHeight:"normal"},r[b]={display:"grid",gridTemplateColumns:"auto 1fr auto",gridTemplateRows:"1fr auto",gridTemplateAreas:`
            "icon text close"
            "action action action"
          `},r)],iconContainer:[a.iconContainer,(f={fontSize:Z.medium,minWidth:16,minHeight:16,display:"flex",flexShrink:0,margin:"8px 0 8px 12px"},f[b]={gridArea:"icon"},f)],icon:{color:w[Pe[u]],selectors:(x={},x[P]=d(d({},R()),{color:"WindowText"}),x)},text:[a.text,d(d({minWidth:0,display:"flex",flexGrow:1,margin:8},A.small),(g={},g[b]={gridArea:"text"},g.selectors=(I={},I[P]=d({},R()),I),g)),!t&&{marginRight:12}],innerText:[a.innerText,{lineHeight:16,selectors:{"& span a:last-child":{paddingLeft:4}}},m&&{overflow:"visible",whiteSpace:"pre-wrap"},!c&&{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},!c&&!m&&{selectors:(B={},B[b]={overflow:"visible",whiteSpace:"pre-wrap"},B)},E&&{overflow:"visible",whiteSpace:"pre-wrap"}],dismissSingleLine:[a.dismissSingleLine,(k={},k[b]={gridArea:"close"},k)],expandSingleLine:a.expandSingleLine,dismissal:[a.dismissal,z],expand:[a.expand,z],actions:[c?a.actions:a.actionsSingleline,(v={display:"flex",flexGrow:0,flexShrink:0,flexBasis:"auto",flexDirection:"row-reverse",alignItems:"center",margin:"0 12px 0 8px",forcedColorAdjust:"auto",MsHighContrastAdjust:"auto"},v[b]={gridArea:"action",marginRight:8,marginBottom:8},v.selectors={"& button:nth-child(n+2)":(T={marginLeft:8},T[b]={marginBottom:0},T)},v),c&&{marginBottom:8},t&&!c&&{marginRight:0}]}},Fe=xe(Y,He,void 0,{scope:"MessageBar"});const Ue=()=>{const e=window.navigator.language==="en",[o,l]=i.useState(!1),[r,f]=i.useState(!1),[x,g]=i.useState(!1),[I,B]=i.useState(""),[k,v]=i.useState({}),[T,p]=i.useState(!1),j=async()=>{await be("FN",k),x&&await Be(ke.Block,k.url),p(!0)};return i.useEffect(()=>{q().then(t=>l(t)),J().then(t=>f(t)),K().then(t=>g(t)),chrome.runtime.sendMessage({type:"detection"}).then(t=>{B(t.resFlag),v(t)})},[]),s.jsx(s.Fragment,{children:s.jsx(ve,{style:{minHeight:"100vh",display:"grid",justifyItems:"center"},children:s.jsxs(W,{horizontalAlign:"center",tokens:{childrenGap:50},style:{paddingTop:"20px"},children:[s.jsxs(W,{horizontal:!0,horizontalAlign:"center",verticalAlign:"center",tokens:{childrenGap:20},children:[s.jsx("img",{src:"/icon/icon48.svg",alt:"BrandIcon",width:36,height:36}),s.jsx(M,{style:{fontSize:"2em"},children:"PhishDetector"})]}),s.jsx(W,{horizontal:!0,horizontalAlign:"center",children:s.jsx(M,{style:{fontSize:"1.5em"},children:`${e?"Phishing Status":"判定結果"} : ${I}`})}),s.jsx(_e,{onClick:j,children:e?"Report this page as phishing":"このページをフィッシングとして報告"}),s.jsxs(W,{horizontalAlign:"center",tokens:{childrenGap:12},children:[s.jsx(M,{style:{fontSize:"1.5em",fontWeight:"bold"},children:" 設定 "}),s.jsx(O,{checked:o,label:s.jsxs(W,{horizontal:!0,verticalAlign:"center",children:[s.jsx(G,{iconName:"Send",style:{paddingLeft:26,fontSize:20,fontWeight:"bolder"}}),s.jsx(M,{style:{fontSize:"1em",fontWeight:"bolder",paddingLeft:26},children:"検出時の情報を開発者に送信する"})]}),inlineLabel:!0,onText:" ",offText:" ",onChange:async(t,m)=>{await pe(m??!1),l(await q())}}),s.jsx(O,{checked:x,label:s.jsxs(W,{horizontal:!0,verticalAlign:"center",children:[s.jsx(G,{iconName:"RemoveFromShoppingList",style:{paddingLeft:26,fontSize:20,fontWeight:"bolder"}}),s.jsx(M,{style:{fontSize:"1em",fontWeight:"bolder",paddingLeft:26},children:"Block listを使用する"})]}),inlineLabel:!0,onText:" ",offText:" ",onChange:async(t,m)=>{await Se(m??!1),g(await K())}}),s.jsx(O,{checked:r,label:s.jsxs(W,{horizontal:!0,verticalAlign:"center",children:[s.jsx(G,{iconName:"WaitlistConfirm",style:{paddingLeft:26,fontSize:20,fontWeight:"bolder"}}),s.jsx(M,{style:{fontSize:"1em",fontWeight:"bolder",paddingLeft:26},children:"Allow listを使用する"})]}),inlineLabel:!0,onText:" ",offText:" ",onChange:async(t,m)=>{await we(m??!1),f(await J())}}),s.jsx(X,{iconProps:{iconName:"OpenInNewTab"},onClick:async()=>await chrome.runtime.sendMessage({type:"list",listType:"Block"}),children:" Block list "}),s.jsx(X,{iconProps:{iconName:"OpenInNewTab"},onClick:async()=>await chrome.runtime.sendMessage({type:"list",listType:"Allow"}),children:" Allow list "})]}),T&&s.jsx(Fe,{messageBarType:n.success,isMultiline:!1,onDismiss:()=>p(!1),children:" Thank you for reporting "})]})})})};Ce();Le.createRoot(document.getElementById("root")).render(s.jsx(ye.StrictMode,{children:s.jsx(Ue,{})}));
