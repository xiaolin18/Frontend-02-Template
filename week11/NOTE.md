学习笔记

# proxy与双向绑定

## proxy
1. Proxy用于修改某些操作的默认行为，等同于在语言层面作出修改，属于一种“元编程”。
2. 目标对象之前架设一层“拦截”，类似nginx,可定制拦截行为。

# 语法
```
new Proxy(target, handler);
```
## Proxy支持的拦截操作
### get

```
get(target, propKey, receiver?)
```
1. 描述：用于拦截某个属性的读取操作（可继承）
2. 参数：
- target: 目标对象
- propKey：属性名
- receiver: proxy实例本身
### set

```
set(target, propKey, value, receiver?)
```
1. 描述：拦截某个属性的赋值操作。

### has

```
has(target, propKey)
```
描述：拦截HasProperty操作，判断对象是否具有某个属性。

### deleteProperty
描述：用于拦截delete操作，如果这个方法抛出错误或者返回false,属性则无法被删除。
```
deleteProperty(target, propKey);
```

### ownKeys
描述：拦截对象自身属性的读取操作；
```
ownKeys(target);
```
### getOwnPropertyDescriptor
描述：拦截Object.getOwnPropertyDescriptor();
```
getOwnPropertyDescriptor(target, propKey);
```
### defineProperty
描述：拦截Object.defineProperty()操作；
```
defineProperty(target, propKey, descriptor);
```

### preventExtensions
描述：拦截Object.preventExtensions()操作；该方法必须返回一个布尔值，否则会被自动转为布尔值。
```
preventExtensions(target);
```

### getPrototypeOf
描述：用来拦截获取对象原型
```
getPrototypeOf(target);
```

### isExtensible
描述：拦截Object.isExtensible()操作；
```
isExtensible(target);
```
### setPrototypeOf
描述：用来拦截Object.setPrototypeOf()操作；
```
setPrototypeOf(target, proto);
```

### apply
描述：拦截函数的调用、call和apply操作；
```
apply(target, ctx, args);
```

### construct
描述：用于拦截new命令；
```
construct(target, args, newTarget);
```

## Proxy.revovable()
返回一个可取消的proxy实例；

## 注意
1. 如果handler没有设置任何拦截，那就等同于直接通向原对象。

## 技巧
1. 将 Proxy 对象，设置到object.proxy属性，从而可以在object对象上调用。

```
var object = { proxy: new Proxy(target, handler) }
```

2. Proxy 实例也可以作为其他对象的原型对象。

```
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
```
## 双向绑定
所谓的双向绑定：Model <===> View
Vue3.0实际是一种半双向绑定，负责从数据到DOM元素这一条线的事件监听；

# 拖拽
1. 拖拽必须作用在document上，否则拖出浏览器就会失效；
2. 使用drag事件无法让元素始终跟随鼠标移动，所以需要使用mouse这一组事件来模拟；
3. 注意计算位置细节