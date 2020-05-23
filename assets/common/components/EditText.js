import React from 'react';
import BaseEdiText from 'react-editext';

const EditText = ({ value, onSave }) => (
  <BaseEdiText
    type="text"
    showButtonsOnHover
    editOnViewClick
    editButtonContent="Edit"
    editButtonClassName="btn btn-sm btn-primary"
    saveButtonContent="Apply"
    saveButtonClassName="btn btn-sm btn-primary"
    cancelButtonContent="Cancel"
    cancelButtonClassName="btn btn-sm btn-secondary ml-1"
    value={value}
    onSave={onSave}
  />
);

export default EditText;
