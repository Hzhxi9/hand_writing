/**
 *  数据类型判断
 *  Object.prototype.toString.call(o) ===> [object 类型]
 *  String.prototype.slice(8,-1) ===> 8为截取前面的[object,-1为总长度-1截取]
 */
function whatType(o) {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}
console.log(whatType(new Date())); // date
console.log(whatType([])); // array
console.log(whatType({})); // object
console.log(whatType(null)); // null

/**
 *  继承
 */

/**
 * 原型链继承
 *
 * 父类方法可以复用
 *
 * 父类所有引用属性会被子类共享
 * 子类实例不能给父类传参
 */
function Father1() {
  this.ids = [1, 2];
}
Father1.prototype.getIds = function () {
  console.log(this.ids);
};
Object.defineProperty(Father1.prototype, "constructor", {
  value: new Father1(),
  writable: false,
  enumerable: false,
});

function Son1() {}
Son1.prototype = new Father1();
const s1 = new Son1();
s1.ids.push(3);
const s2 = new Son1();
console.log(s2.ids);

/**
 * 构造函数实现继承
 *
 * 子类构造函数可以给父类传递参数
 * 父类引用属性不会被共享
 *
 * 子类不能访问父类原型定义的方法
 */
function Father2(name) {
  this.name = name;
  this.ids = [1, 2];
}
Father2.prototype.getIds = function () {
  console.log(this.name);
};

function Son2(name) {
  Father2.call(this, name);
}

const s3 = new Son2("test");
console.log(s3.name);
s3.ids.push(3);
const s4 = new Son2("test1");
console.log(s4.ids);

/**
 * 原型链构造函数组合继承
 *
 * 子类构造函数可以给父类传递参数
 * 父类引用属性不会被子类共享
 * 子类可以访问父类原型定义的方法
 *
 * 父类构造函数始终会被调用两次
 *      1. 创建子类原型时候调用  Son3.prototype = new Father3()
 *      2. 子类构造函数中调用   Father3.call(this, name);
 */
function Father3(name) {
  this.name = name;
  this.ids = [1, 2];
}
Father3.prototype.getIds = function () {
  console.log(this.name);
};

function Son3(name) {
  Father3.call(this, name);
}
Son3.prototype = new Father3();

const s5 = new Son3("son3");
console.log(s5.name);
s5.ids.push(3);
const s6 = new Son3("son03");
console.log(s6.ids);

/**
 *  寄生式继承
 *
 *  添加函数难以复用
 */
function copy1(o) {
  /**
   * 创建一个空对象
   */
  function Fun() {}
  Fun.prototype = o;
  return new Fun();
}
function create1(o) {
  const clone = copy(o);
  clone.getIds = function () {
    console.log(this.ids);
  };
  return clone;
}
const p = {
  name: "p1",
  ids: [1, 2],
};
const c1 = create1(p);
c1.ids.push(3);
const c2 = create1(p);
console.log(c2.ids);

/**
 *  寄生式组合继承
 */
function copy(o) {
  /**
   * 创建一个空对象
   */
  function Fun() {}
  Fun.prototype = o;
  return new Fun();
}
function init(c, p) {
  const clone = copy(p.prototype);
  clone.constructor = c;
  c.prototype = clone;
}
function P(name) {
  this.name = name;
  this.ids = [1, 2];
}
P.prototype.getIds = function () {
  console.log(this.name, this.ids);
};

function C(name) {
  P.call(this, name);
}
init(C, P);

const children1 = new C("c1");
console.log(children1.name);
children1.ids.push(3);
children1.getIds();

const children2 = new C("c2");
console.log(children2.ids);

/**
 * 类实现继承
 */
class FatherCLass {
  constructor(name) {
    this.name = name;
    this.ids = [1, 2];
  }
  getIds() {
    console.log(this.ids, this.name);
  }
}

class ChildClass extends FatherCLass {
  constructor(name) {
    super(name);
  }
}

const cs1 = new ChildClass("cs1");
console.log(cs1.name);
cs1.ids.push(3);
cs1.getIds();

const cs2 = new ChildClass("cs2");
console.log(cs2.ids);

/**
 * 数组去重
 */
const arr = [1, 2, 3, 3, 5, 5, 6, 3, 7];

/**
 * ES5去重
 */
function uniqueES5(arr) {
  return arr.filter(function (item, index, array) {
    return array.indexOf(item) === index;
  });
}

