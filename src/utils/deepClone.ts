const deepClone = (obj: any): any => {
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      let obj2 = [];
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] === null) {
          obj2[i] = null;
          continue;
        } else if (typeof obj[i] === "object") {
          obj2[i] = deepClone(obj[i]);
          continue;
        } else if (typeof obj[i] === "function") {
          obj2[i] = obj[i];
          continue;
        } else {
          obj2[i] = obj[i];
        }
      }
      return obj2;
    } else {
      let obj2: any = {};
      Object.keys(obj).forEach(function(key) {
        if (obj[key] === null) {
          obj2[key] = null;
        } else if (typeof obj[key] === "object") {
          obj2[key] = deepClone(obj[key]);
        } else if (typeof obj[key] === "function") {
          obj2[key] = obj[key];
        } else {
          obj2[key] = obj[key];
        }
      });
      return obj2;
    }
  } else {
    return obj;
  }
};
export default deepClone;
