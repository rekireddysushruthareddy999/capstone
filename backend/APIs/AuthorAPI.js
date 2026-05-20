import exp from 'express'
import { ArticleModel  } from '../models/ArticleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const authorApp=exp.Router()

//write article 
authorApp.post("/articles",verifyToken("AUTHOR"), async(req,res)=>{
    const authorData=req.body
    // Trust the verified token — set author from token directly
    authorData.author = req.user._id
    let authorDocument= new ArticleModel(authorData)
    await authorDocument.save()
    return res.status(201).json({message:"Article uploaded successfully."})
})

//read own articles
authorApp.get("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    const authorIdOfToken=req.user?._id
    const articles=await ArticleModel.find({author:authorIdOfToken})
    res.status(200).json({message:"article details",payload:articles})
})

//update article
authorApp.put("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    //get modified article
    const {articleId,title,category,content}=req.body
    const authorIdOfToken=req.user?._id
    const newArticle=await ArticleModel.findOneAndUpdate(
        {_id:articleId,author:authorIdOfToken},
        {$set:{title,category,content}},
        {new:true})
        if(!newArticle){
        return res.status(403).json({message:"You're not authorized."})
        }
        res.status(200).json({message:"Article Modified.",payload:newArticle})
})

authorApp.patch("/articles/:articleId", verifyToken("AUTHOR"), async (req, res) => {

    const authortokenid = req.user?._id

    const { articleId } = req.params
    const { isArticleActive } = req.body

    const articleofdb = await ArticleModel.findOne({
        _id: articleId,
        author: authortokenid
    })

    if (!articleofdb) {
        return res.status(404).json({ message: "Article not found" })
    }

    if (isArticleActive === articleofdb.isArticleActive) {
        return res.status(400).json({ message: "No change in status" })
    }

    const result = await ArticleModel.findByIdAndUpdate(
        articleId,
        { $set: { isArticleActive } },
        { new: true }
    )

    res.status(200).json({
        message: "Article status updated",
        payload: result
    })
})

//to delete comment
authorApp.delete("/articles/:articleId/comments/:commentId", verifyToken("AUTHOR"), async(req,res)=>{
    const {articleId, commentId} = req.params
    const article = await ArticleModel.findByIdAndUpdate(
        articleId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
    ).populate("comments.user", "firstName email")
    
    res.status(200).json({message:"Comment deleted.", payload:article})
})