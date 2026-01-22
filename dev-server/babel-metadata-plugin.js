module.exports = function(){
  return {
    visitor:{
      Program(){
        console.log("Babel plugin active");
      }
    }
  }
}
