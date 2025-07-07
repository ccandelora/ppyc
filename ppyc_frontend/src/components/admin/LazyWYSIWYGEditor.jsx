import React, { useState, Suspense, lazy } from 'react';

// Lazy load the heavy TinyMCE editor
const WYSIWYGEditor = lazy(() => import('./WYSIWYGEditor'));

// Lightweight textarea fallback
const SimpleTextEditor = ({ value, onChange, placeholder, disabled }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      rows="8"
    />
  );
};

const LazyWYSIWYGEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start writing...', 
  height = 400,
  disabled = false,
  enableRichEditor = false
}) => {
  const [useRichEditor, setUseRichEditor] = useState(enableRichEditor);

  const handleToggleEditor = () => {
    setUseRichEditor(!useRichEditor);
  };

  return (
    <div className="space-y-3">
      {/* Editor Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleEditor}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              useRichEditor
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {useRichEditor ? (
              <>
                <i className="fas fa-eye mr-1"></i>
                Rich Editor
              </>
            ) : (
              <>
                <i className="fas fa-edit mr-1"></i>
                Simple Editor
              </>
            )}
          </button>
          <span className="text-xs text-gray-500">
            {useRichEditor ? 'Full formatting tools' : 'Basic text editing'}
          </span>
        </div>
        
        {useRichEditor && (
          <button
            type="button"
            onClick={() => setUseRichEditor(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Switch to simple editor"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Editor Content */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {useRichEditor ? (
          <Suspense 
            fallback={
              <div className="flex items-center justify-center p-8 bg-gray-50">
                <div className="text-center">
                  <i className="fas fa-spinner fa-spin text-blue-500 text-xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Loading rich editor...</p>
                </div>
              </div>
            }
          >
            <WYSIWYGEditor
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              height={height}
              disabled={disabled}
            />
          </Suspense>
        ) : (
          <SimpleTextEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      </div>

      {/* Editor Info */}
      {useRichEditor && (
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          <i className="fas fa-info-circle mr-1"></i>
          Rich editor loaded. You can format text, add images, and use advanced features.
        </div>
      )}
    </div>
  );
};

export default LazyWYSIWYGEditor; 