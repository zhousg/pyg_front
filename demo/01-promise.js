const isOk = false;
const p = () => {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      if(isOk){
        resolve('ok')
      }else{
        reject('error')
      }
    },1000)
  })
}

const pp = function(){
  return p().then(data=>{
    return data;
  }).catch(err=>{
    return Promise.reject(err)
  })
}

pp().then(data=>{
  console.log(data)
}).catch(function (err) {
  console.log(err)
})