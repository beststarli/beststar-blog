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

## 行内元素与块级元素的特点
### 行内元素
- 设置宽高无效，宽高由内容决定。
- 水平方向的margin和padding有效，垂直方向的margin和padding无效。
- 不独占一行，多个行内元素可以在同一行显示，不会自动换行。

### 块级元素
- 可以设置宽高，默认为元素的内容宽高。
- 水平和垂直方向的margin和padding都有效。
- 独占一行，块级元素会自动换行，前后会有换行符。
- 多个块级元素会在新行显示，形成垂直堆叠的布局。

## 隐藏元素的方法
- `display: none`：渲染树不会包含该渲染对象，该元素不会在页面中占据空间，也不会响应绑定的监听事件。
- `visibility: hidden`：元素仍然占据空间，但不可见，不响应绑定的监听事件。
- `opacity: 0`：元素仍然占据空间且可见，但完全透明，仍然响应绑定的监听事件。
- `position: absolute`：通过绝对定位将元素移出正常文档流，使其不占据空间，但仍然可见并响应事件。
- `z-index: -1`：将元素的堆叠顺序设置为负值，使其在其他元素下方，可能被遮挡，但仍然占据空间并响应事件。
- `clip/clip-path`：通过裁剪元素的可见区域使其不可见，仍然占据空间，但并不响应事件。
- `transform: scale(0)`：通过缩放将元素缩小到不可见，仍然占据空间，但不响应事件。

## link和@import的区别
两者都是外部引用CSS文件的方式，但有以下区别：
- link是XHTML标签，除了加载CSS外，还可以定义RSS等其他事物；@import是CSS语法，只能用于加载CSS文件。
- link引用CSS时，在页面载入时同时加载；@import引用CSS时，必须等到页面载入完成后才会加载。
- link是XHTML标签，无兼容性问题；@import是CSS2.1提出的，低版本浏览器可能不支持。
- link支持使用JavaScript控制DOM去改变样式；@import不支持。

## transition和animation的区别
- transition：过渡属性，其实现需要触发一个事件（点击、悬浮、焦点等）才执行动画。类似于flash的补间动画，设置一个开始关键帧，设置一个结束关键帧，过渡属性会在两者之间进行过渡动画。
- animation：动画属性，其实现不需要触发事件，设置好关键帧后就会自动执行动画。类似于flash的帧动画，可以设置多个关键帧，用@keyframes定义，动画会按照关键帧的顺序自动执行。

## `display:none`和`visibility:hidden`的区别
### 渲染树中
- `display: none`：元素不会被渲染树包含，完全从页面中移除，不占据空间。
- `visibility: hidden`：元素仍然被渲染树包含，但不可见，占据空间。

### 是否继承
- `display: none`：不继承，子孙节点会随父节点从渲染树消失，通过修改子孙节点的属性也无法使其显示。
- `visibility: hidden`：继承，子孙节点会随父节点不可见，但可以通过修改子孙节点的属性使其显示。

### 修改后的效果
- 修改常规文档流中元素的`display`属性会触发重排（reflow），因为元素的显示状态改变了页面布局。
- 修改常规文档流中元素的`visibility`属性不会触发重排，只会造成本元素的重绘。

### 读屏器
- `display: none`：元素不会被读屏器读取，因为它完全从页面中移除。
- `visibility: hidden`：元素仍然被读屏器读取。

## 伪元素与伪类
- 伪元素：在内容元素的前面或后面创建一个虚拟元素，这些元素实际并不在文档中生成，不会在文档的源码中找到他们，只在外部显示可见。
```css
p::before {
    content: "前面";
}
p::after {
    content: "后面";
}
p::first-line {
    background: red;
}
p::first-letter {
    font-size: 200%;
}
```
- 伪类：将特殊效果添加到特定的选择器上，是在已有元素上添加类别，不产生新元素。
```css
a:hover {
    color: red;
}
p:first-child {
    font-weight: bold;
}
```

总结：伪元素通过对元素的操作来改变元素，伪类通过在元素选择器上添加伪类改变元素状态。

## 对requestAnimationFrame的理解
JavaScript可以通过定时器`setTimeout`或`setInterval`来实现动画效果，CSS3可以使用`transition`和`animation`来实现，HTML5的`canvas`也可以实现。但这些方法都有性能问题，尤其是在动画帧率较高时，可能会导致页面卡顿或掉帧。为了解决这个问题，HTML5引入了`requestAnimationFrame`方法：

