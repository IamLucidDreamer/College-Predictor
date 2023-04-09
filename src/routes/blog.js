const express = require('express')
const {
	createBlog,
	updateBlog,
	deleteBlog,
	getBlog,
	getAllBlogs
} = require('../controllers/blog')
const { isSignedIn, isValidToken } = require('../controllers/middleware')
const router = express.Router()

router.post('/blog/create', isSignedIn, isValidToken, createBlog)
router.put('/blog/update/:id', isSignedIn, isValidToken, updateBlog)
router.delete('/blog/delete/:id', deleteBlog)
router.get('/blog/get/:id', getBlog)
router.get('/blog/get-all', getAllBlogs)

module.exports = router
