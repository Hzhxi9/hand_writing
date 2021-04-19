/**
 * 类型判断
 */
function whatType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * 继承
 */

/**
 * 原型链继承
 *
 * 可以访问父类原型的方法
 *
 * 无法给父类传参
 * 父类的引用属性会被子类共享
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
 * 可以给父类传参
 * 父类引用属性不会被共享
 *
 * 无法访问定在父类原型的方法
 */
function F2(name) {
  this.name = name;
  this.ids = [1, 2];
}
F2.prototype.getIds = function () {
  console.log(this.ids);
};

function C2(name) {
  F2.call(this, name);
}

/**
 * 原型构造组合继承
 *
 * 可以给父类传参
 * 父类引用属性不会被子类共享
 * 可以访问定义在父类原型的方法
 *
 *  父类会被调用两次
 */
function F3(name) {
  this.name = name;
  this.ids = [1, 2];
}
F3.prototype.getIds = function () {
  console.log(this.ids);
};

function C3(name) {
  F3.call(this, name);
}
C3.prototype = new F3();

/**
 * 寄生式继承
 */
function copy(o) {
  function Fun() {}
  Fun.prototype = o;
  return new Fun();
}
function create(o) {
  const clone = copy(o);
  clone.getIds = function () {
    console.log(this.ids);
  };
  return clone;
}

/**
 * 寄生组合继承
 */
/**
 * 创建一个空对象
 */
function cloneFun(o) {
  function Fun() {}
  Fun.prototype = o;
  return new Fun();
}

/**
 * 初始化
 */
function init(c, p) {
  const clone = cloneFun(p.prototype);
  clone.constructor = clone;
  c.prototype = clone;
}

function P(name) {
  this.name = name;
  this.ids = [1, 2];
}
P.prototype.getIds = function () {
  console.log(this.ids, this.name);
};

function C(name) {
  P.call(this, name);
}
init(C, P);

/**
 * 类实现继承
 */
class F4 {
  constructor(name) {
    this.name = name;
    this.ids = [1, 2];
  }
  getIds() {
    console.log(this.name, this.ids);
  }
}

class C4 extends F4 {
  constructor(name) {
    super(name);
  }
}

/**
 *  数组去重
 */
const uniqueArr = [1, 2, 3, 3, 4, 4, 6, 6, 5, 5];

/**
 * ES5
 */
function uniqueES5(arr) {
  const result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (result.indexOf(arr[i]) < 0) result.push(arr[i]);
  }
  return result;
}
console.log(uniqueES5(uniqueArr));

/**
 * ES6
 */
const uniqueES6 = arr => Array.from(new Set(arr));
console.log(uniqueES6(uniqueArr));

/**
 * reduce去重
 */
function uniqueReduce(arr) {
  return arr.reduce((acc, pre) => {
    if (!acc.includes(pre)) acc.push(pre);
    return acc;
  }, []);
}
console.log(uniqueReduce(uniqueArr));

/**
 * 扁平化处理
 */
const flatArr = [1, [2, [3, 4]]];

/**
 * ES5
 */
function flatES5(arr) {
  let result = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatES5(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}
console.log(flatES5(flatArr));

/**
 * ES6
 */
function flatES6(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}
console.log(flatES6(flatArr));

/**
 * reduce去扁平化
 */
function flatReduce(arr) {
  return arr.reduce((acc, pre) => {
    return acc.concat(Array.isArray(pre) ? flatReduce(pre) : pre);
  }, []);
}
console.log(flatReduce(flatArr));

/**
 * flat去扁平化
 */
function flatten(arr) {
  return arr.flat(Infinity);
}
console.log(flatten(flatArr));

/**
 * 生成器扁平化
 */
function* flatGenerator(arr) {
  if (Array.isArray(arr)) {
    for (const item of arr) {
      yield* flatGenerator(item);
    }
  } else {
    yield arr;
  }
}

const fg = flatGenerator(flatArr);
console.log([...fg]);

/**
 * 浅拷贝
 */

/**
 * 对象浅拷贝
 */
const o = {
  a: "a",
  b: {
    b: "b",
  },
};
const arr = [1, 2, { n: "n" }];

const shallowO = Object.assign({}, o);
shallowO.a = "a1";
shallowO.b.b = "c";
console.log(shallowO, o);

const shallowArr = arr.slice();
const concat = [].concat(arr);

console.log(shallowArr, concat);

/**
 *  对象属性浅拷贝
 */
function shallowClone(o) {
  const clone = o instanceof Array ? [] : {};
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      clone[key] = o[key];
    }
  }
  return clone;
}

