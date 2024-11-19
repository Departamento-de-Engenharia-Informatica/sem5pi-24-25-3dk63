import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { Provider } from 'inversify-react';
import { container } from './inversify/index';

createRoot(document.getElementById('root')!).render(
  <Provider container={container}>
    <App />
  </Provider>
);
