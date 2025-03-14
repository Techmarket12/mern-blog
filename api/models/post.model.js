
import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({ 
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,   // Assurez-vous que le champ 'content' est toujours rempli
        // Ne pas ajouter "unique: true" ici
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://simplybuiltsites.com/wp-content/uploads/how-to-write-a-blog-post.png'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
