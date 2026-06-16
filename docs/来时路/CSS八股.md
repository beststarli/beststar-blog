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

## CSS Sprites
CSS Sprites即精灵图，是将页面涉及到的图片都包含到一张大图中，通过CSS的background-position、background-image、background-repeat属性来显示大图中的某个部分。

优点：
- 减少HTTP请求次数、提升页面加载速度。
- 减少图片的字节大小，因为合并图片后可以去掉重复的像素数据。

缺点：
- 在合并图片时，要把多张图片有序的放在一起，会增加设计和维护的复杂度。
- 精灵图在使用中相对比较麻烦，需要获得每个图片准确的像素位置。

## 物理像素、逻辑像素、像素密度
- 物理像素：显示设备上实际存在的像素点数量。
- 逻辑像素：浏览器在渲染页面时使用的抽象像素单位，通常是CSS像素。
- 像素密度：物理像素与逻辑像素的比率，通常用DPI（每英寸点数）或PPI（每英寸像素数）来表示。

以IPhone 17为例，它的物理像素为1170x2532，逻辑像素为390x844，像素密度为3（即每个逻辑像素对应3个物理像素），这就是3倍屏。因此，在CSS中设置的宽度为100px的元素，在IPhone 17上实际占用的物理像素宽度为300px（100px * 3）。如果原始图片是500px x 300px时就要使用1500px x 900px的图片才能保证在IPhone 17上显示清晰不失真。也可以使用CSS媒体查询来针对不同像素密度的设备加载不同分辨率的图片：
```css
my-image {
    background-image: url('low.png');
}

@media only screen and (min-device-pixel-ratio: 2) {
    my-image {
        background-image: url('high.png');
    }
}
```

## 对line-height的理解
line-height指一行文本的高度，包含了字间距，实际是下一行基线到上一行基线的距离。如果一个标签没有定义height属性，那么其表现高度就是line-height，一个容器如果没有设置高度，那么撑开容器的不是容器内文本内容而是line-height，line-height和height都可以撑开高度。将line-height设置为与height相同可以实现单行文本垂直居中。

赋值方式：
- 纯数值：如`line-height: 1.5`，表示line-height是font-size的1.5倍。会将比例传递给子元素，子元素行高为子元素font-size的1.5倍。
- 百分比：如`line-height: 150%`，表示line-height是font-size的150%。
- 长度单位：如`line-height: 24px`，表示line-height为24像素。em和rem单位也可以用来设置line-height，分别表示相对于元素的font-size和根元素的font-size。
- 关键字：如`line-height: normal`，表示使用浏览器默认的line-height值，通常为1.2倍的font-size。

## CSS性能优化
### 加载性能
- CSS压缩：将写好的css文件进行压缩，去掉空格、换行、注释等无用字符，减少文件体积，加快加载速度。
- CSS单一样式：当需要下边距和左边距时，多数时候会使用`margin: top 0 bottom 0`，但`margin-bottom: bottom; margin-left: left`更高效。
- 减少是用@import，建议使用link标签引入CSS文件，因为@import会增加HTTP请求次数，降低加载性能。

### 选择器性能
- 关键选择器key selector：选择器的最后面的部分为关键选择器（用来匹配目标元素的部分）。CSS选择符是从右到左进行匹配的，当使用后代选择器时，浏览器会遍历所有子元素来确定是否是指定的元素等等。
- 如果规则拥有ID选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则，这样样式系统就不会浪费时间去匹配他们了。
- 避免使用通配规则则，通配规则会匹配所有元素，性能较差。
- 尽量不对标签进行选择，而是对class进行选择，标签选择器的性能较差。
- 尽量不去使用后代选择器，降低选择器的权重值。后代选择器的开销最高，尽量让选择器的深度不超过三层。
- 了解哪些属性是可以通过继承得到的，避免对这些属性重复指定规则。

### 渲染性能
- 谨慎使用高性能属性：float、position。
- 尽量减少页面重排、重绘。
- 去除空规则。
- 属性值为0时，去掉单位。
- 属性值为浮动小数时，可以省略小数点前的0。
- 标准化各种浏览器前缀：带浏览器前缀的在前，标准属性在后。
- 不使用@import前缀。
- 选择器优化嵌套，避免较深层级。
- CSS精灵图，在使用前评估好维护成本。
- 正确使用display属性，由于display的作用某些样式组合会失效，徒增样式体积的同时也影响解析性能。
- 不滥用web字体：对于中文网站来说，web字体的体积通常较大，加载时间较长，建议使用系统字体或只使用必要的字符集。

