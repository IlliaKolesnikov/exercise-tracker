function checkFrom(date){
  if(date !="Invalid Date"){
    return date.getTime();
  }
  else{
    return 0
  }
}

function checkTo(date){
  if(date != "Invalid Date"){
    return date.getTime();
  }
  else{
    return Date.now()
  }
}

exports.checkFrom = function checkFrom(date){
  if(date !="Invalid Date"){
    return date.getTime();
  }
  else{
    return 0
  }
};

exports.checkTo = function checkTo(date){
  if(date != "Invalid Date"){
    return date.getTime();
  }
  else{
    return Date.now()
  }
}