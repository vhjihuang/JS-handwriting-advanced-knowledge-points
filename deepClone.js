// 可遍历的类型
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';

// 不可遍历类型
const symbolTag = '[object Symbol]';
const regexpTag = '[object Regexp]';
const funcTag = '[object Function]';

// 可遍历类型存在一个数组里
const canForArr = ['[object Map]', '[object Set]', '[object Array]', '[object Object]'];

// 不可遍历类型存在一个数组里
const noForArr = ['[object Symbol]', '[object Regexp]', '[object Function]'];

// 判断类型的函数
function checkType(target) {
  return Object.prototype.toString.call(target);
}

// 判断引用类型的temp
function checkTemp(target) {
  const c = target.constructor;
  return new c();
}

// 拷贝Function的方法
function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(bodyReg);
    if (body) {
      if (param) {
        const paramArr = param[0].split(',');
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

// 拷贝Symbol的方法
function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe));
}

// 拷贝RegExp的方法
function cloneReg(targe) {
  const reFlags = /\w*s/;
  const result = new targe.constructor(targe.soure, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}

// 实现拷贝
function deepClone(target, map = new Map()) {
  // 获取类型
  const type = checkType(target);

  // 基本数据类型直接返回
  if (!canForArr.concat(noForArr).includes(type)) return target;

  // 判断Function, RegExp, Symbol
  if (type === funcTag) return cloneFunction(target);
  if (type === regexpTag) return cloneReg(target);
  if (type === symbolTag) return cloneSymbol(target);

  // 引用数据类型特殊处理
  const temp = checkTemp(target);

  if (map.get(target)) {
    return map.get(target);
  }

  // 不存在则第一次设置
  map.set(target, temp);

  // 处理 Map 类型
  if (type === mapTag) {
    target.forEach((value, key) => {
      temp.set(key, deepClone(value, map))
    })
    return temp;
  }

  // 处理 Set 类型
  if (type === setTag) {
    target.forEach((value, key) => {
      temp.add(key, deepClone(value, map));
    })
    return temp;
  }

  // 处理数据和对象
  for (const key in target) {
    temp[key] = deepClone(target[key], map);
  }
  return temp;
}