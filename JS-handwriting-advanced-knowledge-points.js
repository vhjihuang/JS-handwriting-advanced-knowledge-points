// 1. 实现原生的AJAX请求
// 1.1 定义get, post方法; 定义传入参数为 url 和成功回调函数 fn
// 1.2 在get, post方法内创建 XMLHttpRequest对象
// 1.3 设置请求方式, url; post请求需要设置请求头
// 1.4 设置响应方法,在方法内调用传入的回调函数
// 1.5 调用 send 方法

const ajax = {
  get(url, fn) {
    const xhr  = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        fn(xhr.responseText);
      }
    }
    xhr.send();
  },
  post(url, fn) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        fn(xhr.responseText);
      } 
    }
    xhr.send();
  }
}

// 2. 手写 new 的过程
// 2.1 定义空对象
// 2.2 给空对象添加__proto__,并将该属性链接到构造函数的原型对象
// 2.3 调用构造函数 fn,并将 this 绑定到空对像上
// 2.4 返回空对象

function myNew(fn, ...args) {
  let obj = {};
  obj.__proto__ = fn.prototype;
  fn.apply(obj, args);
  return obj
}

// 3. instanceof 关键字
// 3.1 添加判断条件,控制不符合条件的直接返回值
// 3.2 获取做 B 构造函数, 获取 A 的构造函数原型
// 3.3 用 while 遍历原型链,直到找到 null 为止

function instanceOf(A, B) {
  if (typeof A !== 'object' || A === null || typeof B !== 'function' ) {
    return false;
  }
  const prototype = B.prototype;
  let __proto__ = A.__proto__;
  while(true) {
    if (__proto__ === null) {
      return false;
    }
    if (prototype === __proto__) {
      return true;
    }
    __proto__ = __proto__.__proto__;
  }
}

