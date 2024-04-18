import { createContext, useState } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
  const [user,setUser] = useState(null)

  return (
    <UserContext.Provider value={[user,setUser]}>
      {children}
    </UserContext.Provider>
  )
}
UserContextProvider.propTypes = {
  children: PropTypes.element
}


export default UserContext