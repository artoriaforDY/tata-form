import { defineComponent as w, h as n } from "vue";
import { ElForm as c, ElRow as m, ElCol as k, ElFormItem as F, ElInput as E, ElInputNumber as O, ElAutocomplete as L, ElSelect as R, ElOption as S, ElSelectV2 as x, ElTreeSelect as A, ElCheckboxGroup as I, ElCheckbox as T, ElRadioGroup as C, ElRadio as B, ElRadioButton as P, ElDatePicker as $, ElTimePicker as j, ElTimeSelect as N, ElCascader as V, ElSlider as q, ElSwitch as W } from "element-plus";
const d = (e) => ({
  row: m,
  col: k,
  form: c,
  "form-item": F,
  input: E,
  "input-number": O,
  autocomplete: L,
  select: R,
  option: S,
  "select-v2": x,
  "tree-select": A,
  "checkbox-group": I,
  checkbox: T,
  "radio-group": C,
  radio: B,
  "radio-button": P,
  "date-picker": $,
  "time-picker": j,
  "time-select": N,
  cascader: V,
  slider: q,
  switch: W
})[e], M = w({
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
          let l = typeof s.disabled == "function" ? s.disabled(this.form, s) : s.disabled;
          t[s.key] = e && l ? t[s.key] : r;
        }
      }), t;
    },
    // 生产 tag
    generateTag({ item: e, tagName: t, tagType: o, options: s }) {
      let r = typeof e.disabled == "function" ? e.disabled(this.form, s) : e.disabled, l = {
        "model-value": this.form[e.key],
        ...e.props || {},
        disabled: this.disabled || r
      }, f = e.attrs || {}, u = e.on || {}, i = {
        ...l,
        ...f,
        key: e.key,
        style: {}
      };
      e.width && (i.style.width = typeof e.width == "string" ? e.width : e.width + "px"), s && (o === "tree-select" ? i.data = s : [
        "checkbox-group",
        "radio-group",
        "select"
      ].includes(o) || (i.options = s)), o === "input" ? i.onInput = (a) => {
        e.ref && (this.refObj[e.ref] = this.$refs[e.ref]), this.form[e.key] = a, this.emitInput(a, e, this.refObj);
      } : i.onChange = (a) => {
        a = this.formatDateValue(a, e), e.ref && (this.refObj[e.ref] = this.$refs[e.ref]), this.form[e.key] = a, this.emitInput(a, e, this.refObj);
      };
      for (let a in u) {
        const y = (g) => (...b) => {
          g(...b, e, this.form);
        };
        i[a] = y(u[a]);
      }
      return e.hasOwnProperty("ref") && (i.ref = e.ref), [
        "select-v2",
        "tree-select",
        "cascader"
      ].includes(e.type) ? n(t, i) : n(t, i, s);
    },
    formatDateValue(e, t) {
      return ["date", "datetime"].includes(t.type) ? e || "" : ["daterange", "datetimerange"].includes(t.type) ? e || ["", ""] : e;
    },
    emitInput(e, t, o) {
      typeof t.onInput == "function" && t.onInput(e, t, this.form, o);
    },
    async submit(e) {
      const t = await this.$refs.form.validate();
      this.$emit("submitTataForm", this.getForm(), t, this.$refs);
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
        let l = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, f = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!l && !f);
      });
      for (let r = 0; r < s.length; r += o) {
        let l = [];
        for (let u = 0; u < o && r + u < s.length; u++) {
          let i = s[r + u];
          if (!i) break;
          let h = this.getFormItem(
            i,
            this.getContent(i)
          ), p = e(
            d("col"),
            {
              span: 24 / o
            },
            [h]
          );
          l.push(p);
        }
        let f = this.getRow(l);
        t.push(f);
      }
      return t;
    },
    // 当 grid 为一维数组时
    getFormListByArray(e) {
      let t = [], o = 0, s = this.formList.filter((r) => {
        let l = typeof r.isShow == "function" ? r.isShow(this.form, r) : r.hasOwnProperty("isShow") ? !!r.isShow : !0, f = typeof r.hasRow == "function" ? r.hasRow(this.form, r) : r.hasOwnProperty("hasRow") ? !!r.hasRow : !0;
        return !(!l && !f);
      });
      for (let r = 0; r < s.length; ) {
        let l = [], f = this.grid[o];
        for (let i = 0; i < f; i++) {
          let h = s[r + i];
          if (!h) break;
          let p = this.getFormItem(
            h,
            this.getContent(h)
          ), a = e(
            d("col"),
            {
              span: 24 / f
            },
            [p]
          );
          l.push(a);
        }
        let u = this.getRow(l);
        t.push(u), o += 1, r += f;
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
          let o = this.contentWidth, s = {
            prop: e.key,
            label: e.title,
            style: {
              width: typeof o == "string" ? o : o + "px"
            },
            ...e.settings
          };
          return n(
            d("form-item"),
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
        tagName: d(e.type)
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
          o = e.options.map((r) => n(
            d("option"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "checkbox-group":
          o = e.options.map((r) => n(
            d("checkbox"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
        case "radio-group":
          const s = e.props || {};
          o = e.options.map((r) => n(
            d(s != null && s.radioButton ? "radio-button" : "radio"),
            {
              ...t(r)
            },
            typeof e.renderOption == "function" ? [e.renderOption(n, r, e)] : ""
          ));
          break;
      }
      return o;
    }
  },
  render() {
    return n(c, {
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
  M as TataForm
};
