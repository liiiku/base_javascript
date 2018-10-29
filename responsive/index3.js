let data = { price: 5, quantity: 2 }
let target = null
class Dep {
  constructor() {
    this.subscribers = []
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }
  notify() {
    this.subscribers.forEach(sub => sub())
  }
}

/**
 * 我们需要一些方法来连接data里的属性（如price或quantity），所以当它被访问时，我们可以将target保存到我们的订阅者数组中，当它被改变时，运行我们存储在订阅者数组中的函数。
 * 我们希望：
 * 当data.price值被访问，我希望price属性的依赖类将我们存储在target中的匿名函数，通过调用dep.depend()将其推到它的订阅者（用来存储target）数组(subscribers)中。
 * 同理，当data.quantity被访问，我同样希望quantity属性的依赖类将这个存储在target中的匿名函数推入其订阅者（用来存储target）数组(subscribers)中。
 */
Object.keys(data).forEach(key => {
  let internalValue = data[key]

  const dep = new Dep()

  Object.defineProperty(data, key,  {
    get() {
      console.log(30, dep)
      dep.depend()
      return internalValue
    },
    set(newVal) {
      internalValue = newVal
      console.log(36, newVal, internalValue, data.price, data.quantity)
      dep.notify()
    }
  })
})

function watcher(myFn) {
  target = myFn
  target()
  target = null
}

watcher(() => {
  console.log(49, data.price, data.quantity)
  data.total = data.price * data.quantity
  console.log(51, data.total)
  /**
   * 就是因为这里，执行会返回如下的效果：
   * 因为dat.price data.quantity分别调用了两次 所以get会调用两次
   * 30 Dep { subscribers: [] }
   * 30 Dep { subscribers: [] }
   */
})

data.price = 20
/** 
 * data.price = 20 这行代码会经历的执行过程：

30 Dep { subscribers: [] }
30 Dep { subscribers: [] }
49 5 2
30 Dep { subscribers: [ [Function] ] }
30 Dep { subscribers: [ [Function] ] }
51 10
30 Dep { subscribers: [ [Function] ] }
30 Dep { subscribers: [ [Function] ] }
36 20 20 20 2
30 Dep { subscribers: [ [Function] ] }
30 Dep { subscribers: [ [Function] ] }
49 20 2
30 Dep { subscribers: [ [Function] ] }
30 Dep { subscribers: [ [Function] ] }
51 40

 */