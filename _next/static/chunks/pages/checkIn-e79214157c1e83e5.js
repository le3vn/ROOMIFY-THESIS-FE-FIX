(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[470],{3170:function(e,s,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/checkIn",function(){return t(1171)}])},1171:function(e,s,t){"use strict";t.r(s);var n=t(5893),c=t(7294),r=t(1163),a=t(161),l=t(1061),i=t(7814),u=t(9417),d=t(6738),o=t(6551),h=t(3299);let x=()=>{let e=(0,r.useRouter)();(0,h.useSession)();let[s,t]=(0,c.useState)(""),[a,x]=(0,c.useState)(!1),[f,p]=(0,c.useState)(null),[k,m]=(0,c.useState)(""),{fetchPOST:g}=(0,o.L)(),b=e=>{t(e.target.value)},N=()=>{e.back()},j=async()=>{if(!s){p("Please provide the required input.");return}x(!0),p(null);try{let t=await g(l.j.checkIn,{bookingId:s});t.data?(m("Check-In successful!"),e.push("/dashboardApprover")):p("Failed to check-in. Please try again.")}catch(e){console.error("Check-in error:",e),p("An error occurred during check-in.")}finally{x(!1)}};return(0,n.jsxs)("div",{className:"mt-4",children:[(0,n.jsx)("button",{className:"bg-white rounded-full w-10 h-10 flex items-center justify-center mb-10",onClick:N,children:(0,n.jsx)(i.G,{icon:u.A35,className:"inline"})}),(0,n.jsx)("img",{src:"/Assets/images/check-in.png",alt:"",className:"mb-6 h-12"}),(0,n.jsx)("div",{className:"h-[670px] grid grid-rows-2",children:(0,n.jsxs)("div",{className:"flex flex-col gap-6 items-center justify-end",children:[(0,n.jsx)(d.Z,{type:"text",className:"w-4/5 h-[50px] text-lg",value:s,onChange:b,placeholder:"Enter Check-In Data"}),f&&(0,n.jsx)("p",{className:"text-red-500",children:f}),k&&(0,n.jsx)("p",{className:"text-green-500",children:k}),(0,n.jsx)("button",{className:"bg-[#EB8317] border-4 border-[#d68530] text-3xl w-[200px] font-semibold text-white rounded-xl py-1",onClick:j,disabled:a,children:a?"Checking In...":"Check-in"})]})})]})};x.layout=a.f,s.default=x}},function(e){e.O(0,[976,634,738,161,774,888,179],function(){return e(e.s=3170)}),_N_E=e.O()}]);
//# sourceMappingURL=checkIn-e79214157c1e83e5.js.map