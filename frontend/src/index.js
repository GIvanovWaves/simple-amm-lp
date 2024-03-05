import React from 'react';
import { createRoot } from 'react-dom/client';
import MyApp from './main';

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <MyApp />
  </React.StrictMode>
)