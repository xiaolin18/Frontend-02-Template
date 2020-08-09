# CSS总体结构
- @charset
- @import (引入)
- rules (现阶段常写)
  - @media (适配)
  - @page（分页媒体 打印机）
  - rule（具体的规则）

# At-rules
1. @charset
2. @import
3. @media
4. @page
5. @counter-style（列表）
6. @keyframes（动画）
7. @fontface
8. supports(检测兼容性)
9. namespace

# rule
1. selector
  - selector_group
  - selector
  - simple_selector
2. declaration
  - key
    - variables
    - properities
  - value
    - calc
    - number
    - length

# 选择器
1. 简单选择器
2. 复合选择器
3. 复杂选择器

# 伪类
1. 链接/行为
2. 树结构
3. 逻辑型

# 伪元素
通过选择器，向界面上添加了不存在的元素
两种机制：
1. 无中生有
2. 把特定意义的部分括起来
::first-line: 已经完成排版后的第一行的一个结果
::first-letter: 用一个不存在的元素把部分文本括起来，让我们对它进行一些处理
# 注意
1. 尽可能不要破坏浏览器的回溯原则

# 思考题
- ::first-letter是在布局完成之后，确定了一段文字中的第一个文字，可以对其操作布局时性能开销小；
- ::first-line选中的是第一行文字，不同的宽度选中的文字内容不一样，要对其重新布局排版消耗性能大.
