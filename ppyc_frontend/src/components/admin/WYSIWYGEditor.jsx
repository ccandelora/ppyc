import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { adminAPI } from '../../services/api';

const WYSIWYGEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start writing...', 
  height = 400,
  disabled = false 
}) => {
  const editorRef = useRef(null);
  const [editorError, setEditorError] = useState(null);

  const handleImageUpload = (blobInfo) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob());
      formData.append('folder', 'editor');

      adminAPI.images.upload(formData).then(response => {
        if (response.data.success) {
          resolve(response.data.data.secure_url || response.data.data.url);
        } else {
          reject('Upload failed');
        }
      }).catch(error => {
        console.error('Image upload error:', error);
        reject(error.response?.data?.error || 'Upload failed');
      });
    });
  };

  // If there's an editor error, show a fallback textarea
  if (editorError) {
    return (
      <div className="wysiwyg-editor">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Rich text editor failed to load. Using basic textarea instead.
        </div>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{ minHeight: `${height}px` }}
        />
      </div>
    );
  }

  return (
    <div className="wysiwyg-editor">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
        onInit={(evt, editor) => {
          try {
            if (!editor) {
              throw new Error('TinyMCE editor failed to initialize');
            }
            editorRef.current = editor;
            setEditorError(null);
          } catch (error) {
            console.error('TinyMCE initialization error:', error);
            setEditorError(error);
          }
        }}
        onEditorChange={(content, editor) => {
          try {
            if (onChange && typeof onChange === 'function') {
              onChange(content);
            }
          } catch (error) {
            console.error('TinyMCE onChange error:', error);
            setEditorError(error);
          }
        }}
        onLoadError={(error) => {
          console.error('TinyMCE load error:', error);
          setEditorError(new Error('Failed to load TinyMCE editor. Please refresh the page.'));
        }}
        value={value || ''}
        disabled={disabled}
        init={{
          height,
          menubar: false,
          branding: false,
          statusbar: false,
          resize: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | link image | code | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size:14px; color: #1a202c; }',
          placeholder,
          skin: 'oxide',
          content_css: 'default',
          // Custom styles to match our yacht club theme
          body_class: 'ppyc-editor-content',
          images_upload_handler: handleImageUpload,
          images_upload_base_path: '',
          images_upload_credentials: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              
              input.onchange = function () {
                const file = this.files[0];
                if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('folder', 'editor');
                  
                  adminAPI.images.upload(formData).then(response => {
                    if (response.data.success) {
                      const imageData = response.data.data;
                      callback(imageData.secure_url || imageData.url, { 
                        alt: file.name,
                        width: imageData.width,
                        height: imageData.height
                      });
                    } else {
                      console.error('File picker upload failed: Invalid response structure');
                      // Don't call callback on failure to prevent TinyMCE validation errors
                    }
                  }).catch(error => {
                    console.error('File picker upload error:', error);
                    // Don't call callback on failure to prevent validation errors
                  });
                }
              };
              
              input.click();
            }
          },
          setup: (editor) => {
            editor.on('init', () => {
              if (disabled) {
                editor.mode.set('readonly');
              }
            });
          }
        }}
      />
    </div>
  );
};

export default WYSIWYGEditor; 