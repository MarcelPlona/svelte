var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function s(e){e.forEach(t)}function l(e){return"function"==typeof e}function r(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let o,c;function i(e,t){return o||(o=document.createElement("a")),o.href=t,e===o.href}function a(t,n,s){t.$$.on_destroy.push(function(t,...n){if(null==t)return e;const s=t.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(n,s))}function u(e,t,n){return e.set(n),t}function d(e,t){e.appendChild(t)}function f(e,t,n){e.insertBefore(t,n||null)}function h(e){e.parentNode.removeChild(e)}function p(e){return document.createElement(e)}function v(e){return document.createTextNode(e)}function m(){return v(" ")}function g(){return v("")}function _(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function $(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function k(e,t,n){const s=new Set;for(let t=0;t<e.length;t+=1)e[t].checked&&s.add(e[t].__value);return n||s.delete(t),Array.from(s)}function w(e){return""===e?null:+e}function y(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function x(e,t){e.value=null==t?"":t}function b(e){c=e}function z(){if(!c)throw new Error("Function called outside component initialization");return c}function C(){const e=z();return(t,n)=>{const s=e.$$.callbacks[t];if(s){const l=function(e,t,n=!1){const s=document.createEvent("CustomEvent");return s.initCustomEvent(e,n,!1,t),s}(t,n);s.slice().forEach((t=>{t.call(e,l)}))}}}const O=[],E=[],S=[],j=[],T=Promise.resolve();let M=!1;function N(e){S.push(e)}let L=!1;const q=new Set;function J(){if(!L){L=!0;do{for(let e=0;e<O.length;e+=1){const t=O[e];b(t),P(t.$$)}for(b(null),O.length=0;E.length;)E.pop()();for(let e=0;e<S.length;e+=1){const t=S[e];q.has(t)||(q.add(t),t())}S.length=0}while(O.length);for(;j.length;)j.pop()();M=!1,L=!1,q.clear()}}function P(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(N)}}const A=new Set;let B;function V(){B={r:0,c:[],p:B}}function H(){B.r||s(B.c),B=B.p}function R(e,t){e&&e.i&&(A.delete(e),e.i(t))}function F(e,t,n,s){if(e&&e.o){if(A.has(e))return;A.add(e),B.c.push((()=>{A.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}}function D(e,t){e.d(1),t.delete(e.key)}function U(e,t){F(e,1,1,(()=>{t.delete(e.key)}))}function G(e,t,n,s,l,r,o,c,i,a,u,d){let f=e.length,h=r.length,p=f;const v={};for(;p--;)v[e[p].key]=p;const m=[],g=new Map,_=new Map;for(p=h;p--;){const e=d(l,r,p),c=n(e);let i=o.get(c);i?s&&i.p(e,t):(i=a(c,e),i.c()),g.set(c,m[p]=i),c in v&&_.set(c,Math.abs(p-v[c]))}const $=new Set,k=new Set;function w(e){R(e,1),e.m(c,u),o.set(e.key,e),u=e.first,h--}for(;f&&h;){const t=m[h-1],n=e[f-1],s=t.key,l=n.key;t===n?(u=t.first,f--,h--):g.has(l)?!o.has(s)||$.has(s)?w(t):k.has(l)?f--:_.get(s)>_.get(l)?(k.add(s),w(t)):($.add(l),f--):(i(n,o),f--)}for(;f--;){const t=e[f];g.has(t.key)||i(t,o)}for(;h;)w(m[h-1]);return m}function I(e){e&&e.c()}function K(e,n,r,o){const{fragment:c,on_mount:i,on_destroy:a,after_update:u}=e.$$;c&&c.m(n,r),o||N((()=>{const n=i.map(t).filter(l);a?a.push(...n):s(n),e.$$.on_mount=[]})),u.forEach(N)}function Q(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function W(e,t){-1===e.$$.dirty[0]&&(O.push(e),M||(M=!0,T.then(J)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function X(t,l,r,o,i,a,u,d=[-1]){const f=c;b(t);const p=t.$$={fragment:null,ctx:null,props:a,update:e,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(f?f.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:l.target||f.$$.root};u&&u(p.root);let v=!1;if(p.ctx=r?r(t,l.props||{},((e,n,...s)=>{const l=s.length?s[0]:n;return p.ctx&&i(p.ctx[e],p.ctx[e]=l)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](l),v&&W(t,e)),n})):[],p.update(),v=!0,s(p.before_update),p.fragment=!!o&&o(p.ctx),l.target){if(l.hydrate){const e=function(e){return Array.from(e.childNodes)}(l.target);p.fragment&&p.fragment.l(e),e.forEach(h)}else p.fragment&&p.fragment.c();l.intro&&R(t.$$.fragment),K(t,l.target,l.anchor,l.customElement),J()}b(f)}class Y{$destroy(){Q(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function Z(t){let n,s;return{c(){n=p("img"),i(n.src,s="images/"+t[0])||$(n,"src",s),$(n,"class","person svelte-foj2mr"),$(n,"alt","can't find image")},m(e,t){f(e,n,t)},p(e,[t]){1&t&&!i(n.src,s="images/"+e[0])&&$(n,"src",s)},i:e,o:e,d(e){e&&h(n)}}}function ee(e,t,n){let{profile:s}=t;return e.$$set=e=>{"profile"in e&&n(0,s=e.profile)},[s]}class te extends Y{constructor(e){super(),X(this,e,ee,Z,r,{profile:0})}}const ne=[];function se(t,n=e){let s;const l=new Set;function o(e){if(r(t,e)&&(t=e,s)){const e=!ne.length;for(const e of l)e[1](),ne.push(e,t);if(e){for(let e=0;e<ne.length;e+=2)ne[e][0](ne[e+1]);ne.length=0}}}return{set:o,update:function(e){o(e(t))},subscribe:function(r,c=e){const i=[r,c];return l.add(i),1===l.size&&(s=n(o)||e),r(t),()=>{l.delete(i),0===l.size&&(s(),s=null)}}}}const le=se(void 0),re=se([]),oe=se(void 0),ce=se("mark"),ie=se(void 0),ae=se(void 0),ue=se(!0),de=se([]),fe=se([]),he=se([]),pe=se([]),ve=se([]),me=se([]),ge=se("yes"),_e=se(void 0);function $e(t){let n,s,l,r,o,c;return{c(){n=p("div"),s=p("h2"),l=v(t[0]),$(s,"class","properties_text svelte-n9hce4"),$(n,"class",r="properties "+t[2]+" svelte-n9hce4")},m(e,r){f(e,n,r),d(n,s),d(s,l),t[5](n),o||(c=_(n,"click",t[3]),o=!0)},p(e,[t]){1&t&&y(l,e[0]),4&t&&r!==(r="properties "+e[2]+" svelte-n9hce4")&&$(n,"class",r)},i:e,o:e,d(e){e&&h(n),t[5](null),o=!1,c()}}}function ke(e,t,n){let s,l,r;a(e,le,(e=>n(4,s=e))),a(e,ce,(e=>n(6,l=e))),a(e,oe,(e=>n(7,r=e)));let o,{lang:c}=t,i="";return e.$$set=e=>{"lang"in e&&n(0,c=e.lang)},e.$$.update=()=>{18&e.$$.dirty&&s!=o&&null!=o&&n(2,i="")},[c,o,i,function(){s!=o?(u(oe,r=c,r),n(2,i="isActive"),u(ce,l="properties",l),u(le,s=o,s)):(n(2,i=""),u(le,s=void 0,s))},s,function(e){E[e?"unshift":"push"]((()=>{o=e,n(1,o)}))}]}class we extends Y{constructor(e){super(),X(this,e,ke,$e,r,{lang:0})}}function ye(t){let n,s,l,r,o,c,i=t[0].toFixed(1)+"";return{c(){n=p("div"),s=p("p"),l=v(i),$(n,"class",r="mark_box "+t[1]+" svelte-gdsfc8")},m(e,r){f(e,n,r),d(n,s),d(s,l),t[6](n),o||(c=_(n,"click",t[3]),o=!0)},p(e,[t]){1&t&&i!==(i=e[0].toFixed(1)+"")&&y(l,i),2&t&&r!==(r="mark_box "+e[1]+" svelte-gdsfc8")&&$(n,"class",r)},i:e,o:e,d(e){e&&h(n),t[6](null),o=!1,c()}}}function xe(e,t,n){let s,l,r;a(e,re,(e=>n(11,s=e))),a(e,le,(e=>n(12,l=e))),a(e,ce,(e=>n(13,r=e)));let o,c,{mark:i}=t,{tech:d}=t,{person_id:f}=t,h=[["hsl(0, 100%, ","hsl(0, 100%, "],["hsl(17, 100%, ","hsl(19, 100%, "],["hsl(51, 100%, ","hsl(59, 91%, "],["hsl(86, 100%, ","hsl(91, 100%, "],["hsl(125, 100%, ","hsl(120, 100%, "]],p=[63,72],v=.5,m=1,g=!0;function _(){let e;if(i<=1&&i>=0)e=0;else if(i<=2)e=1;else if(i<=3)e=2;else if(i<=4)e=3;else{if(!(i<=5))return n(2,c.style.backgroundColor="",c),void n(2,c.style.borderColor="",c);e=4}n(2,c.style.backgroundColor=h[e][0]+p[0].toString()+"%)",c),n(2,c.style.borderColor=h[e][1]+p[1].toString()+"%)",c),m>20&&g?(v*=-1,g=!1):m<-13&&!g&&(v*=-1,g=!0),m+=v,p[0]+=v,p[1]+=v,l==c?setTimeout(_,16):(n(2,c.style.backgroundColor="",c),n(2,c.style.borderColor="",c))}return e.$$set=e=>{"mark"in e&&n(0,i=e.mark),"tech"in e&&n(4,d=e.tech),"person_id"in e&&n(5,f=e.person_id)},e.$$.update=()=>{1&e.$$.dirty&&n(1,o=i<=1?"verylow":i<=2?"low":i<=3?"medium":i<=4?"high":"veryhigh")},[i,o,c,function(){l!=c?(p=[63,72],m=1,v=.5,g=!0,setTimeout(_,16),u(le,l=c,l),u(re,s=[f,d],s),u(ce,r="mark",r)):(u(le,l=void 0,l),u(re,s=[],s))},d,f,function(e){E[e?"unshift":"push"]((()=>{c=e,n(2,c)}))}]}class be extends Y{constructor(e){super(),X(this,e,xe,ye,r,{mark:0,tech:4,person_id:5})}}function ze(e,t,n){const s=e.slice();return s[7]=t[n],s[11]=n,s}function Ce(e,t,n){const s=e.slice();return s[7]=t[n],s}function Oe(e){let t,n,s,l,r=[],o=new Map;t=new te({props:{profile:e[0].img}});let c=e[2];const i=e=>e[7];for(let t=0;t<c.length;t+=1){let n=ze(e,c,t),s=i(n);o.set(s,r[t]=Se(s,n))}return{c(){I(t.$$.fragment),n=m();for(let e=0;e<r.length;e+=1)r[e].c();s=g()},m(e,o){K(t,e,o),f(e,n,o);for(let t=0;t<r.length;t+=1)r[t].m(e,o);f(e,s,o),l=!0},p(e,n){const l={};1&n&&(l.profile=e[0].img),t.$set(l),5&n&&(c=e[2],V(),r=G(r,n,i,1,e,c,o,s.parentNode,U,Se,s,ze),H())},i(e){if(!l){R(t.$$.fragment,e);for(let e=0;e<c.length;e+=1)R(r[e]);l=!0}},o(e){F(t.$$.fragment,e);for(let e=0;e<r.length;e+=1)F(r[e]);l=!1},d(e){Q(t,e),e&&h(n);for(let t=0;t<r.length;t+=1)r[t].d(e);e&&h(s)}}}function Ee(e){let t,n,s=[],l=new Map,r=e[3];const o=e=>e[7];for(let t=0;t<r.length;t+=1){let n=Ce(e,r,t),c=o(n);l.set(c,s[t]=je(c,n))}return{c(){for(let e=0;e<s.length;e+=1)s[e].c();t=g()},m(e,l){for(let t=0;t<s.length;t+=1)s[t].m(e,l);f(e,t,l),n=!0},p(e,n){8&n&&(r=e[3],V(),s=G(s,n,o,1,e,r,l,t.parentNode,U,je,t,Ce),H())},i(e){if(!n){for(let e=0;e<r.length;e+=1)R(s[e]);n=!0}},o(e){for(let e=0;e<s.length;e+=1)F(s[e]);n=!1},d(e){for(let t=0;t<s.length;t+=1)s[t].d(e);e&&h(t)}}}function Se(e,t){let n,s,l;return s=new be({props:{tech:t[7],person_id:t[0]._id,mark:t[0][t[7]]}}),{key:e,first:null,c(){n=g(),I(s.$$.fragment),this.first=n},m(e,t){f(e,n,t),K(s,e,t),l=!0},p(e,n){t=e;const l={};4&n&&(l.tech=t[7]),1&n&&(l.person_id=t[0]._id),5&n&&(l.mark=t[0][t[7]]),s.$set(l)},i(e){l||(R(s.$$.fragment,e),l=!0)},o(e){F(s.$$.fragment,e),l=!1},d(e){e&&h(n),Q(s,e)}}}function je(e,t){let n,s,l;return s=new we({props:{lang:t[7]}}),{key:e,first:null,c(){n=g(),I(s.$$.fragment),this.first=n},m(e,t){f(e,n,t),K(s,e,t),l=!0},p(e,n){t=e;const l={};8&n&&(l.lang=t[7]),s.$set(l)},i(e){l||(R(s.$$.fragment,e),l=!0)},o(e){F(s.$$.fragment,e),l=!1},d(e){e&&h(n),Q(s,e)}}}function Te(e){let t,n,s,l;const r=[Ee,Oe],o=[];function c(e,t){return"properties"===e[1]?0:e[2].length?1:-1}return~(n=c(e))&&(s=o[n]=r[n](e)),{c(){t=p("div"),s&&s.c(),$(t,"class","column svelte-vipyu4")},m(e,s){f(e,t,s),~n&&o[n].m(t,null),l=!0},p(e,[l]){let i=n;n=c(e),n===i?~n&&o[n].p(e,l):(s&&(V(),F(o[i],1,1,(()=>{o[i]=null})),H()),~n?(s=o[n],s?s.p(e,l):(s=o[n]=r[n](e),s.c()),R(s,1),s.m(t,null)):s=null)},i(e){l||(R(s),l=!0)},o(e){F(s),l=!1},d(e){e&&h(t),~n&&o[n].d()}}}function Me(e,t,n){let{person:s}=t,{which_column:l}=t,{lang:r}=t,{techs_view:o}=t,{techs:c}=t,i=[];return e.$$set=e=>{"person"in e&&n(0,s=e.person),"which_column"in e&&n(1,l=e.which_column),"lang"in e&&n(2,r=e.lang),"techs_view"in e&&n(4,o=e.techs_view),"techs"in e&&n(5,c=e.techs)},e.$$.update=()=>{var t;4&e.$$.dirty&&(t=r,n(3,i=[]),t.forEach((e=>{i.push(o[c.indexOf(e)])})))},[s,l,r,i,o,c]}class Ne extends Y{constructor(e){super(),X(this,e,Me,Te,r,{person:0,which_column:1,lang:2,techs_view:4,techs:5})}}function Le(e,t,n){const s=e.slice();return s[3]=t[n],s[5]=n,s}function qe(e,t){let n,s,l;return s=new Ne({props:{techs:t[0].tech_list,techs_view:t[0].tech_list_view,which_column:"values",lang:t[1],person:t[3]}}),{key:e,first:null,c(){n=g(),I(s.$$.fragment),this.first=n},m(e,t){f(e,n,t),K(s,e,t),l=!0},p(e,n){t=e;const l={};1&n&&(l.techs=t[0].tech_list),1&n&&(l.techs_view=t[0].tech_list_view),2&n&&(l.lang=t[1]),4&n&&(l.person=t[3]),s.$set(l)},i(e){l||(R(s.$$.fragment,e),l=!0)},o(e){F(s.$$.fragment,e),l=!1},d(e){e&&h(n),Q(s,e)}}}function Je(e){let t,n,s,l,r=[],o=new Map;t=new Ne({props:{techs:e[0].tech_list,techs_view:e[0].tech_list_view,lang:e[1],which_column:"properties"}});let c=e[2];const i=e=>e[3]._id;for(let t=0;t<c.length;t+=1){let n=Le(e,c,t),s=i(n);o.set(s,r[t]=qe(s,n))}return{c(){I(t.$$.fragment),n=m();for(let e=0;e<r.length;e+=1)r[e].c();s=g()},m(e,o){K(t,e,o),f(e,n,o);for(let t=0;t<r.length;t+=1)r[t].m(e,o);f(e,s,o),l=!0},p(e,[n]){const l={};1&n&&(l.techs=e[0].tech_list),1&n&&(l.techs_view=e[0].tech_list_view),2&n&&(l.lang=e[1]),t.$set(l),7&n&&(c=e[2],V(),r=G(r,n,i,1,e,c,o,s.parentNode,U,qe,s,Le),H())},i(e){if(!l){R(t.$$.fragment,e);for(let e=0;e<c.length;e+=1)R(r[e]);l=!0}},o(e){F(t.$$.fragment,e);for(let e=0;e<r.length;e+=1)F(r[e]);l=!1},d(e){Q(t,e),e&&h(n);for(let t=0;t<r.length;t+=1)r[t].d(e);e&&h(s)}}}function Pe(e,t,n){let{data:s}=t,{tech_create:l}=t,{person_list:r}=t;return e.$$set=e=>{"data"in e&&n(0,s=e.data),"tech_create"in e&&n(1,l=e.tech_create),"person_list"in e&&n(2,r=e.person_list)},[s,l,r]}class Ae extends Y{constructor(e){super(),X(this,e,Pe,Je,r,{data:0,tech_create:1,person_list:2})}}function Be(e,t,n){const s=e.slice();return s[21]=t[n],s[22]=t,s[23]=n,s}function Ve(e,t,n){const s=e.slice();return s[24]=t[n],s[25]=t,s[23]=n,s}function He(e,t){let n,s,l,r,o,c,i,a=t[10][t[23]]+"";function u(){t[12].call(s,t[23])}return{key:e,first:null,c(){n=p("div"),s=p("input"),l=m(),r=p("div"),o=v(a),$(s,"type","checkbox"),s.__value=t[24],s.value=s.__value,$(s,"class","svelte-24r7g4"),t[13][1].push(s),$(n,"class","row svelte-24r7g4"),this.first=n},m(e,a){f(e,n,a),d(n,s),s.checked=t[2][t[23]],s.checked=~t[7].indexOf(s.__value),d(n,l),d(n,r),d(r,o),c||(i=_(s,"change",u),c=!0)},p(e,n){t=e,516&n&&(s.checked=t[2][t[23]]),128&n&&(s.checked=~t[7].indexOf(s.__value))},d(e){e&&h(n),t[13][1].splice(t[13][1].indexOf(s),1),c=!1,i()}}}function Re(e,t){let n,s,l,r,o,c,i,a,u=t[21].name+"";function g(){t[14].call(s,t[23])}return{key:e,first:null,c(){n=p("div"),s=p("input"),r=m(),o=p("div"),c=v(u),$(s,"type","checkbox"),s.__value=l=t[21],s.value=s.__value,$(s,"class","svelte-24r7g4"),t[13][0].push(s),$(n,"class","row svelte-24r7g4"),this.first=n},m(e,l){f(e,n,l),d(n,s),s.checked=t[0][t[23]],s.checked=~t[8].indexOf(s.__value),d(n,r),d(n,o),d(o,c),i||(a=_(s,"change",g),i=!0)},p(e,n){t=e,2&n&&l!==(l=t[21])&&(s.__value=l,s.value=s.__value),3&n&&(s.checked=t[0][t[23]]),256&n&&(s.checked=~t[8].indexOf(s.__value)),2&n&&u!==(u=t[21].name+"")&&y(c,u)},d(e){e&&h(n),t[13][0].splice(t[13][0].indexOf(s),1),i=!1,a()}}}function Fe(t){let n,l,r,o,c,i,a,u,g,k,w,b,z,C,O,E,S,j,T,M,N,L,q,J=[],P=new Map,A=[],B=new Map,V=t[9];const H=e=>e[9][e[23]];for(let e=0;e<V.length;e+=1){let n=Ve(t,V,e),s=H(n);P.set(s,J[e]=He(s,n))}let R=t[1].persons;const F=e=>e[21]._id;for(let e=0;e<R.length;e+=1){let n=Be(t,R,e),s=F(n);B.set(s,A[e]=Re(s,n))}return{c(){n=p("h3"),l=v(t[6]),r=m(),o=p("div"),c=p("div"),c.textContent="Technology:",i=m();for(let e=0;e<J.length;e+=1)J[e].c();a=m(),u=p("div"),u.textContent="Persons:",g=m();for(let e=0;e<A.length;e+=1)A[e].c();k=m(),w=p("input"),b=m(),z=p("h3"),z.textContent="Starting date:",C=m(),O=p("input"),E=m(),S=p("h3"),S.textContent="End date:",j=m(),T=p("input"),M=m(),N=p("input"),$(n,"class","error svelte-24r7g4"),$(w,"type","text"),$(w,"placeholder","Tabele name"),$(w,"class","svelte-24r7g4"),$(z,"class","svelte-24r7g4"),$(O,"type","date"),$(O,"class","svelte-24r7g4"),$(S,"class","svelte-24r7g4"),$(T,"type","date"),$(T,"class","svelte-24r7g4"),$(N,"type","submit"),N.value="Save",$(N,"class","svelte-24r7g4"),$(o,"class","on_inputs svelte-24r7g4")},m(e,s){f(e,n,s),d(n,l),f(e,r,s),f(e,o,s),d(o,c),d(o,i);for(let e=0;e<J.length;e+=1)J[e].m(o,null);d(o,a),d(o,u),d(o,g);for(let e=0;e<A.length;e+=1)A[e].m(o,null);d(o,k),d(o,w),x(w,t[5]),d(o,b),d(o,z),d(o,C),d(o,O),x(O,t[3]),d(o,E),d(o,S),d(o,j),d(o,T),x(T,t[4]),d(o,M),d(o,N),L||(q=[_(w,"input",t[15]),_(O,"input",t[16]),_(T,"input",t[17]),_(N,"click",t[11])],L=!0)},p(e,[t]){64&t&&y(l,e[6]),1668&t&&(V=e[9],J=G(J,t,H,1,e,V,P,o,D,He,a,Ve)),259&t&&(R=e[1].persons,A=G(A,t,F,1,e,R,B,o,D,Re,k,Be)),32&t&&w.value!==e[5]&&x(w,e[5]),8&t&&x(O,e[3]),16&t&&x(T,e[4])},i:e,o:e,d(e){e&&h(n),e&&h(r),e&&h(o);for(let e=0;e<J.length;e+=1)J[e].d();for(let e=0;e<A.length;e+=1)A[e].d();L=!1,s(q)}}}function De(e,t,n){let s,l,r,o,c;a(e,ue,(e=>n(18,s=e))),a(e,ge,(e=>n(19,l=e))),a(e,_e,(e=>n(20,r=e))),a(e,de,(e=>n(7,o=e))),a(e,fe,(e=>n(8,c=e)));let{data:i}=t,{person_create:d}=t,f=[!1,!1,!1,!1],h=["javascript","java","python","c_sharp"],p="2021-11-01",v="2021-11-01",m="",g="";const _=[[],[]];return e.$$set=e=>{"data"in e&&n(1,i=e.data),"person_create"in e&&n(0,d=e.person_create)},[d,i,f,p,v,m,g,o,c,h,["Javascript","Java","Python","C#"],function(){if(u(ue,s=!0,s),n(6,g=""),!(m&&p&&v&&c.length&&o.length))return n(6,g="select the minimum number of fields!"),void u(ue,s=!1,s);let e=c.map((e=>e=[...o,"img","_id","name"].reduce(((t,n)=>Object.assign(t,{[n]:e[n]})),{[o[0]]:e[o[0]]})));const t={name:m,data_start:p,data_end:v,tech_list_view:["Javascript","Java","Python","C#"],tech_list:o,persons:e},i={method:"POST",headers:{"Content-Type":"application/json",authorization:`Bearer ${r}`},body:JSON.stringify({data:t})};fetch("http://giereczka.pl/api/add/",i).then((e=>e.json())).then((e=>{e.err?u(ge,l="login",l):"y"==e.res&&u(ue,s=!1,s)}))},function(e){f[e]=this.checked,o=k(_[1],this.__value,this.checked),de.set(o),n(2,f),n(9,h)},_,function(e){d[e]=this.checked,c=k(_[0],this.__value,this.checked),fe.set(c),n(0,d),n(1,i)},function(){m=this.value,n(5,m)},function(){p=this.value,n(3,p)},function(){v=this.value,n(4,v)}]}class Ue extends Y{constructor(e){super(),X(this,e,De,Fe,r,{data:1,person_create:0})}}function Ge(e,t,n){const s=e.slice();return s[30]=t[n],s[31]=t,s[32]=n,s}function Ie(t){let n;return{c(){n=p("h3"),n.textContent="Select view tables to see filters",$(n,"class","info svelte-ruw1oo")},m(e,t){f(e,n,t)},p:e,d(e){e&&h(n)}}}function Ke(e){let t,n,l,r,o,c,i,a,u,g,k,b,z,C,O=[],E=new Map,S=e[2];const j=e=>e[30];for(let t=0;t<S.length;t+=1){let n=Ge(e,S,t),s=j(n);E.set(s,O[t]=Qe(s,n))}function T(e,t){return"properties"==e[9]?Ye:"mark"==e[9]?Xe:"date"==e[9]?We:void 0}let M=T(e),N=M&&M(e);return{c(){for(let e=0;e<O.length;e+=1)O[e].c();t=m(),n=p("input"),l=m(),r=p("input"),o=m(),c=p("input"),i=m(),N&&N.c(),a=m(),u=p("input"),g=m(),k=p("h3"),b=v(e[0]),$(n,"type","number"),$(n,"placeholder","Max results"),$(n,"class","svelte-ruw1oo"),$(r,"type","number"),$(r,"placeholder","Min average"),$(r,"class","svelte-ruw1oo"),$(c,"type","submit"),c.value="filter",$(c,"class","svelte-ruw1oo"),$(u,"type","submit"),u.value="edit",$(u,"class","svelte-ruw1oo"),$(k,"class","error svelte-ruw1oo")},m(s,h){for(let e=0;e<O.length;e+=1)O[e].m(s,h);f(s,t,h),f(s,n,h),x(n,e[8]),f(s,l,h),f(s,r,h),x(r,e[7]),f(s,o,h),f(s,c,h),f(s,i,h),N&&N.m(s,h),f(s,a,h),f(s,u,h),f(s,g,h),f(s,k,h),d(k,b),z||(C=[_(n,"input",e[15]),_(r,"input",e[16]),_(c,"click",e[11]),_(u,"click",e[10])],z=!0)},p(e,s){108&s[0]&&(S=e[2],O=G(O,s,j,1,e,S,E,t.parentNode,D,Qe,t,Ge)),256&s[0]&&w(n.value)!==e[8]&&x(n,e[8]),128&s[0]&&w(r.value)!==e[7]&&x(r,e[7]),M===(M=T(e))&&N?N.p(e,s):(N&&N.d(1),N=M&&M(e),N&&(N.c(),N.m(a.parentNode,a))),1&s[0]&&y(b,e[0])},d(e){for(let t=0;t<O.length;t+=1)O[t].d(e);e&&h(t),e&&h(n),e&&h(l),e&&h(r),e&&h(o),e&&h(c),e&&h(i),N&&N.d(e),e&&h(a),e&&h(u),e&&h(g),e&&h(k),z=!1,s(C)}}}function Qe(e,t){let n,s,l,r,o,c,i,a=t[3][t[32]]+"";function u(){t[13].call(n,t[32])}return{key:e,first:null,c(){n=p("input"),l=m(),r=p("div"),o=v(a),$(n,"type","checkbox"),n.__value=s=t[30],n.value=n.__value,$(n,"class","svelte-ruw1oo"),t[14][0].push(n),$(r,"class","svelte-ruw1oo"),this.first=n},m(e,s){f(e,n,s),n.checked=t[5][t[32]],n.checked=~t[6].indexOf(n.__value),f(e,l,s),f(e,r,s),d(r,o),c||(i=_(n,"change",u),c=!0)},p(e,l){t=e,4&l[0]&&s!==(s=t[30])&&(n.__value=s,n.value=n.__value),36&l[0]&&(n.checked=t[5][t[32]]),64&l[0]&&(n.checked=~t[6].indexOf(n.__value)),12&l[0]&&a!==(a=t[3][t[32]]+"")&&y(o,a)},d(e){e&&h(n),t[14][0].splice(t[14][0].indexOf(n),1),e&&h(l),e&&h(r),c=!1,i()}}}function We(e){let t,n,s;return{c(){t=p("input"),$(t,"type","date"),$(t,"placeholder","new value"),$(t,"class","svelte-ruw1oo")},m(l,r){f(l,t,r),x(t,e[4]),n||(s=_(t,"input",e[19]),n=!0)},p(e,n){16&n[0]&&x(t,e[4])},d(e){e&&h(t),n=!1,s()}}}function Xe(e){let t,n,s;return{c(){t=p("input"),$(t,"type","number"),$(t,"placeholder","new value"),$(t,"class","svelte-ruw1oo")},m(l,r){f(l,t,r),x(t,e[4]),n||(s=_(t,"input",e[18]),n=!0)},p(e,n){16&n[0]&&w(t.value)!==e[4]&&x(t,e[4])},d(e){e&&h(t),n=!1,s()}}}function Ye(e){let t,n,s;return{c(){t=p("input"),$(t,"type","text"),$(t,"placeholder","new value"),$(t,"class","svelte-ruw1oo")},m(l,r){f(l,t,r),x(t,e[4]),n||(s=_(t,"input",e[17]),n=!0)},p(e,n){16&n[0]&&t.value!==e[4]&&x(t,e[4])},d(e){e&&h(t),n=!1,s()}}}function Ze(t){let n;function s(e,t){return e[1]?Ie:Ke}let l=s(t),r=l(t);return{c(){n=p("header"),r.c(),$(n,"class","svelte-ruw1oo")},m(e,t){f(e,n,t),r.m(n,null)},p(e,t){l===(l=s(e))&&r?r.p(e,t):(r.d(1),r=l(e),r&&(r.c(),r.m(n,null)))},i:e,o:e,d(e){e&&h(n),r.d()}}}function et(e,t,n){let s,l,r,o,c,i,d,f;a(e,ve,(e=>n(21,s=e))),a(e,pe,(e=>n(22,l=e))),a(e,le,(e=>n(23,r=e))),a(e,ce,(e=>n(9,o=e))),a(e,me,(e=>n(24,c=e))),a(e,ie,(e=>n(25,i=e))),a(e,oe,(e=>n(26,d=e))),a(e,re,(e=>n(27,f=e)));const h=C();let p,v,m,{error:g=""}=t,{which_mode:_}=t,{techs:$=[]}=t,{techs_view:y=[]}=t,{name:x=""}=t,b=[],z=[...$],O=$;const E=[[]];return e.$$set=e=>{"error"in e&&n(0,g=e.error),"which_mode"in e&&n(1,_=e.which_mode),"techs"in e&&n(2,$=e.techs),"techs_view"in e&&n(3,y=e.techs_view),"name"in e&&n(12,x=e.name)},e.$$.update=()=>{var t;4&e.$$.dirty[0]&&(O!=(t=$)&&(n(5,b=[]),n(5,b=t.map((()=>!0))),n(6,z=[...t]),u(ie,i=[...t],i)),O=t)},[g,_,$,y,p,b,z,v,m,o,function(){let e=((e,t,n,s,l,r)=>{let o;return"mark"==t?e<0||e>5||!e?(o="Value must be between 0 and 5",{value:{},url:"change-mark/",err:o}):{value:{value:e,person_id:r[0],tech:r[1],name:n},url:"change-mark/",err:""}:"properties"==t?e?{value:{value:e,old_value:l,name:n},url:"change-tech-view/",err:""}:(o="Value can't be empty",{value:{},url:"change-tech-view/",err:o}):"date"==t?e?{value:{value:e,end_or_start:s,name:n},url:"change-tech-view/",err:""}:(o="Value can't be empty",{value:{},url:"change-tech-view/",err:o}):void console.log("not valid value")})(p,o,x,r,d,f);if(-1!=l.tech_list_view.indexOf(e.value.value)&&(e.err="Value cannot be repeated"),h("edit",{data:e}),!e.err)if("mark"==o){let t=l.persons.map((e=>e._id)).indexOf(f[0].toString());u(pe,l.persons[t][f[1]]=e.value.value,l),u(ve,s.persons[t][f[1]]=e.value.value,s)}else"properties"==o?(u(pe,l.tech_list_view[l.tech_list_view.indexOf(d)]=e.value.value,l),u(ve,s.tech_list_view[s.tech_list_view.indexOf(d)]=e.value.value,s),c.forEach(((e,t)=>{i.forEach((e=>{c[t]==e&&u(me,c[t]=e,c)}))})),me.set(c)):"date"==o&&("start"==r?(u(pe,l.data_start=e.value.value,l),u(ve,s.data_start=e.value.value,s)):"end"==r&&(u(pe,l.data_end=e.value.value,l),u(ve,s.data_end=e.value.value,s)))},function(){h("filter",{max_results:m,min_avg:v,min_avg:v,selected_techs:z,selected_techs:z})},x,function(e){b[e]=this.checked,z=k(E[0],this.__value,this.checked),n(5,b),n(2,$),n(6,z)},E,function(){m=w(this.value),n(8,m)},function(){v=w(this.value),n(7,v)},function(){p=this.value,n(4,p)},function(){p=w(this.value),n(4,p)},function(){p=this.value,n(4,p)}]}class tt extends Y{constructor(e){super(),X(this,e,et,Ze,r,{error:0,which_mode:1,techs:2,techs_view:3,name:12},null,[-1,-1])}}function nt(t){let n,l,r,o,c,i,a,u,g,k,w,x,b,z,C,O,E=t[0].data_start+"",S=t[0].name+"",j=t[0].data_end+"";return{c(){n=p("div"),l=p("div"),r=v("Starts: "),o=v(E),i=m(),a=p("div"),u=v("Name: "),g=v(S),k=m(),w=p("div"),x=v("Ends: "),b=v(j),$(l,"class",c="click "+t[3][0]+" svelte-14a9ayi"),$(w,"class",z="click "+t[3][1]+" svelte-14a9ayi"),$(n,"class","table_data svelte-14a9ayi")},m(e,s){f(e,n,s),d(n,l),d(l,r),d(l,o),t[6](l),d(n,i),d(n,a),d(a,u),d(a,g),d(n,k),d(n,w),d(w,x),d(w,b),t[8](w),C||(O=[_(l,"click",t[7]),_(w,"click",t[9])],C=!0)},p(e,[t]){1&t&&E!==(E=e[0].data_start+"")&&y(o,E),8&t&&c!==(c="click "+e[3][0]+" svelte-14a9ayi")&&$(l,"class",c),1&t&&S!==(S=e[0].name+"")&&y(g,S),1&t&&j!==(j=e[0].data_end+"")&&y(b,j),8&t&&z!==(z="click "+e[3][1]+" svelte-14a9ayi")&&$(w,"class",z)},i:e,o:e,d(e){e&&h(n),t[6](null),t[8](null),C=!1,s(O)}}}function st(e,t,n){let s,l;a(e,le,(e=>n(5,s=e))),a(e,ce,(e=>n(10,l=e)));let r,o,{data:c}=t,i=["",""];function d(e){o&&r&&(s==e?u(le,s=void 0,s):e&&(u(le,s=e,s),u(ce,l="date",l)),"start"==s?(n(3,i[0]="isActive",i),n(3,i[1]="",i)):"end"==s?(n(3,i[0]="",i),n(3,i[1]="isActive",i)):(n(3,i[0]="",i),n(3,i[1]="",i)))}return e.$$set=e=>{"data"in e&&n(0,c=e.data)},e.$$.update=()=>{32&e.$$.dirty&&d(!1)},[c,r,o,i,d,s,function(e){E[e?"unshift":"push"]((()=>{r=e,n(1,r)}))},()=>{d("start")},function(e){E[e?"unshift":"push"]((()=>{o=e,n(2,o)}))},()=>{d("end")}]}class lt extends Y{constructor(e){super(),X(this,e,st,nt,r,{data:0})}}function rt(t){let n,s,l;return{c(){n=p("div"),n.innerHTML="<p>Logout</p>",$(n,"class","logout svelte-1l69ku1")},m(e,r){f(e,n,r),s||(l=_(n,"click",t[0]),s=!0)},p:e,i:e,o:e,d(e){e&&h(n),s=!1,l()}}}function ot(e,t,n){let s,l,r,o,c,i,d,f,h,p,v,m,g,_,$;return a(e,me,(e=>n(1,s=e))),a(e,ve,(e=>n(2,l=e))),a(e,pe,(e=>n(3,r=e))),a(e,he,(e=>n(4,o=e))),a(e,fe,(e=>n(5,c=e))),a(e,de,(e=>n(6,i=e))),a(e,ue,(e=>n(7,d=e))),a(e,ae,(e=>n(8,f=e))),a(e,ie,(e=>n(9,h=e))),a(e,ce,(e=>n(10,p=e))),a(e,oe,(e=>n(11,v=e))),a(e,re,(e=>n(12,m=e))),a(e,le,(e=>n(13,g=e))),a(e,_e,(e=>n(14,_=e))),a(e,ge,(e=>n(15,$=e))),[function(){document.cookie="token=;expires=Thu, 01 Jan 1970 00:00:00 UTC",u(ge,$="login",$),u(_e,_=void 0,_),u(le,g=void 0,g),u(re,m=[],m),u(oe,v=void 0,v),u(ce,p="mark",p),u(ie,h=void 0,h),u(ae,f=void 0,f),u(ue,d=!0,d),u(de,i=[],i),u(fe,c=[],c),u(he,o=[],o),u(pe,r=[],r),u(ve,l=[],l),u(me,s=[],s)}]}class ct extends Y{constructor(e){super(),X(this,e,ot,rt,r,{})}}function it(e,t,n){const s=e.slice();return s[22]=t[n],s[24]=n,s}function at(t){let n;return{c(){n=p("div"),n.textContent="loading...",$(n,"class","loading svelte-kfz6gx")},m(e,t){f(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}function ut(e){let t,n,l,r,o,c,i,a,u,v;const g=[ft,dt],k=[];function w(e,t){return e[4]?0:1}return c=w(e),i=k[c]=g[c](e),{c(){t=p("div"),n=p("div"),n.innerHTML='<p class="svelte-kfz6gx">Create table</p>',l=m(),r=p("div"),r.innerHTML='<p class="svelte-kfz6gx">View tables</p>',o=m(),i.c(),$(n,"class","options svelte-kfz6gx"),$(r,"class","options svelte-kfz6gx"),$(t,"class","create_table svelte-kfz6gx")},m(s,i){f(s,t,i),d(t,n),d(t,l),d(t,r),d(t,o),k[c].m(t,null),a=!0,u||(v=[_(n,"click",e[17]),_(r,"click",e[18])],u=!0)},p(e,n){let s=c;c=w(e),c===s?k[c].p(e,n):(V(),F(k[s],1,1,(()=>{k[s]=null})),H(),i=k[c],i?i.p(e,n):(i=k[c]=g[c](e),i.c()),R(i,1),i.m(t,null))},i(e){a||(R(i),a=!0)},o(e){F(i),a=!1},d(e){e&&h(t),k[c].d(),u=!1,s(v)}}}function dt(t){let n,s,l,r=[],o=new Map,c=t[8];const i=e=>e[22]._id;for(let e=0;e<c.length;e+=1){let n=it(t,c,e),s=i(n);o.set(s,r[e]=ht(s,n))}return{c(){n=p("div"),s=p("div"),s.textContent="Select:",l=m();for(let e=0;e<r.length;e+=1)r[e].c();$(s,"class","svelte-kfz6gx"),$(n,"class","on_tables svelte-kfz6gx")},m(e,t){f(e,n,t),d(n,s),d(n,l);for(let e=0;e<r.length;e+=1)r[e].m(n,null)},p(e,t){8448&t&&(c=e[8],r=G(r,t,i,1,e,c,o,n,D,ht,null,it))},i:e,o:e,d(e){e&&h(n);for(let e=0;e<r.length;e+=1)r[e].d()}}}function ft(e){let t,n;return t=new Ue({props:{data:e[1],person_create:e[12]}}),{c(){I(t.$$.fragment)},m(e,s){K(t,e,s),n=!0},p(e,n){const s={};2&n&&(s.data=e[1]),t.$set(s)},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){Q(t,e)}}}function ht(e,t){let n,s,l,r,o,c=t[22].name+"";function i(){return t[19](t[22])}return{key:e,first:null,c(){n=p("div"),s=v(c),l=m(),$(n,"class","svelte-kfz6gx"),this.first=n},m(e,t){f(e,n,t),d(n,s),d(n,l),r||(o=_(n,"click",i),r=!0)},p(e,n){t=e,256&n&&c!==(c=t[22].name+"")&&y(s,c)},d(e){e&&h(n),r=!1,o()}}}function pt(e){let t,n,s,l;const r=[_t,gt],o=[];function c(e,t){return e[10].length&&e[11].length?0:1}return n=c(e),s=o[n]=r[n](e),{c(){t=p("div"),s.c(),$(t,"class","flexbox view svelte-kfz6gx")},m(e,s){f(e,t,s),o[n].m(t,null),l=!0},p(e,l){let i=n;n=c(e),n===i?o[n].p(e,l):(V(),F(o[i],1,1,(()=>{o[i]=null})),H(),s=o[n],s?s.p(e,l):(s=o[n]=r[n](e),s.c()),R(s,1),s.m(t,null))},i(e){l||(R(s),l=!0)},o(e){F(s),l=!1},d(e){e&&h(t),o[n].d()}}}function vt(t){let n;return{c(){n=p("div"),n.innerHTML='<div class="loading  svelte-kfz6gx">loading...</div>',$(n,"class","flexbox svelte-kfz6gx")},m(e,t){f(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}function mt(e){let t,n,s,l,r,o;n=new lt({props:{data:e[5]}});const c=[kt,$t],i=[];function a(e,t){return e[6].length&&e[5].persons.length?0:1}return l=a(e),r=i[l]=c[l](e),{c(){t=p("div"),I(n.$$.fragment),s=m(),r.c(),$(t,"class","flexbox svelte-kfz6gx")},m(e,r){f(e,t,r),K(n,t,null),d(t,s),i[l].m(t,null),o=!0},p(e,s){const o={};32&s&&(o.data=e[5]),n.$set(o);let u=l;l=a(e),l===u?i[l].p(e,s):(V(),F(i[u],1,1,(()=>{i[u]=null})),H(),r=i[l],r?r.p(e,s):(r=i[l]=c[l](e),r.c()),R(r,1),r.m(t,null))},i(e){o||(R(n.$$.fragment,e),R(r),o=!0)},o(e){F(n.$$.fragment,e),F(r),o=!1},d(e){e&&h(t),Q(n),i[l].d()}}}function gt(t){let n;return{c(){n=p("div"),n.textContent="Select technologies and people",$(n,"class","loading select_check svelte-kfz6gx")},m(e,t){f(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}function _t(e){let t,n;return t=new Ae({props:{data:e[1],tech_create:e[10],person_list:e[11]}}),{c(){I(t.$$.fragment)},m(e,s){K(t,e,s),n=!0},p(e,n){const s={};2&n&&(s.data=e[1]),1024&n&&(s.tech_create=e[10]),2048&n&&(s.person_list=e[11]),t.$set(s)},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){Q(t,e)}}}function $t(t){let n;return{c(){n=p("div"),n.textContent="No results",$(n,"class","loading select_check svelte-kfz6gx")},m(e,t){f(e,n,t)},p:e,i:e,o:e,d(e){e&&h(n)}}}function kt(e){let t,n;return t=new Ae({props:{data:e[7],tech_create:e[6],person_list:e[5].persons}}),{c(){I(t.$$.fragment)},m(e,s){K(t,e,s),n=!0},p(e,n){const s={};128&n&&(s.data=e[7]),64&n&&(s.tech_create=e[6]),32&n&&(s.person_list=e[5].persons),t.$set(s)},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){Q(t,e)}}}function wt(e){let t,n,s,l,r,o,c,i,a,u,d,v,_;t=new tt({props:{name:e[7].name,which_mode:e[4],error:e[3],techs_view:e[7].tech_list_view,techs:e[7].tech_list}}),t.$on("edit",e[14]),t.$on("filter",e[15]),s=new ct({});const k=[ut,at],w=[];function y(e,t){return e[9]?e[9]?1:-1:0}~(o=y(e))&&(c=w[o]=k[o](e));const x=[mt,vt,pt],b=[];function z(e,t){return!e[0]||e[2]||e[4]?e[0]&&!e[4]?1:((null==a||2&t)&&(a=!!e[1].hasOwnProperty("persons")),a?2:-1):0}return~(u=z(e,-1))&&(d=b[u]=x[u](e)),{c(){I(t.$$.fragment),n=m(),I(s.$$.fragment),l=m(),r=p("div"),c&&c.c(),i=m(),d&&d.c(),v=g(),$(r,"class","on_content svelte-kfz6gx")},m(e,c){K(t,e,c),f(e,n,c),K(s,e,c),f(e,l,c),f(e,r,c),~o&&w[o].m(r,null),f(e,i,c),~u&&b[u].m(e,c),f(e,v,c),_=!0},p(e,[n]){const s={};128&n&&(s.name=e[7].name),16&n&&(s.which_mode=e[4]),8&n&&(s.error=e[3]),128&n&&(s.techs_view=e[7].tech_list_view),128&n&&(s.techs=e[7].tech_list),t.$set(s);let l=o;o=y(e),o===l?~o&&w[o].p(e,n):(c&&(V(),F(w[l],1,1,(()=>{w[l]=null})),H()),~o?(c=w[o],c?c.p(e,n):(c=w[o]=k[o](e),c.c()),R(c,1),c.m(r,null)):c=null);let i=u;u=z(e,n),u===i?~u&&b[u].p(e,n):(d&&(V(),F(b[i],1,1,(()=>{b[i]=null})),H()),~u?(d=b[u],d?d.p(e,n):(d=b[u]=x[u](e),d.c()),R(d,1),d.m(v.parentNode,v)):d=null)},i(e){_||(R(t.$$.fragment,e),R(s.$$.fragment,e),R(c),R(d),_=!0)},o(e){F(t.$$.fragment,e),F(s.$$.fragment,e),F(c),F(d),_=!1},d(e){Q(t,e),e&&h(n),Q(s,e),e&&h(l),e&&h(r),~o&&w[o].d(),e&&h(i),~u&&b[u].d(e),e&&h(v)}}}function yt(e,t,n){let s,l,r,o,c,i,d,f,h;a(e,ve,(e=>n(5,s=e))),a(e,me,(e=>n(6,l=e))),a(e,pe,(e=>n(7,r=e))),a(e,ge,(e=>n(20,o=e))),a(e,_e,(e=>n(21,c=e))),a(e,he,(e=>n(8,i=e))),a(e,ue,(e=>n(9,d=e))),a(e,de,(e=>n(10,f=e))),a(e,fe,(e=>n(11,h=e)));let p,v=[],m=[],g=!1,_="",$=!0;var k;function w(e){n(0,p=e),n(2,g=!0),fetch(`http://giereczka.pl/api/projects/${p}`,{headers:{authorization:`Bearer ${c}`}}).then((e=>e.json())).then((e=>{e.err?u(ge,o="login",o):(n(2,g=!1),u(pe,r=e[0],r),u(ve,s=Object.assign({},e[0]),s),u(ve,s.persons=[],s),e[0].persons.forEach((e=>{s.persons.push(e)})),u(me,l=r.tech_list,l))}))}function y(e){n(4,$=e)}k=()=>{fetch("http://giereczka.pl/api/",{headers:{authorization:`Bearer ${c}`}}).then((e=>e.json())).then((e=>{e.err?u(ge,o="login",o):(u(ue,d=!1,d),n(1,m=e[0]),e[0].persons.forEach((()=>{v.push(!1)})))})),fetch("http://giereczka.pl/api/projects",{headers:{authorization:`Bearer ${c}`}}).then((e=>e.json())).then((e=>{e.err?u(ge,o="login",o):u(he,i=e,i)}))},z().$$.on_mount.push(k);return[p,m,g,_,$,s,l,r,i,d,f,h,v,w,function(e){if(n(3,_=""),console.log(e.detail.data),e.detail.data.err)n(3,_=e.detail.data.err);else{const t={method:"POST",headers:{"Content-Type":"application/json",authorization:`Bearer ${c}`},body:JSON.stringify(e.detail.data.value)};fetch(`http://giereczka.pl/api/${e.detail.data.url}`,t).then((e=>e.json())).then((e=>{e.err?u(ge,o="login",o):"y"==e.res?console.log("Działa"):console.log("Błąd!")}))}},function(e){const t=e.detail.max_results,n=e.detail.min_avg;l.length==e.detail.selected_techs.length?u(me,l=e.detail.selected_techs,l):u(me,l=e.detail.selected_techs.reverse(),l),u(ve,s=Object.assign({},r),s),u(ve,s.persons=[],s),r.persons.forEach((e=>{s.persons.push(e)}));let o=[];if(null!=n&&n>=0)for(s.persons.forEach(((e,t)=>{let s=0;l.forEach((t=>{s+=e[t]})),s/l.length<n&&o.push(t)}));o.length;)s.persons.splice(o.pop(),1);null!=t&&t>=0&&s.persons.length>=t&&u(ve,s.persons.length=t,s)},y,()=>{y(!0)},()=>{y(!1)},e=>w(e.name)]}class xt extends Y{constructor(e){super(),X(this,e,yt,wt,r,{})}}function bt(t){let n,l,r,o,c,i,a,u,g,k,w,b,z,C,O,E,S,j,T;return{c(){n=p("div"),l=p("div"),l.textContent="Login",r=m(),o=p("div"),c=v(t[3]),i=m(),a=p("input"),u=m(),g=p("input"),k=m(),w=p("label"),b=p("input"),z=v(" Remember me"),C=m(),O=p("input"),E=m(),S=p("input"),$(l,"class","svelte-14g164v"),$(o,"class","error svelte-14g164v"),$(a,"type","email"),$(a,"placeholder","email"),$(a,"name","email"),$(a,"class","svelte-14g164v"),$(g,"type","password"),$(g,"placeholder","password"),$(g,"name","password"),$(g,"class","svelte-14g164v"),$(b,"type","checkbox"),$(b,"class","svelte-14g164v"),$(O,"type","submit"),O.value="Login",$(O,"class","svelte-14g164v"),$(S,"type","submit"),S.value="Register",$(S,"class","svelte-14g164v"),$(n,"class","login svelte-14g164v")},m(e,s){f(e,n,s),d(n,l),d(n,r),d(n,o),d(o,c),d(n,i),d(n,a),x(a,t[0]),d(n,u),d(n,g),x(g,t[1]),d(n,k),d(n,w),d(w,b),b.checked=t[2],d(w,z),d(n,C),d(n,O),d(n,E),d(n,S),j||(T=[_(a,"input",t[6]),_(g,"input",t[7]),_(b,"change",t[8]),_(O,"click",t[4]),_(S,"click",t[5])],j=!0)},p(e,[t]){8&t&&y(c,e[3]),1&t&&a.value!==e[0]&&x(a,e[0]),2&t&&g.value!==e[1]&&x(g,e[1]),4&t&&(b.checked=e[2])},i:e,o:e,d(e){e&&h(n),j=!1,s(T)}}}function zt(e,t,n){let s,l,r,o,c;a(e,ge,(e=>n(9,s=e))),a(e,_e,(e=>n(10,l=e)));let i="";return[r,o,c,i,function(){const e={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r,password:o})};fetch("http://giereczka.pl/api/login",e).then((e=>e.json())).then((e=>{if(n(3,i=""),e.err)n(3,i=e.err);else if(e.token){if(c){const t=31536e3.toString();document.cookie="token="+e.token+";max-age="+t}else document.cookie="token="+e.token;console.log(c),u(_e,l=e.token,l),u(ge,s="yes",s)}}))},()=>{u(ge,s="register",s)},function(){r=this.value,n(0,r)},function(){o=this.value,n(1,o)},function(){c=this.checked,n(2,c)}]}class Ct extends Y{constructor(e){super(),X(this,e,zt,bt,r,{})}}function Ot(t){let n,l,r,o,c,i,a,u,g,k,w,b,z,C,O,E,S;return{c(){n=p("div"),l=p("div"),l.textContent="Register",r=m(),o=p("div"),c=v(t[3]),i=m(),a=p("input"),u=m(),g=p("input"),k=m(),w=p("input"),b=m(),z=p("input"),C=m(),O=p("input"),$(l,"class","svelte-1q58mob"),$(o,"class","error svelte-1q58mob"),$(a,"type","email"),$(a,"placeholder","email"),$(a,"name","email"),$(a,"class","svelte-1q58mob"),$(g,"type","password"),$(g,"placeholder","password"),$(g,"name","password"),$(g,"class","svelte-1q58mob"),$(w,"type","password"),$(w,"placeholder","password"),$(w,"name","password2"),$(w,"class","svelte-1q58mob"),$(z,"type","submit"),z.value="Register",$(z,"class","svelte-1q58mob"),$(O,"type","submit"),O.value="Login",$(O,"class","svelte-1q58mob"),$(n,"class","register svelte-1q58mob")},m(e,s){f(e,n,s),d(n,l),d(n,r),d(n,o),d(o,c),d(n,i),d(n,a),x(a,t[0]),d(n,u),d(n,g),x(g,t[1]),d(n,k),d(n,w),x(w,t[2]),d(n,b),d(n,z),d(n,C),d(n,O),E||(S=[_(a,"input",t[6]),_(g,"input",t[7]),_(w,"input",t[8]),_(z,"click",t[4]),_(O,"click",t[5])],E=!0)},p(e,[t]){8&t&&y(c,e[3]),1&t&&a.value!==e[0]&&x(a,e[0]),2&t&&g.value!==e[1]&&x(g,e[1]),4&t&&w.value!==e[2]&&x(w,e[2])},i:e,o:e,d(e){e&&h(n),E=!1,s(S)}}}function Et(e,t,n){let s,l,r,o;a(e,ge,(e=>n(9,s=e)));let c="";return[l,r,o,c,function(){const e={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:l,password:r,password2:o})};fetch("http://giereczka.pl/api/register",e).then((e=>e.json())).then((e=>{n(3,c=""),e.err?n(3,c=e.err):"y"==e.res?u(ge,s="login",s):console.log("error")}))},()=>{u(ge,s="login",s)},function(){l=this.value,n(0,l)},function(){r=this.value,n(1,r)},function(){o=this.value,n(2,o)}]}class St extends Y{constructor(e){super(),X(this,e,Et,Ot,r,{})}}function jt(e){let t,n;return t=new St({}),{c(){I(t.$$.fragment)},m(e,s){K(t,e,s),n=!0},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){Q(t,e)}}}function Tt(e){let t,n;return t=new Ct({}),{c(){I(t.$$.fragment)},m(e,s){K(t,e,s),n=!0},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){Q(t,e)}}}function Mt(e){let t,n;return t=new xt({}),{c(){I(t.$$.fragment)},m(e,s){K(t,e,s),n=!0},i(e){n||(R(t.$$.fragment,e),n=!0)},o(e){F(t.$$.fragment,e),n=!1},d(e){Q(t,e)}}}function Nt(e){let t,n,s,l;const r=[Mt,Tt,jt],o=[];function c(e,t){return"yes"==e[0]?0:"login"==e[0]?1:"register"==e[0]?2:-1}return~(t=c(e))&&(n=o[t]=r[t](e)),{c(){n&&n.c(),s=g()},m(e,n){~t&&o[t].m(e,n),f(e,s,n),l=!0},p(e,[l]){let i=t;t=c(e),t!==i&&(n&&(V(),F(o[i],1,1,(()=>{o[i]=null})),H()),~t?(n=o[t],n||(n=o[t]=r[t](e),n.c()),R(n,1),n.m(s.parentNode,s)):n=null)},i(e){l||(R(n),l=!0)},o(e){F(n),l=!1},d(e){~t&&o[t].d(e),e&&h(s)}}}function Lt(e,t,n){let s,l;return a(e,ge,(e=>n(0,s=e))),a(e,_e,(e=>n(1,l=e))),document.cookie.split("; ").forEach((e=>{"token"==e.split("=")[0]&&u(_e,l=e.split("=")[1],l)})),l||u(ge,s="login",s),[s]}return new class extends Y{constructor(e){super(),X(this,e,Lt,Nt,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
