# 排版
1. 正常流
2. 基于flex技术的排版
3. 基于Grid的排版
> 排版源于文字

## 行级排布
- 行内盒基线位置会随自己内部文字变化，不建议使用行内盒的基线对齐，可以设置属性vertical-align设置基线对齐方式(日常布局时曾遇到过，没有查过为什么...)

```
vertical-align: top | bottom | middle | text-top | text=bottom
```

## 块级排布

### Block-level Box
- display: block | flex | table | grid

### BFC
margin堆叠，留最高的margin
#### 创建BFCC
1. floats
2. absolutes
3. block containers
4. block boxes with overflow other than visible

#### BFC合并
1. 同BFC会合并折叠

# Flex（目前常用的布局方式）
1. 计算主轴方向
- 找出所有Flex元素
- 把主轴方向剩余尺寸按比例分配给这些元素；
- 若剩余空间为负，所有flex元素未0，等比压缩剩余元素
2. 计算交叉轴方向
- 根据每一行中最大元素尺寸计算行高
- 根据行高flex-align和item-align，确定元素具体位置

# 动画与绘制
## animation
- animation-name：时间曲线
- animation-duration: 动画时长
- animation-timing-function: 动画的时间曲线
- animaton-delay: 动画开始前的延迟
- animation-iteration-count: 动画播放次数
- animation-direction: 动画的方向
- @keyframes

## Transition
- transition-property: 要变换的属性
- transition-duration: 变换时长
- transition-timing-function: 时间曲线（三次贝塞尔曲线）
- transition-delay: 延迟

# 颜色
## HSL && HSV

# 绘制
1. 几何图形
- border
- box-shadow
- border-radius
2. 文字
- font
- font-decoration
3. 位图
- background-image

data-uri + svg