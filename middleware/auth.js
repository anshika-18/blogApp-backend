const config=require('config')
const jwt=require("jsonwebtoken")

function middleware(req,res,next){
    //console.log("anshika")
    const token=req.header('x-auth-token')
    if(!token)
    {
        return res.status(401).json({msg:"no token authorization failed"})
    }
    try
    {
        const decoded=jwt.verify(token,config.get('jwtSecret'))
        req.user=decoded
        //console.log(req.user)
        next();
    }
    catch(e)
    {
        res.status(400).json({msg:"token is not valid"})
    }

}

module.exports=middleware;

