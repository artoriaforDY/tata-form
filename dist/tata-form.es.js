import { defineComponent as m, h as i } from "vue";
import { ElForm as g, ElRow as k, ElCol as F, ElFormItem as E, ElInput as L, ElInputNumber as R, ElAutocomplete as S, ElSelect as O, ElOption as x, ElSelectV2 as A, ElTreeSelect as T, ElCheckboxGroup as I, ElCheckbox as C, ElRadioGroup as B, ElRadio as P, ElRadioButton as $, ElDatePicker as N, ElTimePicker as V, ElTimeSelect as j, ElCascader as q, ElSlider as W, ElSwitch as v } from "element-plus";
const h = (e) => ({
  row: k,
  col: F,
  form: g,
  "form-item": E,
  input: L,
  "input-number": R,
  autocomplete: S,
  select: O,
  option: x,
  "select-v2": A,
  "tree-select": T,
  "checkbox-group": I,
  checkbox: C,
  "radio-group": B,
  radio: P,
  "radio-button": $,
  "date-picker": N,
  "time-picker": V,
  "time-select": j,
  cascader: q,
  slider: W,
  switch: v
})[e], G = m({
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
      let t = {}, o = {
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
      return this.formList.forEach((s) => {
        let r = s.defaultValue !== void 0 ? s.defaultValue : o[s.type];
        if (s.key) {
          let n = typeof s.disabled == "function" ? s.disabled(this.form, s) : s.disabled;
          t[s.key] = e && n ? t[s.key] : r;
        }
      }), t;
    },
    // 生产 tag
    generateTag({ item: e, tagName: t, tagType: o, options: s }) {
      let r = typeof e.disabled == "function" ? e.disabled(this.form, s) : e.disabled, n = {
        "model-value": this.form[e.key],
        ...e.props || {},
        disabled: this.disabled || r
      }, a = e.attrs || {}, f = e.on || {}, l = {
        ...n,
        ...a,
        key: e.key,
        style: {}
      };
      e.width && (l.style.width = typeof e.width == "string" ? e.width : e.width + "px"), s && (o === "tree-select" ? l.data = s : [
        "checkbox-group",
        "radio-group",
        "select"
      ].includes(o) || (l.options = s));
      const c = (u, d) => {
        u = this.formatDateValue(u, d), d.ref && (this.refObj[d.ref] = this.$refs[d.ref]), this.form[d.key] = u, this.emitInput(u, d, this.refObj);
      };
      o === "input" ? l.onInput = (u) => c(u, e) : l.onChange = (u) => c(u, e);
      for (let u in f) {
        const d = (b) => (...w) => {
          b(...w, e, this.form);
        };
        l[u] = d(f[u]);
      }
      return e.hasOwnProperty("ref") && (l.ref = e.ref), [
        "select-v2",
        "tree-select",
        "cascader"
      ].includes(e.type) ? i(t, l) : i(t, l, s);
    },
    formatDateValue(e, t) {
      return ["date", "datetime"].includes(t.type) ? e || "" : ["daterange", "datetimerange"].includes(t.type) ? e || ["", ""] : e;
    },
    emitInput(e, t, o) {
      typeof t.onInput == "function" && t.onInput(e, t, this.form, o);
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
      let t = [], o = ~~Math.abs(this.grid);
      o < 1 && (o = 1);
      let s = this.formList.filter((r) => {
        let n = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, a = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!n && !a);
      });
      for (let r = 0; r < s.length; r += o) {
        let n = [];
        for (let f = 0; f < o && r + f < s.length; f++) {
          let l = s[r + f];
          if (!l) break;
          let p = this.getFormItem(
            l,
            this.getContent(l)
          ), c = e(
            h("col"),
            {
              span: 24 / o
            },
            [p]
          );
          n.push(c);
        }
        let a = this.getRow(n);
        t.push(a);
      }
      return t;
    },
    // 当 grid 为一维数组时
    getFormListByArray(e) {
      let t = [], o = 0, s = this.formList.filter((r) => {
        let n = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, a = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!n && !a);
      });
      for (let r = 0; r < s.length; ) {
        let n = [], a = this.grid[o];
        for (let l = 0; l < a; l++) {
          let p = s[r + l];
          if (!p) break;
          let c = this.getFormItem(
            p,
            this.getContent(p)
          ), y = e(
            h("col"),
            {
              span: 24 / a
            },
            [c]
          );
          n.push(y);
        }
        let f = this.getRow(n);
        t.push(f), o += 1, r += a;
      }
      return t;
    },
    getRow(e) {
      return i(
        h("row"),
        e
      );
    },
    getContent(e) {
      let t;
      return typeof e.renderContent == "function" ? t = e.renderContent(i, e, this.form) : t = this.renderTagByName(e, e.type), t;
    },
    getFormItem(e, t) {
      if (e.isShow === !1 || typeof e.isShow == "function" && e.isShow(this.form, e) === !1)
        return null;
      if (typeof e.render == "function")
        return e.render(i, e, this.form);
      {
        let o = this.contentWidth, s = {
          prop: e.key,
          label: e.title,
          style: {
            width: typeof o == "string" ? o : o + "px"
          },
          ...e.settings
        };
        return i(
          h("form-item"),
          s,
          {
            label: () => this.renderTitle(i, e, this.form),
            default: () => [t]
          }
        );
      }
    },
    isRequired(e) {
      return e.rule ? Array.isArray(e.rule) ? e.rule.some((t) => t.required) : e.rule.required : !1;
    },
    // 渲染 title
    renderTitle(e, t) {
      if (t.renderTitle) {
        let o = this.isRequired(t) ? e("span", { style: "color: red" }, "*") : "", s = typeof t.renderTitle == "function" ? t.renderTitle(e, t, this.form) : t.title;
        return e(
          "span",
          [
            o,
            s
          ]
        );
      } else return t.title ? e(
        "span",
        [
          t.title
        ]
      ) : "";
    },
    renderTagByName(e) {
      const t = [
        "select",
        "checkbox-group",
        "radio-group"
      ], o = [
        "select-v2",
        "tree-select",
        "cascader"
      ];
      let s = {
        item: e,
        tagType: e.type,
        tagName: h(e.type)
      };
      return t.includes(e.type) ? s.options = this.renderTagChildren(e) : o.includes(e.type) && (s.options = e.options || []), this.generateTag(s);
    },
    renderTagChildren(e) {
      let t = (s) => ({
        label: s.text,
        value: s.value,
        disabled: s.disabled
      }), o = [];
      switch (e.type) {
        case "select":
          o = e.options.map((r) => i(
            h("option"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(i, r, e)] : ""
          ));
          break;
        case "checkbox-group":
          o = e.options.map((r) => i(
            h("checkbox"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(i, r, e)] : ""
          ));
          break;
        case "radio-group":
          const s = e.props || {};
          o = e.options.map((r) => i(
            h(s != null && s.radioButton ? "radio-button" : "radio"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(i, r, e)] : ""
          ));
          break;
      }
      return o;
    }
  },
  render() {
    return i(g, {
      model: this.form,
      "label-width": typeof this.labelWidth == "string" ? this.labelWidth : this.labelWidth + "px",
      ...this.options,
      rules: this.rules,
      ref: "form"
    }, () => {
      var e, t;
      return [
        this.renderFormList(i),
        (t = (e = this.$slots).default) == null ? void 0 : t.call(e)
      ];
    });
  }
});
export {
  G as TataForm
};
