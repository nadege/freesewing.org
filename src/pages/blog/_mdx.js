import React from 'react'
import useApp from '../../hooks/useApp'
import AppWrapper from '../../components/app/wrapper'

import { Link, graphql } from 'gatsby'
import Mdx from '../../components/mdx'
import { FormattedDate, FormattedMessage } from 'react-intl'

const Page = (props) => {
  const app = useApp(false)

  const frontmatter = props.data.allMdx.edges[0].node.frontmatter
  const img = frontmatter.img.childImageSharp.fluid
  const style = {
    base: {
      maxWidth: '1200px'
    },
    meta: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      fontFamily: "'Roboto Condensed', sans-serif"
    },
    title: {
      marginBottom: 0
    },
    figure: {
      marginTop: 0
    },
    body: {
      maxWidth: '60ch',
      fontSize: '115%',
      margin: 'auto'
    }
  }
  const tags = frontmatter.patterns
    ? frontmatter.patterns.map((pattern) => {
        return (
          <Link to={'/showcase/designs/' + pattern} style={{ marginRight: '8px' }} key={pattern}>
            #{pattern}
          </Link>
        )
      })
    : null

  return (
    <AppWrapper
      app={app}
      title={props.pageContext.title}
      description={props.data.allMdx.edges[0].node.excerpt}
      image={props.data.allMdx.edges[0].node.frontmatter.img.childImageSharp.fluid.originalImg}
      {...app.treeProps(props.path)}
    >
      <div style={style.meta} data-test="meta">
        <FormattedDate value={frontmatter.date} year="numeric" month="long" day="2-digit" />
        <div>
          {tags}
          <FormattedMessage id="app.by" />
          &nbsp;
          <Link to={'/users/' + frontmatter.author} data-test="author">
            {frontmatter.author}
          </Link>
        </div>
      </div>
      <figure style={style.figure}>
        <a href={img.src}>
          <img
            data-test="img"
            src={img.src}
            style={{ width: '100%' }}
            srcSet={img.srcSet}
            alt={frontmatter.caption}
          />
        </a>
        <figcaption data-test="caption" dangerouslySetInnerHTML={{ __html: frontmatter.caption }} />
      </figure>
      <div style={style.body}>
        <Mdx node={props.data.allMdx.edges[0].node} />
      </div>
    </AppWrapper>
  )
}

export default Page

// See https://www.gatsbyjs.org/docs/page-query/
export const pageQuery = graphql`
  query MdxBlogPost($file: String) {
    allMdx(filter: { fileAbsolutePath: { eq: $file } }) {
      edges {
        node {
          excerpt
          body
          tableOfContents(maxDepth: 3)
          frontmatter {
            date
            year: date
            linktitle
            caption
            author
            img {
              childImageSharp {
                fluid(maxWidth: 1200) {
                  src
                  srcSet
                  sizes
                  originalImg
                  originalName
                }
              }
            }
          }
        }
      }
    }
  }
`
