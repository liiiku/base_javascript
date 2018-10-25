// myPromise
// 状态 Pending => resolved/rejected
// 数据
// function myPromise1(fn) {
//   if (typeof fn !== 'function') {
//     throw TypeError(`Promise resolver ${fn} is not a function`)
//   }

//   this.status = 'pending'
//   this.data = undefined

//   // 如果是普通函数的写法，这里面的this指向的是window，所以不会改变上面this.status的值
//   var that = this
//   function resolve() {
//     console.log(that) // myPromise {status: "pending", data: undefined}
//     if (this.status === 'pending') {
//       this.status = 'resolved'
//     }
//   }

//   function reject() {
//     if (this.status === 'pending') {
//       this.status = 'rejected'
//     }
//   }
  
//   // 根据步骤1
//   fn(resolve, reject)
// }

class myPromise {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw TypeError(`Promise resolver ${fn} is not a function`)
    }

    this.status = 'pending'
    this.data = undefined
    // this.resolveCB  = null // 不用数组存有个弊端就是，后面的会覆盖前面 见p4
    // this.rejectCB = null
    this.resolveCBArr  = []
    this.rejectCBArr = []
    let resolve = (data) => {
      if (this.status === 'pending') {
        setTimeout(() => {
          this.status = 'resolved'
          this.data = data
          // this.resolveCB && this.resolveCB()
          this.resolveCBArr.forEach(fn => fn())
        }, 0)
      }
    }
    let reject = (data) => {
      if (this.status === 'pending') {
        setTimeout(() => {
          this.status = 'rejected'
          this.data = data
          // this.rejectCB && this.rejectCB()
          this.rejectCBArr.forEach(fn => fn())
        }, 0)
      }
    }

    fn(resolve, reject)
  }

  // 原型上的方法和constructor同级
  then(resolveFn, rejectedFn) {
    if (this.status === 'resolved') {
      let res = resolveFn(this.data)
      if (res instanceof myPromise) {
        return res
      } else {
        return myPromise.resolve(res)
      }
    }
    if (this.status === 'rejected') {
      let res = rejectedFn(this.data)
      if (res instanceof myPromise) {
        return res
      } else {
        return myPromise.resolve(res)
      }
    }
    if (this.status === 'pending') {
      // 当前状态没有定，不知道是执行resolve还是reject
      return new myPromise((resolve, reject) => { // 离自己最近的非箭头函数产生的作用域 这里的new Promise不变，后面的then函数就不会执行，因为我不知道要执行什么
        // this.resolveCB = resolveFn // 不能这么写，这么写的话，resolveFn的参数怎么传递呢？所以用一个立即执行函数来做，里面return 一个函数

        // this.resolveCBArr.push(((resolveFn) => {
        //   return () => {
        //     let res = resolveFn(this.data)
        //     if (res instanceof myPromise) {
        //       res.then(resolve, reject)
        //     } else {
        //       resolve(res)
        //     }
        //   }
        // })(resolveFn))

        this.resolveCBArr.push(() => {
          let res = resolveFn(this.data)
          if (res instanceof myPromise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        })

        // this.rejectCBArr.push(((rejectedFn) => {
        //   return () => {
        //     let res = rejectedFn(this.data)
        //     if (res instanceof myPromise) {
        //       res.then(resolve, reject)
        //     } else {
        //       resolve(res)
        //     }
        //   }
        // })(rejectedFn))

        this.rejectCBArr.push(() => {
          let res = rejectedFn(this.data)
          if (res instanceof myPromise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        })
      })
    }
  }
  // 不用new就可以调用
  static resolve(data) {
    return new myPromise((resolve, reject) => resolve(data))
  }
  static reject(data) {
    return new myPromise((resolve, reject) => reject(data))
  }
}

// 步骤1：传递一个函数
// 步骤2： 因为new Promise中传递的函数可以写， 所以fn(resolve, reject)中也应该可以写
// 对于then函数：
// 返回的是Promise对象， 接下来的then 所执行的函数，由返回的Promise对象状态决定
// 返回的不是Promise对象， 返回一个状态为 resolved 状态的 Promise对象（Promise会根据这个不是Promise对象的内容是在resolve还是在reject返回的，调用Promise.resolve()/reject()封装一下）
// var p = new Promise(function(resolve, reject) {
//   reject('fail')
// })
// p
// .then(data => data, err => {
//   return err
// })
// .then(data => console.log('succ' + data), err => console.log('fail' + data)) // 打印 succfail

// p.then(data => data, err => {
//   return new Promise((suc, fail) => {
//     fail(err)
//   })
// })
// .then(data => console.log('succ' + data), err => console.log('fail' + err)) // 打印 failfail



// var p1 = new myPromise(function(resolve, reject) {
//   // resolve(1)
//   reject(100)
// })

// p1.then(data => console.log(data), err => console.log(err))

var p2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('strong')
  }, 2000)
})
// p2.then(data => console.log(137, data))
p2.then(data => {
  console.log(169, data)
  return new myPromise((suc, err) => {
    setTimeout(function() {
      suc(2333)
    }, 2000)
  })
})
.then(data => {
  console.log(177, data)
  return new myPromise((suc, err) => {
    setTimeout(function() {
      suc('winner')
    }, 2000)
  })
})
.then(data => console.log(154, data))

var p3 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject('strong')
  }, 2000)
})

p3.then(null, data => {
  console.log(139, data)
  return new myPromise((suc, err) => {
    setTimeout(function() {
      err(178)
    }, 2000)
  })
})
.then(null, data => {
  console.log(201, data)
  return new myPromise((suc, err) => {
    setTimeout(function() {
      suc('winner')
    }, 2000)
  })
})
.then(data => console.log(208, data))

var p4 = new myPromise((resolve, reject) => {
  setTimeout(function() {
    resolve('winner')
  }, 2000)
})

p4.then(data => console.log(data))
p4.then(data => console.log(data))

// 1 3 2 promise的回调函数中，是顺序执行的，then方法是要加到事件队列的队尾的
let p5 = new myPromise((resolve, reject) => {
  console.log(1)
  resolve(2)
}).then(data => console.log(data))
console.log(3)