### 可维护性与健壮性
- 将具有相同属性的样式抽离出来，整合并通过class在页面中进行使用，避免重复代码。
- 样式与内容分离：将CSS代码定义在外部CSS文件中。

## CSS预处理器与后处理器
- 预处理器：如Sass、Less、Stylus等，用来预编译Sass或者less，增加CSS代码的复用性。层级、mixin、变量、循环、函数等对编写以及开发UI组件都极为方便。
- 后处理器：如PostCSS，通常是在完成的样式表中根据CSS规范处理CSS，让其更加有效，目前最常做的是给CSS属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

CSS预处理器为CSS增加一些编程特性，无需考虑浏览器的兼容问题，可以在CSS中使用变量、简单的逻辑程序、函数等，让CSS更加简洁，增加适应性、可读性和可维护性。CSS预处理语言有：Sass、Less、Stylus、Turbine、Switch CSS、CSS Cacheer、DT CSS等。

使用原因：
- 结构清晰、便于扩展
- 可以很方便的屏蔽浏览器私有语法的差异
- 可以轻松实现多重继承
- 完美兼容了CSS代码，兼容新老项目

## ::before和:after单双冒号区别
- :用于CSS3伪类，::用于CSS3伪元素。
- ::before就是一个子元素的存在，定义在元素主体内容之前的一个伪元素，不存在DOM之中只存在于页面之中。

:before和:after这两个伪元素是在CSS2.1引入的，最初伪元素的前缀是单冒号，但在CSS3中伪元素被修改成使用双冒号，成为::before和::after，以区分伪类和伪元素。

## display:inline-block什么时候显示间隙
- 有空格时会有间隙，可以删除空格解决
- margin为正时，可以设置margin为负值解决
- 使用font-size时，可通过设置font-size:0、letter-spacing、word-spacing解决

## 文本溢出隐藏
- 单行文本溢出隐藏：
```css
overflow: hidden;   // 溢出隐藏
text-overflow: ellipsis;   // 溢出显示省略号
white-space: nowrap;   // 不换行
```
- 多行文本溢出隐藏：
```css
overflow: hidden;   // 溢出隐藏
text-overflow: ellipsis;   // 溢出显示省略号
display: -webkit-box;   // 创建一个伸缩容器
-webkit-box-orient: vertical;   // 设置伸缩容器的子元素排列方式为垂直
-webkit-line-clamp: 3;   // 显示的行数，超过3行则溢出隐藏
```

## Sass、Less是什么
Sass和Less都是CSS预处理器，是一种CSS的抽象层。他们是一种特殊的语法/语言编译成的CSS。Less是一种动态样式语言，将CSS赋予了动态语言的特性：变量、继承、运算、函数；Less可以在客户端也可以在服务端运行。

为什么使用：
- 结构清晰、便于扩展。方便屏蔽浏览器私有语法的差异。封装对浏览器语法差异的重复使用的代码，减少冗余。
- 轻松实现多重继承。完全兼容CSS代码，兼容新老项目。

## 媒体查询
媒体查询由一个可选的媒体类型和零个或多个使用媒体功能的限制了样式表范围的表达式组成，如宽度、高度和颜色。媒体查询在CSS3引入，允许内容的呈现针对一个特定范围的输出设备进行裁剪，而不必改变内容本身，适合Web网页应对不同型号的设备而做出对应的响应适配。

媒体查询包含一个可选的媒体类型和满足CSS3规范的条件下的一个或多个表达式，这些表达式描述了媒体特征，最终会被解析为布尔值。如果媒体查询中指定的媒体类型匹配展示文档所使用的设备类型，并且所有表达式的值为true，那么媒体查询结果为true，媒体查询内的样式生效。
```css
<！-- Link元素中的CSS媒体查询 -->
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
<！-- 样式表中的CSS媒体查询 -->
<style>
@media (max-width: 600px) {
    • facet_sidebar {
        display: none;
    ｝
｝
</ style>
```
简单来说使用@media查询，可以针对不同的媒体类型定义不同的样式。@media可以针对不同的屏幕尺寸设置不同的样式，特别是需要设置响应式设计时，@media非常有用。当重制浏览器大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。

