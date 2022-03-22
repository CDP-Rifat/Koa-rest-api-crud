const { posts } = require('../Model/posts.model')
const fs = require('fs');
const { postSchema } = require('../Model/Schemas/postsdb.schemas')
const mongoose = require('mongoose')
const postModel = new mongoose.model("Post", postSchema); //ODM

const getAPIHome = (ctx) => {
    ctx.body = {
        status: 200,
        message: "Hello from API home!"
    }
}

const getAllPosts = (ctx) => {
    const max = parseInt(ctx.request.query.max) //Max (n) numbers of posts
    if (max) {
        ctx.body = {
            status: 200,
            posts: posts.slice(0, max)
        }
    } else {
        ctx.body = {
            status: 200,
            posts: posts
        }
    }
}



const getAllPostsFromDb = async (ctx) => {
    console.log("getAllPostsFromDb")
    try {
        const max = parseInt(ctx.request.query.max) //Max (n) numbers of posts
        await postModel.find({})
            .then((posts) => {
                ctx.body = {
                    status: 200,
                    posts: posts
                }
            })
    } catch (error) {
        console.log(error)
        ctx.body = {
            status: 404,
            message: "Failed"
        }
    }
}

const getPostById = (ctx) => {
    const id = parseInt(ctx.request.params.id)
    var post = posts.filter(post => post.id === id)
    if (post) {
        ctx.body = {
            status: 200,
            posts: post,
            message: 'Success'
        }
    }
    else {
        ctx.body = {
            status: 404,
            posts: [],
            message: 'Not found'
        }
    }
}


const addPost = (ctx) => {
    var post = ctx.request.body
    post.id = posts[posts.length - 1].id + 1
    posts.push(post)
    ctx.body = {
        message: "Success",
        status: 201,
        post
    }
}


const addPostToDb = async (ctx) => {
    console.log("addPostToDb")
    try {
        const post = await postModel.create(ctx.request.body)
        ctx.body = {
            message: "Success",
            status: 201,
            post
        }
    } catch (error) {
        ctx.body = {
            message: "Failed",
            status: 408,
        }
        console.log(error)
    }
}


const deleteById = (ctx) => {
    const id = parseInt(ctx.request.params.id)
    var index = posts.findIndex(post => { return post.id == id })

    if (index != -1) {
        posts.splice(index, 1) //deleteing from array
        ctx.body = {
            message: "Success",
            status: 201
        }
    }
    else {
        ctx.body = {
            status: 404,
            message: 'Failed to delete'
        }
    }
}


const updateById = (ctx) => {
    const id = parseInt(ctx.request.params.id)
    var index = posts.findIndex(post => { return post.id == id })
    if (index != -1) {
        var body = ctx.request.body
        posts[index].body = body.body ? body.body : posts[index].body;
        posts[index].title = body.title ? body.title : posts[index].title;

        ctx.body = {
            message: "Success",
            status: 204,
            post: posts[index]
        }
    }
    else {
        ctx.body = {
            status: 404,
            message: 'Failed to update'
        }
    }
}


const getVideoStream = (ctx) => {
    const fileStream = fs.createReadStream("video_file.mp4")
    ctx.body = fileStream
}

module.exports.getAPIHome = getAPIHome;
module.exports.getAllPosts = getAllPosts;
module.exports.getPostById = getPostById;
module.exports.addPost = addPost;
module.exports.deleteById = deleteById;
module.exports.updateById = updateById;
module.exports.getVideoStream = getVideoStream;

module.exports.addPostToDb = addPostToDb;
module.exports.getAllPostsFromDb = getAllPostsFromDb;