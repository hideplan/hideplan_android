
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

export const sendPostAsync = async (url, content, callback, callback2) => {
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
    

  });
 
 
}

export const createLocalId = () => {
  let timestamp = new Date().getTime()
  let hash = Math.random()
  let stringHash = hash.toString().slice(2) + timestamp.toString()
  return stringHash
}

export const hashForComparingChanges = () => {
  let timestamp = new Date().getTime()
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