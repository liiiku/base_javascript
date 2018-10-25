# base_javascript
基础常见的js技术知识点

**文件结构**

一、节流和防抖

在前端开发中有一部分的用户行为会频繁的触发事件执行，2对于DOM操作、资源加载等消耗性能的处理，很可能导致页面卡顿，甚至浏览器的崩溃。节流和防抖就是为了解决这类问题的

1. throttle 节流

函数节流就是预定一个函数只有在大于等于执行周期时候才执行，周期内调用不执行。好像水滴攒到一定重量才会落下一样

当持续触发事件时，保证一定时间段内只调用一次事件处理函数。 节流不会像防抖一样重新计算时间

场景：
  窗口调整
  页面滚动
  抢购疯狂点击

2. debounce 防抖

函数防抖就是在函数需要频繁触发情况时，只有足够空闲的时间，才执行一次，好像公交司机等人都上车了之后才发车一样

当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时。

场景：
  实时搜索
  拖拽


举个例子：在3秒之内 间隔是1秒，等待也是1秒

节流`throttle`的话：3秒，就会执行3次

|----------|----------|

防抖`debounce`的话：3秒，就不一定执行3次了

|---[=]----------|----------|

从=这里又触发了，就从=这里从新开始计算时间，所以3秒钟之内，如果一直在触发，就可能第一次执行之后，获取了一次数据，就一直不会执行第二次的获取数据了，只能不再重复触发后，等待1秒后，在去获取数据

函数节流不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而函数防抖只是在最后一次事件后才触发一次函数。比如在页面的无限加载场景下，我们需要用户在滚动页面时，每隔一段时间发一次 Ajax 请求，而不是在用户停下滚动页面操作时才去请求数据。这样的场景，就适合用节流技术来实现。

3. reduce函数

```
array.reduce(
  function(accumulator, currentValue, currentIndex, arr), 
  initialValue
)
```

***参数***

`callback`中包裹四个参数：

- `accumulator`: 累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue

- `currentValue`: 数组中正在处理的元素。

- `currentIndex`: [可选]数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则索引为1。

- `array`: [可选]调用reduce()的数组

`initialValue`: 作为第一次调用 callback函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。

**注意**

回调函数第一次执行时，`accumulator`和`currentValue`的取值有两种情况：如果调用`reduce()`时提供了`initialValue`，`accumulator`取值为`initialValue`，`currentValue`取数组中的第一个值；如果没有提供 `initialValue`，那么`accumulator`取数组中的第一个值，`currentValue`取数组中的第二个值。

例如：

```
const str = '9kFZTQLbUWOjurz9IKRdeg28rYxULHWDUrIHxCY6tnHleoJ'
  const obj = {}
  Array.from(str).reduce((accumulator, current) => {
    console.log(accumulator)
    current in accumulator ? accumulator[current]++ : accumulator[current] = 1
    return accumulator  
  }, obj)
```

输出结果：(选取前几次打印)

```
{}
{9: 1}
{9: 1, k: 1}
{9: 1, k: 1, F: 1}
{9: 1, k: 1, F: 1, Z: 1}
{9: 1, k: 1, F: 1, Z: 1, T: 1}
```

第一行打印`{}`就是因为把obj赋值给了`accumulator`

回调函数一定要有返回值，因为回调函数的第一个参数就是去获取这个返回值，如果没有`return`的话，这个值就是`undefined`

```
var num = [1,2,3,4,5];
var res = num.reduce(function(total,num){
	console.log(total)
  return total+num;
})
```

输出结果：

```
1
3
6
10
```

```
var num = [1,2,3,4,5];
var res = num.reduce(function(total,num){
  console.log(total)
})
```

输出结果： 第一行的是直接获取的数组中的第一个
```
1
undefined
undefined
undefined
```

4. filter

```
const arr = [
  { "name": "a1111", "age": 25 },
  { "name": "a1", "age": 26 },
  { "name": "a11", "age": 27 },
  { "name": "a", "age": 29 },
  { "name": "a11", "age": 29 },
  { "name": "a11", "age": 26 },
  { "name": "a111", "age": 25 },
  { "name": "a11", "age": 26 },
  { "name": "a1", "age": 26 },
  { "name": "a", "age": 26 }
]

arr.filter(item => item.name.length === 3)
    .filter(item => item.age > 26)
```

输出结果：

```
[
  { name: "a11", age: 27 },
  { name: "a11", age: 29 }
]
```

5. forEach() 和 map()

`forEach()` 没有返回值

```
arr[].forEach(function(value,index,array){

　　//do something

})
```
- 参数：`value` 数组中的当前项, `index` 当前项的索引, `array` 原始数组；
- 数组中有几项，那么传递进去的匿名回调函数就需要执行几次；
- 理论上这个方法是没有返回值的，仅仅是遍历数组中的每一项，不对原来数组进行修改；但是可以自己通过数组的索引来修改原来的数组

```
var ary = [12,23,24,42,1];  
var res = ary.forEach(function (item,index,input) {  
  input[index] = item*10;  
})  
console.log(res); //--> undefined;  
console.log(ary); //--> 通过数组索引改变了原数组；
```

`map()` 有返回值, 可以`return`出来

```
arr[].map(function(value,index,array){

　　//do something

　　return XXX

})
```
- 参数：`value` 数组中的当前项, `index` 当前项的索引, `array`原始数组；
- 区别：`map`的回调函数中支持`return`返回值；`return`的是啥，相当于把数组中的这一项变为啥（并不影响原来的数组，只是相当于把原数组克隆一份，把克隆的这一份的数组中的对应项改变了）；

```
var ary = [12,23,24,42,1];  
var res = ary.map(function (item,index,input) {  
  return item*10;  
})  
console.log(res); //-->[120,230,240,420,10];  原数组拷贝了一份，并进行了修改
console.log(ary); //-->[12,23,24,42,1]；  原数组并未发生变化
```

