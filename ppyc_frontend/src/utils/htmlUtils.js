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

// Utility function to sanitize HTML content (basic security)
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  // Remove script tags and other potentially dangerous content
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
  
  return cleanHtml;
}; 