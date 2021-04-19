/**
 *  检查类型
 */
function checkType(data: any) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

/**
 * 继承
 */

/**
 *  原型链继承
 *
 *  可以访问到父类方法
 *
 *  不可以给父类传值
 *  父类所有引用属性会被子类共享
 */
function F1() {
  this.ids = [1, 2];
}

F1.prototype.getIds = function () {
  console.log(this.ids);
};

function C1() {}
C1.prototype = new F1();

/**
 * 构造函数继承
 *
 * 可以给父类传值
 * 父类所有引用属性不会被共享
 *
 * 不能访问定义在父类原型的方法
 */
function F2(name: string) {
  this.name = name;
  this.ids = [1, 2];
}
F2.prototype.getIds = function () {
  console.log(this.ids);
};
function C2(name: string) {
  F2.call(this, name);
}

/**
 * 原型构造函数组合继承
 *
 * 可以给父类传值
 * 可以访问定在父类原型的方法
 * 父类所有引用属性不会被共享
 *
 * 父类构造函数会被调用两次
 */
function F3(name?: string) {
  this.name = name;
  this.ids = [1, 2];
}
F3.prototype.getIds = function () {
  console.log(this.ids, this.name);
};
function C3(name: string) {
  F3.call(this, name);
}
C3.prototype = new F3();

/**
 *  寄生式继承
 *
 *  父类所有引用属性会被子类共享
 *  父类方法重复创建
 */
function clone1(o) {
  function Fun() {}
  Fun.prototype = o;
  return new Fun();
}

function create1(o) {
  const clone = clone1(o);
  this.getIds = function () {
    console.log(this.ids);
  };
  return clone;
}

/**
 * 寄生组合式继承
 */
function clone(o) {
  function Fun() {}
  Fun.prototype = o;
  return new Fun();
}

function init(c, p) {
  const o = clone(p.prototype);
  o.constructor = c;
  c.prototype = o;
}

function P(name?: string) {
  this.name = name;
  this.ids = [1, 2];
}
P.prototype.getIds = function () {
  console.log(this.name, this.ids);
};

function C(name: string) {
  P.call(this, name);
}
init(C, P);

/**
 *  类继承
 */
class F4 {
  name: string;
  ids: number[];

  constructor(name: string) {
    this.name = name;
    this.ids = [1, 2];
  }

  getIds() {
    console.log(this.name, this.ids);
  }
}

class C4 extends F4 {
  constructor(name: string) {
    super(name);
  }
}

/**
 * 去重
 */
const uniqueArr = [1, 2, 3, 4, 5, 3, 4, 5, 6];

/**
 * ES5
 */
function uniqueES5(arr: any[]) {
  return arr.filter((item, index, arr) => arr.indexOf(item) === index);
}

/**
 * ES6
 */
const uniqueES6 = (arr: any[]) => Array.from(new Set(arr));

/**
 * reduce
 */
const uniqueReduce = (arr: any) => {
  return arr.reduce((acc, pre) => {
    if (!acc.includes(pre)) acc.push(pre);
    return acc;
  }, []);
};

/**
 * 扁平化
 */
const flatArr = [1, [2, [3, [4]]]];

/**
 * ES5
 */
function flatES5(arr: any[]) {
  var result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatES5(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

/**
 * ES6
 */
const flatES6 = (arr: any[]) => {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
};
// console.log(flatES6(flatArr));

/**
 * reduce
 */
const flatReduce = (arr: any[]) => {
  return arr.reduce((acc, pre) => acc.concat(Array.isArray(pre) ? flatReduce(pre) : pre), []);
};

/**
 * Array.prototype.flat
 */
const flatten = (arr: any[]) => {
  return arr.flat(Infinity);
};

/**
 * 生成器
 */
function* flatGenerator(arr: any) {
  for (const k of arr) {
    if (Array.isArray(k)) {
      yield* flatGenerator(k);
    } else {
      yield k;
    }
  }
}

/**
 * 浅拷贝
 *
 *  对象拷贝 assign
 *  数组 concat, slice
 */
const o = {
  a: "a",
  b: {
    c: "d",
  },
};
const arr = [1, 2, { d: "d" }];

/**
 * 浅拷贝
 */
function shallowClone(o) {
  if (typeof o !== "object") throw new TypeError(`${o} is on object`);

  const clone = o instanceof Array ? [] : {};

  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      clone[key] = o[key];
    }
  }

  return clone;
}

/**
 * 深拷贝只拷贝属性
 */

function deepCloneAttr(o) {
  if (typeof o !== "object") throw new TypeError(`${o} is no object`);

  const clone = o instanceof Array ? [] : {};

  for (const k in o) {
    if (o.hasOwnProperty(k)) {
      clone[k] = typeof o[k] === "object" ? deepCloneAttr(o[k]) : o[k];
    }
  }

  return clone;
}

/**
 * 深拷贝完整版
 */
const isObject = data => (typeof data === "object" || typeof data === "function") && data !== null;

function deepClone(target: any, map = new WeakMap()) {
  if (map.get(target)) return target;

  /**
   * 获取构造函数类型
   */
  const constructor = target.constructor;

  /**
   * 匹配RegExp&&Date对象
   */
  if (/^(RegExp|Date)$/i.test(constructor)) return new constructor(target);

  /**
   * 判断是否对象
   */
  if (isObject(target)) {
    /**
     * 为循环引用的对象进行标记
     */
    map.set(target, true);

    /**
     * 初始化
     */
    const clone = Array.isArray(target) ? [] : {};

    /**
     * 遍历递归
     */
    for (const prop in target) {
      if (target.hasOwnProperty(prop)) {
        clone[prop] = deepClone(target[prop], map);
      }
    }

    return clone;
  } else {
    return target;
  }
}

