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



