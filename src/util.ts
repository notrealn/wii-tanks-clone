import ReactDOM from 'react-dom';

export const renderApp = (component: JSX.Element) => {
  const render = () => {
    ReactDOM.render(component, document.querySelector('#app') as Element);
  };
  if (document.readyState !== 'loading') render();
  else document.addEventListener('DOMContentLoaded', render);
};
