import Comment from '../models/comment.model.js'

export const createComment = async (req, res) => { 
    try {
        const {content, postId, userId} = req.body

        const newComment = new Comment({
            content,
            postId,
            userId,
        })
        await newComment.save()

        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}

export const getPostComments = async (req, res) => { 
    try {
        const comments = await Comment.find({postId: req.params.postId}).sort({
            createdAt: -1,
        })
        res.status(200).json(comments)
    } catch (error) {
        console.log(error);
        
    }
}