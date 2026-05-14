---
title: CSS八股
description: CSS八股
sidebar_position: 4
date: 2026-05-14
---

# CSS八股
## CSS路线图
![路线图](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/CSS.png)

## CSS选择器及其优先级

| 选择器类型 | 格式 | 优先级权重 |
|-----------|------|-----------|
| !important 声明 | `property: value !important` | 最高，覆盖所有样式 |
| 内联样式 | `style="..."` | 1000 |
| ID 选择器 | `#id` | 0100 |
| 类选择器 | `.class` | 0010 |
| 属性选择器 | `[attr]` / `[attr="value"]` | 0010 |
| 伪类 | `:hover` / `:nth-child(n)` | 0010 |
| 元素（类型）选择器 | `div` / `p` / `span` | 0001 |
| 伪元素 | `::before` / `::after` | 0001 |
| 通配选择器 | `*` | 0000 |
| 关系选择器 | `+` / `>` / `~` / 空格 | 0000 |

对于选择器的优先级：
- 标签选择器、伪元素选择器：1
- 类选择器、伪类选择器、属性选择器：10
- ID选择器：100
- 内联样式：1000

注意：
- !important 声明具有最高优先级，覆盖所有其他样式。
- 当多个选择器具有相同的优先级时，后定义的样式会覆盖先定义的样式。
- 继承得到的样式的优先级最低
- 关系选择器和通配选择器不增加优先级，但它们可以影响样式的应用范围。
- 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式表 > 浏览器用户自定义样式 > 浏览器默认样式。

## 可继承与不可继承的属性
### 有继承性
#### 字体系列属性
- `font-family`：字体系列
- `font-weight`：字体粗细
- `font-size`：字体大小
- `font-style`：字体样式（如斜体）
- `font-variant`：字体变体（如小型大写字母）
#### 文本系列属性
- `color`：文本颜色
- `text-align`：文本对齐方式
- `text-indent`：文本缩进
- `text-shadow`：文本阴影
- `text-transform`：文本转换（如大写、小写）
- `line-height`：行高
- `letter-spacing`：字母间距
- `word-spacing`：单词间距
#### 元素可见性
- `visibility`：元素可见性（visible、hidden、collapse），控制元素显示隐藏
#### 列表布局属性
- `list-style`：列表样式（如圆点、数字），包括：
    - `list-style-type`：列表标记类型（如圆点、数字）
    - `list-style-position`：列表标记位置（inside、outside）
    - `list-style-image`：列表标记图像
#### 光标属性
- `cursor`：光标样式（如默认、指针、文本）

### 无继承性
#### display
- `display`：元素的显示类型（如块级、行内、内联块），规定元素应该生成的框的类型。

#### 文本属性
- `vertical-align`：垂直对齐方式，控制行内元素的垂直对齐。
- `text-decoration`：文本装饰（如下划线、删除线），控制文本的装饰效果。
- `text-shadow`：文本阴影，控制文本的阴影效果。
- `text-overflow`：文本溢出，控制当文本溢出元素时的显示方式（如省略号）。
- `text-transform`：文本转换，控制文本的大小写转换（如大写、小写）。
- `white-space`：空白处理，控制元素内空白字符的处理方式。
- `overflow`：溢出处理，控制当内容溢出元素时的显示方式（如滚动、隐藏）。
- `unicode-bidi`：Unicode双向文本控制，控制文本的双向显示。

#### 盒子模型属性
- `margin`：外边距，控制元素与其他元素之间的距离。
- `padding`：内边距，控制元素内容与边框之间的距离。
- `border`：边框，控制元素的边框样式、宽度和颜色。
- `width`：宽度，控制元素的宽度。
- `height`：高度，控制元素的高度。

#### 背景属性
- `background`：背景，控制元素的背景样式，包括：
    - `background-color`：背景颜色
    - `background-image`：背景图像
    - `background-position`：背景位置
    - `background-size`：背景大小
    - `background-repeat`：背景重复
    - `background-attachment`：背景附件（如固定、滚动）
    