/**
 * 对象深拷贝属性
 */
function deepCloneAttr(o) {
  const clone = o instanceof Array ? [] : {};
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      clone[key] = typeof o === "object" ? deepCloneAttr(o[key]) : o[key];
    }
  }
  return clone;
}

/**
 * 对象深拷贝
 */
const isObject = o => (typeof o === "function" || typeof o === "object") && o !== null;

function deepClone(o, map = new WeakMap()) {
  if (map.get(o)) return o;

  /**
   * 获取当前构造函数类型
   */
  const constructor = o.constructor;
  /**
   * 匹配正则还有日期对象
   */
  if (/^(Date| RegExp)$/i.test(constructor.name)) return constructor(target);

  if (isObject(o)) {
    map.set(o, true);
    const clone = o instanceof Array ? [] : {};
    for (const key in o) {
      if (o.hasOwnProperty(key)) clone[key] = deepClone(o[key], map);
    }
    return clone;
  } else {
    return o;
  }
}

/**
 * 事件总线
 */
class EventEmitter {
  constructor() {
    this.cache = {};
  }

  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }

  off(name, fn) {
    const tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex(f => f === fn || f.callback === fn);
      if (index >= 0) tasks.splice(index, 1);
    }
  }

  emit(name, once = false, ...args) {
    const tasks = this.cache[name].slice();
    if (tasks) {
      for (const f of tasks) {
        f(...args);
      }
    }
    once && delete this.cache[name];
  }
}

/**
 * 解析URL参数
 */
function parserParams(url) {
  /**
   * 匹配?之后的字符串
   */
  const reg = /.+\?(.+)/;
  /**
   * 获取匹配第一个捕获组的值
   */
  const paramsStr = reg.test(url) && reg.exec(url)[1];
  /**
   * 分割&
   */
  const paramsArr = paramsStr && paramsStr.split("&");

  if (paramsArr && paramsArr.length) {
    const params = {};
    paramsArr.forEach(item => {
      if (/=/.test(item)) {
        let [key, value] = item.split("=");
        /**
         * 解码
         */
        value = decodeURIComponent(value);
        /**
         * 处理纯数字
         */
        value = /\d+/.test(value) ? parseFloat(value) : value;
        if (params.hasOwnProperty(key)) {
          params[key] = [].concat(params[key], value);
        } else {
          params[key] = value;
        }
      } else {
        params[item] = true;
      }
    });
    return params;
  }
}

/**
 * 模板字符串
 */
function render(template, data) {
  const reg = /\{\{(\w+)\}\}/;

  if (reg.test(template)) {
    const value = reg.exec(template)[1];
    template = template.replace(reg, data[value]);
    return render(template, data);
  }
  return template;
}

/**
 * 图片懒加载
 */
// let imgList = [...document.querySelectorAll("img")];
// const len = imgList.length;

// function lazyLoadImg() {
//   let count = 0;
//   return (function () {
//     const delImageIndex = [];
//     imgList.forEach((img, index) => {
//       const rect = img.getBoundingClientRect();
//       if (rect.top < window.innerHeight) {
//         img.src = img.dataset.src;
//         delImageIndex.push(index);
//         count++;
//         if (len === count) document.removeEventListener("scroll", lazyLoadImg);
//       }
//     });
//     imgList = imgList.filter((_, index) => !delImageIndex.includes(index));
//   })();
// }

/**
 * 简单防抖
 */
function simpleDebounce(f, delay) {
  let timer;
  return function () {
    const this_ = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      f.call(this_, ...args);
    }, delay);
  };
}

/**
 * 完整防抖
 */
