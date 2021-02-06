const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions  })  => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark'){
  const contentName =  getNode(node.parent).sourceInstanceName
  createNodeField({
    name: 'collection',
    node,
    value: contentName
  })
  createNodeField({
    name: 'slug',
    node,
    value: createFilePath({ node, getNode})
  })
  }
}

exports.createPages =  async ({ graphql,  actions }) => {
  const { createPage } = actions
  
  const posts = await graphql(`
  query {
    posts: allMarkdownRemark (
      filter: {fields: { collection: {eq: "pages"} } }
    ) {
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
    authors: allMarkdownRemark(
      filter: { fields: { collection: { eq: "authors" } } }
      ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
        }
      }
    }
  }
  ` )

  
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


  const templateAuthor = path.resolve('src/templates/author.js')
  posts.data.authors.edges.forEach(author => {
    console.log('author', author.node.fields.slug)
    createPage({
      path: author.node.fields.slug,
      component: templateAuthor,
      context: {
        id: author.node.fields.slug
      }
    })
  })

  const templateBlog = path.resolve('src/templates/blog.js')
  const pageSize = 3
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
 
