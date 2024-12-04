import { defineComponent as w, h as a } from "vue";
import { ElForm as g, ElRow as m, ElCol as k, ElFormItem as F, ElInput as E, ElInputNumber as R, ElAutocomplete as S, ElSelect as O, ElOption as x, ElSelectV2 as L, ElTreeSelect as A, ElCheckboxGroup as T, ElCheckbox as C, ElRadioGroup as I, ElRadio as B, ElRadioButton as v, ElDatePicker as P, ElTimePicker as $, ElTimeSelect as j, ElCascader as N, ElSlider as V, ElSwitch as q } from "element-plus";
const p = (e) => ({
  row: m,
  col: k,
  form: g,
  "form-item": F,
  input: E,
  "input-number": R,
  autocomplete: S,
  select: O,
  option: x,
  "select-v2": L,
  "tree-select": A,
  "checkbox-group": T,
  checkbox: C,
  "radio-group": I,
  radio: B,
  "radio-button": v,
  date: P,
  time: $,
  "time-select": j,
  cascader: N,
  slider: V,
  switch: q
})[e], D = w({
  name: "TataForm",
  props: {
    formList: {
      type: Array,
      required: !0
    },
    options: {
      type: Object,
      default: () => {
      }
    },
    // 是否启用 grid 布局
    grid: {
      type: [Array, Number]
    },
    // 默认标签宽度
    labelWidth: {
      type: [String, Number],
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
        time: "",
        "time-select": "",
        cascader: [],
        slider: 0,
        switch: !1
      };
      return this.formList.forEach((o) => {
        var n, f, u, l, d;
        let r = o.defaultValue ? o.defaultValue : s[o.type];
        if (o.type === "date" ? (n = o.props) != null && n.type && ((u = (f = o.props) == null ? void 0 : f.type) == null ? void 0 : u.indexOf("range")) !== -1 && (r = []) : o.type === "time" && (d = (l = o.props) == null ? void 0 : l.type) != null && d.isRange && (r = ["", ""]), o.key) {
          let h = typeof o.disabled == "function" ? o.disabled(this.form, o) : o.disabled;
          t[o.key] = e && h ? t[o.key] : r;
        }
      }), t;
    },
    // 生产 tag
    generateTag({ item: e, tagName: t, tagType: s, options: o }) {
      let r = typeof e.disabled == "function" ? e.disabled(this.form, o) : e.disabled, n = {
        "model-value": this.form[e.key],
        clearable: !0,
        ...e.props || {},
        disabled: this.disabled || r
      }, f = e.attrs || {}, u = e.on || {}, l = {
        ...n,
        ...f,
        key: e.key,
        style: {},
        "onUpdate:modelValue": (i) => {
          this.form[e.key] = i;
        }
      };
      e.width && (l.style.width = typeof e.width == "string" ? e.width : e.width + "px"), o && (s === "tree-select" ? l.data = o : [
        "checkbox-group",
        "radio-group",
        "select"
      ].includes(s) || (l.options = o));
      const h = (i, c) => {
        c.ref && (this.refObj[c.ref] = this.$refs[c.ref]), this.form[c.key] = i, this.emitInput(i, c, this.refObj);
      };
      s === "input" ? l.onInput = (i) => h(i, e) : l.onChange = (i) => h(i, e);
      const y = (i) => (...c) => {
        i(...c, e, this.form);
      }, b = (i) => "on" + i.charAt(0).toUpperCase() + i.slice(1);
      for (let i in u)
        l[b(i)] = y(u[i]);
      return e.hasOwnProperty("ref") && (l.ref = e.ref), [
        "select-v2",
        "tree-select",
        "cascader"
      ].includes(e.type) ? a(t, l) : a(t, l, o);
    },
    formatDateValue(e, t) {
      var s, o, r, n;
      return t.type === "date" ? ((o = (s = t.props) == null ? void 0 : s.type) == null ? void 0 : o.indexOf("range")) !== -1 ? ["", ""] : e : t.type === "time" ? (n = (r = t.props) == null ? void 0 : r.type) != null && n.isRange ? e : ["", ""] : e;
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
    async validate() {
      return await this.$refs.form.validate();
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
        let n = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, f = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!n && !f);
      });
      for (let r = 0; r < o.length; r += s) {
        let n = [];
        for (let u = 0; u < s && r + u < o.length; u++) {
          let l = o[r + u];
          if (!l) break;
          let d = this.getFormItem(
            l,
            this.getContent(l)
          ), h = e(
            p("col"),
            {
              span: 24 / s
            },
            [d]
          );
          n.push(h);
        }
        let f = this.getRow(n);
        t.push(f);
      }
      return t;
    },
    // 当 grid 为一维数组时
    getFormListByArray(e) {
      let t = [], s = 0, o = this.formList.filter((r) => {
        let n = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, f = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!n && !f);
      });
      for (let r = 0; r < o.length; ) {
        let n = [], f = this.grid[s];
        for (let l = 0; l < f; l++) {
          let d = o[r + l];
          if (!d) break;
          let h = this.getFormItem(
            d,
            this.getContent(d)
          ), y = e(
            p("col"),
            {
              span: 24 / f
            },
            [h]
          );
          n.push(y);
        }
        let u = this.getRow(n);
        t.push(u), s += 1, r += f;
      }
      return t;
    },
    getRow(e) {
      return a(
        p("row"),
        e
      );
    },
    getContent(e) {
      let t = "";
      return typeof e.renderContent == "function" ? t = e.renderContent(a, e, this.form) : t = !e.key || !e.type ? "" : this.renderTagByName(e), t;
    },
    getFormItem(e, t) {
      if (e.isShow === !1 || typeof e.isShow == "function" && e.isShow(this.form, e) === !1)
        return null;
      if (typeof e.render == "function")
        return e.render(a, e, this.form);
      {
        let s = e.itemWidth || this.contentWidth, o = {
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
        return e.renderTitle && (r.label = () => this.renderTitle(a, e, this.form)), a(
          p("form-item"),
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
          s = e.options.map((r) => a(
            p("option"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(a, r, e)] : ""
          ));
          break;
        case "checkbox-group":
          s = e.options.map((r) => a(
            p("checkbox"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(a, r, e)] : ""
          ));
          break;
        case "radio-group":
          const o = e.props || {};
          s = e.options.map((r) => a(
            p(o != null && o.radioButton ? "radio-button" : "radio"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(a, r, e)] : ""
          ));
          break;
      }
      return s;
    }
  },
  render() {
    return a(g, {
      model: this.form,
      "label-width": typeof this.labelWidth == "string" ? this.labelWidth : this.labelWidth + "px",
      ...this.options,
      rules: this.rules,
      ref: "form"
    }, () => {
      var e, t;
      return [
        this.renderFormList(a),
        (t = (e = this.$slots).default) == null ? void 0 : t.call(e)
      ];
    });
  }
});
export {
  D as TataForm
};