function debounce(f, delay, immediate) {
  let timer, result;

  const debounced = function () {
    const this_ = this,
      args = arguments;

    timer && clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(function () {
        timer = null;
      });
      if (callNow) result = f.call(this_, ...args);
    } else {
      timer = setTimeout(function () {
        f.call(this_, ...args);
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
 * 简单节流函数
 */
function simpleThrottle(f, delay) {
  const this_ = this,
    args = arguments;
  let count = 0;

  return function () {
    const now = +new Date();
    if (now - count > delay) {
      f.call(this_, ...args);
      count = now;
    }
  };
}

/**
 * 复杂节流函数
 */
function throttle(f, delay, options) {
  let timer,
    this_,
    args,
    count = 0;

  if (!options) options = {};

  const later = function () {
    count = options.leading === false ? 0 : new Date().getTime();
    timer = null;
    f.call(this_, ...args);
    if (!timer) this_ = args = null;
  };

  const throttled = function () {
    const now = new Date().getTime();
    if (!count && options.leading === false) count = now;

    (this_ = this), (args = arguments);

    const remaining = delay - (now - count);

    if (remaining <= 0 && remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      f.call(this_, ...args);
      count = now;
      if (!timer) this_ = args = null;
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

function add(a, b, c) {
  return a + b + c;
}
let addCurry = curry1(add);
console.log(addCurry(1)(2)(3));

/**
 * 偏函数
 */
function partial(f, ...args) {
  return (...arg) => f.call(f, ...args, ...arg);
}

/**
 * ajax
 */
const isObjectType = value => Object.prototype.toString.call(value) === "[object Object]";

const parseParams = params => {
  let result = "";
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      result += `${key}=${params[key]}&`;
    }
  }
  return result.endsWith("&") ? result.substr(0, result.length - 1) : result;
};

const defaultHeader = {
  "Content-Type": "application/x-www-from-urlencoded",
};

const request = options => {
  return new Promise((resolve, reject) => {
    const { method, url, params, headers } = options;
    const xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    if (method === "GET" || method === "DELETE") {
      const requestUrl = `${url}?${parseParams(params)}`;
      xhr.open(method, requestUrl, true);
    } else {
      xhr.open(method, url);
    }

    const mergedHeaders = Object.assign({}, defaultHeader, headers);
    for (const key in mergedHeaders) {
      if (mergedHeaders.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, mergedHeaders[key]);
      }
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };

    xhr.onerror = function (error) {
      reject(error);
    };

    const data = method === "POST" || method === "PUT" ? parserParams(params) : null;
    xhr.send(data);
  });
};

/**
 * Jsonp
 */
const jsonp = ({ url, params, callbackName }) => {
  const generateUrl = () => {
    let result = "";

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        result += `${key}=${params[key]}&`;
      }
    }
    result += `callbackName=${callbackName}`;
    return result;
  };

  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement("script");
    scriptEle.src = `${url}?${generateUrl()}`;

    document.body.appendChild(scriptEle);

    window[callbackName] = data => {
      resolve(data);
      document.body.removeChild(scriptEle);
    };
  });
};

/**
 * forEach
 */
Array.prototype.writeForEach = function (cb, thisArg) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0;

  while (k < len) {
    if (k in o) {
      cb.call(thisArg, o[k], k, o);
    }
    k++;
  }
};

/**
 * map
 */
Array.prototype.writeMap = function (cb, thisArg) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0,
    result = [];

  while (k < len) {
    if (k in o) {
      result[k] = cb.call(thisArg, o[k], k, o);
    }
    k++;
  }

  return result;
};

/**
 * filter
 */
Array.prototype.writeFilter = function (cb, thisArg) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0,
    result = [];

  while (k < len) {
    if (cb.call(thisArg, o[k], k, o)) {
      result.push(o[k]);
    }
    k++;
  }

  return result;
};

/**
 * find
 */
Array.prototype.writeFind = function (cb, thisArg) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0;

  while (k < len) {
    if (k in o) {
      if (cb.call(thisArg, o[k], k, o)) {
        return o[k];
      }
    }
    k++;
  }

  return undefined;
};

/**
 * every
 */
Array.prototype.writeEvery = function (cb, thisArg) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0;

  while (k < len) {
    if (k in o) {
      const result = cb.call(thisArg, o[k], k, o);

      if (!result) return false;
    }
    k++;
  }

  return true;
};

/**
 * some
 */
Array.prototype.writeSome = function (cb, thisArg) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0;

  while (k < len) {
    if (k in o) {
      if (cb.call(thisArg, o[k], k, o)) {
        return true;
      }
    }
    k++;
  }

  return false;
};

/**
 * reduce
 */
Array.prototype.writeReduce = function (cb, initialValue) {
  if (this === null) throw new TypeError(`${this} is null or not defined`);

  if (typeof cb !== "function") throw new TypeError(`${cb} is no function`);

  const o = Object(this),
    len = o.length >>> 0;

  let k = 0,
    acc = [];

  if (arguments.length > 1) {
    acc = initialValue;
  } else {
    while (k < len && !(k in o)) {
      k++;
    }
    if (k > len) throw new TypeError("reduce is no empty");

    acc = o[k++];
  }

  while (k < len) {
    if (k in o) {
      acc = cb(acc, o[k], k, o);
    }
    k++;
  }

  return acc;
};

