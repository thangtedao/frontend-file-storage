export function getFileNameFromContentDisposition(contentDisposition) {
  if (!contentDisposition) return null;

  // 1) filename*=UTF-8''test.pdf  (ưu tiên nhất)
  let match = contentDisposition.match(/filename\*\=([^']*)''(.+)/);
  if (match && match.length === 3) {
    return decodeURIComponent(match[2]);
  }

  // 2) filename="test.pdf"
  match = contentDisposition.match(/filename="([^"]+)"/);
  if (match && match.length === 2) {
    return match[1];
  }

  // 3) filename=test.pdf (không có dấu ")
  match = contentDisposition.match(/filename=([^;]+)/);
  if (match && match.length === 2) {
    return match[1].trim();
  }

  return null;
}
