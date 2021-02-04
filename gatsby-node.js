const path = require('path')
exports.createPages =  async({graphql, actions}) => {
  const { createPage } = actions

  const posts = await graphql(`
  query  {
    posts: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            description
            path
            title
          }
        }
      }
    }
  }
  `)
  const template = path.resolve('src/templates/post.js')
  posts.data.posts.edges.forEach(post => {
    createPage({
      path: post.node.frontmatter.path,
      component: template,
      context: {
        id: post.node.frontmatter.path
      }
    })
  })

  const templateBlog = path.resolve('src/templates/blog.js')
  const pageSize = 2
  const totalPosts = posts.data.posts.edges.length
  const numPages = Math.ceil(totalPosts / pageSize)
  Array
  .from({ length: numPages })
  .forEach((__, i) => {
    createPage({
      path: '/blog' +  (i === 0 ?  '' :  '/'+i),
      component: templateBlog,
      context: {
        limit: pageSize,
        skip: i * pageSize,
        numPages,
        currentPage: i
      }
    })
  })
}
 
