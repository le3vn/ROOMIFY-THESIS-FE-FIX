(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[120],{6607:function(e){e.exports=function(e,t,s){t.prototype.isBetween=function(e,t,a,i){var n=s(e),o=s(t),l="("===(i=i||"()")[0],r=")"===i[1];return(l?this.isAfter(n,a):!this.isBefore(n,a))&&(r?this.isBefore(o,a):!this.isAfter(o,a))||(l?this.isBefore(n,a):!this.isAfter(n,a))&&(r?this.isAfter(o,a):!this.isBefore(o,a))}}},2964:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/room/[id]",function(){return s(7004)}])},7286:function(e,t,s){"use strict";var a=s(5893);s(7294);var i=s(5675),n=s.n(i);let o=()=>(0,a.jsxs)("div",{className:"flex flex-col items-center",children:[(0,a.jsx)(n(),{src:"/Assets/images/font-title-master.png",alt:"Title Master",width:720,height:100}),(0,a.jsxs)("div",{className:"text-center mt-2",children:[(0,a.jsx)("p",{className:"text-white text-sm",children:"Unlock the door to convenience with Roomify. : Where booking a room becomes"}),(0,a.jsx)("p",{className:"text-white text-sm",children:"as effortless as turning the key."})]})]});t.Z=o},4372:function(e,t,s){"use strict";var a=s(5893),i=s(7294),n=s(2453),o=s(5081),l=s(7828),r=s(6551),d=s(1061),c=s(7814),u=s(9417);let m=e=>{let{isOpen:t,onClose:s,roomId:m,roomName:x}=e,{fetchGET:f}=(0,r.L)(),[h,v]=(0,i.useState)(void 0),[b,g]=(0,i.useState)(!1);(0,i.useEffect)(()=>{t&&j()},[t,m]);let j=async()=>{g(!0);try{var e;let t=await f("".concat(d.j.getRoomSchedule,"?id=").concat(m));console.log(t.data),t&&(null===(e=t.data)||void 0===e?void 0:e.scheduleList)?v(t.data):n.ZP.error("No schedule data available.")}catch(e){console.error("Error fetching schedule data:",e),n.ZP.error("Failed to fetch room schedule. Please try again later.")}finally{g(!1)}};return t?(0,a.jsx)("div",{className:"fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50",children:(0,a.jsxs)("div",{className:"bg-white p-8 rounded-lg w-3/5",children:[(0,a.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,a.jsx)("h2",{className:"text-2xl font-bold",children:x}),(0,a.jsx)("button",{className:"bg-gray-200 w-10 h-10 rounded-full",onClick:s,children:(0,a.jsx)(c.G,{icon:u.EOp})})]}),b?(0,a.jsx)("div",{className:"flex justify-center items-center",children:(0,a.jsx)(o.Z,{size:"large"})}):(0,a.jsx)(l.Z,{columns:[{title:"Date",dataIndex:"bookingDate",key:"bookingDate"},{title:"Start Time",dataIndex:"bookingTimeStart",key:"bookingTimeStart"},{title:"End Time",dataIndex:"bookingTimeEnd",key:"bookingTimeEnd"},{title:"Event Name",dataIndex:"eventName",key:"eventName"},{title:"PIC Name",dataIndex:"picName",key:"picName"}],dataSource:null==h?void 0:h.scheduleList,rowKey:"bookingDate",pagination:!1,bordered:!0})]})}):null};t.Z=m},7004:function(e,t,s){"use strict";s.r(t);var a=s(5893),i=s(7294),n=s(1163),o=s(161),l=s(7286),r=s(1061),d=s(3939),c=s(9734),u=s(3299),m=s(4372),x=s(6985),f=s(2400),h=s(7484),v=s.n(h),b=s(6607),g=s.n(b);v().extend(g());let j=()=>{var e,t;let s=(0,n.useRouter)(),{id:o}=s.query,h=(0,u.useSession)(),b=(0,d.f)(),[g,j]=(0,i.useState)([]),[p,N]=(0,i.useState)(""),[w,k]=(0,i.useState)(new Date),[y,S]=(0,i.useState)(!0),[I,E]=(0,i.useState)([]),{data:B}=(0,c.ZP)(r.j.getBlockerList,b),[T,Z]=(0,i.useState)(!1),[_,C]=(0,i.useState)(void 0),[D,L]=(0,i.useState)(void 0),{data:P}=(0,c.ZP)("".concat(r.j.getBuilding),b);(0,i.useEffect)(()=>{P&&(j(P.buildingList),o&&N(o.toString()))},[P,o]),(0,i.useEffect)(()=>{let e=async()=>{var e,t;let s=null===(e=h.data)||void 0===e?void 0:null===(t=e.user)||void 0===t?void 0:t.role,a=await b("".concat(r.j.getRoom,"?BuildingId=").concat(o,"&UserRole=").concat(s,"&IsAvailable=").concat(y,"&DateToBook=").concat(w.toISOString().split("T")[0]));E(a.roomList)};(o&&w&&!y||y)&&e()},[o,w,y,null===(e=h.data)||void 0===e?void 0:null===(t=e.user)||void 0===t?void 0:t.role]);let A=e=>{N(e),s.push("/room/".concat(e))},O=e=>{k(e)},R=e=>{S(e)},U=e=>{let t=w.toISOString().split("T")[0];s.push("/roomDetail/".concat(e,"?date=").concat(t))},z=(e,t)=>{C(e),L(t),Z(!0)},X=()=>{Z(!1)},q=e=>{if(!B||!B.blockerLists)return!1;let t=v()(e);return B.blockerLists.some(e=>{let s=v()(e.startDate),a=v()(e.endDate);return t.isBetween(s,a,"day","[]")})};return(0,a.jsxs)("div",{children:[(0,a.jsx)(l.Z,{}),(0,a.jsxs)("div",{className:"flex flex-col",children:[(0,a.jsxs)("div",{className:"w-full flex justify-center mt-8 gap-4",children:[(0,a.jsx)(x.Z,{className:"w-3/5",value:p,onChange:A,options:null==g?void 0:g.map(e=>({label:e.name,value:e.buildingId}))}),(0,a.jsx)(f.Z,{value:w?v()(w):void 0,onChange:O,className:"border border-gray-300 rounded-md w-2/5",disabledDate:e=>e.isBefore(v()().startOf("day"),"day")||q(e)})]}),(0,a.jsxs)("div",{className:"flex mt-4 mb-6",children:[(0,a.jsx)("button",{className:"rounded-md text-white text-xl ".concat(y?"underline":""," ").concat(y?"underline-offset-8":""),onClick:()=>R(!0),children:"Available"}),(0,a.jsx)("button",{className:"rounded-md ml-8 text-white text-xl ".concat(y?"":"underline"," ").concat(y?"":"underline-offset-8"),onClick:()=>R(!1),children:"Booked"})]}),(0,a.jsx)("div",{className:"mt-4 grid grid-cols-5 gap-5 overflow-y-auto h-[480px]",children:I.map(e=>(0,a.jsx)("div",{className:"flex flex-col bg-white rounded-md p-4 h-[290px]",children:(0,a.jsxs)("div",{children:[(0,a.jsx)("img",{src:e.minioUrl,alt:e.name,className:"w-full h-40 object-cover rounded-md"}),(0,a.jsx)("div",{className:"mb-9",children:(0,a.jsx)("h2",{className:"text-black text-base mt-2 font-semibold",children:e.name})}),(0,a.jsxs)("div",{className:"flex mt-4 justify-end",children:[(0,a.jsx)("button",{className:"rounded-full text-white w-[65px] py-1 mr-2 ".concat(y?"bg-purple-950":"bg-gray-400 cursor-not-allowed"),onClick:()=>y?U(e.roomId):null,disabled:!y,children:"Book"}),(0,a.jsx)("button",{className:"rounded-full bg-purple-950 w-[65px] text-white px-4 py-1",onClick:()=>z(e.roomId,e.name),children:"Info"})]})]})},e.roomId))})]}),T&&_&&(0,a.jsx)(m.Z,{isOpen:T,onClose:X,roomId:_,roomName:D})]})};j.layout=o.f,t.default=j}},function(e){e.O(0,[976,634,738,397,453,123,828,675,400,161,774,888,179],function(){return e(e.s=2964)}),_N_E=e.O()}]);
//# sourceMappingURL=[id]-b000628681980ebb.js.map