## CSS工程化
为了解决的问题：
- 宏观设计：CSS代码如何组织、如何拆分、模块结构怎么设计
- 编码设计：如何写好CSS
- 构建：如何使打包结果最优
- 可维护性：如何最小化变更成本

流行与普适性的CSS工程化实践：
- 预处理器：Less、Sass等
- 工程化插件：PostCSS
- Webpack loader等

### 为什么要用预处理器
预处理器就是CSS的“轮子”，预处理器支持写一种类似CSS而实际不是CSS的语言，再将其编译成CSS代码。

前端工程对CSS的诉求：
- 宏观设计：希望能优化CSS文件的目录结构，对现有CSS文件实现复用。
- 编码优化：希望能写出结构清晰、简明易懂的CSS，需要CSS具有一目了然的嵌套层级关系，希望CSS具有变量特征、计算能力、循环能力等可编程性。
- 可维护性：更优质的代码结构和更强的拓展能力。

预处理器具备的特性：
- 嵌套代码的能力，通过嵌套反映不用CSS属性间的层级关系
- 支持定义CSS变量
- 提供计算函数
- 允许对代码片段进行封装和复用
- 允许使用条件语句和循环语句
- 支持模块化开发，允许将CSS代码拆分成多个文件进行管理

### PostCSS如何工作
PostCSS是一个对CSS进行解析和处理的工具，将旧的CSS代码转换成新的CSS代码。它与预处理的不同在于，预处理器处理的是类CSS，而PostCSS处理的是CSS本身。就像Babel可以将高版本的JS代码转换为低版本的JS代码一样，PostCSS可以做类似的事：可以编译尚未被浏览器广泛支持的先进CSS语法，还可以自动为一些需要兼容的语法增加前缀。另外，PostCSS有强大的插件机制，支持各种扩展。

PostCSS的使用场景：
- 提高CSS代码的可读性
- 适配低版本浏览器
- 编写面向未来的CSS代码

### Webpack处理CSS
Webpack在裸奔状态下，是不能处理CSS的，Webpack本身是一个面向JS且只能处理JS代码的模块化打包工具，不过Webpack在loader的辅助下可以处理CSS。

要实现Webpack对CSS的处理需要使用css-loader和style-loader两个关键的loader：
- css-loader：导入CSS模块，对CSS代码进行编译处理
- style-loader：创建style标签，把CSS内容写入标签

实际使用中，css-loader的执行顺序一定安排在style-loader前面，因为完成了编译才能对CSS代码进行插入，若提前插入未编译的代码，Webpack是无法理解的。

## 如何判断元素到达可视域
![可视域](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/可视域.png)
- window.innerHeight：浏览器窗口的内高度，即可视区域的高度。
- document.body.scrollTop || document.documentElement.scrollTop：页面滚动的距离，即元素距离页面顶部的距离。
- imgs.offsetTop：元素距离页面顶部的距离,包括滚动条的距离
- 内容到达显示区域的条件：img.offsetTop < window.innerHeight + document.body.scrollTop

## z-index失效
z-index元素的position属性需要是relative、absolute、fixed或sticky，否则z-index属性不会生效。
- 父元素position为relative时，子元素的z-index失效，可以将父元素的position改为absolute或fixed来解决。
- 元素没有设置position属性为非static属性时z-index会失效。可以设置该元素的position属性为relative、absolute、fixed或sticky来解决。
- 元素在设置z-index的同时还设置了float浮动会导致z-index失效，可以去掉float属性来解决，改为display:inline-block来实现浮动效果。

## em和rem单位
em和rem相对px更具灵活性，他们都是相对长度单位，区别在于em相对于父元素，rem相对于根元素。
- em：文本相对长度单位，相对于当前对象内文本的字体尺寸。如果当前行内文本的字体尺寸未被人为设置，则采用浏览器的默认字体尺寸（16px）。
- rem：CSS3新增的相对单位，相对于根元素（html）的font-size的倍数。利用rem可以实现简单的响应式布局，可以利用html元素中字体的大小与屏幕间的比值来设置font-size的值，从而实现当屏幕分辨率变化让元素也随之改变。

## px、em、rem的区别与使用场景
三者的区别：
- px是固定的像素，一旦设置了就无法因为适应页面大小而改变
- em和rem相对于px更具有灵活性，他们是相对长度单位，长度不是固定的，更适用于响应式布局
- em是相对于父元素的字体大小，这就存在一个问题，进行任何元素设置都有可能需要知道他父元素的大小，而rem是相对于根元素的字体大小，使用起来更简单，不需要考虑父元素的字体大小

