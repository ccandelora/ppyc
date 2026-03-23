import DOMPurify from 'dompurify';

// Utility function to strip HTML tags from text
export const stripHtmlTags = (html) => {
  if (!html) return '';

  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Extract text content and clean up extra whitespace
  return tempDiv.textContent || tempDiv.innerText || '';
};

// Utility function to truncate text safely
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';

  const cleanText = stripHtmlTags(text);

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Find the last space before the limit to avoid cutting words
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
};

// Sanitize HTML content using DOMPurify
export const sanitizeHtml = (html) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'div', 'span',
      'figure', 'figcaption', 'sup', 'sub',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
      'class', 'style', 'id', 'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
  });
};
