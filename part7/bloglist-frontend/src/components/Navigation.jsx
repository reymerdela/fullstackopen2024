import { Link } from 'react-router-dom'
import { AppBar, Box, Container, Tabs, Toolbar, Typography, Tab, Button, Stack } from '@mui/material'
import { cyan, indigo, orange } from '@mui/material/colors'

const Navigation = ({ user, handleLogout }) => {


  return (
    <AppBar component="nav" position='static' sx={{ background: cyan[900] }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
          <Stack direction="row" spacing={3}>
            <Button component={Link} to="/" variant='text' sx={{ color: 'white' }} size='large'>Blogs</Button>
            <Button component={Link} to='/users' sx={{ color: 'white' }} size="large">Users</Button>
          </Stack>
          <Stack direction="row" spacing={3}>
            <Typography variant='h6'>{user} logged in</Typography>
            <Button sx={{ background: orange[900] }} variant="contained" onClick={handleLogout}  >Logout</Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )


}

export default Navigation