该方法的语法：
```js
requestAnimationFrame(callback);
```
其中`callback`是**下一次重绘之前**更新动画帧所调用的函数，该回调函数会被传入`DOMHighResTimeStamp`类型的参数，表示回调函数被调用时的时间戳。该方法属于宏任务，所以会在执行完微任务之后再去执行。

使用`cancelAnimationFrame()`来取消执行动画，该方法接收一个`requestAnimationFrame()`默认返回的`id`作为参数，只需要传入这个`id`就可以取消动画了。

requestAnimationFrame的优势：
- CPU节能：使用`setInterval`实现的动画在页面被隐藏或最小化时，动画在后台仍执行，由于页面处于不可见或不可用状态，刷新动画没有意义，反而会浪费CPU资源。而`requestAnimationFrame`在页面被隐藏或最小化时会自动暂停动画，节省CPU资源；当页面被激活时，动画就从上次停留的地方继续执行。
- 函数节流：在高频率事件（resize，scroll等）中，为了防止在一个刷新间隔内多次执行函数，`requestAnimationFrame`可保证每个刷新时间间隔内函数只执行一次，这样既保证了流畅性也能很好节省函数执行的开销，一个刷新间隔内函数执行多次没有意义，因为多数显示器的刷新率是60Hz，多次绘制并不会在屏幕上体现出来。
- 减少DOM操作：requestAnimationFrame会会把每一帧的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新率，一般来说这个频率为60Hz。

setTimeout执行动画的缺点：它通过设定间隔时间来不断改变图像位置来实现动画效果，但容易出现卡顿或掉帧现象。原因是：
- setTimeout任务被放入异步队列，只有当主线程任务执行完才会执行队列的任务，因此实际执行时间总比设定时间晚。
- setTimeout的固定时间间隔不一定与屏幕刷新间隔时间相同，会引起丢帧。

## 盒模型
CSS3的盒子模型有两种：标准盒子模型和IE盒子模型。使用方法是在CSS中设置`box-sizing`属性：
- `box-sizing: content-box`：标准盒子模型，默认值。
- `box-sizing: border-box`：IE盒子模型。

![标准盒子模型](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/box.png)

![IE盒子模型](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/iebox.png)

盒子模型都由margin、border、padding和content四部分组成，两个盒模型的区别在于设置width和height时：
- 标准盒模型的width和height范围只包含content。
- IE盒子模型的width和height范围包含content、padding和border。

## 为什么有时候用translate来改变位置而不是定位
translate是transform属性的一个值，改变transform或opacity并不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。而改变绝对定位会触发重新布局，进而触发重绘和复合。translate使浏览器为元素创建一个GPU图层，但改变绝对定位会使用到CPU。因此translate更高效，可以缩短平滑动画的绘制时间。而translate改变位置时，元素依然会占据其原始空间，绝对定位就不会发生这种情况。

## 相邻li之间的空白间隔
浏览器会把inline内联元素间的空白字符（空格、换行、Tab等）渲染成一个空格，为了美观通常是一个`<li>`标签放在一行，这导致`<li>`换行后产生换行字符，它变成一个空格占用一个字符的宽度。解决方法：
- 为`<li>`设置`float: left`。但是有些容器不能设置浮动，比如左右浮动的焦点图片。
- 将`<li>`标签放在同一行。但这样代码不够美观
- 将`<li>`内的字符尺寸设置为0，即`font-size: 0`。但这样`<ul>`内的其他字符尺寸也被设为0，需要额外重新设定其他字符尺寸，且Safari浏览器不支持。
- 消除`<ul>`的字符间隔，即`letter-spacing: -1em`，但这样也设置了`<li>`内的字符间隔，因此需要将`<li>`内的字符间隔设为默认`letter-spacing: normal`，且IE浏览器不支持。

## CSS3新特性
- CSS选择器（`:not(.input)`：表示选择所有不具有`input`类的元素）
- `border-radius`：圆角边框
- `multi-column`：多列布局
- `shadow`：阴影效果，包括`box-shadow`（元素阴影）和`text-shadow`（文本阴影）
- `eflect`：反射效果
- `text-decoration`：文本装饰
- `transform`：变形效果，如旋转、缩放、倾斜等
- 增加了旋转、缩放、定位、倾斜、动画、多背景