/**
 * ES6去重
 */
const uniqueES6 = arr => Array.from(new Set(arr));

/**
 * ES6 reduce去重
 */
function uniqueReduce(arr) {
  return arr.reduce((acc, pre) => {
    if (!acc.includes(pre)) acc.push(pre);
    return acc;
  }, []);
}

/**
 * 数组扁平化
 */
const flatArr = [1, [2, [3]]];

/**
 * ES5
 */
function flatES5(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      newArr = newArr.concat(flat(arr[i]));
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

/**
 * ES6
 */
function flatES6(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

/**
 *  reduce扁平化
 */
function flatReduce(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatReduce(cur) : cur);
  }, []);
}

/**
 *  生成器扁平化
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

/**
 * Array.prototype.flat
 */
function flatten(arr) {
  return arr.flat(Infinity);
}

/**
 *  浅拷贝
 */
const o = {
  a: "a",
  b: {
    b: "b",
  },
};
const arrObj = [1, 2, { o: "o" }];
/**
 * Object.assign
 * 单层对象是深拷贝
 * 多层对象是浅拷贝
 */

const assignObj = Object.assign({}, o);

/**
 *  Array.prototype.concat
 *  作用于原始值
 */
const concatArr = [].concat(arrObj);

/**
 *  Array.prototype.slice
 *  作用于原始值
 */
const sliceArr = arrObj.slice();

/**
 *  浅拷贝只考虑对象属性
 */
const copyAttr = o => {
  if (typeof o !== "object") return;

  const newO = o instanceof Array ? [] : {};

  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      newO[key] = o[key];
    }
  }
  return newO;
};

/**
 * 深拷贝
 */

/**
 * 深拷贝只考虑对象属性
 */
const deepCloneAttr = o => {
  if (typeof o !== "object") return;
  const result = o instanceof Array ? [] : {};
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      result[key] = typeof o[key] === "object" ? deepCloneAttr(o[key]) : o[key];
    }
  }
  return result;
};

/**
 * 深拷贝考虑对象属性， 方法以及内置对象， 解决循环引用
 */
const isObject = target =>
  (typeof target === "object" || typeof target === "function") && target !== null;

function deepClone(target, map = new WeakMap()) {
  if (map.get(target)) return target;
  console.log(map, "====>");
  /**
   * 获取当前值的构造函数,获取它的类型
   */
  const constructor = target.constructor;
  /**
   * 检查当前对象是否与正则、日期对象匹配
   */
  if (/^(RegExp | Date)$/i.test(constructor.name)) return new constructor(target);

  if (isObject(target)) {
    /**
     * 为循环引用的对象做标记
     */
    map.set(target, true);
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
      }
    }
    return cloneTarget;
  } else {
    return target;
  }
}

/**
 * 事件总线(发布订阅模式)
 * 一处更改操作，触发多次事件响应
 */
class EventEmitter {
  constructor() {
    /**
     * 创建缓存对象
     */
    this.cache = {};
  }

  /**
   * 注册
   */
  on(name, fn) {
    if (this.cache[name]) {
      this.cache[name].push(fn);
    } else {
      this.cache[name] = [fn];
    }
  }

  /**
   * 删除
   */
  off(name, fn) {
    const tasks = this.cache[name];
    if (tasks) {
      const index = tasks.findIndex(f => f === fn || f.callback === fn);
      if (index >= 0) tasks.splice(index, 1);
    }
  }

  /**
   * 操作
   */
  emit(name, once = false, ...args) {
    const tasks = this.cache[name].slice();
    if (tasks) {
      for (const fn of tasks) {
        fn(...args);
      }
      once && delete this.cache[name];
    }
  }
}
// 测试
// let eventBus = new EventEmitter();
// let fn1 = function (name, age) {
//   console.log(`${name} ${age}`);
// };
// let fn2 = function (name, age) {
//   console.log(`hello, ${name} ${age}`);
// };
// eventBus.on("aaa", fn1);
// eventBus.on("aaa", fn2);
// eventBus.emit("aaa", false, "布兰", 12);

/**
 * 解析URL参数为对象
 */
