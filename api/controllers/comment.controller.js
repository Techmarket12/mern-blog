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
            // L'utilisateur n'a pas encore aimé le commentaire
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)  // Ajoute l'utilisateur à la liste des likes
        } else {
            // L'utilisateur a déjà aimé ce commentaire, donc on enlève son like
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)  // Retire l'utilisateur de la liste des likes
        }

        await comment.save()
        res.status(200).json(comment)  // Renvoie le commentaire mis à jour
    } catch (error) {
        next(error)
    }
}

export const editComment = async (req, res, next) => { 
    try {
        const comment = await Comment.findById(req.params.commentId)
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        if(comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not authorized to edit this comment'))
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content,
        }, {new: true})
        res.status(200).json(editedComment)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req, res, next) => { 
    try {
        
        const comment = await Comment.findById(req.params.commentId)
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        if(comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not authorized to delete this comment'))
        }
        if(!comment) {
            return next(errorHandler(404, 'Comment not found'))
        }
        if(comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not authorized to delete this comment'))
        }

        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json('Comment deleted successfully')

    } catch (error) {
        next(error)
    }
}