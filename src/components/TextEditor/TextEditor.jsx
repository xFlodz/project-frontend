import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css';

const TextEditor = ({ value, onChange, className = '' }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic'],
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = ['bold', 'italic'];

  return (
    <div className={`text-editor-container ${className}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
        placeholder="Введите текст..."
      />
    </div>
  );
};

export default TextEditor;