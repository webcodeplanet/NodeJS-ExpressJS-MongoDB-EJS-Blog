const express = require('express');

const { 
    
    getPosts, 
    getPost, 
    getAddPost, 
    addPost, 
    deletePost, 
    getEditPost, 
    updatePost,
    get404,
    getSearchPosts

} = require('../controllers/postController');


const router = express.Router();

const upload = require('../middleware/imgUpload'); 


//Get All Posts
router.get('/', getPosts);
router.get('/posts', getPosts);

//Get One Post
router.get('/posts/:id', getPost);

//Show Add Post Page
router.get('/add-post', getAddPost);

//Adding Post
router.post('/add-post', upload.single('postimage'), addPost);

//Delete Post
router.delete('/posts/:id', deletePost);

//Edit Post Form
router.get('/edit/:id', getEditPost);

//Update Post
router.put('/edit/:id', upload.single('postimage'), updatePost);

//Search Posts
router.get('/search', getSearchPosts);


// 404 Error
router.use(get404);

module.exports = router;
