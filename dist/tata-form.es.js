import { defineComponent as w, h as n } from "vue";
import { ElForm as c, ElFormItem as m, ElInput as k, ElInputNumber as F, ElAutocomplete as E, ElSelect as O, ElOption as L, ElSelectV2 as S, ElTreeSelect as R, ElCheckboxGroup as x, ElCheckbox as A, ElRadioGroup as I, ElRadio as T, ElRadioButton as C, ElDatePicker as B, ElTimePicker as P, ElTimeSelect as $, ElCascader as j, ElSlider as V, ElSwitch as N } from "element-plus";
const d = (e) => ({
  form: c,
  "form-item": m,
  input: k,
  "input-number": F,
  autocomplete: E,
  select: O,
  option: L,
  "select-v2": S,
  "tree-select": R,
  "checkbox-group": x,
  checkbox: A,
  "radio-group": I,
  radio: T,
  "radio-button": C,
  "date-picker": B,
  "time-picker": P,
  "time-select": $,
  cascader: j,
  slider: V,
  switch: N
})[e], D = w({
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
          let a = typeof o.disabled == "function" ? o.disabled(this.form, o) : o.disabled;
          t[o.key] = e && a ? t[o.key] : r;
        }
      }), console.log("form===>", t), t;
    },
    // 生产 tag
    generateTag({ item: e, tagName: t, tagType: s, options: o }) {
      let r = typeof e.disabled == "function" ? e.disabled(this.form, o) : e.disabled, a = {
        "model-value": this.form[e.key],
        ...e.props || {},
        disabled: this.disabled || r
      }, f = e.attrs || {}, u = e.on || {}, i = {
        ...a,
        ...f,
        key: e.key,
        style: {}
      };
      e.width && (i.style.width = typeof e.width == "string" ? e.width : e.width + "px"), o && (s === "tree-select" ? i.data = o : [
        "checkbox-group",
        "radio-group",
        "select"
      ].includes(s) || (i.options = o)), s === "input" ? i.onInput = (l) => {
        console.log("input", l), e.ref && (this.refObj[e.ref] = this.$refs[e.ref]), this.form[e.key] = l, this.emitInput(l, e, this.refObj);
      } : i.onChange = (l) => {
        console.log("input", l), l = this.formatDateValue(l, e), e.ref && (this.refObj[e.ref] = this.$refs[e.ref]), this.form[e.key] = l, this.emitInput(l, e, this.refObj);
      };
      for (let l in u) {
        const y = (g) => (...b) => {
          g(...b, e, this.form);
        };
        i[l] = y(u[l]);
      }
      return e.hasOwnProperty("ref") && (i.ref = e.ref), [
        "select-v2",
        "tree-select",
        "cascader"
      ].includes(e.type) ? n(t, i) : n(t, i, o);
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
        let a = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, f = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!a && !f);
      });
      for (let r = 0; r < o.length; r += s) {
        let a = [];
        for (let u = 0; u < s && r + u < o.length; u++) {
          let i = o[r + u];
          if (!i) break;
          let h = this.getFormItem(
            i,
            this.getContent(i)
          ), p = e(
            d("col"),
            {
              span: 24 / s
            },
            [h]
          );
          a.push(p);
        }
        let f = this.getRow(a);
        t.push(f);
      }
      return t;
    },
    // 当 grid 为一维数组时
    getFormListByArray(e) {
      let t = [], s = 0, o = this.formList.filter((r) => {
        let a = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, f = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!a && !f);
      });
      for (let r = 0; r < o.length; ) {
        let a = [], f = this.grid[s];
        for (let i = 0; i < f; i++) {
          let h = o[r + i];
          if (!h) break;
          let p = this.getFormItem(
            h,
            this.getContent(h)
          ), l = e(
            d("col"),
            {
              span: 24 / f
            },
            [p]
          );
          a.push(l);
        }
        let u = this.getRow(a);
        t.push(u), s += 1, r += f;
      }
      return t;
    },
    getRow(e) {
      return n(
        d("row"),
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
          let s = this.contentWidth, o = {
            prop: e.key,
            label: e.title,
            style: {
              width: typeof s == "string" ? s : s + "px"
            },
            ...e.settings
          };
          return n(
            d("form-item"),
            o,
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
        tagName: d(e.type)
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
            d("option"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "checkbox-group":
          s = e.options.map((r) => n(
            d("checkbox"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "radio-group":
          const o = e.props || {};
          s = e.options.map((r) => n(
            d(o != null && o.radioButton ? "radio-button" : "radio"),
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
    return console.log("执行了render"), n(c, {
      model: this.form,
      "label-width": typeof this.labelWidth == "string" ? this.labelWidth : this.labelWidth + "px",
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
  D as TataForm
};