// 4. 实现防抖函数
// 4.1 先定义定时器 ID
// 4.2 返回函数,函数内先判有没有定时器 ID,如果有直接清楚定时器
// 4.3 获取 arguments 参数
// 4.4 设置定时器,获取定时器 ID,定时器时间动态传入,定时器内传入的函数调用 apply 方法改变 this 指向
function debounce(fn, delay = 500) {
  let timer;
  return function() {
    if (timer) {
      clearTimeout(timer);
    }
    const args = arguments;
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}

// 5. 实现节流函数
// 5.1 定义一个 flag = true, return 回一个函数
// 5.2 return 函数内判断 flag 是否为 true,如果不是则表示不是第一次进来的,直接不走后面的函数,否则继续运行后续代码
// 5.3 如果是第一次进来,在判断后面设置 flag = false, 定义变量 args 使其等于 arguments
// 5.4 设置定时器时间为动态传入,定时器内传入的函数调用 apply 方法改变 this 指向,然后设置 flag = true
function throttle(fn, delay = 200) {
  let flag = true;
  return function() {
    if (!flag) return;
    flag = false;
    const args = arguments;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  }
}

// 6. 实现数组去重 ----- 题目描述: 实现一个数组去重
// 6.1 定义空数组,用来过滤之后返回
// 6.2 传入的数组使用 reduce 函数进行去重,初始值为 Map 对象;
// 6.3 reduce 函数内通过 map 对象的 has 方法判断是否为重复的值
// 6.4 如果不存在,在判断里把值设置道 map 对象里,并且把值存在到空数组内, 之后 return 当前值
// 6.5 在 reduce 方法后面返回 新数组
function removeDuplicate(arr) {
  let newArr = [];
  arr.reduce((pre, next) => {
    if (!pre.has(next)) {
      pre.set(next, 1);
      newArr.push(next);
      return pre;
    }
  }, new Map());
  return newArr;
}

function unique (arr) {
  return [...new Set(arr)];
}

/**
 * 7. 用setTimeout实现setInterval ----- 题目描述: setinterval用来实现循环定时调用 可能存在一定的问题 能用 settimeout 解决吗
 * 7.1 定义函数传入调用的方法和计时器时间
 * 7.2 定义计时器 ID,定义一个方法,方法内调用传入的函数 fn;
 * 方法内定时器 ID赋值,调用setTimeout,函数内调用自己形成递归;
 * 7.3 调用setTimeout,调用定义的方法,形成类似定时器调用的效果
 * 7.4 返回一个对象,里面定义了一个方法,该方法是用来清除定时器
*/ 
function mySetInterval(fn, delay) {
  let timer = null;
  const interval = () => {
    fn();
    timer = setTimeout(interval, delay);
  }
  setTimeout(interval, delay);
  return {
    cancel: () => {
      clearTimeout(timer);
    }
  }
}

/**
 * 8. 用setInterval 实现 setTimeout ---- 题目描述: 只想刁难你
 * 8.1 定义函数,参数为函数和定时器时间
 * 8.2 定义一个定时器 ID并且复赋值,调用setInterval,参数为传入的时间
 * 8.3 setInterval 调用传入的函数,然后清除定时器
 */
function mySetTimeout(fn, delay) {
  let timer = setInterval(() => {
    fn();
    clearInterval(timer);
  }, delay);
}

/**
 * 9. 实现一个 compose 函数
 * 9.1 定义一个函数参数为不定个数的函数
 * 9.2 函数内判断传入的参数是否为空,如果为空返回一个函数,函数有一个参数,返回的函数直接返回传入的参数
 * 9.3 函数内传入的参数个数为 1,直接返回传入的函数
 * 9.4 如果函数传入的参数长度大于 1,返回传入的参数 reduce 后的值,reduce 函数每次循环返回一个函数,函数有一个参数,
 * 这个返回的函数内,return 每次传入的函数调用后的值
 */
function compose(...fn) {
  if (fn.length === 0) return (num) => num;
  if (fn.length === 1) return fn[0];
  return fn.reduce((pre, next) => {
    return (num) => {
      return next(pre(num));
    }
  })
}

/**
 * 10. 实现一个科里化函数
 */
function currying(fn, ...args) {
  const length = fn.length;
  let allArgs = [...args];
  let res = (...args1) => {
    allArgs = [...args, ...args1];
    if (allArgs.length === length) {
      return fn(...allArgs);
    } else {
      return res
    }
  }
  return res;
}

/**
 * 11. 实现已给LRU缓存函数
 */
class LRUcache {
  constructor (size) {
    this.size = size;
    this.cache = new Map();
  }
  get(key) {
    let hasKey = this.cache.has(key);
    if (hasKey) {
      const val = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, val);
    } else {
      return -1;
    }
  }
  put(key, val) {
    let hasKey = this.cache.has(key);
    if (hasKey) {
      this.cache.delete(key);
    }
    this.cache.set(key, val);
    if (this.cache.size > this.size) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
}

// 12. 简单实现 发布订阅模式 ---- 题目描述: 实现一个发布订阅模式拥有 on emit once off 方法
class EventEmitter {
  constructor() {
    this.cache = {};
  }

  on(name, fn) {
    const tasks = this.cache[name];
    if (tasks) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }

  off(name, fn) {
    const tasks = this.cache[name];
    if (tasks) {
      if (tasks) {
        const index = tasks.findIndex(item => item === fn);
        if (index >= 0) {
          this.cache[name].splice(index, 1);
        }
      }
    }
  }

  emit(name, ...args) {
    const tasks = this.cache[name].slice();
    if (tasks) {
      for (let fn of tasks) {
        fn(...args);
      }
    } 
  }

  once(name, cb) {
    function fn(...args) {
      cb(args);
      this.off(name, fn);
    }
    this.on(name, fn);
  }
}

// 13. 实现 JSON.parse  ----- 实现 JSON.parse
function parse(json) {
  return eval("(" + json + ")");
}

// 14. 将 DOM 转化为树结构对象
function dom2tree(dom) {
  const obj = {};
  obj.tag = dom.tagName;
  obj.children = [];
  dom.childNodes.forEach(child => obj.children.push(dom2tree(child)));
  return obj;
}

// 15. 将树结构转换为 DOM
function _render(vNode) {
  if (typeof vNode === 'number') {
    vNode = String(vNode);
  }
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }
  const dom = document.createElement(vNode.tagName);
  if (vNode.attrs) {
    Object.keys(vNode.attrs).forEach(key => {
      const value = vNode.attrs[key];
      dom.setAttribute(key, value);
    });
  }
  vNode.children.forEach(child => dom.appendChild(_render(child)));
  return dom;
}

