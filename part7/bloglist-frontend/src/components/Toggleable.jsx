import { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material'
const Toggleable = forwardRef(({ children, label }, ref) => {
  const [visible, setVisible] = useState(false)

  const style = { display: visible ? '' : 'none' }
  const buttonStyle = { display: visible ? 'none' : '' }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility: () => setVisible(!visible),
    }
  })

  return (
    <>
      <Button sx={{ display: buttonStyle }} onClick={() => setVisible(!visible)}>
        {label}
      </Button>
      <div style={style}>
        {children}
        <button onClick={() => setVisible(!visible)}>cancel</button>
      </div>
    </>
  )
})

Toggleable.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element) || PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
}

Toggleable.displayName = 'Toggleable'

export default Toggleable
