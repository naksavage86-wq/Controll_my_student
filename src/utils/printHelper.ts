/**
 * Universal print helper utility for school documents, report cards, exam tables, and receipts.
 * Designed specifically to work reliably inside web applets, iframes, and modern browsers without blank pages.
 */

export interface PrintOptions {
  title?: string;
  orientation?: 'portrait' | 'landscape';
  onComplete?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Collects all current document stylesheets and fonts for accurate print reproduction
 */
function collectDocumentStyles(orientation: 'portrait' | 'landscape' = 'portrait'): string {
  const headElements: string[] = [];

  // 1. Cambodian Fonts
  headElements.push(`
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Moul&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  `);

  // 2. Clone all existing stylesheets and style tags
  const styleNodes = document.querySelectorAll('link[rel="stylesheet"], style');
  styleNodes.forEach((node) => {
    headElements.push(node.outerHTML);
  });

  // 3. Print specific overrides
  headElements.push(`
    <style>
      @page {
        size: A4 ${orientation};
        margin: 10mm 12mm;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-sizing: border-box;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #0f172a !important;
        font-family: 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 11pt;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
      }
      .font-moul {
        font-family: 'Moul', cursive, serif !important;
      }
      .no-print, .no-print * {
        display: none !important;
      }
      .print-shadow-none {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
      }
      table {
        border-collapse: collapse !important;
        width: 100% !important;
      }
      th, td {
        border-color: #cbd5e1 !important;
      }
      .page-break-inside-avoid {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      /* Prevent clipping in iframe print */
      .print-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 8px !important;
        background: #ffffff !important;
      }
    </style>
  `);

  return headElements.join('\n');
}

/**
 * Prints a specific DOM element using a hidden iframe.
 * This guarantees that only the desired document prints, avoiding blank pages and modal clipping.
 */
export function printElement(
  target: HTMLElement | string,
  options: PrintOptions = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const element = typeof target === 'string' ? document.getElementById(target) : target;
      if (!element) {
        console.warn(`[printElement] Target element not found:`, target);
        // Fallback to standard window print
        window.focus();
        window.print();
        resolve(false);
        return;
      }

      const orientation = options.orientation || 'portrait';
      const title = options.title || document.title || 'ឯកសារបោះពុម្ព';

      // Clone target node to clean up any unwanted active modals or interactive wrappers
      const elementClone = element.cloneNode(true) as HTMLElement;
      // Remove no-print elements from clone
      elementClone.querySelectorAll('.no-print').forEach((el) => el.remove());

      // Create a hidden isolated iframe
      const iframe = document.createElement('iframe');
      iframe.setAttribute('style', 'position:fixed;right:-9999px;bottom:-9999px;width:0;height:0;border:none;opacity:0;pointer-events:none;');
      iframe.setAttribute('title', 'Print Preview Frame');
      iframe.setAttribute('sandbox', 'allow-modals allow-same-origin allow-scripts');
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Could not access iframe document for printing');
      }

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="km">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            ${collectDocumentStyles(orientation)}
          </head>
          <body>
            <div class="print-container">
              ${elementClone.outerHTML}
            </div>
          </body>
        </html>
      `);
      iframeDoc.close();

      const executePrint = () => {
        try {
          if (!iframe.contentWindow) {
            throw new Error('Iframe contentWindow missing');
          }
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          options.onComplete?.();
          resolve(true);
        } catch (printErr) {
          console.warn('[printElement] iframe print invocation failed, falling back:', printErr);
          fallbackWindowPrint(element);
          resolve(false);
        } finally {
          // Clean up iframe after print dialog completes
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }
      };

      // Give fonts and external CSS a moment to render cleanly inside the iframe
      setTimeout(executePrint, 350);
    } catch (err) {
      console.error('[printElement] Fatal error during print:', err);
      // Fallback
      if (typeof target !== 'string') {
        fallbackWindowPrint(target);
      } else {
        const el = document.getElementById(target);
        if (el) fallbackWindowPrint(el);
        else {
          window.focus();
          window.print();
        }
      }
      options.onError?.(err as Error);
      resolve(false);
    }
  });
}

/**
 * Fallback print strategy using body CSS class isolation
 */
function fallbackWindowPrint(element: HTMLElement) {
  try {
    document.body.classList.add('is-printing-target');
    element.classList.add('printable-active-area');

    window.focus();
    window.print();
  } finally {
    setTimeout(() => {
      document.body.classList.remove('is-printing-target');
      element.classList.remove('printable-active-area');
    }, 1000);
  }
}

/**
 * Opens document in a clean new browser tab/window for printing
 * Useful when iframe printing is strictly restricted by certain browser privacy extensions.
 */
export function openPrintWindow(
  target: HTMLElement | string,
  title: string = 'បោះពុម្ពឯកសារ',
  orientation: 'portrait' | 'landscape' = 'portrait'
): boolean {
  try {
    const element = typeof target === 'string' ? document.getElementById(target) : target;
    if (!element) return false;

    const elementClone = element.cloneNode(true) as HTMLElement;
    elementClone.querySelectorAll('.no-print').forEach((el) => el.remove());

    const printWin = window.open('', '_blank');
    if (!printWin) {
      return false; // Popup blocked
    }

    printWin.document.open();
    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="km">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          ${collectDocumentStyles(orientation)}
        </head>
        <body style="background:white; padding: 20px;">
          <div class="no-print" style="margin-bottom: 20px; display: flex; gap: 10px; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            <div style="font-weight: bold; color: #1e293b; font-size: 14px;">ទិដ្ឋភាពបោះពុម្ពឯកសារផ្លូវការ</div>
            <div style="display: flex; gap: 8px;">
              <button onclick="window.print()" style="background:#2563eb; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:600; font-size:13px;">
                🖨️ ចុចបោះពុម្ព (Print Now)
              </button>
              <button onclick="window.close()" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 14px; border-radius:8px; cursor:pointer; font-size:13px;">
                បិទ
              </button>
            </div>
          </div>
          <div class="print-container">
            ${elementClone.outerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
    return true;
  } catch (e) {
    console.error('Error opening print window:', e);
    return false;
  }
}

/**
 * Exports document as an offline HTML file that the user can open & print anytime
 */
export function exportAsHtmlFile(
  target: HTMLElement | string,
  filename: string = 'document.html',
  orientation: 'portrait' | 'landscape' = 'portrait'
): void {
  try {
    const element = typeof target === 'string' ? document.getElementById(target) : target;
    if (!element) return;

    const elementClone = element.cloneNode(true) as HTMLElement;
    elementClone.querySelectorAll('.no-print').forEach((el) => el.remove());

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="km">
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
          ${collectDocumentStyles(orientation)}
        </head>
        <body style="background:white; padding: 24px;">
          <div class="print-container">
            ${elementClone.outerHTML}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export HTML file:', err);
  }
}
