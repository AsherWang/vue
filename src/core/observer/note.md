### Observer
## Observer对外提供/暴露的东西
|file|item|desc|
|:--|:--|:--|
|index.js|shouldObserve|全局，当前是否处于依赖收集状态|
|index.js|toggleObserving|全局，切换监听状态,某些情况下不需要监视和收集依赖|
|index.js|Observer| 类Observer|
|index.js|observe| Function, 监察一个对象或者一个数组,并返回一个Observer实例|
|index.js|defineReactive| Function, 将一个对象的某个属性定义为可响应的|
|dep.js|pushTarget|将一个Watcher实例压栈，接下来的依赖收集全是对当前栈顶Watcher实例|
|dep.js|popTarget|将栈顶Watcher实例出栈，接下来的依赖收集全是对之后栈顶Watcher实例|
|watcher.js|Watcher|Watcher实例监控特定的值，并在值变化的时候执行特定的操作|



## 开始的地方  
从defineReactive开始埋点(种下依赖)  
每次defineReactive被调用，都会实例化一个Dep,由于闭包的存在，这个dep不会被销毁，
等到对应的getter函数被触发，那就是依赖收集了 

从Watcher开始收集依赖
实例化一个Watcher的时候,如果lazy参数为false(默认false)， 会在实例化的同时完成依赖的收集(watcher.get())



- Watcher实例在开始收集依赖的时候，会将自己通过pushTarget压栈，之后所有的依赖收集全都是对此Watcher实例的,
- 依赖收集完成之后，popTarget

- watcher主要是用在组件中
- 一个组件会有好多watcher
- 一个watcher有好多deps
- 一个dep会有很多订阅者,订阅者其实就是watcher了

- 一个observer会使用一个dep来监察一个value
- 一个value只会被一个observer监察

- 在value的get方法中会使用dep.denpend来完成依赖的收集
- 在value的set方法中会使用dep.notify来完成变化的通知 wachters.update



### 使用方式
# todo: 探索后整理
Vue实例或者组件实例是如何使用Observer的？

初始化的时候，依次初始化props属性，data属性，computed属性和watch属性时，都会和Observer有关系  
#### props
使用defineReactive给实例的_props属性加上一个个可响应的属性  
defineReactive本质是重新定义其getter和setter， getter中添加依赖收集，setter中添加变动通知

todo: Dep.target这个target是哪个target呢？

#### data
data一般回是一个返回data的方法，当然不排除有是plainObj的情况
大致思路 observe(data())  
todo:  怎么就完成依赖收集了
Observer 通过defineReactive给data的各个属性添加getter, setter

### 一个值得注意的事情
beforeCreate之前还没有完成数据方法等的初始化, 所以在这个回调里边同步执行想调用method或者改变data的值是做不到的
```在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用``  





### 延伸问题
#### 第一次依赖收集是在什么时候
尝试回答  
应该是问某个组件, 预期是get触发的时候, 这个get触发可能在生命周期也可能是在render的时候
这个
是在beforeCreate之后和created之前完成了依赖收集的设置

第一次开始依赖收集要分情况来说，最早可以在createed回调中访问一个computed属性， 其后的beforeMounted也是如此，如果没有类似的操作，那么在第一次render的时候，vue需要从拿数据结合模板渲染页面了，此时基本上可以认为回触发getter触发依赖收集。(要是template中不拿此类触发依赖收集的getter。。那就也还是没触发...，这个就比较少见了吧)



### 组件用到watcher的地方有哪些
1. 组件自己watch属性注册的监视器
2. 组件的computed属性


### 关于源码
## 数组值变化监听
`./array.js` 中对数组的一些方法进行了修改，这些方法属于执行后对数组值本身有修改的，于是需要在这里添加一些通知数据变化的逻辑。  
导出一个完整包含Array所有实例方法(部分方法已进行修改)的一个对象后称arrayMethods  
执行时机：Observer实例化的时候，对数组建立监视的时候  
兼容处理：如果浏览器支持__proto__属性，那么直接讲要监视的数组实例的__proto__赋值为arrayMethods, 如果不兼容，那么就直接给这个数组实例本身定义这些方法,相当于是覆盖了原型上的方法



