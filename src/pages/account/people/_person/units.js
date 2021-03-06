import React, { useState } from 'react'
import useApp from '../../../../hooks/useApp'
import AppWrapper from '../../../../components/app/wrapper'

import { FormattedMessage } from 'react-intl'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const Page = (props) => {
  const app = useApp()

  // FIXME: Show something better than nothing in SSR
  if (!app.people || typeof app.people[props.person] === 'undefined') return null

  // Figure out inital state in a SSR-safe way
  const initial =
    props.params.person && app.people[props.params.person] && app.people[props.params.person].units
      ? app.people[props.params.person].units
      : false

  const [units, setUnits] = useState(initial)

  return (
    <AppWrapper
      app={app}
      title={app.translate('account.units')}
      {...app.treeProps(`/account/people/${props.params.person}/units/`)}
    >
      <RadioGroup name="units" onChange={(evt) => setUnits(evt.target.value)} value={units}>
        <FormControlLabel
          control={<Radio color="primary" />}
          value="metric"
          checked={units === 'metric' ? true : false}
          label={app.translate('app.metricUnits')}
        />
        <FormControlLabel
          control={<Radio color="primary" />}
          checked={units === 'imperial' ? true : false}
          value="imperial"
          label={app.translate('app.imperialUnits')}
        />
      </RadioGroup>
      <p style={{ textAlign: 'right' }}>
        <Button
          size="large"
          style={{ marginLeft: '1rem' }}
          variant="outlined"
          color="primary"
          href={`/account/people/${props.person}/`}
        >
          <FormattedMessage id="app.cancel" />
        </Button>
        <Button
          size="large"
          style={{ marginLeft: '1rem' }}
          variant="contained"
          color="primary"
          onClick={() =>
            app.updatePerson(
              props.params.person,
              [units, 'units'],
              `/account/people/${props.params.person}/`
            )
          }
        >
          <FormattedMessage id="app.save" />
        </Button>
      </p>
    </AppWrapper>
  )
}

export default Page
