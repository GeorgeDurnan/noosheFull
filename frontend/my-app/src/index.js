import ReactDOM from 'react-dom/client' 
import store from "./app/store"
import { Provider } from 'react-redux' 
import './index.css' 
import App from './App' 
import reportWebVitals from './reportWebVitals' 

// Initialize the root of the React application targeting the DOM element with id 'root'
const root = ReactDOM.createRoot(document.getElementById('root')) 

// Render the application
// Wrapped in Redux Provider to allow store access throughout the component tree
root.render(
  <Provider store = {store}>
    <App />
  </Provider>
) 

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals() 
