import { defineComponent as w, h as n } from "vue";
import { ElForm as g, ElRow as m, ElCol as k, ElFormItem as F, ElInput as E, ElInputNumber as S, ElAutocomplete as L, ElSelect as R, ElOption as O, ElSelectV2 as x, ElTreeSelect as A, ElCheckboxGroup as T, ElCheckbox as C, ElRadioGroup as I, ElRadio as B, ElRadioButton as P, ElDatePicker as $, ElTimePicker as j, ElTimeSelect as q, ElCascader as N, ElSlider as V, ElSwitch as W } from "element-plus";
const h = (e) => ({
  row: m,
  col: k,
  form: g,
  "form-item": F,
  input: E,
  "input-number": S,
  autocomplete: L,
  select: R,
  option: O,
  "select-v2": x,
  "tree-select": A,
  "checkbox-group": T,
  checkbox: C,
  "radio-group": I,
  radio: B,
  "radio-button": P,
  "date-picker": $,
  "time-picker": j,
  "time-select": q,
  cascader: N,
  slider: V,
  switch: W
})[e], G = w({
  name: "TataForm",
  props: {
    formList: {
      type: Array,
      required: !0
    },
    options: {
      type: Object,
      required: !0
    },
    // 是否启用 grid 布局
    grid: {
      type: [Array, Number]
    },
    // 默认标签宽度
    labelWidth: {
      type: Number,
      default: 100
    },
    // 默认内容宽度
    contentWidth: {
      type: [Number, String],
      default: "100%"
    },
    // 开启全局 clearable
    clearable: {
      type: Boolean,
      default: !0
    },
    // 是否全局 disabled
    disabled: {
      type: Boolean,
      default: !1
    }
  },
  data() {
    return {
      form: this.initForm(),
      refObj: {}
    };
  },
  computed: {
    rules() {
      let e = {};
      return this.formList.forEach((t) => {
        this.isRequired(t) && (e[t.key] = t.rule);
      }), e;
    }
  },
  methods: {
    // 默认值
    initForm(e) {
      if (!Array.isArray(this.formList))
        return console.error("formList must be an array"), {};
      let t = {}, s = {
        input: "",
        "input-number": 0,
        autocomplete: "",
        select: null,
        "select-v2": null,
        "tree-select": null,
        "checkbox-group": [],
        "radio-group": "",
        date: "",
        datetime: "",
        daterange: [],
        datetimerange: [],
        "time-select": "",
        cascader: [],
        slider: 0,
        switch: !1
      };
      return this.formList.forEach((o) => {
        let r = o.defaultValue !== void 0 ? o.defaultValue : s[o.type];
        if (o.key) {
          let a = typeof o.disabled == "function" ? o.disabled(this.form, o) : o.disabled;
          t[o.key] = e && a ? t[o.key] : r;
        }
      }), t;
    },
    // 生产 tag
    generateTag({ item: e, tagName: t, tagType: s, options: o }) {
      let r = typeof e.disabled == "function" ? e.disabled(this.form, o) : e.disabled, a = {
        "model-value": this.form[e.key],
        clearable: !0,
        ...e.props || {},
        disabled: this.disabled || r
      }, u = e.attrs || {}, f = e.on || {}, l = {
        ...a,
        ...u,
        key: e.key,
        style: {}
      };
      e.width && (l.style.width = typeof e.width == "string" ? e.width : e.width + "px"), o && (s === "tree-select" ? l.data = o : [
        "checkbox-group",
        "radio-group",
        "select"
      ].includes(s) || (l.options = o));
      const c = (i, d) => {
        i = this.formatDateValue(i, d), d.ref && (this.refObj[d.ref] = this.$refs[d.ref]), this.form[d.key] = i, this.emitInput(i, d, this.refObj);
      };
      s === "input" ? l.onInput = (i) => c(i, e) : l.onChange = (i) => c(i, e);
      const y = (i) => (...d) => {
        i(...d, e, this.form);
      }, b = (i) => "on" + i.charAt(0).toUpperCase() + i.slice(1);
      for (let i in f)
        l[b(i)] = y(f[i]);
      return e.hasOwnProperty("ref") && (l.ref = e.ref), [
        "select-v2",
        "tree-select",
        "cascader"
      ].includes(e.type) ? n(t, l) : n(t, l, o);
    },
    formatDateValue(e, t) {
      return ["date", "datetime"].includes(t.type) ? e || "" : ["daterange", "datetimerange"].includes(t.type) ? e || ["", ""] : e;
    },
    emitInput(e, t, s) {
      typeof t.onInput == "function" && t.onInput(e, t, this.form, s);
    },
    async submit() {
      const e = await this.$refs.form.validate();
      this.$emit("submitTataForm", this.getForm(), e, this.$refs);
    },
    reset(e) {
      this.clear(), this.form = this.initForm(e), this.$refs.form.resetFields();
    },
    clear(e) {
      this.$refs.form.clearValidate && this.$refs.form.clearValidate(e || void 0);
    },
    getFormBykey(e) {
      return this.form[e];
    },
    getForm() {
      return { ...this.form };
    },
    setForm(e) {
      for (let t in e)
        this.form[t] = e[t];
    },
    validateField(e, t) {
      return this.$refs.form.validateField(e, t);
    },
    renderFormList(e) {
      const t = this.grid;
      return typeof t == "number" ? this.getFormListByNumber(e) : Array.isArray(t) ? this.getFormListByArray(e) : this.getFormList(e);
    },
    getFormList(e) {
      return this.formList.map((t) => this.getFormItem(t, this.getContent(t)));
    },
    // 当 grid 为数字时
    getFormListByNumber(e) {
      let t = [], s = ~~Math.abs(this.grid);
      s < 1 && (s = 1);
      let o = this.formList.filter((r) => {
        let a = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, u = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!a && !u);
      });
      for (let r = 0; r < o.length; r += s) {
        let a = [];
        for (let f = 0; f < s && r + f < o.length; f++) {
          let l = o[r + f];
          if (!l) break;
          let p = this.getFormItem(
            l,
            this.getContent(l)
          ), c = e(
            h("col"),
            {
              span: 24 / s
            },
            [p]
          );
          a.push(c);
        }
        let u = this.getRow(a);
        t.push(u);
      }
      return t;
    },
    // 当 grid 为一维数组时
    getFormListByArray(e) {
      let t = [], s = 0, o = this.formList.filter((r) => {
        let a = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, u = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!a && !u);
      });
      for (let r = 0; r < o.length; ) {
        let a = [], u = this.grid[s];
        for (let l = 0; l < u; l++) {
          let p = o[r + l];
          if (!p) break;
          let c = this.getFormItem(
            p,
            this.getContent(p)
          ), y = e(
            h("col"),
            {
              span: 24 / u
            },
            [c]
          );
          a.push(y);
        }
        let f = this.getRow(a);
        t.push(f), s += 1, r += u;
      }
      return t;
    },
    getRow(e) {
      return n(
        h("row"),
        e
      );
    },
    getContent(e) {
      let t;
      return typeof e.renderContent == "function" ? t = e.renderContent(n, e, this.form) : t = this.renderTagByName(e, e.type), t;
    },
    getFormItem(e, t) {
      if (e.isShow === !1 || typeof e.isShow == "function" && e.isShow(this.form, e) === !1)
        return null;
      if (typeof e.render == "function")
        return e.render(n, e, this.form);
      {
        let s = this.contentWidth, o = {
          prop: e.key,
          label: e.title,
          required: !!this.isRequired(e),
          style: {
            width: typeof s == "string" ? s : s + "px"
          },
          ...e.settings
        }, r = {
          default: () => [t]
        };
        return e.renderTitle && (r.label = () => this.renderTitle(n, e, this.form)), n(
          h("form-item"),
          o,
          r
        );
      }
    },
    isRequired(e) {
      return e.rule ? Array.isArray(e.rule) ? e.rule.some((t) => t.required) : e.rule.required : !1;
    },
    // 渲染 title
    renderTitle(e, t) {
      return t.renderTitle ? typeof t.renderTitle == "function" ? t.renderTitle(e, t, this.form) : t.title : t.title ? t.title : "";
    },
    renderTagByName(e) {
      const t = [
        "select",
        "checkbox-group",
        "radio-group"
      ], s = [
        "select-v2",
        "tree-select",
        "cascader"
      ];
      let o = {
        item: e,
        tagType: e.type,
        tagName: h(e.type)
      };
      return t.includes(e.type) ? o.options = this.renderTagChildren(e) : s.includes(e.type) && (o.options = e.options || []), this.generateTag(o);
    },
    renderTagChildren(e) {
      let t = (o) => ({
        label: o.text,
        value: o.value,
        disabled: o.disabled
      }), s = [];
      switch (e.type) {
        case "select":
          s = e.options.map((r) => n(
            h("option"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "checkbox-group":
          s = e.options.map((r) => n(
            h("checkbox"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "radio-group":
          const o = e.props || {};
          s = e.options.map((r) => n(
            h(o != null && o.radioButton ? "radio-button" : "radio"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
      }
      return s;
    }
  },
  render() {
    return n(g, {
      model: this.form,
      "label-width": typeof this.labelWidth == "string" ? this.labelWidth : this.labelWidth + "px",
      ...this.options,
      rules: this.rules,
      ref: "form"
    }, () => {
      var e, t;
      return [
        this.renderFormList(n),
        (t = (e = this.$slots).default) == null ? void 0 : t.call(e)
      ];
    });
  }
});
export {
  G as TataForm
};
