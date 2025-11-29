/**
 * Vision Helper Utilities
 * Vision LLM 및 OCR을 위한 유틸리티 함수들
 */

/**
 * File validation constants
 */
export const FILE_VALIDATION = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB per file
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB total
  MAX_FILES: 10,
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png"],
} as const;

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate uploaded image files
 */
export function validateImageFiles(files: File[]): FileValidationResult {
  const errors: string[] = [];

  // Check file count
  if (files.length === 0) {
    errors.push("파일이 선택되지 않았습니다.");
  }

  if (files.length > FILE_VALIDATION.MAX_FILES) {
    errors.push(
      `최대 ${FILE_VALIDATION.MAX_FILES}개의 파일만 업로드할 수 있습니다. (현재: ${files.length}개)`
    );
  }

  // Check total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > FILE_VALIDATION.MAX_TOTAL_SIZE) {
    const totalMB = (totalSize / 1024 / 1024).toFixed(2);
    const maxMB = (FILE_VALIDATION.MAX_TOTAL_SIZE / 1024 / 1024).toFixed(0);
    errors.push(`전체 파일 크기가 너무 큽니다. (${totalMB}MB / ${maxMB}MB)`);
  }

  // Check individual files
  files.forEach((file, index) => {
    // File size
    if (file.size > FILE_VALIDATION.MAX_FILE_SIZE) {
      const fileMB = (file.size / 1024 / 1024).toFixed(2);
      const maxMB = (FILE_VALIDATION.MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
      errors.push(
        `${file.name}: 파일 크기가 너무 큽니다. (${fileMB}MB / ${maxMB}MB)`
      );
    }

    // File type
    const isValidType = FILE_VALIDATION.ALLOWED_TYPES.includes(file.type as any);
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const isValidExtension =
      FILE_VALIDATION.ALLOWED_EXTENSIONS.includes(fileExtension as any);

    if (!isValidType && !isValidExtension) {
      errors.push(
        `${file.name}: 지원하지 않는 파일 형식입니다. (JPG, PNG만 가능)`
      );
    }

    // Empty file
    if (file.size === 0) {
      errors.push(`${file.name}: 빈 파일입니다.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Convert File to ArrayBuffer
 */
export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert File to Base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (data:image/jpeg;base64,)
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Convert File to Data URL (with prefix)
 */
export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Validate image dimensions (optional check)
 */
export async function validateImageDimensions(
  file: File,
  minWidth = 800,
  minHeight = 600
): Promise<{
  isValid: boolean;
  width: number;
  height: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      const isValid = width >= minWidth && height >= minHeight;

      resolve({
        isValid,
        width,
        height,
        error: isValid
          ? undefined
          : `이미지 해상도가 너무 낮습니다. (${width}×${height}, 권장: ${minWidth}×${minHeight} 이상)`,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        width: 0,
        height: 0,
        error: "이미지 파일을 읽을 수 없습니다.",
      });
    };

    img.src = url;
  });
}

/**
 * Sort files by name (natural sort for page numbers)
 */
export function sortFilesByName(files: File[]): File[] {
  return [...files].sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

/**
 * Create page separator for multi-page OCR text
 */
export function createPageSeparator(pageNumber: number): string {
  return `\n\n=== 페이지 ${pageNumber} ===\n\n`;
}

/**
 * Merge multi-page OCR texts
 */
export function mergeOCRTexts(texts: string[]): string {
  return texts
    .map((text, index) => {
      if (index === 0) {
        return text;
      }
      return createPageSeparator(index + 1) + text;
    })
    .join("");
}

/**
 * Extract confidence statistics from OCR response
 */
export interface OCRConfidenceStats {
  averageConfidence: number;
  minConfidence: number;
  maxConfidence: number;
  lowConfidenceCount: number; // confidence < 0.7
  totalWords: number;
}

/**
 * Calculate OCR confidence statistics
 */
export function calculateOCRConfidence(
  words: Array<{ confidence: number }>
): OCRConfidenceStats {
  if (words.length === 0) {
    return {
      averageConfidence: 0,
      minConfidence: 0,
      maxConfidence: 0,
      lowConfidenceCount: 0,
      totalWords: 0,
    };
  }

  const confidences = words.map((w) => w.confidence);
  const sum = confidences.reduce((a, b) => a + b, 0);
  const low = confidences.filter((c) => c < 0.7).length;

  return {
    averageConfidence: sum / confidences.length,
    minConfidence: Math.min(...confidences),
    maxConfidence: Math.max(...confidences),
    lowConfidenceCount: low,
    totalWords: words.length,
  };
}

/**
 * Generate unique block ID
 */
export function generateBlockId(type: "text" | "table" | "drawing"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${type}-${timestamp}-${random}`;
}
