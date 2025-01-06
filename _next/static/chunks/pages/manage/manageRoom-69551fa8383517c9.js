(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[233],{8840:function(e,l,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/manage/manageRoom",function(){return a(6339)}])},6339:function(e,l,a){"use strict";a.r(l),a.d(l,{default:function(){return k}});var s=a(5893),t=a(7294),n=a(1163),i=a(2453),r=a(6738),o=a(6985),d=a(1693),c=a(8662),m=a(7732),u=a(3457),x=a(5081),h=a(9417),p=a(7814),f=a(6551),g=a(1061),b=a(161),j=a(9734),N=a(3939);let v=e=>{let{visible:l,onConfirm:a,onCancel:t}=e;return(0,s.jsxs)("div",{className:"fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-auto ".concat(l?"":"hidden"),children:[(0,s.jsx)("div",{className:"bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4",children:(0,s.jsx)("img",{src:"/Assets/images/are-you-sure.png",alt:"Are you sure?",className:"w-[200px] rounded-full"})}),(0,s.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-2/5",children:(0,s.jsxs)("div",{className:"h-full",children:[(0,s.jsx)("div",{className:"h-2/3 flex flex-col justify-end",children:(0,s.jsxs)("div",{className:"flex flex-col items-center",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold",children:"Submit Room?"}),(0,s.jsx)("h4",{className:"text-center",children:"Make sure to input the right data and requirements :)"})]})}),(0,s.jsx)("div",{className:"h-1/3 flex items-center justify-center",children:(0,s.jsxs)("div",{className:"flex gap-4",children:[(0,s.jsx)("button",{className:"bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold",onClick:a,children:"Submit"}),(0,s.jsx)("button",{className:"bg-gray-200 h-[50px] w-[150px] rounded-full text-black text-lg font-semibold",onClick:t,children:"Cancel"})]})})]})})]})},w=e=>{let{visible:l,onConfirm:a,isSuccess:t}=e;return(0,s.jsxs)("div",{className:"fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-auto ".concat(l?"":"hidden"),children:[(0,s.jsx)("div",{className:"bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4",children:(0,s.jsx)("img",{src:t?"/Assets/images/succeed.png":"/Assets/images/person-sad.png",alt:t?"Success":"Error",className:"w-[200px] rounded-full"})}),(0,s.jsx)("div",{className:"bg-white p-4 rounded-lg w-2/5 h-2/5",children:(0,s.jsxs)("div",{className:"h-full",children:[(0,s.jsx)("div",{className:"h-2/3 flex flex-col justify-end",children:t?(0,s.jsxs)("div",{className:"flex flex-col items-center px-8",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold",children:"You're All Set!"}),(0,s.jsx)("h4",{className:"text-center",children:"Your room has been successfully added. Check the management page for more details!"})]}):(0,s.jsxs)("div",{className:"flex flex-col items-center",children:[(0,s.jsx)("h1",{className:"text-2xl font-bold",children:"Oh no..."}),(0,s.jsx)("h4",{className:"text-center",children:"Something went wrong. Please try again later."})]})}),(0,s.jsx)("div",{className:"h-1/3 flex items-center justify-center",children:(0,s.jsx)("button",{className:"bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold",onClick:a,children:t?"Okay, Great!":"Okay :("})})]})})]})},y=["image/jpeg","image/png","image/gif"],C=()=>{let e=(0,n.useRouter)(),{fetchPOSTWithFormData:l}=(0,f.L)(),[a,b]=(0,t.useState)(null),[C,k]=(0,t.useState)(""),[I,Z]=(0,t.useState)(!1),S=(0,N.f)(),[P,G]=(0,t.useState)({roomName:"",description:"",roomTypeId:"",buildingId:"",capacity:"",image:null,roomGroupId:""}),[R,A]=(0,t.useState)(!1),[_,T]=(0,t.useState)(!1),[E,F]=(0,t.useState)(!1),{data:L}=(0,j.ZP)(g.j.getBuilding,S),{data:O}=(0,j.ZP)(g.j.getRoomGroup,S);console.log(L);let B=e=>{let l=y.includes(e.type),a=e.size<=5242880;if(!l)return i.ZP.error("File yang di upload hanya bisa dalam format JPG, JPEG, PNG"),!1;if(!a)return i.ZP.error("File yang di upload maksimal 5 MB"),!1;let s=new FileReader;return s.readAsDataURL(e),s.onload=()=>{b(s.result),k(e.name),G({...P,image:e})},!1},D=()=>{b(null),k(""),G({...P,image:null})},U=()=>{e.back()},z=async()=>{if(!P.roomName||!P.image){i.ZP.error("Please provide a room name and an image");return}A(!1),Z(!0);let e=new FormData;e.append("RoomName",P.roomName),e.append("Description",P.description),e.append("Capacity",P.capacity),e.append("BuildingId",P.buildingId),e.append("RoomTypeId",P.roomTypeId),e.append("RoomGroupId",P.roomGroupId),e.append("RoomPicture",P.image);try{await l(g.j.createRoom,e),F(!0)}catch(e){F(!1)}finally{Z(!1),T(!0)}},J=e=>{e.length<=250?G({...P,description:e}):i.ZP.warning("Description must be less than 250 characters")};return(0,s.jsxs)("div",{className:"mt-4 h-[710px] overflow-y-auto",children:[(0,s.jsx)("button",{className:"bg-white rounded-full w-10 h-10 flex items-center justify-center",onClick:U,children:(0,s.jsx)(p.G,{icon:h.A35,className:"inline"})}),(0,s.jsxs)("div",{children:[(0,s.jsx)("img",{src:"/Assets/images/add-room.png",alt:"manage",width:310,height:40,className:"mt-6 mb-6"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Room Name"}),(0,s.jsx)(r.Z,{value:P.roomName,onChange:e=>G({...P,roomName:e.target.value}),placeholder:"Enter room name",className:"w-full mb-3 rounded-md"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Description"}),(0,s.jsx)(r.Z.TextArea,{value:P.description,onChange:e=>J(e.target.value),placeholder:"Enter room description (max 250 characters)",maxLength:250,className:"w-full mb-3 rounded-md",rows:4})]}),(0,s.jsxs)("div",{className:"mt-4",children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Room Type"}),(0,s.jsx)(o.Z,{value:P.roomTypeId,onChange:e=>G({...P,roomTypeId:e}),placeholder:"Select room type",className:"w-full mb-3 rounded-lg",children:[{label:"LAB",value:1},{label:"CLASS",value:2},{label:"FUNCTION",value:3}].map(e=>(0,s.jsx)(o.Z.Option,{value:e.value,children:e.label},e.value))})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Building"}),(0,s.jsx)(o.Z,{value:P.buildingId,onChange:e=>G({...P,buildingId:e}),placeholder:"Select building",className:"w-full mb-3 rounded-lg h-8",options:null==L?void 0:L.buildingList.map(e=>({label:e.name,value:e.buildingId}))})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Capacity"}),(0,s.jsx)(r.Z,{value:P.capacity,onChange:e=>G({...P,capacity:e.target.value}),placeholder:"Enter room capacity",className:"w-full mb-3 rounded-md"})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Group"}),(0,s.jsx)(o.Z,{value:P.roomGroupId,onChange:e=>G({...P,roomGroupId:e}),placeholder:"Select building",className:"w-full mb-3 rounded-lg h-8",options:null==O?void 0:O.roomGroups.map(e=>({label:e.name,value:e.id}))})]}),(0,s.jsxs)("div",{className:"",children:[(0,s.jsx)("p",{className:"text-white font-normal text-base mb-2",children:"Room Image"}),(0,s.jsx)(d.Z,{beforeUpload:B,multiple:!1,showUploadList:!1,children:(0,s.jsxs)(c.ZP,{className:"bg-white border-black text-black text-base",children:[(0,s.jsx)(p.G,{icon:h.cf$,className:"mr-2"}),"Click to Upload"]})}),a&&(0,s.jsx)(m.Z,{className:"mt-4 p-4 bg-[#F4F5F2] shadow-inner flex justify-center",children:(0,s.jsxs)("div",{className:"w-72 h-fit",children:[(0,s.jsx)("div",{className:"flex justify-center",children:(0,s.jsx)(u.Z,{width:256,height:150,className:"rounded-md object-cover max-w-[256px] max-h-[150px]",src:a,alt:C})}),(0,s.jsxs)("div",{className:"flex justify-center items-center w-full",children:[(0,s.jsx)("p",{className:"font-normal text-sm",children:C}),(0,s.jsx)(c.ZP,{type:"link",onClick:D,children:(0,s.jsx)(p.G,{icon:h.NBC,className:"text-red-500"})})]})]})})]}),(0,s.jsx)("div",{className:"mt-6 flex justify-center",children:(0,s.jsx)(x.Z,{spinning:I,children:(0,s.jsx)("button",{onClick:()=>A(!0),disabled:!P.roomName||!P.roomTypeId||!P.image||I,className:"bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl",children:"Add Room"})})})]}),(0,s.jsx)(v,{visible:R,onConfirm:z,onCancel:()=>A(!1)}),(0,s.jsx)(w,{visible:_,isSuccess:E,onConfirm:()=>{T(!1),e.push("/manage")}})]})};C.layout=b.f;var k=C}},function(e){e.O(0,[976,634,738,397,453,123,693,732,161,774,888,179],function(){return e(e.s=8840)}),_N_E=e.O()}]);
//# sourceMappingURL=manageRoom-69551fa8383517c9.js.map