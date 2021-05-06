const Blog=require('../models/blogModel')
const middleware=require('../middleware/auth')
const User=require('../models/userModel')
module.exports=(app)=>{
    
    app.get('/',(req,res)=>{
        res.send("hello")
    })

    //get all blogs
    app.get('/api/blogs',(req,res)=>{
        Blog.find()
            .then((data)=>{
                res.status(200).json(data)
            })
            .catch((err)=>{
                res.status(500).json(err)
            })
    })

    //create a blog
    app.post('/api/blog/create',async(req,res)=>{
        const newBlog=new Blog({
            title:req.body.title,
            author:req.body.author,
            description:req.body.description,
            email:req.body.email
        })
        
        let blog;
        try{
            blog=await newBlog.save()
        }
        catch(err){
            if(err) return res.status(500).json(err)
        }
        return res.status(201).json({"msg":"created","blog":blog})
    })

    //delete a blog
    app.delete('/api/blog/:blogId',(req,res)=>{
        Blog.findByIdAndDelete(req.params.blogId)
            .then((data)=>{
                if(!data) return res.status(404).json({"msg":"data not found"})

                res.status(202).json({"msg":"deleted successfully","data":data})
            })
            .catch(err=>res.status(500).json(err))
    })

    //update a blog
    app.put('/update/:blogId',(req,res)=>{

        if(!req.body.title||!req.body.author||!req.body.description)
            return res.status(500).json({"msg":"enter all details"})
        
            Blog.findByIdAndUpdate(req.params.blogId,{
                title:req.body.title,
                author:req.body.author,
                description:req.body.description
            },{new:true})
            .then((data)=>{
                if(!data) return res.status(500).json({"msg":"blog not found"})
                res.status(202).json({"msg":"blog updated","blog":data})
            })
            .catch(err=>res.status(500).json(EvalError))

    })

    //get blog by email
    app.get('/api/blog',middleware,(req,res)=>{
        //console.log(req.user.id)
        User.findById(req.user.id)
            .then(req=>{
                console.log(req)
                Blog.find({email:req.email})
                .then(data=>{
                    if(!data) return res.status(500).json({"msg":"blog not found"})
    
                    res.status(200).json({"data":data})
                })
                .catch(err=>res.status(500).json(err))
            })
        
    })

    app.get('/blog/:id',(req,res)=>{
       // console.log(req.params.id)
        Blog.findById(req.params.id)
            .then(blog=>{
                if(!blog)
                    res.status(400).json({"msg":"Blog not found"})
                res.status(200).json(blog)
            })
            .catch(err=>res.status(400).json(err))

        })
}