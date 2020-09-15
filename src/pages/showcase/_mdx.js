import React, { useEffect } from 'react'
import useApp from '../../hooks/useApp'
import withLanguage from '../../components/withLanguage'
import AppWrapper from '../../components/app/wrapper'
import Layout from '../../components/layouts/default'

import { Link, graphql } from 'gatsby'
import Mdx from '../../components/mdx'
import MdxToc from '../../components/mdx/toc'
import { FormattedDate, FormattedMessage } from 'react-intl'

const ShowcasePostPage = (props) => {
  // State
  const app = useApp()

  // Data from page query
  const frontmatter = props.data.allMdx.edges[0].node.frontmatter

  // Effects
  useEffect(() => {
    app.setTitle(frontmatter.title)
    app.setDescription(props.data.allMdx.edges[0].node.excerpt)
    app.setImage(props.data.allMdx.edges[0].node.frontmatter.img.childImageSharp.fluid.originalImg)
    app.setCrumbs([
      {
        slug: '/showcase/',
        title: app.translate('app.showcase')
      }
    ])
  }, [])

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
  const context = [
    <h5>{frontmatter.title}</h5>,
    <MdxToc toc={props.data.allMdx.edges[0].node.tableOfContents} />
  ]
  return (
    <AppWrapper app={app} context={context}>
      <Layout active="blog" app={app} context={context}>
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
          <figcaption data-test="caption">{frontmatter.caption}</figcaption>
        </figure>
        <div style={style.body}>
          <Mdx node={props.data.allMdx.edges[0].node} />
        </div>
      </Layout>
    </AppWrapper>
  )
}

export default withLanguage(ShowcasePostPage)

// See https://www.gatsbyjs.org/docs/page-query/
export const pageQuery = graphql`
  query MdxShowcasePost($file: String) {
    allMdx(filter: { fileAbsolutePath: { eq: $file } }) {
      edges {
        node {
          excerpt
          body
          tableOfContents(maxDepth: 3)
          frontmatter {
            title
            date
            caption
            author
            patterns
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
