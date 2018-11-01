function deepClone(obj) {
  var objArr = Array.isArray(obj) ? [] : {}

  if (obj && typeof obj === 'object') {
    for(key in obj) {
      if (!obj.hasOwnProperty(key)) {
        return
      }
      if (obj[key] && typeof obj[key] === 'object') {
        objArr[key] = deepClone(obj[key])
      } else {
        objArr[key] = obj[key]
      }
    }
  }
  return objArr
}

var obj1 = {
  fruits: ['apple', 'banner'],
  obj: {
    name: 'lrn',
    age: {
      no: 24
    }
  },
  num: 100
}

var obj2 = deepClone(obj1)
console.log(25, obj2)
console.log(26, obj1)
// obj2.num = 200
// obj2.fruits = ['abc', 'ddd']
// console.log(29, obj2)
// console.log(30, obj1)
// obj2.obj.age.no = 18
// console.log(38, obj2)
// console.log(39, obj1)
obj2.obj = {
  test: '123'
}
console.log(43, obj2)
console.log(44, obj1)