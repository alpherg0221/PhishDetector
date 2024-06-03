import{n as K,D as ee,E as te,G as ie,_,J as re,t as se,K as q,L as oe,M as ne,N as ae,r as R,W as he,O as le,P as de,Q as ue,v as ce,U as ge,V as L,X as M,j as m,T as pe,S as z,c as k,Y as fe,f as _e,R as ve}from"../../assets/utils.js";import{I as me,i as Pe}from"../../assets/index.js";var H={auto:0,top:1,bottom:2,center:3},ye=function(s){if(s===void 0)return 0;var r=0;return"scrollHeight"in s?r=s.scrollHeight:"document"in s&&(r=s.document.documentElement.scrollHeight),r},N=function(s){if(s===void 0)return 0;var r=0;return"scrollTop"in s?r=s.scrollTop:"scrollY"in s&&(r=s.scrollY),Math.ceil(r)},T=function(s,r){"scrollTop"in s?s.scrollTop=r:"scrollY"in s&&s.scrollTo(s.scrollX,r)},Re=16,Ee=100,Se=500,be=200,Ae=500,j=10,Ce=30,De=2,we=2,He="page-",U="spacer-",Te=1/3,B={top:-1,bottom:-1,left:-1,right:-1,width:0,height:0},O=function(s){return s.getBoundingClientRect()},We=O,Le=O,ze=function(s){K(r,s);function r(t){var e=s.call(this,t)||this;return e._root=R.createRef(),e._surface=R.createRef(),e._pageRefs={},e._getDerivedStateFromProps=function(i,n){return i.items!==e.props.items||i.renderCount!==e.props.renderCount||i.startIndex!==e.props.startIndex||i.version!==e.props.version||!n.hasMounted&&e.props.renderEarly&&le()?(e._resetRequiredWindows(),e._requiredRect=null,e._measureVersion++,e._invalidatePageCache(),e._updatePages(i,n)):n},e._onRenderRoot=function(i){var n=i.rootRef,o=i.surfaceElement,h=i.divProps;return R.createElement("div",_({ref:n},h),o)},e._onRenderSurface=function(i){var n=i.surfaceRef,o=i.pageElements,h=i.divProps;return R.createElement("div",_({ref:n},h),o)},e._onRenderPage=function(i,n){for(var o,h=e.props,l=h.onRenderCell,a=h.onRenderCellConditional,d=h.role,u=i.page,c=u.items,p=c===void 0?[]:c,b=u.startIndex,y=de(i,["page"]),E=d===void 0?"listitem":"presentation",v=[],A=0;A<p.length;A++){var g=b+A,P=p[A],C=e.props.getKey?e.props.getKey(P,g):P&&P.key;C==null&&(C=g);var f=a??l,S=(o=f==null?void 0:f(P,g,e.props.ignoreScrollingState?void 0:e.state.isScrolling))!==null&&o!==void 0?o:null;(!a||S)&&v.push(R.createElement("div",{role:E,className:"ms-List-cell",key:C,"data-list-index":g,"data-automationid":"ListCell"},S))}return R.createElement("div",_({},y),v)},ue(e),e.state={pages:[],isScrolling:!1,getDerivedStateFromProps:e._getDerivedStateFromProps,hasMounted:!1},e._estimatedPageHeight=0,e._totalEstimates=0,e._requiredWindowsAhead=0,e._requiredWindowsBehind=0,e._measureVersion=0,e._cachedPageHeights={},e._estimatedPageHeight=0,e._focusedIndex=-1,e._pageCache={},e}return r.getDerivedStateFromProps=function(t,e){return e.getDerivedStateFromProps(t,e)},Object.defineProperty(r.prototype,"pageRefs",{get:function(){return this._pageRefs},enumerable:!1,configurable:!0}),r.prototype.scrollToIndex=function(t,e,i){i===void 0&&(i=H.auto);for(var n=this.props.startIndex,o=this._getRenderCount(),h=n+o,l=this._allowedRect,a=0,d=1,u=n;u<h;u+=d){var c=this._getPageSpecification(this.props,u,l),p=c.height;d=c.itemCount;var b=u<=t&&u+d>t;if(b){if(e&&this._scrollElement){for(var y=Le(this._scrollElement),E=N(this._scrollElement),v={top:E,bottom:E+y.height},A=t-u,g=0;g<A;++g)a+=e(u+g);var P=a+e(t);switch(i){case H.top:T(this._scrollElement,a);return;case H.bottom:T(this._scrollElement,P-y.height);return;case H.center:T(this._scrollElement,(a+P-y.height)/2);return}var C=a>=v.top&&P<=v.bottom;if(C)return;var f=a<v.top,S=P>v.bottom;f||S&&(a=P-y.height)}this._scrollElement&&T(this._scrollElement,a);return}a+=p}},r.prototype.getStartItemIndexInView=function(t){for(var e=this.state.pages||[],i=0,n=e;i<n.length;i++){var o=n[i],h=!o.isSpacer&&(this._scrollTop||0)>=o.top&&(this._scrollTop||0)<=o.top+o.height;if(h)if(t)for(var a=0,d=o.startIndex;d<o.startIndex+o.itemCount;d++){var l=t(d);if(o.top+a<=this._scrollTop&&this._scrollTop<o.top+a+l)return d;a+=l}else{var l=Math.floor(o.height/o.itemCount);return o.startIndex+Math.floor((this._scrollTop-o.top)/l)}}return 0},r.prototype.componentDidMount=function(){this._async=new ee(this),this._events=new te(this),this._onAsyncScrollDebounced=this._async.debounce(this._onAsyncScroll,Ee,{leading:!1,maxWait:Se}),this._onAsyncIdleDebounced=this._async.debounce(this._onAsyncIdle,be,{leading:!1}),this._onAsyncResizeDebounced=this._async.debounce(this._onAsyncResize,Re,{leading:!1}),this._onScrollingDoneDebounced=this._async.debounce(this._onScrollingDone,Ae,{leading:!1}),this._scrollElement=ie(this._root.current),this._scrollTop=0,this.setState(_(_({},this._updatePages(this.props,this.state)),{hasMounted:!0})),this._measureVersion++;var t=re(this.context);this._events.on(t,"resize",this._onAsyncResizeDebounced),this._root.current&&this._events.on(this._root.current,"focus",this._onFocus,!0),this._scrollElement&&(this._events.on(this._scrollElement,"scroll",this._onScroll),this._events.on(this._scrollElement,"scroll",this._onAsyncScrollDebounced))},r.prototype.componentDidUpdate=function(t,e){var i=this.props,n=this.state;if(this.state.pagesVersion!==e.pagesVersion){if(i.getPageHeight)this._onAsyncIdleDebounced();else{var o=this._updatePageMeasurements(n.pages);o?(this._materializedRect=null,this._hasCompletedFirstRender?this._onAsyncScrollDebounced():(this._hasCompletedFirstRender=!0,this.setState(this._updatePages(i,n)))):this._onAsyncIdleDebounced()}i.onPagesUpdated&&i.onPagesUpdated(n.pages)}},r.prototype.componentWillUnmount=function(){var t,e;(t=this._async)===null||t===void 0||t.dispose(),(e=this._events)===null||e===void 0||e.dispose(),delete this._scrollElement},r.prototype.shouldComponentUpdate=function(t,e){var i=this.state.pages,n=e.pages,o=!1;if(!e.isScrolling&&this.state.isScrolling||t.version!==this.props.version||t.className!==this.props.className)return!0;if(t.items===this.props.items&&i.length===n.length)for(var h=0;h<i.length;h++){var l=i[h],a=n[h];if(l.key!==a.key||l.itemCount!==a.itemCount){o=!0;break}}else o=!0;return o},r.prototype.forceUpdate=function(){this._invalidatePageCache(),this._updateRenderRects(this.props,this.state,!0),this.setState(this._updatePages(this.props,this.state)),this._measureVersion++,s.prototype.forceUpdate.call(this)},r.prototype.getTotalListHeight=function(){return this._surfaceRect.height},r.prototype.render=function(){for(var t=this.props,e=t.className,i=t.role,n=i===void 0?"list":i,o=t.onRenderSurface,h=t.onRenderRoot,l=this.state.pages,a=l===void 0?[]:l,d=[],u=se(this.props,ce),c=0,p=a;c<p.length;c++){var b=p[c];d.push(this._renderPage(b))}var y=o?q(o,this._onRenderSurface):this._onRenderSurface,E=h?q(h,this._onRenderRoot):this._onRenderRoot;return E({rootRef:this._root,pages:a,surfaceElement:y({surfaceRef:this._surface,pages:a,pageElements:d,divProps:{role:"presentation",className:"ms-List-surface"}}),divProps:_(_({},u),{className:oe("ms-List",e),role:d.length>0?n:void 0,"aria-label":d.length>0?u["aria-label"]:void 0})})},r.prototype._shouldVirtualize=function(t){t===void 0&&(t=this.props);var e=t.onShouldVirtualize;return!e||e(t)},r.prototype._invalidatePageCache=function(){this._pageCache={}},r.prototype._renderPage=function(t){var e=this,i=this.props.usePageCache,n;if(i&&(n=this._pageCache[t.key],n&&n.pageElement))return n.pageElement;var o=this._getPageStyle(t),h=this.props.onRenderPage,l=h===void 0?this._onRenderPage:h,a=l({page:t,className:"ms-List-page",key:t.key,ref:function(d){e._pageRefs[t.key]=d},style:o,role:"presentation"},this._onRenderPage);return i&&t.startIndex===0&&(this._pageCache[t.key]={page:t,pageElement:a}),a},r.prototype._getPageStyle=function(t){var e=this.props.getPageStyle;return _(_({},e?e(t):{}),t.items?{}:{height:t.height})},r.prototype._onFocus=function(t){for(var e=t.target;e!==this._surface.current;){var i=e.getAttribute("data-list-index");if(i){this._focusedIndex=Number(i);break}e=ne(e)}},r.prototype._onScroll=function(){!this.state.isScrolling&&!this.props.ignoreScrollingState&&this.setState({isScrolling:!0}),this._resetRequiredWindows(),this._onScrollingDoneDebounced()},r.prototype._resetRequiredWindows=function(){this._requiredWindowsAhead=0,this._requiredWindowsBehind=0},r.prototype._onAsyncScroll=function(){this._updateRenderRects(this.props,this.state),(!this._materializedRect||!ke(this._requiredRect,this._materializedRect))&&this.setState(this._updatePages(this.props,this.state))},r.prototype._onAsyncIdle=function(){var t=this.props,e=t.renderedWindowsAhead,i=t.renderedWindowsBehind,n=this,o=n._requiredWindowsAhead,h=n._requiredWindowsBehind,l=Math.min(e,o+1),a=Math.min(i,h+1);(l!==o||a!==h)&&(this._requiredWindowsAhead=l,this._requiredWindowsBehind=a,this._updateRenderRects(this.props,this.state),this.setState(this._updatePages(this.props,this.state))),(e>l||i>a)&&this._onAsyncIdleDebounced()},r.prototype._onScrollingDone=function(){this.props.ignoreScrollingState||(this.setState({isScrolling:!1}),this._onAsyncIdle())},r.prototype._onAsyncResize=function(){this.forceUpdate()},r.prototype._updatePages=function(t,e){this._requiredRect||this._updateRenderRects(t,e);var i=this._buildPages(t,e),n=e.pages;return this._notifyPageChanges(n,i.pages,this.props),_(_(_({},e),i),{pagesVersion:{}})},r.prototype._notifyPageChanges=function(t,e,i){var n=i.onPageAdded,o=i.onPageRemoved;if(n||o){for(var h={},l=0,a=t;l<a.length;l++){var d=a[l];d.items&&(h[d.startIndex]=d)}for(var u=0,c=e;u<c.length;u++){var d=c[u];d.items&&(h[d.startIndex]?delete h[d.startIndex]:this._onPageAdded(d))}for(var p in h)h.hasOwnProperty(p)&&this._onPageRemoved(h[p])}},r.prototype._updatePageMeasurements=function(t){var e=!1;if(!this._shouldVirtualize())return e;for(var i=0;i<t.length;i++){var n=t[i];n.items&&(e=this._measurePage(n)||e)}return e},r.prototype._measurePage=function(t){var e=!1,i=this._pageRefs[t.key],n=this._cachedPageHeights[t.startIndex];if(i&&this._shouldVirtualize()&&(!n||n.measureVersion!==this._measureVersion)){var o={width:i.clientWidth,height:i.clientHeight};(o.height||o.width)&&(e=t.height!==o.height,t.height=o.height,this._cachedPageHeights[t.startIndex]={height:o.height,measureVersion:this._measureVersion},this._estimatedPageHeight=Math.round((this._estimatedPageHeight*this._totalEstimates+o.height)/(this._totalEstimates+1)),this._totalEstimates++)}return e},r.prototype._onPageAdded=function(t){var e=this.props.onPageAdded;e&&e(t)},r.prototype._onPageRemoved=function(t){var e=this.props.onPageRemoved;e&&e(t)},r.prototype._buildPages=function(t,e){var i=t.renderCount,n=t.items,o=t.startIndex,h=t.getPageHeight;i=this._getRenderCount(t);for(var l=_({},B),a=[],d=1,u=0,c=null,p=this._focusedIndex,b=o+i,y=this._shouldVirtualize(t),E=this._estimatedPageHeight===0&&!h,v=this._allowedRect,A=function(f){var S=g._getPageSpecification(t,f,v),W=S.height,F=S.data,Y=S.key;d=S.itemCount;var D=u+W-1,G=ge(e.pages,function(I){return!!I.items&&I.startIndex===f})>-1,X=!v||D>=v.top&&u<=v.bottom,V=!g._requiredRect||D>=g._requiredRect.top&&u<=g._requiredRect.bottom,J=!E&&(V||X&&G)||!y,Q=p>=f&&p<f+d,Z=f===o;if(J||Q||Z){c&&(a.push(c),c=null);var $=Math.min(d,b-f),w=g._createPage(Y,n.slice(f,f+$),f,void 0,void 0,F);w.top=u,w.height=W,g._visibleRect&&g._visibleRect.bottom&&(w.isVisible=D>=g._visibleRect.top&&u<=g._visibleRect.bottom),a.push(w),V&&g._allowedRect&&Fe(l,{top:u,bottom:D,height:W,left:v.left,right:v.right,width:v.width})}else c||(c=g._createPage(U+f,void 0,f,0,void 0,F,!0)),c.height=(c.height||0)+(D-u)+1,c.itemCount+=d;if(u+=D-u+1,E&&y)return"break"},g=this,P=o;P<b;P+=d){var C=A(P);if(C==="break")break}return c&&(c.key=U+"end",a.push(c)),this._materializedRect=l,_(_({},e),{pages:a,measureVersion:this._measureVersion})},r.prototype._getPageSpecification=function(t,e,i){var n=t.getPageSpecification;if(n){var o=n(e,i,t.items),h=o.itemCount,l=h===void 0?this._getItemCountForPage(e,i):h,a=o.height,d=a===void 0?this._getPageHeight(e,i,l):a;return{itemCount:l,height:d,data:o.data,key:o.key}}else{var l=this._getItemCountForPage(e,i);return{itemCount:l,height:this._getPageHeight(e,i,l)}}},r.prototype._getPageHeight=function(t,e,i){if(this.props.getPageHeight)return this.props.getPageHeight(t,e,i,this.props.items);var n=this._cachedPageHeights[t];return n?n.height:this._estimatedPageHeight||Ce},r.prototype._getItemCountForPage=function(t,e){var i=this.props.getItemCountForPage?this.props.getItemCountForPage(t,e):j;return i||j},r.prototype._createPage=function(t,e,i,n,o,h,l){i===void 0&&(i=-1),n===void 0&&(n=e?e.length:0),o===void 0&&(o={}),t=t||He+i;var a=this._pageCache[t];return a&&a.page?a.page:{key:t,startIndex:i,itemCount:n,items:e,style:o,top:0,height:0,data:h,isSpacer:l||!1}},r.prototype._getRenderCount=function(t){var e=t||this.props,i=e.items,n=e.startIndex,o=e.renderCount;return o===void 0?i?i.length-n:0:o},r.prototype._updateRenderRects=function(t,e,i){var n=t.renderedWindowsAhead,o=t.renderedWindowsBehind,h=e.pages;if(this._shouldVirtualize(t)){var l=this._surfaceRect||_({},B),a=ye(this._scrollElement),d=N(this._scrollElement);this._surface.current&&(i||!h||!this._surfaceRect||!a||a!==this._scrollHeight||Math.abs(this._scrollTop-d)>this._estimatedPageHeight*Te)&&(l=this._surfaceRect=We(this._surface.current),this._scrollTop=d),(i||!a||a!==this._scrollHeight)&&this._measureVersion++,this._scrollHeight=a||0;var u=Math.max(0,-l.top),c=ae(this._root.current),p={top:u,left:l.left,bottom:u+c.innerHeight,right:l.right,width:l.width,height:c.innerHeight};this._requiredRect=x(p,this._requiredWindowsBehind,this._requiredWindowsAhead),this._allowedRect=x(p,o,n),this._visibleRect=p}},r.defaultProps={startIndex:0,onRenderCell:function(t,e,i){return R.createElement(R.Fragment,null,t&&t.name||"")},onRenderCellConditional:void 0,renderedWindowsAhead:we,renderedWindowsBehind:De},r.contextType=he,r}(R.Component);function x(s,r,t){var e=s.top-r*s.height,i=s.height+(r+t)*s.height;return{top:e,bottom:e+i,height:i,left:s.left,right:s.right,width:s.width}}function ke(s,r){return s.top>=r.top&&s.left>=r.left&&s.bottom<=r.bottom&&s.right<=r.right}function Fe(s,r){return s.top=r.top<s.top||s.top===-1?r.top:s.top,s.left=r.left<s.left||s.left===-1?r.left:s.left,s.bottom=r.bottom>s.bottom||s.bottom===-1?r.bottom:s.bottom,s.right=r.right>s.right||s.right===-1?r.right:s.right,s.width=s.right-s.left+1,s.height=s.bottom-s.top+1,s}const Ve=()=>{const s=L[new URLSearchParams(location.search).get("listType")],[r,t]=R.useState([]);return R.useEffect(()=>{s!==L.Allow&&s!==L.Block?chrome.runtime.sendMessage({type:"close"}).then():M(s).then(e=>t(e))},[]),m.jsx(m.Fragment,{children:m.jsx(pe,{style:{minHeight:"100vh",display:"grid",justifyItems:"center"},children:m.jsxs(z,{horizontalAlign:"center",tokens:{childrenGap:20},style:{paddingTop:"50px"},children:[m.jsxs(z,{horizontal:!0,horizontalAlign:"center",verticalAlign:"center",tokens:{childrenGap:20},children:[m.jsx("img",{src:"/icon/icon48.svg",alt:"BrandIcon",width:24,height:24}),m.jsx(k,{style:{fontSize:"1.5em"},children:"PhishDetector"})]}),m.jsxs(k,{style:{fontSize:"2.5em",fontWeight:"bold"},children:[" ",s," List "]}),m.jsx(ze,{items:r,onRenderCell:e=>m.jsxs(z,{horizontal:!0,horizontalAlign:"end",verticalAlign:"center",tokens:{childrenGap:10,padding:5},style:{borderBottom:"1px solid #999999"},children:[m.jsx("div",{style:{height:32,width:32}}),m.jsx(k,{style:{fontSize:"1em",height:"32px",lineHeight:"32px"},children:e}),m.jsx(me,{iconProps:{iconName:"Cancel"},onClick:async()=>{await fe(s,e??""),t(await M(s))}})]})})]})})})};Pe();_e.createRoot(document.getElementById("root")).render(m.jsx(ve.StrictMode,{children:m.jsx(Ve,{})}));
