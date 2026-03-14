/**
 * Safe error logging: never pass raw error objects to the console.
 * Raw Axios/request errors can expose response.config (headers, Authorization, request body).
 * We only log a safe message string.
 */
export function safeErrorMessage(err) {
  if (err == null) return '';
  const msg = err.response?.data?.error ?? err.response?.data?.message ?? err.message;
  return typeof msg === 'string' ? msg : 'Error';
}

export function logError(label, err) {
  console.error(label, safeErrorMessage(err) || 'Unknown error');
}
