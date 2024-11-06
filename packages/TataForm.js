import { defineComponent, h } from 'vue';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElAutocomplete, ElSelect, ElOption, ElSelectV2, ElTreeSelect, ElCheckboxGroup, ElCheckbox, ElRadioGroup, ElRadio, ElRadioButton, ElDatePicker, ElTimePicker, ElCascader, ElSlider, ElSwitch, ElTimeSelect, ElRow, ElCol } from 'element-plus';


const getPrefix = (tag) => {
  const elementMap = {
    'form': ElForm,
    'form-item': ElFormItem,
    'input': ElInput,
    'input-number': ElInputNumber,
    'autocomplete': ElAutocomplete,
    'select': ElSelect,
    'option': ElOption,
    'select-v2': ElSelectV2,
    'tree-select': ElTreeSelect,
    'checkbox-group': ElCheckboxGroup,
    'checkbox': ElCheckbox,
    'radio-group': ElRadioGroup,
    'radio': ElRadio,
    'radio-button': ElRadioButton,
    'date-picker': ElDatePicker,
    'time-picker': ElTimePicker,
    'time-select': ElTimeSelect,
    'cascader': ElCascader,
    'slider': ElSlider,
    'switch': ElSwitch,
  }
  return elementMap[tag]
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
  computed: {
    rules() {
      let rules = {}
      this.formList.forEach((item) => {
        if (this.isRequired(item)) {
          rules[item.key] = item.rule
        }
      })
      return rules
    }
  },
  methods: {
    // 默认值
    initForm(isExclude) {
      console.log('执行了initForm')
      if (!Array.isArray(this.formList)) {
        console.error('formList must be an array');
        return {};
      }
      let form = {}
      let map = {
        'input': '',
        'input-number': 0,
        'autocomplete': '',
        'select': null,
        'select-v2': null,
        'tree-select': null,
        'checkbox-group': [],
        'radio-group': '',
        'date': '',
        'datetime': '',
        'daterange': [],
        'datetimerange': [],
        'time-select': '',
        'cascader': [],
        'slider': 0,
        'switch': false,
      }
      this.formList.forEach((item) => {
        let defaultValue = item.defaultValue !== undefined ? item.defaultValue : map[item.type];
        if (item.key) {
          let disabled = typeof item.disabled == 'function' ? item.disabled(this.form, item) : item.disabled;
          form[item.key] = isExclude && disabled ? form[item.key] : defaultValue;
        }
      })
      console.log('form===>', form)
      return form
    },
    // 生产 tag
    generateTag({ item, tagName, tagType, options }) {
      let disabled = typeof item.disabled === 'function' ? item.disabled(this.form, options) : item.disabled

      let currProps = {
        'model-value': this.form[item.key],
        ...(item.props || {}),
        disabled: this.disabled || disabled,
      };
      let attrs = item.attrs || {};
      let width = null;

      let w = item.width || this.contentWidth;
      if (typeof w === 'string' && (w.indexOf('%') >= 0 || w === 'auto')) {
        width = w;
      } else {
        width = w + 'px';
      }
      let itemOn = item.on || {}

      let obj = {
        ...currProps,
        ...attrs,
        key: item.key,
        style: {
          width,
        },
      }

      const noOptArr = [
        'checkbox-group',
        'radio-group',
        'select',
      ]
      if (options) {
        if (tagType === 'tree-select') {
          obj.data = options
        } else if (!noOptArr.includes(tagType)) {
          obj.options = options
        }
      }
      if (tagType === 'input') {
        obj.onInput = (value) => {
          console.log('input', value)
          let refObj = {};
          if (item.ref) {
            refObj[item.ref] = this.$refs[item.ref];
          }
          this.form[item.key] = value;
          this.emitInput(value, item, refObj);
        }
      } else {
        obj.onChange = (value) => {
          console.log('input', value)
          value = this.formatDateValue(value, item);
          let refObj = {};
          if (item.ref) {
            refObj[item.ref] = this.$refs[item.ref];
          }
          this.form[item.key] = value;
          this.emitInput(value, item, refObj);
        }
      }
      for (let key in itemOn) {
        const createFn = (fn) => {
          return (...args) => {
            // 为自定义事件新增参数
            fn(...args, item, this.form);
          };
        };
        obj[key] = createFn(itemOn[key])
      }
      if (item.hasOwnProperty('ref')) {
        obj.ref = item.ref;
      }
      const optsArr = [
        'select-v2',
        'tree-select',
        'cascader',
      ]
      if (optsArr.includes(item.type)) {
        return h(tagName, obj);
      } else {
        return h(tagName, obj, options);
      }
    },
    formatDateValue(value, item) {
      if (['date', 'datetime'].includes(item.type)) {
        return value ? value : '';
      } else if (['daterange', 'datetimerange'].includes(item.type)) {
        return value ? value : ['', ''];
      }
      console.log('formatDateValue', value)
      return value;
    },
    emitInput(value, item, refObj) {
      if (typeof item.onInput === 'function') {
        item.onInput(value, item, this.form, refObj);
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
        return this.getFormItem(item, this.getContent(item))
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
            children,
            this.getContent(children)
          )
          let childrenParts = h(
            getPrefix('col'),
            {
              span: 24 / grid,
            },
            [childrenItem]
          )
          childrenList.push(childrenParts)
        }
        let row = this.getRow(childrenList)
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
            children,
            this.getContent(children)
          )
          let childrenParts = h(
            getPrefix('col'),
            {
              span: 24 / grid,
            },
            [childrenItem]
          )
          childrenList.push(childrenParts)
        }
        let row = this.getRow(childrenList)
        list.push(row)
        gridIndex += 1
        i += grid
      }
      return list
    },
    getRow(childrenList) {
      return h(
        getPrefix('row'),
        childrenList
      )
    },
    getContent(item) {
      let content
      if (typeof item.renderContent === 'function') {
        content = item.renderContent(h, item, this.form)
      } else {
        content = this.renderTagByName(item, item.type)
      }
      return content
    },
    getFormItem(item, content) {
      if (item.isShow === false) return;
      else if (typeof item.isShow === 'function' && item.isShow(this.form, item) === false) {
        return;
      }
      if (typeof item.render === 'function') {
        return item.render(h, item, this.form)
      } else {
        let settings = {
          prop: item.key,
          label: item.title,
          ...item.settings
        }
        return h(
          getPrefix('form-item'),
          settings,
          {
            label: () => this.renderTitle(h, item, this.form),
            default: () => [content]
          }
        )
      }
    },
    isRequired(item){
      if (!item.rule) return false
      if (Array.isArray(item.rule)) {
        return item.rule.some(it => it.required)
      } else {
        return item.rule.required
      }
    },
    // 渲染 title
    renderTitle(h, item) {
      if (item.renderTitle) {
        let tip = !!this.isRequired(item) ? h('span', { style: 'color: red' }, '*') : ''

        let renderBox = typeof item.renderTitle === 'function' ? item.renderTitle(h, item, this.form) : item.title

        return h(
          'span',
          [
            tip, renderBox
          ]
        );
      } else if (item.title) {
        return h(
          'span',
          [
            item.title
          ]
        );
      } else {
        return ''
      }
    },
    renderTagByName(item) {
      const childrenArr = [
        'select',
        'checkbox-group',
        'radio-group'
      ]
      const optsArr = [
        'select-v2',
        'tree-select',
        'cascader'
      ]
      let tag = {
        item,
        tagType: item.type,
        tagName: getPrefix(item.type),
      }
      if (childrenArr.includes(item.type)) {
        tag.options = this.renderTagChildren(item)
      } else if (optsArr.includes(item.type)) {
        tag.options = item.options || []
      }
      return this.generateTag(tag)
    },
    renderTagChildren(item) {
      let optFn = (option) => {
        return {
          label: option.text,
          value: option.value,
          disabled: option.disabled
        }
      }
      let opts = []
      switch (item.type) {
        case 'select':
          opts = item.options.map((option) => {
            return h(
              getPrefix('option'),
              {
                ...(optFn(option))
              },
              typeof item.renderOption === 'function' ? [item.renderOption(h, option, item)] : ''
            )
          })
          break;
        case 'checkbox-group':
          opts = item.options.map((option) => {
            return h(
              getPrefix('checkbox'),
              {
                ...(optFn(option))
              },
              typeof item.renderOption === 'function' ? [item.renderOption(h, option, item)] : ''
            )
          })
          break;
        case 'radio-group':
          const props = item.props || {}
          opts = item.options.map((option) => {
            return h(
              getPrefix(props?.radioButton ? 'radio-button' : 'radio'),
              {
                ...(optFn(option))
              },
              typeof item.renderOption === 'function' ? [item.renderOption(h, option, item)] : ''
            )
          })
          break;
        default:
          break;
      }
      return opts
    },
  },
  render() {
    console.log('执行了render')
    return h(ElForm, {
      model: this.form,
      'label-width': this['labelWidth'] + 'px',
      ...this.options,
      rules: this.rules,
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