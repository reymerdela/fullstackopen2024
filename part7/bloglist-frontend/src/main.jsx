import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './store'
import { BrowserRouter as Router } from 'react-router-dom'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Provider store={store}>
      <>
        <CssBaseline />
        <App />
      </>
    </Provider>
  </Router>)
