let price = 5
let quantity = 2
let total = 0
let target = null
let storage = []

target = () => total = price * quantity

function record () {
  storage.push(target)
}

function replay () {
  storage.forEach(fn => fn())
}

target()
record()
console.log(total)
price = 20
replay()
console.log(total)