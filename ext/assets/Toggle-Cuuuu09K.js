import{r as t,u as M,x as X,_ as h,k as G,l as Y,E as V,a0 as j,H as k,al as $,J,h as ee,am as ae,an as re,ao as oe}from"./utils-BkBAF_PO.js";function le(e,r,a){var c=t.useState(r),u=c[0],g=c[1],n=M(e!==void 0),i=n?e:u,b=t.useRef(i),d=t.useRef(a);t.useEffect(function(){b.current=i,d.current=a});var l=M(function(){return function(o,f){var m=typeof o=="function"?o(b.current):o;d.current&&d.current(f,m),n||g(m)}});return[i,l]}var te=V({cacheSize:100}),ne=function(e){X(r,e);function r(){return e!==null&&e.apply(this,arguments)||this}return r.prototype.render=function(){var a=this.props,c=a.as,u=c===void 0?"label":c,g=a.children,n=a.className,i=a.disabled,b=a.styles,d=a.required,l=a.theme,o=te(b,{className:n,disabled:i,required:d,theme:l});return t.createElement(u,h({},G(this.props,Y),{className:o.root}),g)},r}(t.Component),ie=function(e){var r,a=e.theme,c=e.className,u=e.disabled,g=e.required,n=a.semanticColors,i=j.semibold,b=n.bodyText,d=n.disabledBodyText,l=n.errorText;return{root:["ms-Label",a.fonts.medium,{fontWeight:i,color:b,boxSizing:"border-box",boxShadow:"none",margin:0,display:"block",padding:"5px 0",wordWrap:"break-word",overflowWrap:"break-word"},u&&{color:d,selectors:(r={},r[k]=h({color:"GrayText"},$()),r)},g&&{selectors:{"::after":{content:"' *'",color:l,paddingRight:12}}},c]}},U=J(ne,ie,void 0,{scope:"Label"}),de=V(),Z="Toggle",K=t.forwardRef(function(e,r){var a=e.as,c=a===void 0?"div":a,u=e.ariaLabel,g=e.checked,n=e.className,i=e.defaultChecked,b=i===void 0?!1:i,d=e.disabled,l=e.inlineLabel,o=e.label,f=e.offAriaLabel,m=e.offText,s=e.onAriaLabel,T=e.onChange,y=e.onChanged,_=e.onClick,N=e.onText,S=e.role,R=e.styles,p=e.theme,E=le(g,b,t.useCallback(function(I,q){T==null||T(I,q),y==null||y(q)},[T,y])),v=E[0],D=E[1],C=de(R,{theme:p,className:n,disabled:d,checked:v,inlineLabel:l,onOffMissing:!N&&!m}),H=v?s:f,x=ee(Z,e.id),L="".concat(x,"-label"),W="".concat(x,"-stateText"),P=v?N:m,O=G(e,ae,["defaultChecked"]),w=void 0;!u&&!H&&(o&&(w=L),P&&!w&&(w=W));var F=t.useRef(null);re(F),se(e,v,F);var Q=function(I){d||(D(!v,I),_&&_(I))},B={root:{className:C.root,hidden:O.hidden},label:{children:o,className:C.label,htmlFor:x,id:L},container:{className:C.container},pill:h(h({},O),{"aria-disabled":d,"aria-checked":v,"aria-label":u||H,"aria-labelledby":w,className:C.pill,"data-is-focusable":!0,"data-ktp-target":!0,disabled:d,id:x,onClick:Q,ref:F,role:S||"switch",type:"button"}),thumb:{className:C.thumb},stateText:{children:P,className:C.text,htmlFor:x,id:W}};return t.createElement(c,h({ref:r},B.root),o&&t.createElement(U,h({},B.label)),t.createElement("div",h({},B.container),t.createElement("button",h({},B.pill),t.createElement("span",h({},B.thumb))),(v&&N||m)&&t.createElement(U,h({},B.stateText))))});K.displayName=Z+"Base";var se=function(e,r,a){t.useImperativeHandle(e.componentRef,function(){return{get checked(){return!!r},focus:function(){a.current&&a.current.focus()}}},[r,a])},ce=40,z=20,A=12,ue=function(e){var r,a,c,u,g,n,i,b=e.theme,d=e.className,l=e.disabled,o=e.checked,f=e.inlineLabel,m=e.onOffMissing,s=b.semanticColors,T=b.palette,y=s.bodyBackground,_=s.inputBackgroundChecked,N=s.inputBackgroundCheckedHovered,S=T.neutralDark,R=s.disabledBodySubtext,p=s.smallInputBorder,E=s.inputForegroundChecked,v=s.disabledBodySubtext,D=s.disabledBackground,C=s.smallInputBorder,H=s.inputBorderHovered,x=s.disabledBodySubtext,L=s.disabledText;return{root:["ms-Toggle",o&&"is-checked",!l&&"is-enabled",l&&"is-disabled",b.fonts.medium,{marginBottom:"8px"},f&&{display:"flex",alignItems:"center"},d],label:["ms-Toggle-label",{display:"inline-block"},l&&{color:L,selectors:(r={},r[k]={color:"GrayText"},r)},f&&!m&&{marginRight:16},m&&f&&{order:1,marginLeft:16},f&&{wordBreak:"break-word"}],container:["ms-Toggle-innerContainer",{display:"flex",position:"relative"}],pill:["ms-Toggle-background",oe(b,{inset:-3}),{fontSize:"20px",boxSizing:"border-box",width:ce,height:z,borderRadius:z/2,transition:"all 0.1s ease",border:"1px solid ".concat(C),background:y,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 3px",overflow:"visible"},!l&&[!o&&{selectors:{":hover":[{borderColor:H}],":hover .ms-Toggle-thumb":[{backgroundColor:S,selectors:(a={},a[k]={borderColor:"Highlight"},a)}]}},o&&[{background:_,borderColor:"transparent",justifyContent:"flex-end"},{selectors:(c={":hover":[{backgroundColor:N,borderColor:"transparent",selectors:(u={},u[k]={backgroundColor:"Highlight"},u)}]},c[k]=h({backgroundColor:"Highlight"},$()),c)}]],l&&[{cursor:"default"},!o&&[{borderColor:x}],o&&[{backgroundColor:R,borderColor:"transparent",justifyContent:"flex-end"}]],!l&&{selectors:{"&:hover":{selectors:(g={},g[k]={borderColor:"Highlight"},g)}}}],thumb:["ms-Toggle-thumb",{display:"block",width:A,height:A,borderRadius:"50%",transition:"all 0.1s ease",backgroundColor:p,borderColor:"transparent",borderWidth:A/2,borderStyle:"solid",boxSizing:"border-box"},!l&&o&&[{backgroundColor:E,selectors:(n={},n[k]={backgroundColor:"Window",borderColor:"Window"},n)}],l&&[!o&&[{backgroundColor:v}],o&&[{backgroundColor:D}]]],text:["ms-Toggle-stateText",{selectors:{"&&":{padding:"0",margin:"0 8px",userSelect:"none",fontWeight:j.regular}}},l&&{selectors:{"&&":{color:L,selectors:(i={},i[k]={color:"GrayText"},i)}}}]}},ge=J(K,ue,void 0,{scope:"Toggle"});export{ge as T};
