(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[604],{7484:function(e){var s,t,l,n,i,r,a,c,d,o,u,h,x,f,m,p,j,g,v,b,N;e.exports=(s="millisecond",t="second",l="minute",n="hour",i="week",r="month",a="quarter",c="year",d="date",o="Invalid Date",u=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,h=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,x=function(e,s,t){var l=String(e);return!l||l.length>=s?e:""+Array(s+1-l.length).join(t)+e},(m={})[f="en"]={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var s=["th","st","nd","rd"],t=e%100;return"["+e+(s[(t-20)%10]||s[t]||"th")+"]"}},p=function(e){return e instanceof b},j=function e(s,t,l){var n;if(!s)return f;if("string"==typeof s){var i=s.toLowerCase();m[i]&&(n=i),t&&(m[i]=t,n=i);var r=s.split("-");if(!n&&r.length>1)return e(r[0])}else{var a=s.name;m[a]=s,n=a}return!l&&n&&(f=n),n||!l&&f},g=function(e,s){if(p(e))return e.clone();var t="object"==typeof s?s:{};return t.date=e,t.args=arguments,new b(t)},(v={s:x,z:function(e){var s=-e.utcOffset(),t=Math.abs(s);return(s<=0?"+":"-")+x(Math.floor(t/60),2,"0")+":"+x(t%60,2,"0")},m:function e(s,t){if(s.date()<t.date())return-e(t,s);var l=12*(t.year()-s.year())+(t.month()-s.month()),n=s.clone().add(l,r),i=t-n<0,a=s.clone().add(l+(i?-1:1),r);return+(-(l+(t-n)/(i?n-a:a-n))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return({M:r,y:c,w:i,d:"day",D:d,h:n,m:l,s:t,ms:s,Q:a})[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}}).l=j,v.i=p,v.w=function(e,s){return g(e,{locale:s.$L,utc:s.$u,x:s.$x,$offset:s.$offset})},N=(b=function(){function e(e){this.$L=j(e.locale,null,!0),this.parse(e)}var x=e.prototype;return x.parse=function(e){this.$d=function(e){var s=e.date,t=e.utc;if(null===s)return new Date(NaN);if(v.u(s))return new Date;if(s instanceof Date)return new Date(s);if("string"==typeof s&&!/Z$/i.test(s)){var l=s.match(u);if(l){var n=l[2]-1||0,i=(l[7]||"0").substring(0,3);return t?new Date(Date.UTC(l[1],n,l[3]||1,l[4]||0,l[5]||0,l[6]||0,i)):new Date(l[1],n,l[3]||1,l[4]||0,l[5]||0,l[6]||0,i)}}return new Date(s)}(e),this.$x=e.x||{},this.init()},x.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},x.$utils=function(){return v},x.isValid=function(){return this.$d.toString()!==o},x.isSame=function(e,s){var t=g(e);return this.startOf(s)<=t&&t<=this.endOf(s)},x.isAfter=function(e,s){return g(e)<this.startOf(s)},x.isBefore=function(e,s){return this.endOf(s)<g(e)},x.$g=function(e,s,t){return v.u(e)?this[s]:this.set(t,e)},x.unix=function(){return Math.floor(this.valueOf()/1e3)},x.valueOf=function(){return this.$d.getTime()},x.startOf=function(e,s){var a=this,o=!!v.u(s)||s,u=v.p(e),h=function(e,s){var t=v.w(a.$u?Date.UTC(a.$y,s,e):new Date(a.$y,s,e),a);return o?t:t.endOf("day")},x=function(e,s){return v.w(a.toDate()[e].apply(a.toDate("s"),(o?[0,0,0,0]:[23,59,59,999]).slice(s)),a)},f=this.$W,m=this.$M,p=this.$D,j="set"+(this.$u?"UTC":"");switch(u){case c:return o?h(1,0):h(31,11);case r:return o?h(1,m):h(0,m+1);case i:var g=this.$locale().weekStart||0,b=(f<g?f+7:f)-g;return h(o?p-b:p+(6-b),m);case"day":case d:return x(j+"Hours",0);case n:return x(j+"Minutes",1);case l:return x(j+"Seconds",2);case t:return x(j+"Milliseconds",3);default:return this.clone()}},x.endOf=function(e){return this.startOf(e,!1)},x.$set=function(e,i){var a,o=v.p(e),u="set"+(this.$u?"UTC":""),h=((a={}).day=u+"Date",a[d]=u+"Date",a[r]=u+"Month",a[c]=u+"FullYear",a[n]=u+"Hours",a[l]=u+"Minutes",a[t]=u+"Seconds",a[s]=u+"Milliseconds",a)[o],x="day"===o?this.$D+(i-this.$W):i;if(o===r||o===c){var f=this.clone().set(d,1);f.$d[h](x),f.init(),this.$d=f.set(d,Math.min(this.$D,f.daysInMonth())).$d}else h&&this.$d[h](x);return this.init(),this},x.set=function(e,s){return this.clone().$set(e,s)},x.get=function(e){return this[v.p(e)]()},x.add=function(e,s){var a,d=this;e=Number(e);var o=v.p(s),u=function(s){var t=g(d);return v.w(t.date(t.date()+Math.round(s*e)),d)};if(o===r)return this.set(r,this.$M+e);if(o===c)return this.set(c,this.$y+e);if("day"===o)return u(1);if(o===i)return u(7);var h=((a={})[l]=6e4,a[n]=36e5,a[t]=1e3,a)[o]||1,x=this.$d.getTime()+e*h;return v.w(x,this)},x.subtract=function(e,s){return this.add(-1*e,s)},x.format=function(e){var s=this,t=this.$locale();if(!this.isValid())return t.invalidDate||o;var l=e||"YYYY-MM-DDTHH:mm:ssZ",n=v.z(this),i=this.$H,r=this.$m,a=this.$M,c=t.weekdays,d=t.months,u=function(e,t,n,i){return e&&(e[t]||e(s,l))||n[t].slice(0,i)},x=function(e){return v.s(i%12||12,e,"0")},f=t.meridiem||function(e,s,t){var l=e<12?"AM":"PM";return t?l.toLowerCase():l},m={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:v.s(a+1,2,"0"),MMM:u(t.monthsShort,a,d,3),MMMM:u(d,a),D:this.$D,DD:v.s(this.$D,2,"0"),d:String(this.$W),dd:u(t.weekdaysMin,this.$W,c,2),ddd:u(t.weekdaysShort,this.$W,c,3),dddd:c[this.$W],H:String(i),HH:v.s(i,2,"0"),h:x(1),hh:x(2),a:f(i,r,!0),A:f(i,r,!1),m:String(r),mm:v.s(r,2,"0"),s:String(this.$s),ss:v.s(this.$s,2,"0"),SSS:v.s(this.$ms,3,"0"),Z:n};return l.replace(h,function(e,s){return s||m[e]||n.replace(":","")})},x.utcOffset=function(){return-(15*Math.round(this.$d.getTimezoneOffset()/15))},x.diff=function(e,s,d){var o,u=v.p(s),h=g(e),x=(h.utcOffset()-this.utcOffset())*6e4,f=this-h,m=v.m(this,h);return m=((o={})[c]=m/12,o[r]=m,o[a]=m/3,o[i]=(f-x)/6048e5,o.day=(f-x)/864e5,o[n]=f/36e5,o[l]=f/6e4,o[t]=f/1e3,o)[u]||f,d?m:v.a(m)},x.daysInMonth=function(){return this.endOf(r).$D},x.$locale=function(){return m[this.$L]},x.locale=function(e,s){if(!e)return this.$L;var t=this.clone(),l=j(e,s,!0);return l&&(t.$L=l),t},x.clone=function(){return v.w(this.$d,this)},x.toDate=function(){return new Date(this.valueOf())},x.toJSON=function(){return this.isValid()?this.toISOString():null},x.toISOString=function(){return this.$d.toISOString()},x.toString=function(){return this.$d.toUTCString()},e}()).prototype,g.prototype=N,[["$ms",s],["$s",t],["$m",l],["$H",n],["$W","day"],["$M",r],["$y",c],["$D",d]].forEach(function(e){N[e[1]]=function(s){return this.$g(s,e[0],e[1])}}),g.extend=function(e,s){return e.$i||(e(s,b,g),e.$i=!0),g},g.locale=j,g.isDayjs=p,g.unix=function(e){return g(1e3*e)},g.en=m[f],g.Ls=m,g.p={},g)},5624:function(e,s,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/approverDetail/[id]",function(){return t(7481)}])},2898:function(e,s,t){"use strict";var l=t(5893),n=t(9417),i=t(7814),r=t(7294);let a=e=>{let{isOpen:s,onClose:t,minioUrl:a}=e;return((0,r.useEffect)(()=>(s?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[s]),s)?(0,l.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",children:(0,l.jsxs)("div",{className:"bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-auto",children:[(0,l.jsx)("div",{className:"flex justify-end",children:(0,l.jsx)("button",{className:"bg-gray-200 w-10 h-10 rounded-full",onClick:t,children:(0,l.jsx)(i.G,{icon:n.EOp})})}),(0,l.jsx)("div",{className:"flex justify-center items-center h-full p-6",children:(0,l.jsx)("img",{src:a,alt:"Evidence Preview",className:"max-w-full max-h-full"})})]})}):null};s.Z=a},7481:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return w}});var l=t(5893),n=t(7294),i=t(1163),r=t(3939),a=t(161),c=t(1061),d=t(9734),o=t(7814),u=t(9417),h=t(7484),x=t.n(h),f=t(2898),m=t(3299),p=t(6551);let j=e=>{let{isOpen:s,onApprove:t,onClose:n}=e;return s?(0,l.jsxs)("div",{className:"fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-auto ".concat(s?"":"hidden"),children:[(0,l.jsx)("div",{className:"bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4",children:(0,l.jsx)("img",{src:"/Assets/images/are-you-sure.png",alt:"",className:"w-[200px] rounded-full"})}),(0,l.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-2/5",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("div",{className:"h-2/3 flex flex-col justify-end",children:(0,l.jsxs)("div",{className:"flex flex-col items-center",children:[(0,l.jsx)("h1",{className:"text-2xl font-bold",children:"Approve Booking ?"}),(0,l.jsx)("h4",{className:"text-center",children:"Make sure to check the booking details carefully :)"})]})}),(0,l.jsx)("div",{className:"h-1/3 flex items-center justify-center",children:(0,l.jsxs)("div",{className:"flex gap-4",children:[(0,l.jsx)("button",{className:"bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold",onClick:t,children:"Approve"}),(0,l.jsx)("button",{className:"bg-gray-200 h-[50px] w-[150px] rounded-full text-black text-lg font-semibold",onClick:n,children:"Cancel"})]})})]})})]}):null},g=e=>{let{isOpen:s,onClose:t}=e;return s?(0,l.jsxs)("div",{className:"fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-auto ".concat(s?"":"hidden"),children:[(0,l.jsx)("div",{className:"bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4",children:(0,l.jsx)("img",{src:"/Assets/images/succeed.png",alt:"",className:"w-[200px] rounded-full"})}),(0,l.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-2/5",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("div",{className:"h-2/3 flex flex-col justify-end",children:(0,l.jsxs)("div",{className:"flex flex-col items-center px-8",children:[(0,l.jsx)("h1",{className:"text-2xl font-bold",children:"This booking is approved"}),(0,l.jsx)("h4",{className:"text-center",children:"Check menu history for your approvals history :)"})]})}),(0,l.jsx)("div",{className:"h-1/3 flex items-center justify-center",children:(0,l.jsx)("div",{className:"flex gap-4",children:(0,l.jsx)("button",{className:"bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold",onClick:t,children:"Okay, Great!"})})})]})})]}):null},v=e=>{let{isOpen:s,onReject:t,onClose:n,rejectMessage:i,onRejectMessageChange:r}=e;return s?(0,l.jsxs)("div",{className:"fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40 z-50 ".concat(s?"":"hidden"),children:[(0,l.jsx)("div",{className:"bg-purple-950 p-4 absolute top-11 rounded-full border-white border-4",children:(0,l.jsx)("img",{src:"/Assets/images/person-writing.png",alt:"",className:"w-[200px] rounded-full"})}),(0,l.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-3/5",children:(0,l.jsxs)("div",{className:" h-full flex flex-col justify-between",children:[(0,l.jsxs)("div",{className:"grid grid-row-2 gap-0 max-h-[200px]",children:[(0,l.jsx)("div",{className:"h-[100px]",children:(0,l.jsx)("div",{className:"flex justify-end",children:(0,l.jsx)("button",{className:"bg-gray-200 w-10 h-10 rounded-full",onClick:n,children:(0,l.jsx)(o.G,{icon:u.EOp})})})}),(0,l.jsx)("div",{className:"flex justify-center items-center h-[100px]",children:(0,l.jsx)("p",{className:"text-2xl font-bold",children:"Input Reject Message"})})]}),(0,l.jsx)("div",{className:"h-full flex flex-col",children:(0,l.jsx)("textarea",{value:i,onChange:e=>r(e.target.value),placeholder:"Type your rejection message here...",className:"h-[150px] rounded-lg border p-2"})}),(0,l.jsxs)("div",{className:"gap-4 flex justify-end",children:[(0,l.jsx)("button",{className:"bg-purple-950 text-white font-semibold w-[100px] py-1 text-lg rounded-full",onClick:t,children:"Submit"}),(0,l.jsx)("button",{className:"bg-red-600 text-white font-semibold w-[100px] py-1 text-lg rounded-full",onClick:n,children:"Cancel"})]})]})})]}):null},b=e=>{let{isOpen:s,onConfirm:t,onCancel:n}=e;return s?(0,l.jsxs)("div",{className:"fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-auto ".concat(s?"":"hidden"),children:[(0,l.jsx)("div",{className:"bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4",children:(0,l.jsx)("img",{src:"/Assets/images/are-you-sure.png",alt:"",className:"w-[200px] rounded-full"})}),(0,l.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-2/5",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("div",{className:"h-2/3 flex flex-col justify-end",children:(0,l.jsxs)("div",{className:"flex flex-col items-center",children:[(0,l.jsx)("h1",{className:"text-2xl font-bold",children:"Reject Booking ?"}),(0,l.jsx)("h4",{className:"text-center",children:"Make sure to check the booking details carefully :)"})]})}),(0,l.jsx)("div",{className:"h-1/3 flex items-center justify-center",children:(0,l.jsxs)("div",{className:"flex gap-4",children:[(0,l.jsx)("button",{className:"bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold",onClick:t,children:"Reject"}),(0,l.jsx)("button",{className:"bg-gray-200 h-[50px] w-[150px] rounded-full text-black text-lg font-semibold",onClick:n,children:"Cancel"})]})})]})})]}):null},N=e=>{let{isOpen:s,onClose:t}=e;return s?(0,l.jsxs)("div",{className:"fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-20 z-auto ".concat(s?"":"hidden"),children:[(0,l.jsx)("div",{className:"bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4",children:(0,l.jsx)("img",{src:"/Assets/images/yes-okay.png",alt:"",className:"w-[200px] rounded-full"})}),(0,l.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-2/5",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("div",{className:"h-2/3 flex flex-col justify-end",children:(0,l.jsxs)("div",{className:"flex flex-col items-center px-8",children:[(0,l.jsx)("h1",{className:"text-2xl font-bold",children:"This Booking is Rejected"}),(0,l.jsx)("h4",{className:"text-center",children:"The reject message has been sent. Thanks for your time in reviewing the booking :)"})]})}),(0,l.jsx)("div",{className:"h-1/3 flex items-center justify-center",children:(0,l.jsx)("div",{className:"flex gap-4",children:(0,l.jsx)("button",{className:"bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold",onClick:t,children:"Okay, Great !"})})})]})})]}):null},y=()=>{var e,s,t;let a=(0,i.useRouter)(),{id:h}=a.query,[y,w]=(0,n.useState)(!1),[$,k]=(0,n.useState)(""),S=(0,r.f)(),[M,D]=(0,n.useState)(!1),[C,O]=(0,n.useState)(!1),[_,I]=(0,n.useState)(!1),[A,R]=(0,n.useState)(!1),[T,L]=(0,n.useState)(!1),[E,H]=(0,n.useState)(""),{data:Y}=(0,m.useSession)(),U=null==Y?void 0:Y.user,z=null==U?void 0:U.id,{fetchPOST:B}=(0,p.L)(),{data:W}=(0,d.ZP)("".concat(c.j.getBookingDetail,"?BookingId=").concat(h),S),q=async()=>{let e={userId:z,bookingId:null==X?void 0:X.bookingId,isApproved:!0,rejectMessage:""},s=await B(c.j.approveBooking,e);s&&(D(!1),I(!0))},G=()=>{L(!1),O(!0)},Z=()=>{L(!1)},P=e=>{H(e)},F=async()=>{if(!E.trim()){alert("Please enter a rejection message.");return}let e=document.createElement("div");e.innerHTML=E;let s=e.textContent||e.innerText,t={userId:z,bookingId:null==X?void 0:X.bookingId,isApproved:!1,rejectMessage:s.trim()},l=await B(c.j.approveBooking,t);l&&(O(!1),R(!0))},J=()=>{R(!1),a.push("/approverHistory")},V=()=>{I(!1),a.push("/approverHistory")},X=null==W?void 0:W.bookingDetailModel[0],Q=(null==X?void 0:X.bookingDate)?x()(X.bookingDate):null,K=Q?Q.format("ddd"):"N/A",ee=Q?Q.format("DD"):"N/A",es=Q?Q.format("MMM").toUpperCase():"N/A",et=Q?Q.format("YYYY"):"N/A",el=()=>{a.back()},en=e=>{k(e),w(!0)},ei=e=>{if(!e){console.error("Booking data is not available.");return}let s="EVIDENCE_".concat(e.bookingDescription,"_").concat(e.bookingInstitutionalId,"_").concat(e.name);("Staff"===e.userRole||"StudentOrganization"===e.userRole)&&(s+="_".concat(e.bookingOrganizationName));let t=e.minioUrl.split(".").pop();s+=".".concat(t);let l=document.createElement("a");l.href=e.minioUrl,l.download=s,l.click()};return(0,l.jsxs)("div",{className:"mt-4",children:[(0,l.jsx)("button",{className:"bg-white rounded-full w-10 h-10 flex items-center justify-center",onClick:el,children:(0,l.jsx)(o.G,{icon:u.A35,className:"inline"})}),(0,l.jsxs)("div",{className:"mt-8 flex h-[640px] gap-4",children:[(0,l.jsx)("div",{className:"w-1/6 h-full",children:(0,l.jsxs)("div",{className:"flex flex-col h-full justify-between gap-4",children:[(0,l.jsx)("div",{className:"bg-white rounded-lg h-[150px] p-4",children:(0,l.jsx)("div",{className:"text-center flex flex-col items-center h-full justify-center",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("p",{className:"mb-6 text-sm",children:"Room Name"}),(0,l.jsx)("div",{className:"flex flex-col items-center",children:(0,l.jsx)("p",{className:"text-3xl font-semibold text-purple-950",children:null==X?void 0:X.roomName})})]})})}),(0,l.jsx)("div",{className:"bg-white rounded-lg h-[150px] p-4",children:(0,l.jsxs)("div",{className:"h-full flex flex-col items-center justify-between",children:[(0,l.jsx)("p",{className:"text-sm",children:"Submitted By"}),(0,l.jsx)("img",{src:null==X?void 0:X.bookerMinioUrl,alt:"",className:"w-8 h-8 rounded-full border-2 border-purple-950"}),(null==X?void 0:X.userRole)==="Staff"||(null==X?void 0:X.userRole)==="StudentOrganization"?(0,l.jsxs)("div",{className:"flex flex-col items-center",children:[(0,l.jsx)("p",{className:"text-sm font-semibold",children:null==X?void 0:X.bookingInstitutionalId}),(0,l.jsx)("p",{className:"text-sm",children:null==X?void 0:X.name}),(0,l.jsx)("p",{className:"text-sm truncate",children:null==X?void 0:X.bookingOrganizationName})]}):(0,l.jsxs)("div",{children:[(0,l.jsx)("p",{children:null==X?void 0:X.bookingInstitutionalId}),(0,l.jsx)("p",{className:"text-sm font-semibold truncate",children:null==X?void 0:X.name})]})]})}),(0,l.jsx)("div",{className:"bg-white rounded-lg h-[150px] p-4",children:(0,l.jsx)("div",{className:"h-full",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("div",{className:"bg-purple-950 h-2/5 rounded-t-xl p-1 border-2 border-purple-950",children:(0,l.jsxs)("div",{className:"flex flex-col items-center",children:[(0,l.jsx)("p",{className:"text-xs text-white",children:et}),(0,l.jsx)("p",{className:"text-base text-white",children:es})]})}),(0,l.jsx)("div",{className:"h-3/5 rounded-b-xl flex flex-col justify-center p-1 border-2 border-purple-950",children:(0,l.jsxs)("div",{className:"flex flex-col items-center",children:[(0,l.jsx)("p",{className:"".concat("Sun"==K?"text-4xl text-red-600":"text-4xl text-black"),children:ee}),(0,l.jsx)("p",{className:"".concat("Sun"==K?"text-base text-red-600":"text-base text-black"),children:K})]})})]})})}),(0,l.jsx)("div",{className:"bg-white rounded-lg h-[150px] p-4",children:(0,l.jsx)("div",{className:"text-center flex flex-col items-center h-full justify-center",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("p",{className:"mb-9 text-sm",children:"Evidence"}),(0,l.jsxs)("div",{className:"flex items-center gap-4",children:[(0,l.jsx)("button",{className:"w-8 h-8 rounded-full \n                                            ".concat((null==X?void 0:X.userRole)=="Staff"||(null==X?void 0:X.userRole)=="Student"||(null==X?void 0:X.userRole)=="Lecturer"?"bg-gray-200 border-2 border-gray-400":"bg-purple-950"),onClick:()=>en((null==X?void 0:X.minioUrl)||""),disabled:(null==X?void 0:X.userRole)=="Staff"||(null==X?void 0:X.userRole)=="Student"||(null==X?void 0:X.userRole)=="Lecturer",children:(0,l.jsx)(o.G,{icon:u.Mdf,className:"inline text-white"})}),(0,l.jsx)("button",{className:"w-8 h-8 rounded-full \n                                            ".concat((null==X?void 0:X.userRole)=="Staff"||(null==X?void 0:X.userRole)=="Student"||(null==X?void 0:X.userRole)=="Lecturer"?"bg-gray-200 border-2 border-gray-400":"bg-purple-950"),onClick:()=>X?ei(X):null,disabled:(null==X?void 0:X.userRole)=="Staff"||(null==X?void 0:X.userRole)=="Student"||(null==X?void 0:X.userRole)=="Lecturer",children:(0,l.jsx)(o.G,{icon:u.q7m,className:"inline text-white"})})]})]})})})]})}),(0,l.jsxs)("div",{className:"flex flex-col gap-4 w-full",children:[(0,l.jsxs)("div",{className:"h-3/5 flex gap-4",children:[(0,l.jsxs)("div",{className:"w-2/5 flex flex-col gap-4",children:[(0,l.jsx)("div",{className:"bg-white rounded-lg h-2/6 p-4",children:(0,l.jsxs)("div",{className:" h-full flex flex-col",children:[(0,l.jsx)("p",{className:"text-sm",children:"Event Name"}),(0,l.jsx)("div",{className:" h-full flex flex-col justify-center",children:(0,l.jsxs)("div",{className:"flex",children:[(0,l.jsx)("p",{children:'"'}),(0,l.jsx)("p",{className:"text-lg font-semibold",children:null==X?void 0:X.bookingDescription}),(0,l.jsx)("p",{children:'"'})]})})]})}),(0,l.jsx)("div",{className:"bg-white rounded-lg h-4/6 p-4",children:(0,l.jsxs)("div",{className:"h-full",children:[(0,l.jsx)("p",{className:"text-sm mb-4",children:"Session Booked"}),(null==X?void 0:null===(e=X.sessionList)||void 0===e?void 0:e.length)?(0,l.jsx)("div",{className:"grid grid-cols-2 gap-2",children:X.sessionList.map(e=>{var s,t;let n=e.sessionName.match(/^(.*?)(\s*\(.*\))$/),i=n?null===(s=n[1])||void 0===s?void 0:s.trim():e.sessionName,r=n?null===(t=n[2])||void 0===t?void 0:t.trim():"";return(0,l.jsxs)("div",{className:"flex ".concat(1==e.sessionId?"bg-red-800 border-red-900":2==e.sessionId?"bg-orange-800 border-orange-900":3==e.sessionId?"bg-yellow-600 border-yellow-700":4==e.sessionId?"bg-emerald-800 border-emerald-900":5==e.sessionId?"bg-blue-900 border-blue-950":6==e.sessionId&&"bg-pink-700 border-pink-800"," flex-col items-center rounded-full py-1 border-4"),children:[(0,l.jsx)("p",{className:"text-sm text-white ",children:i}),(0,l.jsx)("p",{className:"text-sm text-white",children:r})]},e.sessionId)})}):(0,l.jsx)("p",{children:"No sessions booked."})]})})]}),(0,l.jsx)("div",{className:"bg-white rounded-lg w-3/5 p-4",children:(0,l.jsx)("div",{className:"h-full",children:(0,l.jsx)("img",{src:null==X?void 0:X.roomMinioUrl,alt:"",className:"h-full w-full object-cover rounded-lg"})})})]}),(0,l.jsxs)("div",{className:"flex h-2/5 w-full gap-4",children:[(0,l.jsxs)("div",{className:"w-3/5 grid grid-cols-2 gap-4",children:[(0,l.jsx)("div",{className:"bg-white rounded-lg p-4",children:(0,l.jsxs)("div",{className:"h-full flex flex-col",children:[(0,l.jsx)("p",{className:"text-sm",children:"Approval History"}),(null==X?void 0:null===(s=X.sessionList)||void 0===s?void 0:s.length)?(0,l.jsx)("div",{className:"flex flex-col mt-6 h-full justify-end",children:(0,l.jsx)("div",{className:"flex flex-col gap-2 h-4/5",children:null==X?void 0:X.approverHistory.map(e=>(0,l.jsx)("div",{children:(0,l.jsxs)("div",{className:"flex gap-2 items-center",children:[(0,l.jsx)("img",{src:e.approverMinioUrl,alt:"",className:"w-8 h-8 rounded-full border-2 ".concat(1==e.statusId?"border-yellow-600":2==e.statusId?"border-green-600":"border-red-600")}),(0,l.jsx)("p",{children:e.approverUserName})]})},e.approverUserId))})}):(0,l.jsx)("p",{children:"No Approval History."})]})}),(0,l.jsx)("div",{className:"bg-white rounded-lg p-4",children:(0,l.jsxs)("div",{className:"flex flex-col h-full",children:[(0,l.jsx)("p",{className:"text-sm",children:"Technical Support"}),(null==X?void 0:null===(t=X.equipmentList)||void 0===t?void 0:t.length)?(0,l.jsx)("div",{className:"flex flex-col mt-6 h-full justify-end",children:(0,l.jsx)("div",{className:"flex flex-col gap-4 h-4/5 items-center",children:null==X?void 0:X.equipmentList.map(e=>(0,l.jsx)("div",{children:(0,l.jsx)("div",{className:"bg-blue-800 border-4 border-blue-900 w-[150px] flex items-center justify-center py-2 rounded-full",children:(0,l.jsx)("p",{className:"text-white",children:e.equipmentName})})},e.equipmentId))})}):(0,l.jsx)("p",{children:"No Equipment booked."})]})})]}),(0,l.jsx)("div",{className:"bg-white rounded-lg w-2/5 p-4",children:(0,l.jsxs)("div",{className:"h-full flex flex-col",children:[(0,l.jsx)("p",{className:"text-sm",children:"Actions"}),(0,l.jsx)("div",{className:"flex flex-col h-full justify-center",children:(0,l.jsxs)("div",{className:"flex justify-center gap-4",children:[(0,l.jsx)("button",{className:"bg-purple-950 w-[120px] py-2 rounded-full text-white font-semibold",onClick:()=>D(!0),children:"Approve"}),(0,l.jsx)("button",{className:"bg-red-600 w-[120px] py-2 rounded-full text-white font-semibold",onClick:()=>L(!0),children:"Reject"})]})})]})})]})]})]}),(0,l.jsx)(f.Z,{isOpen:y,onClose:()=>w(!1),minioUrl:$}),(0,l.jsx)(j,{isOpen:M,onApprove:q,onClose:()=>D(!1)}),(0,l.jsx)(g,{isOpen:_,onClose:V}),(0,l.jsx)(b,{isOpen:T,onConfirm:G,onCancel:Z}),(0,l.jsx)(v,{isOpen:C,onReject:F,onClose:()=>O(!1),rejectMessage:E,onRejectMessageChange:P}),(0,l.jsx)(N,{isOpen:A,onClose:J})]})};y.layout=a.f;var w=y}},function(e){e.O(0,[976,634,161,774,888,179],function(){return e(e.s=5624)}),_N_E=e.O()}]);
//# sourceMappingURL=[id]-f485575c6d0792b6.js.map