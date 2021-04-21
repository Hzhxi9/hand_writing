const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(exe) {
    try {
      /**
       * 立即执行
       */
      exe(this.resolve, this.reject);
    } catch (error) {
      /**
       * 抛出错误
       */
      this.reject(error);
    }
  }

  /**
   * 状态
   */
  status = PENDING;
  /**
   * 成功值
   */
  value = null;
  /**
   * 失败原因
   */
  reason = null;

  /**
   * 成功函数数组缓存
   */
  fulfilledCb = [];

  /**
   * 失败函数数组缓存
   */
  rejectedCb = [];

  /**
   * 成功函数回调
   */
  resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;

      while (this.fulfilledCb.length) {
        this.fulfilledCb.shift()(value);
      }
    }
  };

  /**
   * 失败函数回调
   */
  reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;

      while (this.rejectedCb.length) {
        this.rejectedCb.shift()(reason);
      }
    }
  };

  /**
   * then
   */
  then(onFulfilled, onRejected) {
    const realFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;

    const realRejected =
      typeof onRejected === "function"
        ? onRejected
        : reason => {
            throw reason;
          };

    const p = new MyPromise((resolve, reject) => {
      const fulfilledTask = () => {
        queueMicrotask(() => {
          try {
            const x = realFulfilled(this.value);

            handleResolve(p, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejectedTask = () => {
        queueMicrotask(() => {
          try {
            const x = realRejected(this.reason);

            handleResolve(p, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      switch (this.status) {
        case FULFILLED:
          fulfilledTask();
          break;
        case REJECTED:
          rejectedTask();
          break;
        case PENDING:
          this.fulfilledCb.push(fulfilledTask);
          this.rejectedCb.push(rejectedTask);
          break;
      }
    });

    return p;
  }

  /**
   * 成功静态方法
   */
  static resolve(params) {
    if (params instanceof MyPromise) return params;

    return new MyPromise(resolve => {
      resolve(params);
    });
  }

  /**
   * 失败静态方法
   */
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

/**
 * 成功失败统一处理函数
 */
function handleResolve(p, x, resolve, reject) {
  if (p === x) return reject(new TypeError("promise is same"));

  if (typeof x === "function" || typeof x === "object") {
    /**
     * x为null直接返回
     */
    if (x === null) return resolve(x);

    let then;
    try {
      then = x.then;
    } catch (error) {
      return reject(error);
    }

    if (typeof then === "function") {
      let called = false;

      try {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            handleResolve(p, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) return;

        reject(error);
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

MyPromise.deferred = function () {
  var result = {};
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = MyPromise;
