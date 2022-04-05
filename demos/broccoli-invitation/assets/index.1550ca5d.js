var F=Object.defineProperty;var k=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable;var E=(n,s,e)=>s in n?F(n,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[s]=e,u=(n,s)=>{for(var e in s||(s={}))T.call(s,e)&&E(n,e,s[e]);if(k)for(var e of k(s))V.call(s,e)&&E(n,e,s[e]);return n};var t=(n,s,e)=>(E(n,typeof s!="symbol"?s+"":s,e),e);import{R as M,P as l,n as N,r as v,b as y,g as w,i as S,a as p,j as o,h as L,c as D,_ as R}from"./index.79d975b3.js";import{T as b}from"./index.236912d1.js";import{c as m}from"./classnames.956b8db4.js";import{b as q}from"./index.fe18dfe5.js";class g extends M.Component{constructor(){super(...arguments);t(this,"state",{rippleLeft:0,rippleTop:0});t(this,"rippleRadius",0);t(this,"buttonRef",null);t(this,"setButtonRef",e=>{this.buttonRef===null&&(this.buttonRef=e,this.setRippleRadius())});t(this,"rippleRef",null);t(this,"setRippleRef",e=>{this.rippleRef===null&&(this.rippleRef=e,this.rippleRef.addEventListener("animationend",()=>{v(this.rippleRef,"fade")}))});t(this,"startRipple",e=>{if(this.props.disabled!==!0&&(y(this.buttonRef,"mousedown"),!this.rippling)){this.rippling=!0;const a=e.nativeEvent,r=a.offsetX-this.rippleRadius,i=a.offsetY-this.rippleRadius;this.setState({rippleLeft:r,rippleTop:i}),y(this.rippleRef,"appear")}});t(this,"endRipple",e=>{v(this.buttonRef,"mousedown","mouseup"),this.rippling&&(v(this.rippleRef,"appear"),y(this.rippleRef,"fade"),this.rippling=!1)});t(this,"setRippleRadius",()=>{this.rippleRadius=Math.max(w(this.buttonRef,"width"),w(this.buttonRef,"height"))})}componentDidUpdate(){this.setRippleRadius()}render(){const e=isNaN(this.rippleRadius)?0:this.rippleRadius*2,a={left:this.state.rippleLeft,top:this.state.rippleTop,width:e,height:e},r=m("material-button",this.props.isFlat&&"flat",this.props.disabled&&"disabled",`type-${this.props.type}`,`size-${this.props.size}`,this.props.className),i=S(this.props.link);return p(i?"a":"button",{className:r,ref:this.setButtonRef,onMouseDown:this.startRipple,onMouseUp:this.endRipple,onMouseOut:this.endRipple,onClick:this.props.onClick,href:i?this.props.link:null,target:i?this.props.linkTarget:null,children:[o("span",{className:"button-content",children:this.props.children}),o("div",{className:"ripple",ref:this.setRippleRef,style:a})]})}}t(g,"propTypes",{label:l.string,className:l.string,disabled:l.bool,isFlat:l.bool,type:l.oneOf(["normal","primary","secondary"]),size:l.oneOf(["normal","small"]),link:l.string,linkTarget:l.string,onClick:l.func}),t(g,"defaultProps",{label:"Button",className:"",disabled:!1,type:"normal",isFlat:!1,size:"normal",link:"",linkTarget:"_self",onClick:N});class x extends M.Component{constructor(){super(...arguments);t(this,"cancelListener",e=>{e.keyCode===27&&this.props.onCancel()});t(this,"onClickCover",e=>{L(e.target,"material-modal")&&this.props.onCancel()});t(this,"modalRef",null);t(this,"setModalRef",e=>{this.modalRef=e})}componentDidMount(){window.addEventListener("keyup",this.cancelListener)}componentWillUmount(){window.removeEventListener("keyup",this.cancelListener)}componentDidUpdate(e){const a=document.body,r=a.querySelector(".material-header .header-content"),i=`${D()}px`;e.isOpen===!1&&this.props.isOpen===!0&&(this.modalRef,y(a,"has-visible-modal"),a.style.paddingRight=i,r&&(r.style.paddingRight=i)),e.isOpen===!0&&this.props.isOpen===!1&&(v(a,"has-visible-modal"),a.style.paddingRight="0px",r&&(r.style.paddingRight="0px"))}render(){const{title:e,children:a,confirmButtonText:r,cancelButtonText:i,confirmOnly:c,isOpen:d,confirmDisabled:h,errorMessage:C}=this.props;if(!d)return null;const O=m("material-modal","visible",c&&"confirm-only",this.props.className);return R.exports.createPortal(o("div",{className:O,onClick:this.onClickCover,ref:this.setModalRef,children:p("div",{className:"modal-inner",children:[S(e)&&o("h1",{className:"modal-title",children:e}),o(q,{className:"icon-close",onClick:this.props.onCancel}),o("div",{className:"modal-content",children:a}),p("div",{className:"modal-action-buttons",children:[o(g,{className:"modal-confirm",onClick:this.props.onConfirm,type:"primary",size:"small",disabled:h,children:r}),!c&&o(g,{className:"modal-cancel",onClick:this.props.onCancel,size:"small",children:i})]}),S(C)&&o("p",{className:"error-message",children:C})]})}),document.body)}}t(x,"propTypes",{title:l.string,children:l.node,confirmButtonText:l.string,cancelButtonText:l.string,onConfirm:l.func,onCancel:l.func,isOpen:l.bool,confirmOnly:l.bool,confirmDisabled:l.bool,errorMessage:l.string}),t(x,"defaultProps",{confirmButtonText:"\u786E\u8BA4",cancelButtonText:"\u53D6\u6D88",onConfirm:N,onCancel:N,isOpen:!1,confirmOnly:!1,confirmDisabled:!1,errorMessage:""});class f extends M.Component{constructor(e){super(e);t(this,"state",{focused:!1});t(this,"isUncontrolled",!1);t(this,"ref",null);t(this,"setRef",e=>{this.ref===null&&(this.ref=e,this.ref.addEventListener("focus",()=>{this.setState({focused:!0}),R.exports.findDOMNode(this.ref).focus()}),this.ref.addEventListener("blur",()=>{this.setState({focused:!1}),R.exports.findDOMNode(this.ref).blur()}))});S(this.props.defaultValue)&&(this.isUncontrolled=!0)}get notEmpty(){return this.props.value!==""}get currentCharCount(){return this.props.value.length}componentDidMount(){this.props.autoFocus&&(this.setState({focused:!0}),R.exports.findDOMNode(this.ref).focus())}render(){const e=m("material-text-field",this.props.className,this.state.focused&&"focused",this.notEmpty&&"not-empty",this.props.invalid&&"invalid"),a={width:this.props.width},r=this.state.focused?this.props.placeholder:"",i={};return this.isUncontrolled?i.defaultValue=this.props.defaultValue:i.value=this.props.value,o("div",{className:e,children:p("div",{className:m("input-content",this.props.disabled&&"disabled"),style:a,children:[o("label",{children:this.props.label}),o("input",u({ref:this.setRef,type:this.props.type,maxLength:this.props.maxLength,placeholder:r,onChange:this.props.onChange,disabled:this.props.disabled,spellCheck:"false"},i)),o("p",{className:"hint",children:this.props.hint}),p("p",{className:"char-counter",children:[o("span",{className:"current",children:this.currentCharCount}),o("span",{className:"separator",children:"/"}),o("span",{className:"maximum",children:this.props.maxLength})]})]})})}}t(f,"propTypes",{type:l.oneOf(["text","password","number"]),label:l.string.isRequired,value:l.string,defaultValue:l.string,maxLength:l.number,width:l.string,disabled:l.bool,hint:l.string,onChange:l.func.isRequired,placeholder:l.string,autoFocus:l.bool}),t(f,"defaultProps",{type:"text",label:"Text TextField",value:"",defaultValue:"",width:180,maxLength:20,disabled:!1,hint:"",onChange:N,placeholder:"",autoFocus:!1});const B=n=>{const s=n.split("&"),e={};for(let a=0;a<s.length;a++){let[r,i]=s[a].split("=");r!==""&&i!==void 0&&(e[r]=i)}return e},P=(n=location.search)=>B(n.replace(/^\?/,"")),I=(n,s)=>{const e=P();for(let i in s)e[i]=s[i];let a="";for(let i in s)a+=`${i}=${s[i]}`;let r=n;return/\?/.test(n)?r=r.replace(/\?.*$/,a):a!==""&&(r+=`?${a}`),r};function $(n,s,e={},a=!0){return new Promise(function(r,i){const c=n==="GET",d=new XMLHttpRequest;c&&(s=I(s,e)),d.open(n,s),a&&d.setRequestHeader("Content-Type","application/json"),d.onreadystatechange=()=>{if(d.readyState===4)if(d.status===200){let h=d.response;try{h=JSON.parse(d.response)}catch{}r(h)}else{let h=d.response;try{h=JSON.parse(d.response)}catch{}i(h)}},d.onerror=h=>{i(h)},d.send(a?JSON.stringify(e):e)})}function z(n,s){return $("POST",n,s)}const U=(n,s,e)=>{const a=s.replace(/\[(\d+)]/g,(i,c)=>`.${c}`).split(".").filter(i=>i!=="");let r=n;for(let i=0;i<a.length;i++)if(r=Object(r)[a[i]],r===void 0)return e;return r},_="https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth";class W extends M.PureComponent{constructor(){super(...arguments);t(this,"state",{formModalVisible:!1,hasValidated:!1,fieldFullName:"",fieldEmail:"",fieldConfirmEmail:"",isSending:!1,errorMessage:"",sendSuccessful:!1});t(this,"regExpFullName",/^\S{3,}$/);t(this,"regExpEmail",/^\w+@\w+\.\w+$/);t(this,"handleCLickRequestBtn",()=>{this.setState({formModalVisible:!0,hasValidated:!1})});t(this,"setFieldValue",e=>a=>{this.setState({[e]:a.target.value,errorMessage:""})});t(this,"handleClickConfirm",()=>{this.state.isSending||this.setState({hasValidated:!0,errorMessage:""},()=>{this.fieldFullNameInvalid||this.fieldEmailInvalid||this.fieldConfirmEmailInvalid||this.sendRequest()})});t(this,"sendRequest",()=>{this.setState({isSending:!0}),z(_,{name:this.state.fieldFullName,email:this.state.fieldEmail}).then(e=>{this.hideFormModal(()=>{this.setState({sendSuccessful:!0})})}).catch(e=>{this.setState({errorMessage:U(e,"errorMessage","")})}).finally(()=>{this.setState({isSending:!1})})});t(this,"hideFormModal",e=>{this.setState({fieldFullName:"",fieldEmail:"",fieldConfirmEmail:"",hasValidated:!1,formModalVisible:!1,errorMessage:""},e)});t(this,"handleClickCancel",()=>{this.state.isSending||this.hideFormModal()});t(this,"renderFormModal",()=>{const e={hasValidated:this.state.hasValidated,width:"100%",disabled:this.state.isSending};return o(x,{confirmOnly:!0,title:"Request an invite",isOpen:this.state.formModalVisible,confirmButtonText:this.state.isSending?"Sending, please wait...":"Send",confirmDisabled:this.state.isSending,onConfirm:this.handleClickConfirm,onCancel:this.handleClickCancel,errorMessage:this.state.errorMessage,children:p("div",{className:"request-form",children:[o(f,u({label:"Full Name",value:this.state.fieldFullName,maxLength:20,invalid:this.fieldFullNameInvalid,onChange:this.setFieldValue("fieldFullName"),hint:"3~20 characters required.",autoFocus:!0},e)),o(f,u({label:"Email",value:this.state.fieldEmail,onChange:this.setFieldValue("fieldEmail"),invalid:this.fieldEmailInvalid,maxLength:30,hint:"Common email format required."},e)),o(f,u({label:"Confirm Email",value:this.state.fieldConfirmEmail,onChange:this.setFieldValue("fieldConfirmEmail"),invalid:this.fieldConfirmEmailInvalid,maxLength:30,hint:"Double-check your email address."},e))]})})});t(this,"hideSuccessModal",()=>{this.setState({sendSuccessful:!1})});t(this,"renderSuccessModal",()=>o(x,{confirmOnly:!0,title:"All done!",isOpen:this.state.sendSuccessful,confirmButtonText:"OK",onConfirm:this.hideSuccessModal,onCancel:this.hideSuccessModal,children:o(b,{variant:"body2",children:"You will be one of the first to experience Broccoli & Co. when we launch."})}))}get fieldFullNameInvalid(){return this.state.hasValidated&&!this.regExpFullName.test(this.state.fieldFullName)}get fieldEmailInvalid(){return this.state.hasValidated&&!this.regExpEmail.test(this.state.fieldEmail)}get fieldConfirmEmailInvalid(){return this.state.hasValidated&&(!this.regExpEmail.test(this.state.fieldConfirmEmail)||this.state.fieldConfirmEmail!==this.state.fieldEmail)}render(){return p("div",{className:m("page-index-wrap"),children:[p("div",{className:"content",children:[o(b,{variant:"h1",useMaterialSeparators:!0,className:"main-title",children:"A better way"}),o(b,{variant:"h1",className:"main-title",useMaterialSeparators:!0,children:"to enjoy every day"}),o(b,{variant:"h3",className:"main-subtitle",children:"Be the first to know when we launch."}),o(g,{className:"btn-request",onClick:this.handleCLickRequestBtn,type:"primary",children:"Request an invite"})]}),this.renderFormModal(),this.renderSuccessModal()]})}}export{W as default};