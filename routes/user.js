const User=require('../models/userModel')
const jwt=require('jsonwebtoken')
const config=require("config")

module.exports=(app)=>{
    app.post('/api/users',(req,res)=>{
        
        const {name,email,password}=req.body
        if(!name||!email||!password)
        {
            return res.status(400).json({msg:"Please enter all fields"})
        }

        User.findOne({email})
            .then(user=>{
                if(user)
                {
                    return res.status(400).json({msg:"user already exist"})
                }
                else
                {
                    const newUser=new User({
                        name,
                        email,
                        password
                        }).save()
                        .then(user=>{
                            jwt.sign(
                                {id:user.id},
                                config.get('jwtSecret'),
                                {expiresIn:3600},
                                (err,token)=>{
                                    if(err) throw err
                                    res.json({
                                        token,
                                        user:{
                                            id:user.id,
                                            name:user.name,
                                            email:user.email
                                            }
                                        })
                                    }
                                )
                            })
        
                }
            })
            .catch(err=>{
                return res.status(500).json(err)
            })
                
            
    })

}