## 替换元素的概念及计算规则
替换元素，是指通过修改某个属性值呈现的内容就可以被替换的元素。有以下特性：
- 内容的外观不受页面CSS影响：样式表现在CSS作用域之外，更改替换元素本身的外观需要类似appearance的属性或者浏览器自身暴露的一些样式接口。
- 内在尺寸：替换元素在没有明确设置宽高时，默认的尺寸是300px宽和150px高。
- 内在的表现规则：代表性属性就是`vertical-align`，对于替换元素和非替换元素，默认值`baseline`的含义不同。对于替换元素，`baseline`是元素底部；对于非替换元素，`baseline`是文本基线。

替换元素的尺寸由内而外分为三类：
- 固有尺寸：替换元素本身的尺寸。
- HTML尺寸：只能通过HTML原生属性改变，包括width、height、size等。
- CSS尺寸：特指可以通过CSS的width、height等属性改变的尺寸，对应盒尺寸中的content box尺寸。

三层结果的计算规则具体如下：
- 如果没有CSS尺寸和HTML尺寸，则使用固有尺寸。
- 如果没有CSS尺寸，但有HTML尺寸，则使用HTML尺寸。
- 如果有CSS尺寸，则使用CSS尺寸。
- 如果固有尺寸含有固有的宽高比例，同时仅设置了宽度或仅设置了高度，则元素依然按照固有的宽高比例进行缩放。
- 如果以上的条件都不符合，则元素的尺寸为内在尺寸，即300px宽和150px高。
- 内联替换元素和块级替换元素使用上面同一套尺寸计算规则。

## 常见的图片格式及使用场景

1. BMP：无损格式，既支持索引色，也支持直接色的点阵图。因为几乎没有对数据进行压缩，所以 BMP 格式的图片通常会比较大。

2. GIF：无损格式，采用索引色点阵图，使用 LZW 压缩算法进行编码。文件体积小，是 GIF 的优点，同时它还支持动画和透明。不过 GIF 只支持 8bit 索引色，适合对色彩要求不高、但对文件体积要求较高的场景。

3. JPEG：有损格式，采用直接色的点阵图。它的优点是可以呈现更丰富的色彩，因此非常适合存放照片。但 JPEG 不适合存储企业 Logo、线框类图片，因为有损压缩会导致图片模糊，反而可能比 GIF 占用更大的体积。

4. PNG-8：无损格式，使用索引色的点阵图。它是比较新的图片格式，也是 GIF 的良好替代者。在可能的情况下，优先使用 PNG-8 而不是 GIF，因为在相同图片效果下，PNG-8 通常有更小的文件体积。另外，PNG-8 还支持透明度调节，而 GIF 不支持。除非需要动画支持，否则没有理由优先使用 GIF 而不是 PNG-8。

5. PNG-24：无损格式，使用直接色的点阵图。PNG-24 的优点在于能更好地压缩图片数据，在同样效果下，文件大小通常比 BMP 小得多。当然，PNG-24 的图片体积还是会比 JPEG、GIF、PNG-8 更大。

6. SVG：无损的矢量图。SVG 图片由直线、曲线以及绘制它们的方法组成。放大 SVG 时，看到的仍然是线和曲线，不会出现像素点，所以不会失真，适合绘制 Logo、Icon 等图形。

7. WebP：谷歌开发的新图片格式，同时支持有损和无损压缩，使用直接色的点阵图。从名字就能看出来它是为 Web 而生的，目标是用更小的体积承载相同质量的图片。由于 Web 场景中图片很多，如果能降低单张图片体积，就能减少浏览器和服务器之间的数据传输，从而降低访问延迟、提升体验。目前 Chrome 和 Opera 支持 WebP，兼容性还不够理想。
    - 无损压缩的情况下，相同质量的WebP图片文件大小要比PNG小26%，比JPEG小25%。
    - 有损压缩的情况下，相同质量的WebP图片文件大小要比JPEG小25%-34%。
    - WebP图片格式支持图片透明度，一个无损压缩的WebP图片如果要支持透明度只需要22%额外的文件大小，而PNG图片格式支持透明度需要增加约100%的文件大小。

