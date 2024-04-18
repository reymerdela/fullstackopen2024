import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
const Users = () => {
  const [users,setUsers] = useState([])

  useEffect(() => {
    usersService.getAll()
      .then(res => {
        console.log(res)
        setUsers(res)
      })
  },[])


  return (
    <Box my={2}>
      <Typography variant="h4">Users</Typography>
      <Table sx={{ maxWidth: 600 }} >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell><Link to={`/users/${user.id}`} >{user.username}</Link></TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
}

export default Users