使用场景：
- 对于只需要适配少部分移动设备且分辨率对页面影响不大的，使用px即可
- 对于需要适配各种移动设备，使用rem，例如iphone和ipad等分辨率差别较大的设备

## 移动端适配
移动端适配主要有两个维度：
- 适配不同的像素密度：针对不同的像素密度，使用CSS媒体查询，选择不同精度的图片，以保证图片不会失真。
- 适配不同屏幕大小：由于不同的屏幕有着不同的逻辑像素大小，所以如果直接使用px作为开发单位，会使得开发的页面在同一款手机上可以准确显示，但是在另一款手机上就会失真，为了适配不同屏幕的大小，应按照比例来还原设计稿的内容。

为了能让页面的尺寸自适应，可以使用rem、em、vw、vh等相对单位。

## 对flex布局的理解及使用场景
设为flex布局后，子元素的float、clear和vertical-align属性将失效。采用flex布局的元素称为flex容器，他的所有子元素自动成为容器成员，称为flex项目。容器默认有两根轴：水平主轴和垂直交叉轴，项目默认沿水平主轴排列。

### 设置在容器上的属性
- flex-direction：定义主轴的方向，决定了项目的排列方式（水平或垂直）。默认值为row，即水平排列。
- flex-wrap：定义如果一行排不下，如何换行。默认值为nowrap，即不换行。
- flex-flow：flex-direction和flex-wrap的简写形式，默认值为row nowrap。
- justify-content：定义了项目在主轴上的对齐方式，默认值为flex-start，即从主轴的起点开始排列。
- align-items：定义了项目在交叉轴上的对齐方式，默认值为stretch，即如果项目未设置高度或设为auto，将占满整个交叉轴。
- align-content：定义了多行项目的对齐方式。默认值为stretch，即如果项目未设置高度或设为auto，将占满整个交叉轴。

### 设置在项目上的属性
- order：定义项目的排列顺序，数值越小，排列越靠前，默认为0。
- flex-grow：定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。
- flex-shrink：定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
- flex-basis：定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。默认值为auto，即项目的本来大小。
- flex：flex-grow、flex-shrink和flex-basis的简写，默认值为0 1 auto。建议使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算其他两个属性的默认值。
- align-self：允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性，默认值为auto，即继承父元素的align-items属性，如果没有父元素，则等同于stretch。

### flex:1表示什么
flex属性是flex-grow、flex-shrink和flex-basis的简写，默认值为0 1 auto。flex:1表示flex: 1 1 0:
- 第一个参数表示flex-grow，值为1表示如果存在剩余空间，该项目将占据剩余空间的全部。
- 第二个参数表示flex-shrink，值为1表示如果空间不足，该项目将缩小。
- 第三个参数表示flex-basis，值为0表示在分配多余空间之前，项目占据的主轴空间为0。

flex:1的效果是让项目占满剩余空间，并且在空间不足时缩小。flex:1是一个常用的设置，可以让项目在主轴上占据剩余空间，同时保持其原有的大小和比例。

### flex-shrink计算公式
flex-shrink 决定了当 flex 容器空间不足时，每个 flex 项目的缩小比例。
![flex-shrink](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/flex-shrink.png)

## 响应式设计
响应式网站设计是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。基本原理是通过媒体查询@media查询检测不同的设备屏幕尺寸做处理，页面头部必须有meta标签声明viewport，告诉浏览器如何控制页面的尺寸和缩放。
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

## 浮动与清除方式
浮动是指非IE浏览器下，容器不设高度且子元素浮动时，容器高度不能被内容撑开。此时内容会溢出到容器外面而影响布局，这种现象被称为浮动。

### 浮动的原理
- 浮动元素脱离文档流，不占据空间，引起高度塌陷现象
- 浮动元素碰到包含它的边框或者其他浮动元素的边框停留

浮动元素可以左右移动，直到遇到另一个浮动元素或者遇到它外边界的包含框。浮动框不属于文档流中的普通流，当元素浮动之后，不会影响块级元素的布局，只会影响内联元素的布局，此时文档流中的普通流就会表现的该浮动框不存在一样。当包含框的高度小于浮动框的时候，就会出现高度塌陷。