/**
 * 事件总线
 */
class EventEmitter {
  cache: {};

  constructor() {
    this.cache = {};
  }

  /**
   * 注册
   */
  on(name: string | number, f: any) {
    const task = this.cache[name];

    if (task) {
      this.cache[name].push(f);
    } else {
      this.cache[name] = [f];
    }
  }

  /**
   * 删除
   */
  off(name, fn) {
    const tasks = this.cache[name];

    if (tasks) {
      const index = tasks.findIndex(f => f === fn || f.callback === fn);
      this.cache[name].splice(index, 1);
    }
  }

  /**
   * 响应
   */
  emit(name, once = false, ...args) {
    const tasks = this.cache[name].slice();

    if (tasks) {
      for (const f of tasks) {
        f.call(f, ...args);
      }
      once && delete this.cache[name];
    }
  }
}

/**
 * 解析url获取参数
 */
const parseUrl = (url: string) => {
  /**
   * 正则匹配url?
   */
  const reg = /^.+\?(.+)$/;

  const paramsStr = reg.test(url) ? reg.exec(url)[1] : undefined;

  const paramsArr = paramsStr && paramsStr.split("&");

  let result = {};

  if (paramsArr && paramsArr.length) {
    paramsArr.forEach(params => {
      if (/=/.test(params)) {
        let [key, value] = params.split("=");

        /**
         * 处理数字
         */
        value = /^\d+$/.test(value) ? parseFloat(value).toString() : value;
        /**
         * 解码
         */
        value = decodeURIComponent(value);

        if (key in result) {
          result[key] = [].concat(result[key], value);
        } else {
          result[key] = value;
        }
      } else {
        result[params] = true;
      }
    });
  } else {
    result = null;
  }

  return result;
};

/**
 * 字符串模板
 */
function render(template, data) {
  /**
   * 匹配{{}}
   */
  const reg = /\{\{(\w+)\}\}/;
  if (reg.test(template)) {
    /**
     * 捕获{{}}里的值
     */
    const target = reg.exec(template)[1];
    /**
     * 替换{{}}的值
     */
    template = template.replace(reg, data[target]);
    /**
     * 递归调用
     */
    return render(template, data);
  }
  return template;
}

/**
 * 图片懒加载
 */
// let imgList = [...document.querySelectorAll("img")];
// const len = imgList.length;

// function loadImgFun() {
//   let count = 1;
//   return (function () {
//     const delImgIndex = [];
//     imgList.forEach((img, index) => {
//       const ret = img.getBoundingClientRect();

//       /**
//        * 出现在可视区域将dataset.src 赋值
//        */
//       if (ret.top < window.innerHeight) {
//         img.src = img.dataset.src;
//         count++;
//         delImgIndex.push(index);
//         if (count === len) document.body.removeEventListener("scroll", loadImgFun);
//       }
//     });

//     imgList = imgList.filter((_, index) => !delImgIndex.includes(index));
//   })();
// }

/**
 * 简单防抖
 */
function simpleDebonce(f, delay) {
  let timer;
  return function () {
    const ctx = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      f.call(ctx, ...args);
    }, delay);
  };
}

/**
 * 防抖
 */
function debounce(f, delay, immediate) {
  let timer, result;

  const debounced = function () {
    const ctx = this,
      args = arguments;

    timer && clearTimeout(timer);
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(function () {
        timer = null;
      }, delay);
      if (callNow) result = f.call(ctx, ...args);
    } else {
      timer = setTimeout(function () {
        f.call(ctx, ...args);
      }, delay);
    }

    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

/**
 * 简单节流
 */
function simpleThrottle(f, delay) {
  let count = 0;
  return function () {
    const ctx = this,
      args = arguments,
      now = +new Date();

    if (now - count > delay) {
      f.call(ctx, ...args);
    }
  };
}

/**
 * 节流
 */
function throttle(fn, delay, options) {
  let timer,
    ctx,
    args,
    count = 0;

  if (!options) options = {};

  const later = function () {
    count = options.leading === false ? 0 : new Date().getTime();
    timer = null;
    fn.call(ctx, ...args);
    if (!timer) ctx = args = null;
  };

  const throttled = function () {
    const now = new Date().getTime();
    if (!count && options.leading === false) count = now;
    const remaining = delay - (now - count);

    (ctx = this), (args = arguments);
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.call(ctx, ...args);
      count = now;
      if (!timer) ctx = args = null;
    } else if (!timer && !options.trailing) {
      timer = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timer);
    timer = null;
    count = 0;
  };

  return throttled;
}

/**
 * 函数柯里化
 */
function curry(f) {
  let params = [];
  const next = (...args) => {
    params = [...params, ...args];
    return params.length < f.length ? next : f.call(f, ...params);
  };
  return next;
}

/**
 * 函数柯里化
 */
function curry1(f) {
  const next = (...args) => {
    if (args.length === f.length) return f.call(f, ...args);
    return (...arg) => next(...args, ...arg);
  };
  return next;
}

/**
 * 偏函数
 */
function partial(fn, ...args) {
  return (...arg) => fn.call(fn, ...args, ...arg);
}
