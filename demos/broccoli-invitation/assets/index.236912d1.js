var n=Object.defineProperty;var l=(r,s,a)=>s in r?n(r,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[s]=a;var e=(r,s,a)=>(l(r,typeof s!="symbol"?s+"":s,a),a);import{R as c,P as t,j as i}from"./index.79d975b3.js";import{c as h}from"./classnames.956b8db4.js";class o extends c.Component{constructor(){super(...arguments);e(this,"renderText",()=>this.props.useMaterialSeparators?this.props.children.split(/\s+/).filter(a=>a!=="").map((a,p)=>i("span",{className:"material-single-word",children:a},p)):this.props.children)}render(){const a=h("material-typography",`variant-${this.props.variant}`,this.props.className),p=this.props.tag;return i(p,{className:a,children:this.renderText()})}}e(o,"propTypes",{variant:t.oneOf(["h1","h2","h3","body1","body2"]),className:t.string,useMaterialSeparators:t.bool,tag:t.oneOf(["span","p","a"])}),e(o,"defaultProps",{variant:"body1",className:"",useMaterialSeparators:!1,tag:"p"});export{o as T};