### 浮动元素引起的问题
- 父元素的高度无法被撑开，影响与父元素同级的元素
- 与浮动元素同级的非浮动元素会跟随其后
- 若浮动的元素不是第一个元素，则该元素之前的元素也要浮动，否则会影响页面的显示结构

### 清除浮动的方式
- 给父元素div设置height属性，强制父元素具有高度。
- 最后一个浮动元素之后添加一个空的div标签，并添加clear:both属性，清除浮动。
- 包含浮动元素的父级标签添加overflow:hidden属性或overflow:auto属性，触发BFC（块级格式化上下文），使父级标签包含浮动元素。
- 使用::after伪元素，在最后一个浮动元素之后添加一个伪元素，并设置clear:both属性，清除浮动。
```css
.clearfix::after {
    content: "";
    display: block;
    clear: both;
}
```

### clear清除浮动的原理
使用clear属性清除浮动，语法如下：
```css
clear: none | left | right | both | inherit;
```
官方对clear属性的解释是：“元素盒子的边不能和前面的浮动元素相邻”，对元素设置clear属性是为了避免浮动元素对该元素的影响，而不是清除掉浮动。

clear属性指的是元素盒子的边不能和前面的浮动元素相邻，clear属性对后面的浮动元素是没有影响的。由于float属性要么为left要么为right，因此当clear:left有效时clear:right就无效，也就是clear:left等同于设置了clear:both。所以事实上直接使用clear:both就可以了。

一般使用伪元素的方式来消除浮动：
```css
.clear::after {
    content: "";
    display: block;
    clear: both;
}
```
clear属性只有块级元素才有效，而::after等伪元素默认都是内联水平，也就是借助伪元素消除浮动影响时需要设置display属性的原因。

## 对BFC的理解
两个相关的概念：
- Box：Box是CSS布局的对象和基本单位，一个页面是由多个Box组成的，这个Box就是我们所说的盒模型。
- Formatting context：块级上下文格式化，它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。

块可视化上下文（Block Formatting Context，BFC）是Web页面的可视化CSS渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

通俗来说BFC是一个独立的布局环境，可以理解为一个容器，在这个容器中按照一定规则进行物品摆放，并且不会影响其他环境中的物品。如果一个元素符合触发BFC的条件，则BFC中的元素布局不受外部影响。

### 创建BFC的条件
- 根元素body
- 元素设置浮动：float除none以外的值
- 元素设置绝对定位：position（absolute、fixed）
- display值为：inline-block、table-cell、table-caption、flex等
- overflow值为：hidden、auto、scroll等

### BFC特点
- 垂直方向上，自上而下排列，和文档流的排列方式一致
- 在BFC中上下相邻的两个容器的margin会重叠
- 计算BFC的高度时，需要计算浮动元素的高度
- BFC区域不会与浮动的容器发生重叠
- BFC是独立的容器，容器内部元素不会影响外部元素
- 每个元素的左margin值和容器的左border相接触

### BFC的作用
- 解决margin的重叠问题：由于BFC是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个BFC就解决了margin重叠问题。
- 解决高度塌陷的问题：在对子元素设置浮动后，父元素会发生高度塌陷，也就是父元素的高度变为0，只需要将父元素变为BFC就可以解决这个问题，常用的办法是将父元素设置overflow:hidden。
- 创建自适应两栏布局：可以用来创建自适应两栏布局，左栏宽度固定，右栏宽度自适应。
```css
.left {
    width: 100px;
    height: 200px;
    background-color: red;
    float: left;
}

.right {
    height: 300px;
    background-color: blue;
    overflow: hidden; /* 触发BFC */
}
```
左侧设置float:left，右侧设置overflow:hidden触发BFC，BFC的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠，实现了自适应双栏布局。

## margin重叠
两个块级元素的上外边距和下外边距可能会合并（折叠）为一个外边距，其大小会取其中外边距值大的那个，这种行为就是外边距折叠。需要注意的是，浮动的元素和绝对定位这种脱离文档流的元素的外边距不会折叠。重叠只会出现在垂直方向。

计算原则：
- 如果两者都是正数，那么取最大者
- 如果是一正一负，那么就相加
- 如果两者都是负数，那么取最小者

解决方法：
- 兄弟元素间折叠：
    - 底部元素变为行内盒子：display:inline-block
    - 底部元素设置浮动：float
    - 底部元素的position设置为absolute或fixed
