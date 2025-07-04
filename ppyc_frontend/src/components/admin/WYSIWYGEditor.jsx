import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import api from '../../services/api';

const WYSIWYGEditor = ({ 
  value, 
  onChange, 
  placeholder = 'Start writing...', 
  height = 400,
  disabled = false 
}) => {
  const editorRef = useRef(null);

  const handleImageUpload = (blobInfo) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob());
      formData.append('folder', 'editor');

      api.post('/admin/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(response => {
        if (response.data.success) {
          resolve(response.data.data.url);
        } else {
          reject('Upload failed');
        }
      }).catch(error => {
        console.error('Image upload error:', error);
        reject(error.response?.data?.error || 'Upload failed');
      });
    });
  };

  return (
    <div className="wysiwyg-editor">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={onChange}
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
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size:14px }',
          placeholder,
          skin: 'oxide-dark',
          content_css: 'dark',
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
                  
                  api.post('/admin/images', formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  }).then(response => {
                    if (response.data.success) {
                      const imageData = response.data.data;
                      callback(imageData.url, { 
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