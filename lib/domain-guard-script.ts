import { HOST_KEY, LOOP_KEY, LOOP_MS, OFFICIAL_HOST_CODES, PRIVATE_IPV4, PRIVATE_IPV6 } from "./official-host";

// Lớp chống sao chép thứ nhất: script inline đầu <head>, chạy trước cả khi React tải.
// Trang bị chép sang tên miền khác → báo động về tên miền chính rồi chuyển khách về website chính chủ.
// Lớp thứ hai là guardDomain() (components/DomainGuard.tsx), phòng khi bản chép gỡ script này.
// Logic PHẢI khớp isOfficialHost() + guardDomain() trong lib/official-host.ts.
export const DOMAIN_GUARD_SCRIPT =
  `(function(){try{` +
  `var C=${JSON.stringify(OFFICIAL_HOST_CODES)},H=[],i,j,s,l=location,d=document;` +
  `if(!C.length)return;` +
  `for(i=0;i<C.length;i++){s="";for(j=0;j<C[i].length;j++)s+=String.fromCharCode(C[i][j]^${HOST_KEY});H.push(s)}` +
  `var n=(l.hostname||"").toLowerCase().replace(/\\.$/,"");` +
  `if(n==="localhost"||n==="::1"||n==="web.archive.org"||/\\.local$/.test(n)||new RegExp(${JSON.stringify(PRIVATE_IPV4.source)}).test(n)||new RegExp(${JSON.stringify(PRIVATE_IPV6.source)}).test(n))return;` +
  `function t(x){return x.replace(/-/g,"--").replace(/\\./g,"-")+".translate.goog"}` +
  `for(i=0;i<H.length;i++){s=H[i].replace(/^www\\./,"");if(n===s||n==="www."+s||n===t(s)||n===t("www."+s))return}` +
  `var o="https://"+H[0],S=null,m=null;` +
  `try{S=sessionStorage;m=S.getItem("${LOOP_KEY}")}catch(e){}` +
  `if(m==="loop")return;` +
  `try{navigator.sendBeacon&&navigator.sendBeacon(o+"/api/beacon",JSON.stringify({h:n,u:l.href.slice(0,500),r:(d.referrer||"").slice(0,300)}))}catch(e){}` +
  `if(m&&Date.now()-Number(m)<${LOOP_MS}){try{S.setItem("${LOOP_KEY}","loop")}catch(e){}return}` +
  `try{S&&S.setItem("${LOOP_KEY}",String(Date.now()))}catch(e){}` +
  `l.replace(o+(n?l.pathname+l.search+l.hash:"/"))` +
  `}catch(e){}})();`;
