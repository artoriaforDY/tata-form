(function(p,n){typeof exports=="object"&&typeof module<"u"?n(exports,require("vue"),require("element-plus")):typeof define=="function"&&define.amd?define(["exports","vue","element-plus"],n):(p=typeof globalThis<"u"?globalThis:p||self,n(p.TataForm={},p.Vue,p.ElementPlus))})(this,function(p,n,i){"use strict";const c=e=>({form:i.ElForm,"form-item":i.ElFormItem,input:i.ElInput,"input-number":i.ElInputNumber,autocomplete:i.ElAutocomplete,select:i.ElSelect,option:i.ElOption,"select-v2":i.ElSelectV2,"tree-select":i.ElTreeSelect,"checkbox-group":i.ElCheckboxGroup,checkbox:i.ElCheckbox,"radio-group":i.ElRadioGroup,radio:i.ElRadio,"radio-button":i.ElRadioButton,"date-picker":i.ElDatePicker,"time-picker":i.ElTimePicker,"time-select":i.ElTimeSelect,cascader:i.ElCascader,slider:i.ElSlider,switch:i.ElSwitch})[e],b=n.defineComponent({name:"TataForm",props:{formList:{type:Array,required:!0},options:{type:Object,required:!0},grid:{type:[Array,Number]},"label-width":{type:Number,default:100},"content-width":{type:[Number,String],default:240},clearable:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1}},data(){return{form:this.initForm(),refObj:{}}},computed:{rules(){let e={};return this.formList.forEach(t=>{this.isRequired(t)&&(e[t.key]=t.rule)}),e}},methods:{initForm(e){if(console.log("执行了initForm"),!Array.isArray(this.formList))return console.error("formList must be an array"),{};let t={},s={input:"","input-number":0,autocomplete:"",select:null,"select-v2":null,"tree-select":null,"checkbox-group":[],"radio-group":"",date:"",datetime:"",daterange:[],datetimerange:[],"time-select":"",cascader:[],slider:0,switch:!1};return this.formList.forEach(o=>{let r=o.defaultValue!==void 0?o.defaultValue:s[o.type];if(o.key){let l=typeof o.disabled=="function"?o.disabled(this.form,o):o.disabled;t[o.key]=e&&l?t[o.key]:r}}),console.log("form===>",t),t},generateTag({item:e,tagName:t,tagType:s,options:o}){let r=typeof e.disabled=="function"?e.disabled(this.form,o):e.disabled,l={"model-value":this.form[e.key],...e.props||{},disabled:this.disabled||r},h=e.attrs||{},u=null,a=e.width||this.contentWidth;typeof a=="string"&&(a.indexOf("%")>=0||a==="auto")?u=a:u=a+"px";let y=e.on||{},f={...l,...h,key:e.key,style:{width:u}};o&&(s==="tree-select"?f.data=o:["checkbox-group","radio-group","select"].includes(s)||(f.options=o)),s==="input"?f.onInput=d=>{console.log("input",d),e.ref&&(this.refObj[e.ref]=this.$refs[e.ref]),this.form[e.key]=d,this.emitInput(d,e,this.refObj)}:f.onChange=d=>{console.log("input",d),d=this.formatDateValue(d,e),e.ref&&(this.refObj[e.ref]=this.$refs[e.ref]),this.form[e.key]=d,this.emitInput(d,e,this.refObj)};for(let d in y){const w=m=>(...F)=>{m(...F,e,this.form)};f[d]=w(y[d])}return e.hasOwnProperty("ref")&&(f.ref=e.ref),["select-v2","tree-select","cascader"].includes(e.type)?n.h(t,f):n.h(t,f,o)},formatDateValue(e,t){return["date","datetime"].includes(t.type)?e||"":["daterange","datetimerange"].includes(t.type)?e||["",""]:(console.log("formatDateValue",e),e)},emitInput(e,t,s){typeof t.onInput=="function"&&t.onInput(e,t,this.form,s)},async submit(){const e=await this.$refs.form.validate();this.$emit("submit",this.getForm(),e,this.$refs)},reset(e){this.clear(),this.form=this.initForm(e),this.$refs.form.resetFields()},clear(e){this.$refs.form.clearValidate&&this.$refs.form.clearValidate(e||void 0)},getFormBykey(e){return this.form[e]},getForm(){return{...this.form}},setForm(e){for(let t in e)this.form[t]=e[t]},validateField(e,t){return this.$refs.form.validateField(e,t)},renderFormList(e){const t=this.grid;return typeof t=="number"?this.getFormListByNumber(e):Array.isArray(t)?this.getFormListByArray(e):this.getFormList(e)},getFormList(e){return this.formList.map(t=>this.getFormItem(t,this.getContent(t)))},getFormListByNumber(e){let t=[],s=~~Math.abs(this.grid);s<1&&(s=1);let o=this.formList.filter(r=>{let l=typeof r.isShow=="function"?r.isShow(this.form,r):r.hasOwnProperty("isShow")?!!r.isShow:!0,h=typeof r.hasRow=="function"?r.hasRow(this.form,r):r.hasOwnProperty("hasRow")?!!r.hasRow:!0;return!(!l&&!h)});for(let r=0;r<o.length;r+=s){let l=[];for(let u=0;u<s&&r+u<o.length;u++){let a=o[r+u];if(!a)break;let y=this.getFormItem(a,this.getContent(a)),f=e(c("col"),{span:24/s},[y]);l.push(f)}let h=this.getRow(l);t.push(h)}return t},getFormListByArray(e){let t=[],s=0,o=this.formList.filter(r=>{let l=typeof r.isShow=="function"?r.isShow(this.form,r):r.hasOwnProperty("isShow")?!!r.isShow:!0,h=typeof r.hasRow=="function"?r.hasRow(this.form,r):r.hasOwnProperty("hasRow")?!!r.hasRow:!0;return!(!l&&!h)});for(let r=0;r<o.length;){let l=[],h=this.grid[s];for(let a=0;a<h;a++){let y=o[r+a];if(!y)break;let f=this.getFormItem(y,this.getContent(y)),g=e(c("col"),{span:24/h},[f]);l.push(g)}let u=this.getRow(l);t.push(u),s+=1,r+=h}return t},getRow(e){return n.h(c("row"),e)},getContent(e){let t;return typeof e.renderContent=="function"?t=e.renderContent(n.h,e,this.form):t=this.renderTagByName(e,e.type),t},getFormItem(e,t){if(e.isShow!==!1&&!(typeof e.isShow=="function"&&e.isShow(this.form,e)===!1)){if(typeof e.render=="function")return e.render(n.h,e,this.form);{let s={prop:e.key,label:e.title,...e.settings};return n.h(c("form-item"),s,{label:()=>this.renderTitle(n.h,e,this.form),default:()=>[t]})}}},isRequired(e){return e.rule?Array.isArray(e.rule)?e.rule.some(t=>t.required):e.rule.required:!1},renderTitle(e,t){if(t.renderTitle){let s=this.isRequired(t)?e("span",{style:"color: red"},"*"):"",o=typeof t.renderTitle=="function"?t.renderTitle(e,t,this.form):t.title;return e("span",[s,o])}else return t.title?e("span",[t.title]):""},renderTagByName(e){const t=["select","checkbox-group","radio-group"],s=["select-v2","tree-select","cascader"];let o={item:e,tagType:e.type,tagName:c(e.type)};return t.includes(e.type)?o.options=this.renderTagChildren(e):s.includes(e.type)&&(o.options=e.options||[]),this.generateTag(o)},renderTagChildren(e){let t=o=>({label:o.text,value:o.value,disabled:o.disabled}),s=[];switch(e.type){case"select":s=e.options.map(r=>n.h(c("option"),{...t(r)},typeof e.renderOption=="function"?[e.renderOption(n.h,r,e)]:""));break;case"checkbox-group":s=e.options.map(r=>n.h(c("checkbox"),{...t(r)},typeof e.renderOption=="function"?[e.renderOption(n.h,r,e)]:""));break;case"radio-group":const o=e.props||{};s=e.options.map(r=>n.h(c(o!=null&&o.radioButton?"radio-button":"radio"),{...t(r)},typeof e.renderOption=="function"?[e.renderOption(n.h,r,e)]:""));break}return s}},render(){return console.log("执行了render"),n.h(i.ElForm,{model:this.form,"label-width":this.labelWidth+"px",...this.options,rules:this.rules,ref:"form",nativeOn:{submit(e){e.preventDefault(),e.stopPropagation()}}},()=>{var e,t;return[this.renderFormList(n.h),(t=(e=this.$slots).default)==null?void 0:t.call(e)]})}});p.TataForm=b,Object.defineProperty(p,Symbol.toStringTag,{value:"Module"})});