#### 定位属性
- `float`：浮动，控制元素的浮动方式（如左浮动、右浮动）。
- `clear`：清除浮动，控制元素是否清除前面的浮动元素。
- `position`：定位，控制元素的定位方式（如静态、相对、绝对、固定）。
- `top`：上边距，控制元素相对于其定位上下文的上边距。
- `right`：右边距，控制元素相对于其定位上下文的右边距。
- `bottom`：下边距，控制元素相对于其定位上下文的下边距。
- `left`：左边距，控制元素相对于其定位上下文的左边距。
- `z-index`：层叠顺序，控制元素在堆叠上下文中的层叠顺序。
- `max-width`：最大宽度，控制元素的最大宽度。
- `max-height`：最大高度，控制元素的最大高度。
- `clip`：裁剪，控制元素的可见区域。
- `overflow`：溢出处理，控制当内容溢出元素时的显示方式（如滚动、隐藏）。

#### 生成内容属性
- `content`：生成内容，控制伪元素生成的内容。
- `counter-reset`：计数器重置，控制CSS计数器的重置。
- `counter-increment`：计数器递增，控制CSS计数器的递增。
- `quotes`：引号，控制生成内容中的引号样式。

#### 轮廓样式属性
- `outline`：轮廓，控制元素的轮廓样式、宽度和颜色。
- `outline-color`：轮廓颜色，控制元素轮廓的颜色。
- `outline-style`：轮廓样式，控制元素轮廓的样式（如实线、虚线）。
- `outline-width`：轮廓宽度，控制元素轮廓的宽度。

#### 页面样式属性
- `size`：页面大小，控制打印时页面的大小。
- `page-break-before`：分页符前，控制元素前是否强制分页。
- `page-break-after`：分页符后，控制元素后是否强制分页。
- `page-break-inside`：分页符内，控制元素内部是否允许分页。

#### 声音样式属性
- `pause`：暂停，控制媒体元素的暂停状态。
- `pause-after`：暂停后，控制媒体元素暂停后的行为。
- `pause-before`：暂停前，控制媒体元素暂停前的行为。
- `play-during`：播放期间，控制媒体元素在播放期间的行为。
- `cue`：提示，控制媒体元素的提示行为。
- `cue-before`：提示前，控制媒体元素提示前的行为。
- `cue-after`：提示后，控制媒体元素提示后的行为。

## display属性值

| 属性值 | 作用 |
|--------|------|
| `none` | 隐藏元素，不占据页面空间，不触发渲染 |
| `block` | 块级元素，独占一行，可设置宽高 |
| `inline` | 行内元素，不独占一行，宽高由内容决定 |
| `inline-block` | 行内块元素，不独占一行，但可设置宽高 |
| `flex` | 弹性布局，子元素灵活排列，主轴/交叉轴控制 |
| `inline-flex` | 内联弹性容器，行为类似 `inline-block` 的 flex 容器 |
| `grid` | 网格布局，二维布局系统，行列控制 |
| `inline-grid` | 内联网格容器，行为类似 `inline-block` 的 grid 容器 |
| `table` | 块级表格容器，类似 `<table>` |
| `inline-table` | 内联表格容器 |
| `list-item` | 列表项，生成块级框和标记框（如 `<li>`） |
| `flow-root` | 创建块级格式化上下文（BFC），常用于清除浮动 |
| `contents` | 元素自身不生成框，子元素继承其父级样式位置 |
| `inherit` | 继承父元素的 display 值 |

### block、inline和inline-block的区别
- `block`：块级元素，独占一行，宽高可设置，可设置width、height、margin、padding，常用于布局结构元素（如 `<div>`、`<p>`）。
- `inline`：行内元素，不独占一行，宽高由内容决定，设置width和height无效，，但可以设置水平方向的margin和padding，常用于文本和小型元素（如 `<span>`、`<a>`）。
- `inline-block`：行内块元素，不独占一行，但可设置宽高，常用于需要同时具有行内和块级特性的元素（如按钮、图标）。

