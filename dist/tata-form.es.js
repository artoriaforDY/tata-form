import { defineComponent as w, h as n } from "vue";
import { ElForm as g, ElFormItem as k, ElInput as F, ElInputNumber as E, ElAutocomplete as L, ElSelect as O, ElOption as S, ElSelectV2 as R, ElTreeSelect as x, ElCheckboxGroup as A, ElCheckbox as I, ElRadioGroup as T, ElRadio as C, ElRadioButton as B, ElDatePicker as P, ElTimePicker as $, ElTimeSelect as V, ElCascader as N, ElSlider as q, ElSwitch as j } from "element-plus";
const p = (e) => ({
  form: g,
  "form-item": k,
  input: F,
  "input-number": E,
  autocomplete: L,
  select: O,
  option: S,
  "select-v2": R,
  "tree-select": x,
  "checkbox-group": A,
  checkbox: I,
  "radio-group": T,
  radio: C,
  "radio-button": B,
  "date-picker": P,
  "time-picker": $,
  "time-select": V,
  cascader: N,
  slider: q,
  switch: j
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
    "label-width": {
      type: Number,
      default: 100
    },
    // 默认内容宽度
    "content-width": {
      type: [Number, String],
      default: 240
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
      form: this.initForm()
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
      if (console.log("执行了initForm"), !Array.isArray(this.formList))
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
          let l = typeof o.disabled == "function" ? o.disabled(this.form, o) : o.disabled;
          t[o.key] = e && l ? t[o.key] : r;
        }
      }), console.log("form===>", t), t;
    },
    // 生产 tag
    generateTag({ item: e, tagName: t, tagType: s, options: o }) {
      let r = typeof e.disabled == "function" ? e.disabled(this.form, o) : e.disabled, l = {
        "model-value": this.form[e.key],
        ...e.props || {},
        disabled: this.disabled || r
      }, u = e.attrs || {}, d = null, i = e.width || this.contentWidth;
      typeof i == "string" && (i.indexOf("%") >= 0 || i === "auto") ? d = i : d = i + "px";
      let h = e.on || {}, a = {
        ...l,
        ...u,
        key: e.key,
        style: {
          width: d
        }
      };
      o && (s === "tree-select" ? a.data = o : [
        "checkbox-group",
        "radio-group",
        "select"
      ].includes(s) || (a.options = o)), s === "input" ? a.onInput = (f) => {
        console.log("input", f);
        let c = {};
        e.ref && (c[e.ref] = this.$refs[e.ref]), this.form[e.key] = f, this.emitInput(f, e, c);
      } : a.onChange = (f) => {
        console.log("input", f), f = this.formatDateValue(f, e);
        let c = {};
        e.ref && (c[e.ref] = this.$refs[e.ref]), this.form[e.key] = f, this.emitInput(f, e, c);
      };
      for (let f in h) {
        const c = (b) => (...m) => {
          b(...m, e, this.form);
        };
        a[f] = c(h[f]);
      }
      return e.hasOwnProperty("ref") && (a.ref = e.ref), [
        "select-v2",
        "tree-select",
        "cascader"
      ].includes(e.type) ? n(t, a) : n(t, a, o);
    },
    formatDateValue(e, t) {
      return ["date", "datetime"].includes(t.type) ? e || "" : ["daterange", "datetimerange"].includes(t.type) ? e || ["", ""] : (console.log("formatDateValue", e), e);
    },
    emitInput(e, t, s) {
      typeof t.onInput == "function" && t.onInput(e, t, this.form, s);
    },
    async submit() {
      const e = await this.$refs.form.validate();
      this.$emit("submit", this.getForm(), e, this.$refs);
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
        let l = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, u = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!l && !u);
      });
      for (let r = 0; r < o.length; r += s) {
        let l = [];
        for (let d = 0; d < s && r + d < o.length; d++) {
          let i = o[r + d];
          if (!i) break;
          let h = this.getFormItem(
            i,
            this.getContent(i)
          ), a = e(
            p("col"),
            {
              span: 24 / s
            },
            [h]
          );
          l.push(a);
        }
        let u = this.getRow(l);
        t.push(u);
      }
      return t;
    },
    // 当 grid 为一维数组时
    getFormListByArray(e) {
      let t = [], s = 0, o = this.formList.filter((r) => {
        let l = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, u = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!l && !u);
      });
      for (let r = 0; r < o.length; ) {
        let l = [], u = this.grid[s];
        for (let i = 0; i < u; i++) {
          let h = o[r + i];
          if (!h) break;
          let a = this.getFormItem(
            h,
            this.getContent(h)
          ), y = e(
            p("col"),
            {
              span: 24 / u
            },
            [a]
          );
          l.push(y);
        }
        let d = this.getRow(l);
        t.push(d), s += 1, r += u;
      }
      return t;
    },
    getRow(e) {
      return n(
        p("row"),
        e
      );
    },
    getContent(e) {
      let t;
      return typeof e.renderContent == "function" ? t = e.renderContent(n, e, this.form) : t = this.renderTagByName(e, e.type), t;
    },
    getFormItem(e, t) {
      if (e.isShow !== !1 && !(typeof e.isShow == "function" && e.isShow(this.form, e) === !1)) {
        if (typeof e.render == "function")
          return e.render(n, e, this.form);
        {
          let s = {
            prop: e.key,
            label: e.title,
            ...e.settings
          };
          return n(
            p("form-item"),
            s,
            {
              label: () => this.renderTitle(n, e, this.form),
              default: () => [t]
            }
          );
        }
      }
    },
    isRequired(e) {
      return e.rule ? Array.isArray(e.rule) ? e.rule.some((t) => t.required) : e.rule.required : !1;
    },
    // 渲染 title
    renderTitle(e, t) {
      if (t.renderTitle) {
        let s = this.isRequired(t) ? e("span", { style: "color: red" }, "*") : "", o = typeof t.renderTitle == "function" ? t.renderTitle(e, t, this.form) : t.title;
        return e(
          "span",
          [
            s,
            o
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
      ], s = [
        "select-v2",
        "tree-select",
        "cascader"
      ];
      let o = {
        item: e,
        tagType: e.type,
        tagName: p(e.type)
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
            p("option"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "checkbox-group":
          s = e.options.map((r) => n(
            p("checkbox"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "radio-group":
          const o = e.props || {};
          s = e.options.map((r) => n(
            p(o != null && o.radioButton ? "radio-button" : "radio"),
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
    return console.log("执行了render"), n(g, {
      model: this.form,
      "label-width": this.labelWidth + "px",
      ...this.options,
      rules: this.rules,
      ref: "form",
      nativeOn: {
        submit(e) {
          e.preventDefault(), e.stopPropagation();
        }
      }
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