function parseParams(url) {
  /**
   *  url匹配正则
   */
  const reg = /.+\?(.+)$/;

  const paramsStr = reg.test(url) && reg.exec(url)[1];

  /**
   *  根据&进行分割
   */
  const paramsArr = paramsStr && paramsStr.split("&");

  /**
   * 定义参数对象
   */
  const params = {};

  if (paramsArr && paramsArr.length) {
    paramsArr.forEach(item => {
      if (/=/.test(item)) {
        /**
         * 处理参数带=
         */
        let [key, value] = item.split("=");
        /**
         * 解码
         */
        value = decodeURIComponent(value);
        /**
         * 处理数字
         */
        value = /^\d+$/.test(value) ? parseFloat(value) : value;

        if (params.hasOwnProperty(key)) {
          /**
           * 已经存在当前key,转化成数组
           */
          params[key] = [].concat(params[key], value);
        } else {
          params[key] = value;
        }
      } else {
        /**
         * 处理没有value的参数
         */
        params[item] = true;
      }
    });
  }
  return params;
}

/**
 * 字符串模板
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
let template = "我是{{name}}，年龄{{age}}，性别{{sex}}";
let person = {
  name: "布兰",
  age: 12,
};
console.log(render(template, person));

/**
 * 图片懒加载
 */
// let imgList = [...document.querySelectorAll("img")];
// const len = imgList.length;

// const lazyLoadImg = () => {
//   let count = 1;
//   return (function () {
//     const delImgList = [];
//     imgList.forEach((img, index) => {
//       const rect = img.getBoundingClientRect();
//       if (rect.top < window.innerHeight) {
//         img.src = img.dataset.src;
//         delImgList.push(index);
//         count++;
//         if (count === len) document.removeEventListener("scroll", lazyLoadImg);
//       }
//     });

//     imgList = imgList.filter((_, index) => !delImgList.includes(index));
//   })();
// };

// document.addEventListener("scroll", lazyLoadImg);

/**
 *  防抖
 *
 *  触发高频事件 N 秒后只会执行一次，如果 N 秒内事件再次触发，则会重新计时。
 */
// function debounce(f, delay) {
//   let timer;
//   return function () {
//     const ctx = this;
//     clearTimeout(timer);
//     timer = setTimeout(function () {
//       f.call(ctx, ...arguments);
//     }, delay);
//   };
// }

function debounce(f, delay, immediate) {
  let timer, result;
  const debounced = function () {
    const ctx = this;

    timer && clearTimeout(timer);

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(function () {
        timer = null;
      }, delay);

      callNow && (result = f.call(ctx, ...arguments));
    } else {
      timer = setTimeout(function () {
        f.call(ctx, ...arguments);
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
 * 节流
 * 触发高频事件,且n秒内只执行一次
 */
// function throttle(f, delay) {
//   let ctx;
//   let count = 0;
//   return function () {
//     const now = +new Date();
//     ctx = this;
//     if (now - count > delay) {
//       f.call(ctx, ...arguments);
//       count = now;
//     }
//   };
// }

/**
 * 节流
 * @param options
 *  leading  是否可以立即执行一次  true
 *  trailing  结束调用的时候是否还要执行一次 true
 */
function throttle(f, delay, options) {
  let timer, ctx, args;
  let count = 0;
  if (!options) options = {};

  const later = function () {
    count = options.leading === false ? 0 : new Date().getTime();
    timer = null;
    f.call(ctx, ...args);
    if (!timer) ctx = args = null;
  };

  const throttled = function () {
    const now = new Date().getTime();

    if (!count && options.leading === false) count = now;

    const remaining = delay - (now - count);
    ctx = this;
    args = arguments;

    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      count = now;
      f.call(ctx, ...args);
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

// let count = 0;
// const node = document.getElementById("layout");
// const btn = document.getElementById("btn");
// function getCount(e) {
//   console.log("====");
//   node.innerHTML = count++;
// }
// btn.onclick = throttle(getCount, 1000);

/**
 * 函数柯里化
 */
// function curry(f) {
//   const fn = (...args) => {
//     if (args.length === f.length) return f(...args);
//     return (...arg) => fn(...args, ...arg);
//   };
//   return fn;
// }

function curry(fn) {
  let params = [];
  const next = (...args) => {
    params = [...params, ...args];
    return params.length < fn.length ? next : fn.call(fn, ...params);
  };
  return next;
}
function add(a, b, c) {
  return a + b + c;
}
let addCurry = curry(add);
console.log(addCurry(1)(2)(3));
