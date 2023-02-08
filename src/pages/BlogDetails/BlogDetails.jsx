import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

import styles from './BlogDetails.module.css'

// components
import Loading from "../Loading/Loading"
import AuthorInfo from "../../components/AuthorInfo/AuthorInfo"
import NewComment from "../../components/NewComment/NewComment"
import BlogComments from "../../components/Comments/BlogComment"

// Services
import * as blogService from '../../services/blogService'
import MealCard from "../../components/MealCard/MealCard"

const BlogDetails = (props) => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      const data = await blogService.show(id)
      setBlog(data)
    }
    fetchBlog()
  }, [id])

  const handleAddComment = async (commentData) => {
    const newComment = await blogService.createComment(id, commentData)
    setBlog({ ...blog, comments: [...blog.comments, newComment] })
  }

  const handleDeleteComment = async (blogId, commentId) => {
  await blogService.deleteComment(blogId, commentId)
  setBlog({...blog, comments: blog.comments.filter((c) => c._id !==commentId) }) 
  }

if (!blog) return <Loading />

return (
  <main className={styles.container}>
    <article>
      <header>
        <h3>{blog.category.toUpperCase()}</h3>
        <h1>{blog.title}</h1>
        <span>
            <AuthorInfo content={blog} />
            {blog.author._id === props.user.profile &&
              <>
                <Link to={`/blogs/${id}/edit`} state={blog}>Edit</Link>
                <button onClick={() => props.handleDeleteBlog(id)}>Delete</button>
              </>
            }
          </span>
      </header>
      <p>{blog.text}</p>
    </article>
    <section>
      <h1>Comments</h1>
      <NewComment handleAddComment={handleAddComment} />
      <BlogComments 
      comments={blog.comments} 
      user={props.user} 
      blogId={id} 
      handleDeleteComment={handleDeleteComment}
      />
    </section>
  </main>
)
}

export default BlogDetails