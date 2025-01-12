const Post = require('../models/post-model');
const myPath = require('../helpers/mypath');
const { request, response, next } = require('express');
const path = require('path');
const fs = require('fs');

const postsPerPage = 5;

//Show Error
const handleError = (response, error) => {
    const title = 'Error';
    console.log(error);
    response.render(myPath('404'), { title })
};

// Get All Posts with Pagination
const getPosts = (request, response) => {
    const title = 'Posts';
    const page = parseInt(request.query.page) || 1; // Получаем страницу из запроса, по умолчанию 1

    Post
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * postsPerPage) // Пропускаем посты на основе текущей страницы
        .limit(postsPerPage) // Ограничиваем количество постов на странице
        .then((posts) => {
            // Подсчитываем общее количество постов для расчета количества страниц
            Post.countDocuments().then(count => {
                const totalPages = Math.ceil(count / postsPerPage); // Рассчитываем общее количество страниц
                response.render(myPath('index'), { 
                    posts, 
                    title, 
                    currentPage: page, 
                    totalPages: totalPages 
                });
            });
        })
        .catch((error) => handleError(response, error));
};


//Get One Post
const getPost = (request, response) => {
    const title = 'Post';
    Post
        .findById(request.params.id)
        .then((post) => response.render(myPath('post'), { post, title }))
        .catch((error) => handleError (response, error));
};

//Add Page
const getAddPost = (request, response) => {
    const title = 'Add Post'
    response.render(myPath('add-post'), { title });
};

// Adding Post
const addPost = (request, response) => {
    const { posttitle, postbody } = request.body;
    const imagePath = request.file ? request.file.filename : null;
    const post = new Post({ 
        posttitle, 
        postbody, 
        postimage: imagePath  
    });
    post
        .save()
        .then(() => response.redirect('/')) 
        .catch((error) => handleError (response, error));
};


// Delete Post
const deletePost = (request, response) => {
    Post
        .findByIdAndDelete(request.params.id) // Находим и удаляем пост
        .then((post) => {
            if (!post) {
                return response.status(404).send('Post not found');
            }

            // Получаем имя файла из удаленного поста
            const imagePath = path.resolve(__dirname, '../public/uploads', post.postimage); // путь к файлу на сервере

            // Удаляем файл с диска
            fs.unlink(imagePath, (err) => {
                if (err) {
                    return response.status(500).send('Error deleting file');
                }

                // Ответ об успешном удалении
                response.sendStatus(200);
            });
        })
        .catch((error) => handleError(response, error)); // Обработка ошибок
};



//Edit Post Form
const getEditPost = (request, response) => {
    const title = 'Edit Post';
    Post
        .findById(request.params.id)
        .then(post => response.render(myPath('edit-post'), { post, title }))
        .catch((error) => handleError((response, error)));
};


//Update Post        
const updatePost = (request, response) => {
    const { posttitle, postbody } = request.body;
    const id = request.params.id;
    const updatedPostImage = request.file ? request.file.filename : request.body.postimage;

    Post
        .findByIdAndUpdate(
            id,
            { posttitle, postbody, postimage: updatedPostImage },
            { new: false }
        )
        .then((post) => {
            if (request.file && post?.postimage) {
                fs.unlink(path.join(__dirname, '../public/uploads', post.postimage), (err) => {
                    if (err) console.error(`Ошибка удаления файла: ${err.message}`);
                });
            }
            response.redirect(`/posts/${id}`);
        })
        .catch((error) => handleError(response, error));
};


// Search Posts with Pagination
const getSearchPosts = (request, response) => {
    const { query } = request.query;  // Get the search query
    
    const page = parseInt(request.query.page) || 1;  // Get current page or default to 1

    // If the query is provided
    if (query) {
        // Find posts based on the query with regex
        Post.find({ $or: [{ posttitle: { $regex: query, $options: 'i' } }, { postbody: { $regex: query, $options: 'i' } }] })
            .skip((page - 1) * postsPerPage)  // Skip the number of posts based on the page
            .limit(postsPerPage)  // Limit to postsPerPage per page
            .then((posts) => {
                // Get the total count of posts for pagination
                Post.countDocuments({ $or: [{ posttitle: { $regex: query, $options: 'i' } }, { postbody: { $regex: query, $options: 'i' } }] })
                    .then(count => {
                        const totalPages = Math.ceil(count / postsPerPage);  // Calculate the total pages
                        response.render('search-posts', {
                            posts,
                            searchQuery: query,
                            currentPage: page,
                            totalPages: totalPages
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        response.status(500).send('Error counting posts');
                    });
            })
            .catch((error) => {
                console.error(error);
                response.status(500).send('Error fetching posts');
            });
    } else {
        // If no query, send back empty results
        response.render('search-posts', { posts: [], searchQuery: '', currentPage: 1, totalPages: 0 });
    }
};


//Error Not found
const get404 = (request, response, next) => {
    response.status(404).render(myPath('404'));
};

module.exports = { 

    getPosts, 
    getPost, 
    getAddPost, 
    addPost, 
    deletePost, 
    getEditPost, 
    updatePost,
    get404,
    getSearchPosts

};
