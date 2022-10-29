// 实现 Promise 步骤
// 1. 执行了 resolve, Promise 状态会变成 fulfilled
// 2. 执行了 reject, Promise 状态会变成 rejected
// 3. Promise 只以第一次为准, 第一次成功就永久为fulfilled, 第一次失败就永远状态为 rejected
// 4. Promise 中有throw的话, 就相当于执行了reject那么咱们就把这四个知识点一步步实现

class MyPromise {
  // 构造函数方法
  constructor (executor) {
    // 初始化值
    this.initValue();
    // 初始化 this 指向
    this.initBind();
    try {
      // 执行传进来的函数
      executor(this.resolve, this.reject);
    } catch (err) {
      // 捕捉到错误立即执行 reject
      this.reject(err);
    }
    
  }
  initBind() {
    // 初始化 this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  initValue() {
    // 初始化值
    this.PromiseResult = null; // 终值
    this.PromiseStatus = 'pending'; // 状态
  }
  resolve(value) {
    if (this.PromiseStatus !== 'pending') return;
    this.PromiseStatus = 'fulfilled';
    this.PromiseResult = value;
  }
  reject(reason) {
    if (this.PromiseStatus !== 'pending') return;
    this.PromiseStatus = 'fulfilled';
    this.PromiseResult = reason;
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    if (this.Promise.Status === 'fulfilled') {
      onFulfilled(this.PromiseResult);
    } else if (this.PromiseStatus === 'rejected'){
      onRejected(this.PromiseResult);
    }
  }
}