- 父子元素间折叠：
    - 父元素加入overflow:hidden，触发BFC
    - 父元素添加透明边框：border:1px solid transparent
    - 子元素变为行内盒子：display:inline-block
    - 子元素加入浮动属性或定位

## 元素层叠顺序
层叠顺序（stacking order）表示元素发生层叠时有着特定的垂直显示顺序。
![层叠顺序](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/层叠顺序.png)
由上到下分别是：
1. 背景和边框：建立当前层叠上下文元素的背景和边框
2. 负z-index的子元素：按照z-index值从小到大排列
3. 块级盒子：文档流内非行内级非定位后代元素
4. 浮动盒子：非定位浮动元素
5. 行内盒子：文档流内行内级非定位后代元素
6. z-index:0：层叠级数为0的定位元素
7. 正z-index的子元素：按照z-index值从大到小排列

当定位元素z-index设置为auto时，生成盒在当前层叠上下文中的层级为0，不会建立新的层叠上下文，除非是根元素。

## position属性

| 属性值 | 概述 |
| :----- | :--- |
| `static` | **默认值**，没有定位，元素出现在正常的文档流中。会忽略 `top`、`bottom`、`left`、`right` 或 `z-index` 声明。块级元素从上往下纵向排布，行级元素从左向右排列。 |
| `relative` | **相对定位**，相对于元素**原来的位置**进行定位。元素的位置通过 `left`、`top`、`right`、`bottom` 属性进行规定。元素仍占据原有文档流空间。 |
| `absolute` | **绝对定位**，生成绝对定位的元素，相对于 **static 定位以外**的最近一个父元素进行定位。元素的位置通过 `left`、`top`、`right`、`bottom` 属性进行规定。脱离文档流，不占据空间。 |
| `fixed` | **固定定位**，生成绝对定位的元素，相对于**浏览器视口（viewport）** 来定位。元素的位置在屏幕滚动时不会改变。常用于回到顶部按钮、导航栏等。 |
| `inherit` | 规定从父元素继承 `position` 属性的值。 |

### relative
元素的定位永远是相对于元素自身位置的，和其他元素没关系，也不会影响其他元素。
![relative](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/relative.png)

### fixed
元素的定位是相对于window或者iframe边界的，和其他元素没有关系，但是它具有破坏性，会导致其他元素位置的变化。
![fixed](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/fixed.png)

### absolute
元素的定位相对前两者要复杂。如果为absolute设置了top、left，浏览器会递归查找该元素的父元素来确定它的纵向和横向的偏移量，如果找到一个设置了position为relative、absolute或fixed的父元素，就以这个父元素为参照物来定位，如果没有找到这样的父元素，就以浏览器边界为参照物来定位。
![absolute1](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/absolute1.png)

