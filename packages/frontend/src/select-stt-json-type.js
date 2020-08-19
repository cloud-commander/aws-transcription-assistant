import React from 'react';
import PropTypes from 'prop-types';

const SttTypeSelect = props => {
  return <select className={ props.className } name={ props.name } value={ props.value } onChange={ props.handleChange }>
    <option value="draftjs">Draft Js</option>
    <option value="amazontranscribe">Amazon Transcribe</option>
    <option value="google-stt">Google STT</option>
  </select>;
};

SttTypeSelect.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func
};

export default SttTypeSelect;