// 16. 判断一个对象有环引用 --- 验证一个对象有无环引用
// 实现思路: 用一个数组存储每一个遍历过的对象, 下次找到数组中存在, 则说明环引用
function cycleDetector(obj) {
  const arr = [obj];
  let flag = false;
  function cycle(o) {
    const keys = Object.keys(o);
    for (const key of keys) {
      const temp = o[key];
      if (typeof temp === 'object' && temp !== null ) {
        if (arr.indexOf(temp) >= 0 ) {
          flag = true;
          return;
        }
        arr.push(temp);
        cycle(temp);
      }
    }
  }
  cycle(obj);
  return flag;
}

// 17. 计算一个对象的层数 --- 题目描述: 给你一个对象, 统计一下他的层数
function loopGetLevel(obj) {
  let res = 1;
  function computedLevel(obj, level) {
    var level = level ? level : 0;
    if (typeof obj === 'object') {
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          computedLevel(obj[key], level + 1)
        } else {
          res = level + 1 > res ?  level + 1 : res;
        }
      }
    } else {
      res = level > res ? level : res;
    }
  }
  computedLevel(obj);
  return res;
}

// 18.对象的扁平化
function flatten(obj) {
  if (!isObject(obj)) return;
  let res = {};
  const dfs = (cur, prefix) => {
    if (isObject(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((item, index) => {
          dfs(item, `${prefix}[${index}]`);
        })
      } else {
        for (let key in cur) {
          dfs(cur[key], `${prefix}${prefix ? '.' : ''}${key}`);
        }
      }
    } else {
      res[prefix] = cur;
    }
  }
  dfs(obj, '');
  return res;
}

//  19. 实现(a === 1 && a === 2 && a === 3) 为true
// 方法一
var  a = {
   i: 1,
   toString: function () {
    return a.i++;
   }
}

// 方法二
var a = [1, 2, 3];
a.join = a.shift;

// 方法三
var val = 0;
Object.defineProperty(window, 'a', {
  get: function () {
    return ++ val;
  }
}) 

// 20. 实现限制并发的 Promise 调度器 --- 题目描述: JS实现一个带兵法限制的异步调度器 Scheduler, 保证同时运行的任务最多有两个
class Scheduler {
  constructor() {
    this.queue = [];
    this.limit = limit;
    this.count = 0;
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve()
        }, time);
      })
    }
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.limit; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue.length || this.count >= this.limit) return;
    this.count++;
    this.queue.shift()().then(() => {
      this.count--;
      this.request();
    })
  }
}

// 21.实现lazyMan函数
class _LazyMan {
  constructor(name) {
    this.tasks = [];
    const task = () => {
      console.log(`Hi! this is ${name}`)
      this.next();
    }
    this.tasks.push(task);
    setTimeout(() => {
      this.next();
    }, 0);
  }
  next() {
    const task = this.tasks.shift();
    task && task();
  }
  sleep(time) {
    this.sleepWrapper(time, false);
    return this;
  }
  sleepFirst(time) {
    this.sleepWrapper(time, true);
    return this;
  }
  sleepWrapper(time, first) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`)
      }, time * 1000);
    }
    if (first) {
      this.task.unshift(task);
    } else {
      this.task.push(task);
    }
  }
  eat(food) {
    const task = () => {
      console.log(`Eat ${food}`);
      this.next();
    }
    this.task.push(task);
    return this;
  }
}

// 22. 实现 add 函数 --- 题目描述: 实现一个 add 方法 使计算结果能满足预期:add(1)(2)(3)() = 6,add(1,2,3)4)() = 10,
function add(...args1) {
  let allArgs = [...args1];
  function fn(...args2) {
    if (!args2.length) return fn.toString();
    allArgs = [...allArgs, args2];
    return fn;
  }
  fn.toString = function () {
    return allArgs.reduce((pre, next) => pre + next);
  }
  return;
}

// 23. 实现一个合格的深拷贝
import './deepClone.js'