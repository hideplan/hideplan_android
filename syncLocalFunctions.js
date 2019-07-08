
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


export const hashForComparingChanges = () => {
  let hash = Math.random()
  let stringHash = hash.toString().slice(2)
  return stringHash
}
