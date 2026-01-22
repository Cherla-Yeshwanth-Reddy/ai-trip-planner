class HealthPlugin{
  apply(compiler){
    compiler.hooks.done.tap("HealthPlugin",()=>{
      console.log("Build completed successfully");
    });
  }
}
module.exports = HealthPlugin;