console.log([1, 2, 3, 4].writeReduce((acc, pre, index, arr) => acc + pre, 0));

/**
 * call
 */
Function.prototype.writeCall = function (context) {
  const this_ = context || window;

  this_.fn = this;

  const args = [];

  for (let i = 0, len = arguments.length; i < len; i++) {
    args.push(`arguments[${i}]`);
  }

  const result = eval(`this_.fn(${args})`);

  delete this_.fn;

  return result;
};

/**
 * apply
 */
Function.prototype.writeApply = function (context, arr) {
  const ctx = context || window;

  let result;

  if (!acc) {
    result = ctx.fn();
  } else {
    const args = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      args.push(`arr[${i}]`);
    }

    result = eval(`ctx.fn(${args})`);
  }

  delete ctx.fn;

  return result;
};

/**
 * bind
 */
Function.prototype.writeBind = function (context) {
  const ctx = this,
    args = Array.prototype.slice.call(arguments, 1);

  function Fun() {}

  function bindFun() {
    const bindArgs = Array.prototype.slice.call(arguments);
    return ctx.apply(this instanceof Fun ? this : context, args.concat(bindArgs));
  }

  Fun.prototype = this.prototype;
  bindFun.prototype = new Fun();

  return bindFun;
};

/**
 * JSON.stringify
 *    undefined ===> undefined
 *    boolean ===> true/false
 *    number ===> 字符串数值
 *    symbol ===> undefined
 *    null ===> 'null'
 *    string ===> string
 *    NaN/infinity ===> 'null'
 *    function ===> undefined
 *
 *    对象
 *      数组,如果属性出现undefined,symbol,函数,转换为'null'
 *      RegExp,返回'{}'
 *      Date, 返回Date的toJSON字符串值
 *      普通对象
 *        如果有toJSON()方法,那么序列化toJSON()的返回值
 *        如果属性值中出现undefined、任意函数、symbol值，忽略
 *        所有以symbol为属性键的属性都会被忽略
 *
 *    对包含循环引用的对象(对象之间相互引用，形成无限)执行此方法,会抛出错误
 */
function stringify(data) {
  const type = typeof data;

  /**
   *  参数不是对象
   */
  if (type !== "object") {
    let result = data;

    if (Number.isNaN(data) || data === Infinity) {
      /**
       *  NaN/infinity 转换为'null'
       */
      return "null";
    } else if (type === "function" || type === "undefined" || type === "symbol") {
      /**
       * function/undefined/symbol 转换为undefined
       */
      return undefined;
    } else if (type === "string") {
      /**
       * string 转换为"string"
       */
      result = `"${data}"`;
    }

    /**
     * boolean转换为对应的true/false
     */
    return String(result);
  } else if (type === "object") {
    /**
     *  类型为对象时
     */
    if (data === null) {
      /**
       * null 转换为'null'
       */
      return "null";
    } else if (data.toJSON() && typeof data.toJSON === "function") {
      /**
       *  有toJSON方法 转换为 调用toJSON()方法
       */
      return stringify(data.toJSON());
    } else if (data instanceof Array) {
      /**
       * 数组
       */
      let result = [];

      data.forEach((item, index) => {
        /**
         * 数组里有undefined/function/symbol 转换为'null'
         */
        if (typeof item === "undefined" || typeof item === "function" || typeof item === "symbol") {
          result[index] = "null";
        } else {
          /**
           * 递归转换
           */
          result[index] = jsonStringify(item);
        }
      });

      result = `[${result}]`;

      return result.replace(/'/g, '"');
    }
  } else {
    /**
     * 普通对象
     *
     */
    let result = [];

    Object.keys(data).forEach((item, index) => {
      /**
       * symbol key 被忽略
       *  undefined/symbol value 忽略
       */
      if (typeof item !== "symbol") {
        if (
          typeof data[item] !== "undefined" &&
          typeof data[item] !== "function" &&
          typeof data[item] !== "symbol"
        ) {
          result.push(`"${item}"：${stringify(data[item])}`);
        }
      }
    });

    return `"${result}"`.replace(/'/g, '"');
  }
}
