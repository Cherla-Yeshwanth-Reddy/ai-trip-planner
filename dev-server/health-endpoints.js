export function health(req,res){
  res.json({status:"OK",time:new Date()});
}
