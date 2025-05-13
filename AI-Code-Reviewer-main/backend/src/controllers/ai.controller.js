const aiservice=require('../services/ai.service.js')

module.exports.getReview=async (req,res)=>{
    const code=req.body.code;
    if(!code){
        return res.status(400).send({msg:"Code is rquired!!!!"})
    }

    const response=await aiservice(code);

    res.send(response)
}
