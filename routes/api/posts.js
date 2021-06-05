//ROUTER FOR POSTS

//require express and router
const { json } = require('express');
const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

//require in our models 
const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

//@route        POST api/posts
//@description  Create a post
//@access       Private 
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save();
        res.json(post)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }

});

//@route        GET api/posts
//@description  Get all posts
//@access       Private 
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }) //<-- -1 will select the most recent posts first
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

//@route        GET api/posts/:id
//@description  Get post by ID
//@access       Private 
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error')
    }
});


//@route        DELETE api/posts/:id
//@description  Delete a post
//@access       Private 
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        //check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        } 

        await post.remove();
        res.json({ msg: 'Post Removed'});
    } catch (error) {
        console.error(error.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error')
    }
});

//@route        PUT api/posts/like/:id
//@description  Like a Post
//@access       Private 
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log(post.likes)
        // check if post has already been liked 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();
        return json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// //@route        PUT api/posts/unlike/:id
// //@description  Unlike a Post
// //@access       Private 
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        //check if post has already been liked 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        //get removed index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex, 1);


        await post.save();
        return json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


//@route        POST api/posts/comment/:id
//@description  Comment on a post
//@access       Private 
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});



//@route        DELETE api/posts/comment/:id/:comment_id
//@description  Delete comment
//@access       Private 
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        //Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist'});
        };

        //Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized'})
        }

        const removedIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);
        
            post.comments.splice(removedIndex, 1);
        
        await post.save();
        res.json(post.comments);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }

});









module.exports = router;