![absolute2](https://blog-1385521233.cos.ap-guangzhou.myqcloud.com/docs/job/absolute2.png)

## display、float、position的关系
1. 首先判断display属性是否为none，如果为none则position和float属性的值不影响元素最后的表现。
2. 然后判断position的值是否为absolute或fixed，如果是则float属性失效，并且display的值应该被设置为table或者block，具体转换需要看初始转换值。
3. 如果position的值不为absolute或者fixed，则判断float属性的值是否为none，如果不是则display的值按上面的规则转换。如果position的值为relative并且float属性的值存在，则relative相对于浮动后的最终位置定位。
4. 如果float的值为none，则判断元素是否为根元素，如果是根元素则display属性按照上面的规则转换，如果不是，则保持指定的display属性值不变。

总之可以把他们的关系看作一个类似优先级的机制：position:absolute或position:fixed优先级最高，当它存在时浮动不起作用，display的值也需要调整；其次元素的float属性不为none或者是根元素时，调整display的值；最后，非根元素且非浮动元素，并且非绝对定位的元素，display的值同设置值。

## absolute与fixed
共同点：
- 改变行内元素的呈现方式，将display设置为inline-block
- 使元素脱离普通文档流，不再占据文档物理空间
- 覆盖非定位文档元素

不同点：
- absolute与fixed的根元素不同，absolute的根元素可以设置，fixed根元素是浏览器。
- 在有滚动条的页面中，absolute会跟着父元素进行移动，fixed固定在页面的具体位置。

## sticky定位
sticky定位可以称为粘性定位，position:sticky基于用户的滚动位置来定位。

粘性定位的元素是依赖于用户的滚动，在position:relative与position:fixed定位之间切换。当元素在视口内时，表现为relative定位；当元素滚动到指定位置时，表现为fixed定位，直到其父元素的边界被滚出视口时，表现为relative定位。元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。这个特定阈值指的是top、right、bottom或left属性的值。或者说指定top、right、bottom或left属性之一时，才可使粘性定位生效。否则其行为与相对定位相同。

## 画一条0.5px的线
- `transform: scale(0.5)`可以将元素缩放到原来的一半，从而实现0.5px的线条效果。
- `meta viewport`标签中的`initial-scale=0.5`可以将整个页面缩放到原来的一半，从而实现0.5px的线条效果。但这个效果只针对移动端。

## 设置小于12px的字体
在Chrome浏览器中设置字体大小为12px及以下时，默认显示为12px。解决的方法有：
- 使用Webkit的内核的-webkit-text-size-adjust的私有CSS属性解决，只要设置-webkit-text-size-adjust: none;就可以了。但是Chrome版本达到27后就不支持了。
- 使用CSS3的transform缩放属性-webkit-transform: scale(0.5)来缩放字体大小。注意-webkit-transform: scale()缩放的是整个元素的大小，这时如果是内联元素，必须要将内联元素转换成块元素，可以使用display:inline-block或display:block实现。
- 使用图片，如果是固定内容不需要改变的情况下，可以使用图片来代替文本，来实现小于12px的字体显示。

## 如何解决1px问题
1px问题是指在一些Retina屏幕上，移动端页面的1px会显得很粗，呈现出不止1px的效果，这是由于CSS中的1px并不等同于移动设备的1px，他们的比例关系是：
```txt
window.devicePixelRatio = 设备的物理像素 / CSS的逻辑像素
```

### 写成0.5px
如果之前1px的样式是这样：
```css
border: 1px solid #333;
```
可以先用JS获取window.devicePixelRatio的值，然后把这个值通过JSX或模版语法给到CSS的data中，得到类似这样的效果：
```css
<div id="container" data-device={{window.devicePixelRatio}}></div>
```
然后就可以在CSS中用属性选择器来命中devicePixelRatio为某一值的情况，例如尝试命中devicePixelRatio为2的情况：
```css
#container[data-device="2"] {
    border: 0.5px solid #333;
}
```
直接把1px改成1/devicePixelRatio就可以了，这是最简单的方法，但是缺陷在于兼容性不行，IOS 8以上版本以及安卓系统完全不兼容。

### 伪元素先放大再缩小
在目标元素的后面追加一个::after伪元素，让这个元素布局为absolute之后，整个伸展铺开在目标元素上，然后把长和宽都设置为目标元素的两倍，border值设为1px，借助CSS动画特效中的缩放能力，把整个伪元素缩小为原来的50%，此时伪元素的宽高刚好可以和原本的目标元素对齐，而border也缩小为1px的二分之一，间接实现了0.5px的效果。
```css
#container[data-device="2"] {
    position: relative;
}

#container[data-device="2"]::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    content: "";
    transform: scale(0.5);
    transform-origin: left top;
    box-sizing: border-box;
    border: 1px solid #333
}
```

### viewport缩放
在meta标签中设置viewport的initial-scale值为0.5，来实现整个页面的缩放，从而实现1px的效果。
```html
<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=no" />
```
这里针对像素比为2的页面，把整个页面缩放为原来的二分之一大小，这样本来占用2个物理像素的1px样式现在占用的就是标准的一个物理像素了。根据像素比的不同，这个缩放比例可以被计算为不同的值，用JS代码实现如下：
```js
const scale = 1 / window.devicePixelRatio
// 这里 metaEL 指的是 meta 标签对应的 DOM
metaEL.setAttribute('content', `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no`)
```
这种方法的副作用很大，整个页面都被缩小了，这时1px已经被处理成物理像素大小了，但是原本一些不需要缩小的内容也被无差别缩小掉了。

## Sass和Less的区别
- Less是基于JavaScript实现的，是在客户端处理的；Sass是基于Ruby实现的，是在服务端处理的。
- Sass有条件判断语句if-else和for循环等；Less使用when进行条件判断，新版本添加了if关键字
- 两者都有变量、嵌套、混入、函数等功能
- Sass的功能比Less强大，算是一种真正的编程语言了；Less则相对清晰明了，易于上手，对编译环境要求较宽松。
