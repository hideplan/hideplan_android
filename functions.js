import { parseISO, format } from 'date-fns';

export const sendPost = function (url, content, callback, callback2) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function (e) {
   
    if (xhr.readyState === 4) {
     
      if (xhr.status === 200) {
        
        if (xhr.responseText) {
         if (xhr.responseText === "response") {
           callback.call()
         } else {
          if (typeof(callback2) === typeof(Function)) {
            callback2.call()
          }
        }
        }
      } else {
       
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
    callback2.call()

  };
  xhr.open("POST", url, true);
 
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.withCredentials = true;
 
  xhr.send(
    JSON.stringify({
      content
    })
  )
}

export const parse = (date) => {
  let formatedDate = format(new Date(date), "yyyy-MM-dd HH:mm:ss 'Z'")
  let parsedDate = parseISO(formatedDate)
  return parsedDate
}

export const formatDate = (date) => {
  let formatedDate = format(new Date(date), "yyyy-MM-dd HH:mm:ss 'Z'")
  return formatedDate
}


export const createLocalId = () => {
  let timestamp = parse(new Date())
  let hash = Math.random()
  let stringHash = hash.toString().slice(2) + timestamp.toString()
  return stringHash
}

export const hashForComparingChanges = () => {
  let timestamp = parse(new Date())
  let hash = Math.random()
  let stringHash = hash.toString().slice(2) + timestamp.toString()
  return stringHash
}

export const createId = (type) => {
  let timestamp = new Date().getTime()
  let hash = Math.random().toString().slice(2)
  let hash1 = hash.slice(0,4)
  let hash2 = hash.slice(4,9)
  let result = hash1 + timestamp + hash2
  return  result
 
}
export const timeoutPromise = () => {
  return new Promise(function(resolve, reject) {
    let wait = setTimeout(() => {
    clearTimout(wait);
    resolve("timeout");
  }, 5000)
})
}
timeout = (delay) => {
  let cancel;
  const wait = new Promise(resolve => {
    const timer = setTimeout(() => resolve(false), delay);
    cancel = () => {
      clearTimeout(timer);
      resolve(true);
    };
  });
  wait.cancel = cancel;
  return wait;
}


const timeoutConnection = () => {
  return new Promise(function(resolve, reject) {
  setTimeout(() => {resolve("timeout")}, 5500);
})
}

const sendData = (url, content, callback, callback2) => {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
     
      if (xhr.readyState === 4) {
       
        if (xhr.status === 200) {
          
          if (xhr.responseText) {
           if (xhr.responseText === "response") {
            resolve('resolved');

           } else {
              resolve("wrong");

          }
          }
        } else {
          reject("error")
        }
      }
    };
    xhr.onerror = function (e) {
      reject("error")

    };
    xhr.open("POST", url, true);
   
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;
   
    xhr.send(
      JSON.stringify({
        content
      })
    )
  })
}

export const sendPostAsyncA = (url, content, callback, callback2) => {
  return Promise.race([() => {timeoutConnection}, () => {sendData(url, content, callback, callback2)}])
}

export const sendPostAsync = (url, content, callback, callback2) => {
  return new Promise(function(resolve, reject) {
    const timer = setTimeout(() => resolve("timeout"), 10000);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
     
      if (xhr.readyState === 4) {
       
        if (xhr.status === 200) {
          
          if (xhr.responseText) {
           if (xhr.responseText === "response") {
            resolve('resolved');

           } else {
              resolve("wrong");

          }
          }
        } else {
          reject("error")
        }
      }
    };
    xhr.onerror = function (e) {
      reject("error")

    };
    xhr.open("POST", url, true);
   
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;
   
    xhr.send(
      JSON.stringify({
        content
      })
    )
  })
}