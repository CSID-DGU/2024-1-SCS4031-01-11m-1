import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {ThemeProvider} from "styled-components";
import { mainTheme } from '../src/style/theme.js';
import { RecoilRoot } from 'recoil';
import { GlobalStyle } from './style/globalStyle.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={mainTheme}>
        <GlobalStyle />
          <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
)