let price = 5
let quantity = 2
let total = 0
let target = null

class Dep {
  constructor() {
    this.subscribers = [] // 代替index1.js中的 storage
  }
  depend() { // 代替record
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target)
    }
  }
  notify() { // 代替replay
    this.subscribers.forEach(sub => sub())
  }
}

target = () => total = price * quantity

const dep = new Dep()
target()
dep.depend()

console.log(total)
price = 20
dep.notify()
console.log(total)
