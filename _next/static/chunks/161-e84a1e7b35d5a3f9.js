"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[161],{161:function(e,o,t){t.d(o,{f:function(){return R}});var i=t(5893),a=t(7294),l=t(9008),n=t.n(l),r=t(7183),s=t(1835),c=t(3575),d=t(8508),u=t(9417),g=t(7814),p=t(1163),m=t(3299),h=t(4865),v=t.n(h),f=t(3457),x=t(9734),b=t(1061),k=t(3939),j=t(6551);let y=e=>{var o,t;let{isOpen:l,onClose:n}=e,{data:r}=(0,m.useSession)(),s=null==r?void 0:r.user,c=(0,k.f)(),d=null==s?void 0:s.id,[u,g]=(0,a.useState)((null==s?void 0:null===(o=s.role)||void 0===o?void 0:o[0])||""),[p,h]=(0,a.useState)({}),[v,f]=(0,a.useState)((null==s?void 0:null===(t=s.role)||void 0===t?void 0:t[0])||""),{fetchPOST:y}=(0,j.L)(),{data:N,error:B,isLoading:S}=(0,x.ZP)(d?"".concat(b.j.getUserRole,"?UserId=").concat(d):null,c),{data:w}=(0,x.ZP)(d?"".concat(b.j.getDisplayName,"?UserId=").concat(d,"&RoleName=Staff"):null,c),{data:R}=(0,x.ZP)(d?"".concat(b.j.getDisplayName,"?UserId=").concat(d,"&RoleName=StudentOrganization"):null,c);(0,a.useEffect)(()=>{w&&h(e=>({...e,Staff:w.name})),R&&h(e=>({...e,StudentOrganization:R.name}))},[w,R]),(0,a.useEffect)(()=>{if(l){var e;f((null==s?void 0:null===(e=s.role)||void 0===e?void 0:e[0])||"")}},[l,s]);let C=e=>{f(e),g(e)},E=async()=>{var e;let o=null==N?void 0:null===(e=N.userRoles)||void 0===e?void 0:e.find(e=>e.roleName===u);if(!d||!o){console.error("User ID or selected role is not available.");return}let t={userId:d,roleId:o.roleId};try{let e=await y(b.j.changeRole,t);e.data&&(await (0,m.signIn)("oidc",{redirect:!1}),console.log("Role changed successfully. Updated session fetched."))}catch(e){console.error("Failed to change role:",e)}};if(S)return(0,i.jsx)("div",{className:"fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50",children:(0,i.jsx)("div",{className:"bg-white p-8 rounded-lg w-3/5",children:"Loading..."})});if(B)return(0,i.jsx)("div",{className:"fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50",children:(0,i.jsx)("div",{className:"bg-white p-8 rounded-lg w-3/5",children:"Error loading roles"})});let A=(null==N?void 0:N.userRoles)||[];return(0,i.jsx)("div",{className:"fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ".concat(l?"":"hidden"),children:(0,i.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5",children:(0,i.jsxs)("div",{className:"flex flex-col items-center",children:[(0,i.jsx)("p",{className:"text-xl font-medium text-purple-950 mb-6",children:"Change Role"}),(0,i.jsxs)("div",{className:"flex flex-col",children:[(0,i.jsx)("div",{className:"grid grid-cols-3 gap-5",children:A.length>0?A.map(e=>{let o=p[e.roleName]||e.roleName,t=v===e.roleName;return(0,i.jsx)("div",{className:"flex flex-col mb-6",children:(0,i.jsx)("button",{onClick:()=>C(e.roleName),className:"w-[160px] h-[160px] border border-gray-400 rounded-xl ".concat(t?"border-2 border-purple-950":""),children:(0,i.jsxs)("div",{className:"flex flex-col items-center",children:[(0,i.jsx)("img",{src:"/Assets/images/".concat(e.roleName,".png"),alt:e.roleName,className:"w-[120px] h-[120px]"}),(0,i.jsx)("p",{children:o})]})})},e.roleId)}):(0,i.jsx)("div",{children:"No roles"})}),(0,i.jsxs)("div",{className:"flex justify-end gap-4 py-2",children:[(0,i.jsx)("button",{onClick:n,className:"bg-gray-400 w-[90px] text-white px-6 py-2 rounded-full",children:"Cancel"}),(0,i.jsx)("button",{onClick:async()=>{await E(),n()},className:"bg-purple-950 w-[90px] text-white px-6 py-2 rounded-full",children:"Save"})]})]})]})})})},{Content:N,Sider:B}=r.Z,S="#380356",w=e=>{var o;let{children:t}=e,l=(0,p.useRouter)(),{data:h,status:j}=(0,m.useSession)(),w=null==h?void 0:h.user,R=(0,k.f)(),[C,E]=(0,a.useState)([l.pathname]),[A,U]=(0,a.useState)(!1),[G,I]=(0,a.useState)((null==w?void 0:w.name)||""),L=null==w?void 0:w.id,{data:O,error:D}=(0,x.ZP)("".concat(b.j.getUserRole,"?UserId=").concat(L),R),{data:T}=(0,x.ZP)("".concat(b.j.getNotificationUnread,"?UserId=").concat(L),R),[P,H]=(0,a.useState)(0);(0,a.useEffect)(()=>{T&&H(T.total)},[T]);let Z=()=>{l.push("/notification")};(0,a.useEffect)(()=>{if(w){var e;let o=null==w?void 0:null===(e=w.role)||void 0===e?void 0:e[0];"Student"===o||"StudentOrganization"===o||"Staff"===o||"Lecturer"===o?E(["/dashboardUser"]):"SSO"===o?E(["/dashboardApprover"]):"SLC"===o||"LSC"===o||"BM"===o?E(["/dashboardApprover"]):"SuperAdmin"===o&&E(["/dashboardAdmin"])}},[w]),(0,a.useEffect)(()=>{var e,o,t;if((null==w?void 0:null===(e=w.role)||void 0===e?void 0:e[0])==="StudentOrganization"||(null==w?void 0:null===(o=w.role)||void 0===o?void 0:o[0])==="Staff"){let e=async()=>{var e,o,t;try{let t=await fetch("".concat(b.j.getDisplayName,"?UserId=").concat(L,"&RoleName=").concat(null==w?void 0:null===(e=w.role)||void 0===e?void 0:e[0])),i=await t.json();i&&i.name?I(i.name):I((null==h?void 0:null===(o=h.user)||void 0===o?void 0:o.name)||"")}catch(e){console.error("Error fetching display name:",e),I((null==h?void 0:null===(t=h.user)||void 0===t?void 0:t.name)||"")}};e()}else I((null==h?void 0:null===(t=h.user)||void 0===t?void 0:t.name)||"")},[L,O,null==h?void 0:null===(o=h.user)||void 0===o?void 0:o.name,null==w?void 0:w.role]),D&&console.error("Error fetching roles:",D);let z=()=>U(!0),M=()=>U(!1);return(0,i.jsx)(s.ZP,{theme:{components:{Layout:{colorBgHeader:S,colorBgBody:"#000000"}}},children:(0,i.jsxs)(r.Z,{className:"min-h-screen",children:[(0,i.jsxs)(n(),{children:[(0,i.jsx)("meta",{charSet:"utf-8"},"meta-charset"),(0,i.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"},"meta-viewport"),(0,i.jsx)("link",{rel:"icon",href:"/main-logo.ico"},"main-logo")]}),(0,i.jsx)(B,{width:300,className:"pb-24 hidden lg:block p-6",children:(0,i.jsxs)("div",{className:"h-12",children:[(0,i.jsx)(f.Z,{preview:!1,src:"/Assets/images/logo-side-bar.png",alt:"Roomify Logo",width:170}),(0,i.jsxs)("div",{className:"bg-white rounded-2xl h-56 my-6 shadow-gray-600 shadow-lg relative",children:[(0,i.jsxs)("div",{className:"px-6 py-6 max-w-sm",children:[(0,i.jsx)("p",{className:"text-xl font-semibold",children:"Hi,"}),(0,i.jsx)("p",{className:"text-4xl font-bold overflow-wrap break-words",children:G})]}),(0,i.jsx)("button",{onClick:z,className:"absolute bottom-4 right-4 flex items-center justify-center text-white bg-[#EB8317] border-4 border-[#d68530] px-4 py-2 rounded-lg font-semibold hover:to-blue-950",children:"Change Role"}),(0,i.jsx)("button",{onClick:Z,className:"absolute bottom-4 left-4 flex items-center justify-center text-white border-2 px-4 py-2 font-semibold bg-purple-950 border-purple-800 rounded-full w-9 h-9",children:(0,i.jsx)("div",{className:"relative flex items-center justify-center",children:(0,i.jsx)(c.Z,{count:P,overflowCount:999,style:{position:"absolute",top:-6,right:-15},children:(0,i.jsx)(g.G,{icon:u.YHc,className:"text-white"})})})})]}),(0,i.jsxs)(s.ZP,{theme:{components:{Menu:{colorItemBg:S,colorItemBgSelected:"#6B0078",radiusItem:100,colorActiveBarBorderSize:0,itemMarginInline:0}}},children:[(0,i.jsx)(d.Z,{theme:"dark",mode:"vertical",items:(()=>{var e;let o=[],t=null==w?void 0:null===(e=w.role)||void 0===e?void 0:e[0];return t&&(o.push({key:"Student"===t||"StudentOrganization"===t||"Staff"===t||"Lecturer"===t?"/dashboardUser":"SuperAdmin"===t?"/dashboardAdmin":"/dashboardApprover",label:"Dashboard",icon:(0,i.jsx)(g.G,{icon:u.J9Y,className:"mr-[10px]"}),onClick:()=>l.push("/")}),"Student"===t||"StudentOrganization"===t||"Staff"===t||"Lecturer"===t?o.push({key:"/ongoing",label:"Ongoing",icon:(0,i.jsx)(g.G,{icon:u.J9Y,className:"mr-[10px]"}),onClick:()=>l.push("/ongoing")}):"SSO"===t?o.push({key:"/approverHistory",label:"History",icon:(0,i.jsx)(g.G,{icon:u.IV4,className:"mr-[11px]"}),onClick:()=>l.push("/approverHistory")}):"SLC"===t||"LSC"===t||"BM"===t?(o.push({key:"/approverHistory",label:"History",icon:(0,i.jsx)(g.G,{icon:u.IV4,className:"mr-[11px]"}),onClick:()=>l.push("/approverHistory")}),o.push({key:"/manage",label:"Manage",icon:(0,i.jsx)(g.G,{icon:u.Xhk,className:"mr-[9px]"}),onClick:()=>l.push("/manage")})):"SuperAdmin"===t&&(o.push({key:"/manage",label:"Manage",icon:(0,i.jsx)(g.G,{icon:u.Xhk,className:"mr-[9px]"}),onClick:()=>l.push("/manage")}),o.push({key:"/blocker",label:"Blocker",icon:(0,i.jsx)(g.G,{icon:u.isG,className:"mr-[12px]"}),onClick:()=>l.push("/blocker")}))),o})(),selectedKeys:C,onSelect:e=>E(e.selectedKeys),style:{fontSize:16}}),(0,i.jsx)(d.Z,{theme:"dark",mode:"vertical",items:(()=>{let e=[];return"authenticated"===j?e.push({key:"/signOut",label:"Log out",icon:(0,i.jsx)(g.G,{icon:u.HEx,className:"mr-[12px]"}),onClick:()=>{v().start(),(0,m.signOut)({callbackUrl:"/",redirect:!0}).then(()=>{v().done()})}}):e.push({key:"/login",label:"Sign in",icon:(0,i.jsx)(g.G,{icon:u.Yem,className:"mr-[12px]"}),onClick:()=>{v().start(),l.push("/login")}}),e})(),selectedKeys:C,onSelect:e=>E(e.selectedKeys),style:{fontSize:16},className:"absolute bottom-6"})]})]})}),(0,i.jsx)(r.Z,{children:(0,i.jsx)(N,{className:"m-5 p-8 bg-[#1F1E1E]",children:t})}),(0,i.jsx)(y,{isOpen:A,onClose:M})]})})},R=e=>(0,i.jsx)(w,{children:e})},1061:function(e,o,t){t.d(o,{j:function(){return a}});let i="/api/be",a={test:i+"/api/test",login:i+"/api/Authentication/login",getUserRole:i+"/api/Role/get-user-role",changeRole:i+"/api/Role/change-role",getDisplayName:i+"/api/Role/get-display-name",getUser:i+"/api/User/get-user-by-roles",getBuilding:i+"/api/v1/Building/get-all-building",getBuildingDetail:e=>i+"/api/v1/Building/get-building/".concat(e),editBuilding:e=>i+"/api/v1/Building/edit-building/".concat(e),createBuilding:i+"/api/v1/Building/create-building",deleteBuilding:i+"/api/v1/Building/delete-building",getRoom:i+"/api/v1/Room/get-user-view",getRoomDetail:i+"/api/v1/Room/get-room-detail",getRoomSchedule:i+"/api/v1/Room/get-room-schedule",getAllRoom:i+"/api/v1/Room/get-all-room",createRoom:i+"/api/v1/Room/create-room",getAllRoomDetail:i+"/api/v1/Room/get-room-detail",editRoom:e=>i+"/api/v1/Room/".concat(e),deleteRoom:i+"/api/v1/Room/delete-room",getRoomGroup:i+"/api/v1/Room/get-room-group",createGroup:i+"/api/Group/create-group",getGroupDetail:i+"/api/Group/get-group-detail",editGroup:e=>i+"/api/Group/".concat(e),deleteGroup:i+"/api/Group/delete-group",getRoomAvailable:i+"/api/v1/Room/get-room-available",getAvailableSession:i+"/api/Booking/get-available-session",getAllEquipment:i+"/api/Booking/get-all-equipment",getLecturerSubject:i+"/api/Booking/get-lecturer-subject",getInstituteId:i+"/api/Booking/get-institutional-id",createBooking:i+"/api/Booking/create-booking",getUserBookingView:i+"/api/Booking/get-user-view",cancelBooking:i+"/api/Booking/cancel-booking",getRejectMessage:i+"/api/Booking/get-reject-message",getAllBooking:i+"/api/Booking/get-all-booking",updateBooking:i+"/api/Booking/update-booking",getBookingTraffic:i+"/api/Booking/get-booking-traffic",getApproverView:i+"/api/Booking/get-approver-view",getBookingDetail:i+"/api/Booking/get-booking-detail",approveBooking:i+"/api/Booking/approve",getApproverHistory:i+"/api/Booking/get-approver-history",checkIn:i+"/api/Booking/checkin",getUserRoles:i+"/api/User/get-user-roles",getRoleDetail:i+"/api/User/get-role-detail",getAvailableRole:i+"/api/user/get-role-available",addNewRole:i+"/api/User/add-new-role",deleteRole:i+"/api/User/delete-role",getBlockerList:i+"/api/Blocker/get-blocker-list",createBlocker:i+"/api/Blocker/create-blocker",deleteBlocker:i+"/api/Blocker/delete-blocker",deactiveBlocker:i+"/api/Blocker/deactive-blocker",getBlockerDetail:i+"/api/Blocker/get-blocker-detail",updateBlocker:i+"/api/Blocker/update-blocker",getNotificationUnread:i+"/api/Notification/get-notification-unread",getNotification:i+"/api/Notification/get-notification",readNotification:i+"/api/Notification/read-notification",deleteNotification:i+"/api/Notification/delete-notification",deleteAllNotification:i+"/api/Notification/delete-all"}},6551:function(e,o,t){t.d(o,{L:function(){return r}});let i={"Content-Type":"application/json","Cache-Control":"no-cache",Pragma:"no-cache",Expires:"0"};var a=t(7294);let l=a.createContext({accessToken:"",user:{id:"",name:"",email:"",role:[]},isAuthenticated:!1});async function n(e,o){try{let t=await fetch(e,o);if(t.ok){let e=await t.json();return{data:e}}try{let e=await t.json();return{problem:e}}catch(o){let e=await t.text();return{problem:e}}}catch(e){return{error:e}}}function r(){let{accessToken:e,isAuthenticated:o}=(0,a.useContext)(l),t={...i};return o&&e&&(t.Authorization="Bearer ".concat(e)),{fetchGET:function(e){return n(e,{method:"GET",headers:t})},fetchPOST:function(e){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return n(e,{method:"POST",headers:t,body:JSON.stringify(o)})},fetchPUT:function(e){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return n(e,{method:"PUT",headers:t,body:JSON.stringify(o)})},fetchPATCH:function(e){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return n(e,{method:"PATCH",headers:t,body:JSON.stringify(o)})},fetchDELETE:function(e){return n(e,{method:"DELETE",headers:t})},fetchDELETEWithBody:function(e){let o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;return n(e,{method:"DELETE",headers:t,body:JSON.stringify(o)})},fetchPOSTWithFormData:function(e,o){let i=new Headers(t);return i.delete("Content-Type"),n(e,{method:"POST",headers:i,body:o})}}}},3939:function(e,o,t){t.d(o,{f:function(){return a}});var i=t(6551);function a(){let{fetchGET:e}=(0,i.L)();return async o=>{let{data:t,error:i,problem:a}=await e(o);if(i)throw i;if(a)throw a;return t}}}}]);
//# sourceMappingURL=161-e84a1e7b35d5a3f9.js.map