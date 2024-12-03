import { defineComponent, h } from 'vue';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElAutocomplete, ElSelect, ElOption, ElSelectV2, ElTreeSelect, ElCheckboxGroup, ElCheckbox, ElRadioGroup, ElRadio, ElRadioButton, ElDatePicker, ElTimePicker, ElCascader, ElSlider, ElSwitch, ElTimeSelect, ElRow, ElCol } from 'element-plus';


const getPrefix = (tag) => {
  const elementMap = {
    'row': ElRow,
    'col': ElCol,
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
    'date': ElDatePicker,
    'time': ElTimePicker,
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
      default: () => {}
    },
    // 是否启用 grid 布局
    grid: {
      type: [Array, Number],
    },
    // 默认标签宽度
    labelWidth: {
      type: [String, Number],
      default: 100,
    },
    // 默认内容宽度
    contentWidth: {
      type: [Number, String],
      default: '100%',
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
      refObj: {}
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
        'time': '',
        'time-select': '',
        'cascader': [],
        'slider': 0,
        'switch': false,
      }
      this.formList.forEach((item) => {
        let defaultValue = item.defaultValue ? item.defaultValue : map[item.type];
        if (item.type === 'date') {
          if (item.props?.type && item.props?.type?.indexOf('range') !== -1) {
            defaultValue = []
          }
        } else if (item.type === 'time') {
          if (item.props?.type?.isRange) {
            defaultValue = ['', '']
          }
        }
        if (item.key) {
          let disabled = typeof item.disabled == 'function' ? item.disabled(this.form, item) : item.disabled;
          form[item.key] = isExclude && disabled ? form[item.key] : defaultValue;
        }
      })
      return form
    },
    // 生产 tag
    generateTag({ item, tagName, tagType, options }) {
      let disabled = typeof item.disabled === 'function' ? item.disabled(this.form, options) : item.disabled

      let currProps = {
        'model-value': this.form[item.key],
        clearable: true,
        ...(item.props || {}),
        disabled: this.disabled || disabled,
      };
      let attrs = item.attrs || {};

      let itemOn = item.on || {}

      let obj = {
        ...currProps,
        ...attrs,
        key: item.key,
        style: {},
        'onUpdate:modelValue': (value) => {
          this.form[item.key] = value
        }
      }

      if (item.width) {
        obj.style.width = typeof item.width === 'string' ? item.width : (item.width + 'px')
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

      const handleEvent = (value, item) => {
        // value = this.formatDateValue(value, item);
        if (item.ref) {
          this.refObj[item.ref] = this.$refs[item.ref];
        }
        this.form[item.key] = value;
        this.emitInput(value, item, this.refObj);
      };

      if (tagType === 'input') {
        obj.onInput = (value) => handleEvent(value, item);
      } else {
        obj.onChange = (value) => handleEvent(value, item)
      }
      const createFn = (fn) => {
        return (...args) => {
          // 为自定义事件新增参数
          fn(...args, item, this.form);
        };
      };
      const getUpStr = (str) => {
        return 'on' + str.charAt(0).toUpperCase() + str.slice(1)
      };
      for (let key in itemOn) {
        obj[getUpStr(key)] = createFn(itemOn[key])
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
      if (item.type === 'date') {
        if (item.props?.type?.indexOf('range') !== -1) {
          return ['', '']
        } else {
          return value
        }
      } else if (item.type === 'time') {
        return item.props?.type?.isRange ? value : ['', ''];
      }
      return value;
    },
    emitInput(value, item, refObj) {
      if (typeof item.onInput === 'function') {
        item.onInput(value, item, this.form, refObj);
      }
    },
    async submit() {
      const valid = await this.$refs.form.validate();
      this.$emit('submitTataForm', this.getForm(), valid, this.$refs);
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
    async validate(){
      return await this.$refs.form.validate();
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
        // 检查返回值是否为 Promise
        // if (content instanceof Promise) {
        //   // 如果是 Promise，等待其解析
        //   content = await content;
        // }
      } else {
        content = this.renderTagByName(item)
      }
      return content
    },
    getFormItem(item, content) {
      if (item.isShow === false) return null
      if (typeof item.isShow === 'function' && item.isShow(this.form, item) === false) {
        return null
      }
      if (typeof item.render === 'function') {
        return item.render(h, item, this.form)
      } else {
        let w = item.itemWidth || this.contentWidth
        let settings = {
          prop: item.key,
          label: item.title,
          required: !!this.isRequired(item),
          style: {
            width: typeof w === 'string' ? w : (w + 'px')
          },
          ...item.settings
        }
        let obj = {
          default: () => [content]
        }
        if (item.renderTitle) {
          obj.label = () => this.renderTitle(h, item, this.form)
        }
        return h(
          getPrefix('form-item'),
          settings,
          obj
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
        let renderBox = typeof item.renderTitle === 'function' ? item.renderTitle(h, item, this.form) : item.title

        return renderBox
      } else if (item.title) {
        return item.title
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

      // date date-picker
      // date date-picker
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
    return h(ElForm, {
      model: this.form,
      'label-width': typeof this.labelWidth === 'string' ? this.labelWidth : (this.labelWidth + 'px'),
      ...this.options,
      rules: this.rules,
      ref: 'form'
    }, () => [
      this.renderFormList(h),
      this.$slots.default?.()
    ]);
  }
});

export default TataForm;