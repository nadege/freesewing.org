import React from 'react'
import useDesign from '../../hooks/useDesign'

import Draft from '@freesewing/components/Draft'
import i18nPlugin from '@freesewing/plugin-i18n'
import { plugin as strings } from '@freesewing/i18n'
import DraftError from '../draft/error'

const DraftPreview = ({ app, data }) => {
  // Hooks
  const Pattern = useDesign(data.design)

  // Draft the pattern
  let patternProps
  try {
    patternProps = new Pattern(data.settings).use(i18nPlugin, { strings }).draft().getRenderProps()
    return (
      <figure key="pattern" style={{ textAlign: 'center' }} data-test="draft">
        <Draft {...patternProps} />
      </figure>
    )
  } catch (err) {
    return <DraftError error={err} />
  }
}

export default DraftPreview
