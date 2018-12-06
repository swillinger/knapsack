import React from 'react';
import PropTypes from 'prop-types';
import PageWithSidebar from '../layouts/page-with-sidebar';

function BadRoute({ title, subtitle, message }) {
  return (
    <PageWithSidebar>
      <h4 className="eyebrow">{subtitle}</h4>
      <h2>{title}</h2>
      <p>{message}</p>
    </PageWithSidebar>
  );
}

BadRoute.defaultProps = {
  title: '404 - Error',
  subtitle: 'Oh no,',
  message: 'Seems there was an error.',
};

BadRoute.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  message: PropTypes.string,
};

export default BadRoute;
