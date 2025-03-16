import Comment from '../models/comment.model.js'
import errorHandler from '../utils/errorHandler.js'

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

export const likeComment = async (req, res, next) => { 

    try {
        const comment = await Comment.findById(req.params.commentId)

        if(!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        const userIndex = comment.likes.indexOf(req.user.id)

        if(userIndex === -1) {
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
        } else { 
            comment.numberOfLikes -= 1
            comment.likes.split(userIndex, 1)
        }
        await comment.save()
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}