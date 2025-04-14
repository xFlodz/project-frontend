import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TextEditor.css';

const TextEditor = ({ value, onChange, className = '' }) => {
  // Модули для панели инструментов (только bold и italic)
  const modules = {
    toolbar: [
      ['bold', 'italic'],
    ],
    clipboard: {
      matchVisual: false, // Отключаем автоматическое форматирование при вставке
    }
  };

  // Поддерживаемые форматы
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