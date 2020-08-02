/**
 * 获取并转化style
 * @param {*} element
 * @returns
 */
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (const prop in element.computedStyle) {
    var p = element.computedStyle.value;
    element.style[prop] = element.computedStyle[prop].value;

    // 处理单位
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    } 
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout (element) {
  if(!element.computedStyle) {
    return;
  }

  var elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex') {
    // 过滤不处理非flex布局的style，简化处理
    return
  }

  // 过滤子节点中的非元素节点
  var items = element.children.filter(e=> e.type === 'element');

  items.sort(function(a, b ) {
    // flex order sort
    return (a.order || 0) - (b.order || 0);
  })

  var style = elementStyle;

  ['width', 'height'].forEach(size=> {
    if (style[size] === 'auto' || style[size] === ''){
      style[size] = null;
    }
  })

  // 处理flex属性的默认值
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = style['flex-direction'] || 'row';
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = style['align-items'] || 'stretch';
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = style['flex-wrap'] || 'nowrap';
  }
  if (!style.alginContent || style.alginContent === 'auto') {
    style.alginContent = style['algin-content'] || 'stretch';
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = style['justify-content'] || 'flex-start';
  }
  
  var mainSize, mainStart, mainEnd, mainSign, mainBase,
      crossSize, crossStart, crossEnd, crossSign, crossBase;
  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'rigth';
    mainEnd = 'left';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexWrap === 'wrap-reverse') {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  // 2. 将元素收入行
  var isAutoMainSize = false;
  if (!style[mainSize]) { // 如果没有主轴没有设置宽度，自动撑开
    elementStyle[mainSize] = 0;
    // 遍历前面过滤后的所有子元素节点
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      var itemStyle = getStyle(item);
      // itemStyle define no find
      if (itemStyle[mainSize] !== null && itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }

  var flexLine = [];
  var flexLines = [flexLine];

  var mainSpace = elementStyle[mainSize];
  var crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null || itemStyle[mainSize] === (void 0)) {
      itemStyle[mainSize] = 0;
    }
    if (itemStyle.flex) {
      // 可伸缩元素
      flexLine.push(item);
    } else if (style.flexWrap === 'nowrap' || isAutoMainSize) {
      // 处理nowrap情况
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace <= itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  // 3. 计算主轴
  flexLine.mainSpace = mainSpace;

  // 处理以下crossSpace
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  if (mainSpace < 0) {
    // overflow 溢出如何处理，缩小
    var scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      var itemStyle = getStyle(item);

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      // 主轴计算方式，标记一个start 和 end
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // 如果mainSpace不小于0，说明是多行情况，或者只有一行，且不超出
    flexLines.forEach(function(item){
      var mainSpace = item.mainSpace;
      var flexTotal = 0; // 每一行flex 总值
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);
        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      if (flexTotal > 0) {
        // 总值大于0，说明有flex元素
        var currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // 没有设置flex元素，但还有剩余空间。处理juisty-content
        if (style.justifyContent === 'flex-start') {
          var currentMain = mainBase;
          var step = 0;
        }
        if (style.justifyContent === 'flex-end') {
          var currentMain = mainSpace * mainSign + mainBase;
          var step = 0;
        }
        if (style.justifyContent === 'center') {
          var currentMain = mainSpace / 2 * mainSign + mainBase;
          var step = 0;
        }
        if (style.justifyContent === 'space-between') {
          var currentMain = mainBase;
          var step = mainSpace / (items.length - 1);
        }
        if (style.justifyContent === 'space-around') {
          var step = mainSpace / items.length * mainSign;
          var currentMain = step / 2 + mainBase;
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          var itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    })
  }
  // 4. 计算交叉轴， compute the cross axis sizes
  // align-item， align-self
  var crossSpace;

  if (!style[crossSize]) {
    // 没有设置，则自动撑开 auto sizing
    crossSpace = 0;
    style[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      style[crossSize] = style[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }

  var lineSize = style[crossSize] / flexLines.length;
  var step = 0;
  if (style.alginContent === 'flex-start') {
    crossBase += 0;
    step = 0;
  }
  if (style.alginContent === 'flex-end') {
    crossBase += crossSize * crossSpace;
    step = 0;
  }
  if (style.alginContent === 'center') {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if (style.alginContent === 'space-around') {
    step = crossSpace / (flexLines.length);
    crossBase += crossSign * step / 2;
  }
  flexLines.forEach(function(items) {
    var lineCrossSize = style.alginContent === 'stretch' ? 
      items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
    
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        var itemStyle = getStyle(item);

        var align = itemStyle.alignSelf || style.alignItems;

        if (itemStyle[crossSize] === null) {
          itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
        }
        
        if (align === 'flex-start') {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if (align === 'flex-end') {
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
          itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
        }
        if (align === 'center') {
          itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if (align === 'stretch') {
          itemStyle[crossStart] = crossBase ;
          // 重点思考下
          itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize);
          // 修改高度
          itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
        }
      }
      crossStart += crossSign * (lineCrossSize + step);
  })
}

module.exports = layout;