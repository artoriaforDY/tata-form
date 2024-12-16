# tata-form

> 封装element-plus表单组件

## 安装

```bash
$ npm install tata-form
```

## 快速开始

``` html
<template>
  <TataForm @submitTataForm="onSubmit" :formList="formList"></TataForm>
</template>

<script setup>
  const formList = [
    {
      title: '姓名',
      key: 'name',
      type: 'input',
      props: {
        placeholder: '请输入姓名'
      },
      onInput(value, item, form) {
        // do something
      }
    }
  ]
</script>
```

## 参数说明

| 参数 | 说明 | 类型 | 默认值 |
| - | - | - | - |
| grid | 栅格 | Number，Array | 1 |
| formList | 配置项（看下面 formList 参数） | Array | [] |
| options | element-plus 原生 props ( 如：:options="{size: 'small'}" ) | Object | {} |
| label-width | 标签的宽度 | Number | 100 |
| content-width | 内容的宽度(支持 数字 百分比 px auto) | Number, String | 100% |
| clearable | 全局控制是否显示清除 icon | Boolean | true |
| disabled | 全局控制是否禁用 | Boolean | false |


## formList 参数
| 参数 | 说明 | 类型 | 默认值 |
| - | - | - | - |
| ref | 设置组件的ref，可在onInput第四参数、submit第三参数获取 | String | - |
| title | 显示的标签 | String | '' |
| width | 单独设置组件宽度(支持 数字 百分比 px auto) | Number,String | - |
| type | 不同的类型默认值不同，具体看下面 type 的种类 | String | '' |
| key | form 里面的 key 就是你定义的 key | String | '' |
| rule | 单个表单验证 | Array/Object | - |
| defaultValue | 组件的默认值, 参见type种类表 | - | - |
| hasRow | isShow为false时是否保留空行 | Boolean,Function(form, item) | true |
| isShow | isShow 为 false 则不显示这个元素，但会留空行，如不想留空行可再添加hasRow:false | Boolean,Function(form, item) | true |
| props | 组件库自带的参数,可以参考 element-plus 文档 | Object | {} |
| attrs | 组件库自带的参数,可以参考 element-plus 文档 | Object | {} |
| options | element-plus 组件中需要options的组件都必填，由 {value: 0, text: '苹果'} 组成 | Array | [] |
| onInput | 默认变更事件，onInput和onChange统一使用该事件 | Function | (value, item, form, allRef) |
| render | 自定义整行 | Function(h, item, form) | - |
| renderTitle | 自定义标签 | Function(h, item, form) | - |
| renderContent | 自定义内容区 | Function(h, item, form) | - |
| disabled | 禁用表单元素，优先级高于全局 | Boolean,Function(form, item) | false |
| settings | formItem 的标签属性，比如 style，class 等 | Object | - |
| on | 当前组件的事件配置项（on: {change: function}） | Object | {} |

## type 种类
| 类型 | 默认值 | 其它 |
| - | - | - |
| input | '' |  |
| input-number | 0 |  |
| select | null | |
| select-v2 | null | |
| tree-select | null | |
| checkbox-group | [] | |
| radio-group | '' | String,Number |
| date | 当前时间，new Date() | |
| time | '' | |
| time-select | '' | |
| switch | false | |
| slider | 0 | |
| cascader | [] | |

## 内置方法
| 名称 | 说明 | 参数 | 返回值 |
| - | - | - | - |
| clear | 清除表单验证 | - | - |
| reset | 还原表单（默认会调用 clear）。支持传一个 Boolean 不对禁用项进行重置 | - | - |
| getFormBykey | 根据 key 来获取 form[key] 的值 | { key: value, ... } | - |
| getForm | 获取 form 的值 | - | { key: value, ... } |
| setForm | 设置 form 的值 | { key: value, ... } | - |
| submit | 手动触发 submit 事件 | - | - |
| validateField | 对部分表单字段进行校验的方法。支持第一个参数是数组 | (props: array or string, callback: Function(errorMessage: string) | - |
| validate | 对表单字段进行校验的方法，返回一个 Boolean | - |

## 更新日志

### 1.0.19
1. 添加update:modelValue事件实时更新表单数据

### 1.0.17
1. 渲染内容时没有type及key的项设为空值

### 1.0.14
1. 修改options为Object

### 1.0.13
1. 添加整体表单验证事件validate并返回一个Boolean

### 1.0.11
1. 修改date及time组件及其默认值
2. label-width参数支持百分比及px固定值
3. 统一使用onUpdate:modelValue事件更新值
4. 添加了itemWidth参数对单行宽度进行修改

### 1.0.10
1. 添加全局clearable参数
2. 优化标题的渲染方式

## LICENSE
MIT
