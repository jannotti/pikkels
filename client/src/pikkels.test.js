import React from 'react';
import ReactDOM from 'react-dom';
import LeaguePage from './pikkels';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LeaguePage id="1" />, div);
});
