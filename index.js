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
