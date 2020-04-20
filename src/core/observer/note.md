- watcher主要是用在组件中
- 一个组件会有好多watcher
- 一个watcher有好多deps
- 一个dep会有很多订阅者,订阅号其实就是watcher了

- 一个observer会使用一个dep来监察一个value
- 一个value只会被一个observer监察

- 在value的get方法中会使用dep.denpend来完成依赖的收集
- 在value的set方法中会使用dep.notify来完成变化的通知 wachters.update



### 延伸问题
#### 第一次依赖收集是在什么时候
尝试回答  
应该是问某个组件, 预期是get触发的时候, 这个get触发可能在生命周期也可能是在render的时候

对于组件, 是在beforeCreate和created期间完成了依赖收集


