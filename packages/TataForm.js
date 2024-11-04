import { defineComponent, h } from 'vue';
import { ElForm, ElFormItem } from 'element-plus';

const getPrefix = (tag) => {
  return `el-${tag}`;
}

const TataForm = defineComponent({
  name: 'TataForm',
  props: {
    formList: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    // 是否启用 grid 布局
    grid: {
      type: [Array, Number],
    },
    // 默认标签宽度
    'label-width': {
      type: Number,
      default: 100,
    },
    // 默认内容宽度
    'content-width': {
      type: [Number, String],
      default: 240,
    },
    // 开启全局 clearable
    clearable: {
      type: Boolean,
      default: true,
    },
    // 文本框默认字符个数
    maxlength: {
      type: [Number, String],
      default: 20,
    },
    // 多行文本框默认字符个数
    textareaMaxlength: {
      type: Number,
      default: 256,
    },
    // 是否全局 disabled
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.initForm(),
    }
  },
  methods: {
    // 默认值
    initForm(isExclude) {
      if (!Array.isArray(this.formList)) {
        console.error('formList must be an array');
        return {};
      }
      let form = {}
      let map = {
        input: '',
        autocomplete: '',
        select: null,
        'select-v2': [],
        'tree-select': [],
        'checkbox-group': [],
        date: new Date(),
        datetime: new Date(),
        daterange: [],
        datetimerange: [],
        time: '',
        'time-select': '',
        'radio-group': '',
        slider: 0,
        switch: false,
        'input-number': 0,
        cascader: [],
      }
      this.formList.forEach((item) => {
        let defaultValue = item.defaultValue !== undefined ? item.defaultValue : map[item.type];
        if (item.key) {
          let disabled = typeof item.disabled == 'function' ? item.disabled(this.form, item) : item.disabled;
          form[item.key] = isExclude && disabled ? form[item.key] : defaultValue;
        }
      })
      return form
    },
    // 生产 tag
    generateTag({ h, item, tagName, props, children, on = {}, nativeOn = {} }) {
      let disabled = typeof item.disabled === 'function' ? item.disabled(this.form, children) : item.disabled

      let currProps = {
        value: this.form[item.key],
        min: 0,
        max: 9999999,
        ...props,
        disabled: this.disabled || disabled,
      };
      let attrs = item.attrs || {};
      let width = null;

      let itemOn = item.on || {}
      let itemNativeOn = item.nativeOn || {}

      let ignoreMap = {
        'switch': true,
        'checkbox-group': true,
        'radio-group': true,
        'input-number': true,
      };

      if (!ignoreMap[item.type]) {
        let w = item.width || this.contentWidth;
        if (typeof w === 'string' && (w.indexOf('%') >= 0 || w === 'auto')) {
          width = w;
        } else {
          width = w + 'px';
        }
      }

      let obj = {
        props: currProps,
        attrs,
        key: item.key,
        style: {
          width,
        },
        on: {
          ...item.on,
          input: (value) => {
            value = this.formatDateValue(value, item);
            let refObj = {};
            if (item.ref) {
              refObj[item.ref] = this.$refs[item.ref];
            }
            this.form[item.key] = value;
            this.emitInput(value, item, refObj, this.$refs);
          },
          ...on,
        },
        nativeOn: {
          ...itemNativeOn,
          ...nativeOn,
        },
      };
      if (item.hasOwnProperty('ref')) {
        obj.ref = item.ref;
      }
      return h(tagName, obj, children);
    },
    formatDateValue(value, item) {
      if (['date', 'datetime'].includes(item.type)) {
        return value ? value : '';
      } else if (['daterange', 'datetimerange'].includes(item.type)) {
        return value ? value : ['', ''];
      }
      return value;
    },
    emitInput(value, item, refObj, allRef) {
      if (typeof item.onInput === 'function') {
        item.onInput(value, item, this.form, refObj, allRef);
      }
    },
    async submit() {
      const valid = await this.$refs.form.validate();
      this.$emit('submit', this.getForm(), valid, this.$refs);
    },
    reset(isExclude) {
      this.clear();
      this.form = this.initForm(isExclude);
      this.$refs.form.resetFields();
    },
    clear(props) {
      this.$refs.form.clearValidate && this.$refs.form.clearValidate(props || undefined);
    },
    getFormBykey(key) {
      return this.form[key];
    },
    getForm() {
      return { ...this.form };
    },
    setForm(form) {
      for (let key in form) {
        this.form[key] = form[key];
      }
    },
    validateField(props, callback) {
      return this.$refs.form.validateField(props, callback);
    },
    renderFormList(h) {
      const grid = this.grid;
      if (typeof grid === 'number') {
        return this.getFormListByNumber(h);
      } else if (Array.isArray(grid)) {
        return this.getFormListByArray(h);
      } else {
        return this.getFormList(h);
      }
    },
    getFormList(h) {
      return this.formList.map((item) => {
        return this.getFormItem(h, item, this.getContent(h, item))
      })
    },
    // 当 grid 为数字时
    getFormListByNumber(h) {
      let list = []
      // 过滤 grid
      let grid = ~~Math.abs(this.grid)
      if (grid < 1) grid = 1

      let formList = this.formList.filter((children) => {
        let isShow = typeof children.isShow == 'function' ? children.isShow(this.form, children) : children.hasOwnProperty('isShow') ? !!children.isShow : true;
        let hasRow = typeof children.hasRow == 'function' ? children.hasRow(this.form, children) : children.hasOwnProperty('hasRow') ? !!children.hasRow : true;
        return !(!isShow && !hasRow)
      })
      for (let i = 0; i < formList.length; i += grid) {
        let childrenList = []
        // 获取当前分成几列 grid 为 number 时
        for (let j = 0; j < grid && i + j < formList.length; j++) {
          let children = formList[i + j]
          if (!children) break
          let childrenItem = this.getFormItem(
            h,
            children,
            this.getContent(h, children)
          )
          let childrenParts = h(
            getPrefix('col'),
            {
              props: {
                span: 24 / grid,
              },
            },
            [childrenItem]
          )
          childrenList.push(childrenParts)
        }
        let row = this.getRow(h, childrenList)
        list.push(row)
      }
      return list
    },
    // 当 grid 为一维数组时
    getFormListByArray(h) {
      let list = []
      let gridIndex = 0
      let formList = this.formList.filter((children) => {
        let isShow = typeof children.isShow == 'function' ? children.isShow(this.form, children) : children.hasOwnProperty('isShow') ? !!children.isShow : true;
        let hasRow = typeof children.hasRow == 'function' ? children.hasRow(this.form, children) : children.hasOwnProperty('hasRow') ? !!children.hasRow : true;
        return !(!isShow && !hasRow)
      })
      for (let i = 0; i < formList.length; ) {
        let childrenList = []
        let grid = this.grid[gridIndex]
        for (let j = 0; j < grid; j++) {
          let children = formList[i + j]
          if (!children) break
          let childrenItem = this.getFormItem(
            h,
            children,
            this.getContent(h, children)
          )
          let childrenParts = h(
            getPrefix('col'),
            {
              props: {
                span: 24 / grid,
              },
            },
            [childrenItem]
          )
          childrenList.push(childrenParts)
        }
        let row = this.getRow(h, childrenList)
        list.push(row)
        gridIndex += 1
        i += grid
      }
      return list
    },
    getRow(h, childrenList) {
      return h(
        getPrefix('row'),
        childrenList
      )
    },
    getContent(h, item) {
      let content
      switch (item.type) {
        case 'input':
          content = this.renderInput(h, item)
          break
        case 'autocomplete':
          content = this.renderInput(h, item)
          break
        case 'select':
          content = this.renderSelect(h, item)
          break
        case 'select-v2':
          content = this.renderSelectV2(h, item)
          break
        case 'tree-select':
          content = this.renderTreeSelect(h, item)
          break
        case 'checkbox-group':
          content = this.renderCheckboxGroup(h, item)
          break
        case 'date':
          content = this.renderDatePicker(h, item)
          break
        case 'datetime':
          content = this.renderDatePicker(h, item)
          break
        case 'daterange':
          content = this.renderDateRange(h, item)
          break
        case 'datetimerange':
          content = this.renderDateRange(h, item)
          break
        case 'time':
          content = this.renderTimePicker(h, item)
          break
        case 'time-select':
          content = this.renderTimeSelect(h, item)
          break
        case 'radio-group':
          content = this.renderRadioGroup(h, item)
          break
        case 'switch':
          content = this.renderSwitch(h, item)
          break
        case 'slider':
          content = this.renderSlider(h, item)
          break
        case 'input-number':
          content = this.renderInputNumber(h, item)
          break
        case 'cascader':
          content = this.renderCascader(h, item)
          break
        default:
          if (typeof item.renderContent === 'function') {
            content = item.renderContent(h, item, this.form)
          }
          break
      }
      return content
    },
    getFormItem(h, item, content) {
      if (item.isShow === false) return;
      else if (typeof item.isShow === 'function' && item.isShow(this.form, item) === false) {
        return;
      }
      if (typeof item.render === 'function') {
        return item.render(h, item, this.form)
      } else {
        let settings = {
          props: {
            prop: item.key,
          },
        }
        return h(
          getPrefix('form-item'),
          Object.assign(settings, item.settings),
          [this.renderTitle(h, item, this.form), content]
        )
      }
    },
    // 渲染 title
    renderTitle(h, item) {
      if (item.title) {
        return h(
          'span',
          { slot: 'label' },
          [
            item.required === true ? h('span', { style: 'color: red' }, '*') : '',
            typeof item.renderTitle === 'function' ? item.renderTitle(h, item, this.form) : item.title,
          ]
        );
      } else {
        return '';
      }
    },
    // 渲染 input
    renderInput(h, item) {
      let props = item.props || {}
      let attrs = item.attrs || {}
      // 让 element-ui 在 props 里也可以设置 placeholder
      if (props.placeholder) {
        attrs.placeholder = props.placeholder
      }

      // 让 element-ui 在 props 里也可以设置 maxlength
      if (props.type !== 'textarea') {
        attrs.maxlength = +props.maxlength || +this.maxlength
      } else {
        // textarea 长度
        attrs.maxlength = +props.maxlength || +this.textareaMaxlength
      }

      item.attrs = attrs

      let tag = {
        h,
        item,
        tagName: getPrefix('input'),
        props: {
          clearable: this.clearable,
          ...props,
        }
      }
      return this.generateTag(tag)
    },
    // 渲染 autocomplete 自动补全输入框
    renderAutoComplete(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('autocomplete'),
        props: {
          clearable: this.clearable,
          ...(item.props || {}),
        }
      }
      return this.generateTag(tag)
    },
    // 渲染 input-number
    renderInputNumber(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('input-number'),
        props: item.props || {},
      }
      return this.generateTag(tag)
    },
    // 渲染 select
    renderSelect(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('select'),
        props: {
          clearable: this.clearable,
          ...(item.props || {}),
        },
        children: item.options.map((option) => {
          return h(
            getPrefix('option'),
            {
              props: {
                label: option.text,
                value: option.value,
                disabled: option.disabled,
              },
            },
            [
              typeof item.renderOption === 'function'
                ? item.renderOption(h, option, item)
                : item.text,
            ]
          )
        }),
      }
      return this.generateTag(tag)
    },
    // 渲染 Virtualized Select 虚拟化选择器
    renderSelectV2(h, item){
      let tag = {
        h,
        item,
        tagName: getPrefix('select-v2'),
        children: item.options || [],
        props: {
          clearable: this.clearable,
          ...(item.props || {})
        }
      }
      return this.generateTag(tag)
    },
    // 渲染 TreeSelect 树形选择
    renderTreeSelect(h, item){
      let tag = {
        h,
        item,
        tagName: getPrefix('tree-select'),
        children: item.options || [],
        props: {
          clearable: this.clearable,
          ...(item.props || {})
        }
      }
      return this.generateTag(tag)
    },
    // 渲染 checkbox group
    renderCheckboxGroup(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('checkbox-group'),
        props: item.props || {},
        children: item.options.map((option) => {
          return h(
            getPrefix('checkbox'),
            {
              props: {
                border: item.border,
                label: option.value,
                disabled: option.disabled,
              },
            },
            [
              typeof item.renderOption === 'function'
                ? item.renderOption(h, option, item)
                : option.text,
            ]
          )
        }),
      }
      return this.generateTag(tag)
    },
    // 渲染 datepicker
    renderDatePicker(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('date-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {}),
        },
      }
      return this.generateTag(tag)
    },
    // 渲染范围的 daterange
    renderDateRange(h, item) {
      // 处理 datetimerange 可能宽度不够的问题
      if (item.type === 'datetimerange') {
        item.width = item.width || 360
      }
      let tag = {
        h,
        item,
        tagName: getPrefix('date-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {}),
        },
      }
      return this.generateTag(tag)
    },
    renderTimePicker(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('time-picker'),
        props: {
          clearable: this.clearable,
          type: item.type,
          ...(item.props || {}),
        },
      }
      return this.generateTag(tag)
    },
    // 渲染 TimeSelect 时间选择
    renderTimeSelect(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('time-select'),
        props: {
          clearable: this.clearable,
          ...(item.props || {}),
        },
      }
      return this.generateTag(tag)
    },
    // 渲染 radio group
    renderRadioGroup(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('radio-group'),
        props: item.props || {},
        children: item.options.map((option) => {
          return h(
            getPrefix('radio'),
            {
              props: {
                border: item.border,
                label: option.value,
                disabled: option.disabled,
              },
            },
            [
              typeof item.renderOption === 'function'
                ? item.renderOption(h, option, item)
                : option.text,
            ]
          )
        }),
      }
      return this.generateTag(tag)
    },
    // 渲染 switch
    renderSwitch(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('switch'),
        props: item.props || {},
      }
      return this.generateTag(tag)
    },
    // 渲染 slider
    renderSlider(h, item) {
      let tag = {
        h,
        item,
        tagName: getPrefix('slider'),
        props: item.props || {},
      }
      return this.generateTag(tag)
    },
    // 渲染 cascader
    renderCascader(h, item) {
      let props = item.props || {}
      let tag = {
        h,
        item,
        tagName: getPrefix('cascader'),
        children: item.options || [],
        props: {
          ...props
        }
      }
      return this.generateTag(tag)
    },
    // 转换 cascader options
    getCascaderOptions(options = []) {
      return options.map(option => ({
        ...option,
        label: option.text,
        children: this.getCascaderOptions(option.children || [])
      }));
    },
  },
  render() {
    return h(getPrefix('form'), {
      props: {
        model: this.form,
        'label-width': this['label-width'] + 'px',
        ...this.options,
      },
      ref: 'form',
      nativeOn: {
        submit(e) {
          e.preventDefault()
          e.stopPropagation()
        },
      },
    }, () => [
      this.renderFormList(h),
      this.$slots.default?.()
    ]);
  }
});

export default TataForm;