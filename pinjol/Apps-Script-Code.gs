
 * ============================================================================
 * XEVERSEA LOAN REQUEST HANDLER - Google Apps Script
 * ============================================================================
 * 
 * This is a complete, production-ready Apps Script that handles loan form
 * submissions from the Xeversea loan request page.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet at https://sheets.google.com
 * 2. Copy the Sheet ID from the URL (between /d/ and /edit)
 *    Example: https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
 * 
 * 3. Rename the first sheet to "Loans" (right-click the sheet tab)
 * 
 * 4. In the "Loans" sheet, add these column headers in row 1:
 *    A: Timestamp
 *    B: Email
 *    C: Phone
 *    D: Amount (IDR)
 *    E: Term (days)
 *    F: Reason
 *    G: Fee (IDR)
 *    H: Total (IDR)
 *    I: Repay Method
 *    J: Status
 * 
 * 5. Go to https://script.google.com
 * 6. Create a new project
 * 7. Replace all code with THIS ENTIRE FILE
 * 8. Update the SHEET_ID variable below with your Sheet ID
 * 9. Save (Ctrl+S)
 * 10. Click "Deploy" button → "New deployment"
 * 11. Select Type: "Web app"
 * 12. Execute as: "Me"
 * 13. Who has access: "Anyone" (or "Anyone, even anonymous" for testing)
 * 14. Click "Deploy"
 * 15. Copy the deployment URL that appears
 * 16. Paste that URL into new-loan.js (line 3, replace empty SHEET_URL)
 * 
 * ============================================================================
 */

// ========== CONFIGURATION - UPDATE THIS WITH YOUR SHEET ID ==========
const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Loans';
const MAX_REQUESTS_PER_HOUR = 20;
const SPAM_KEYWORDS = ['viagra', 'casino', 'lottery', 'prize', 'click', 'download', 'free money', 'win'];

// ========== MAIN REQUEST HANDLER ==========
function doPost(e) {
  try {
    // Parse incoming request
    const payload = JSON.parse(e.postData.contents);
    
    // Step 1: Honeypot check
    if (payload.hp && payload.hp.trim() !== '') {
      return sendJSON({ success: false, message: 'Bot detected', code: 'HONEYPOT_FAIL' });
    }
    
    // Step 2: Validate email
    if (!payload.email || !isValidEmail(payload.email)) {
      return sendJSON({ success: false, message: 'Invalid email address', code: 'INVALID_EMAIL' });
    }
    
    // Step 3: Validate amount
    const amount = Number(payload.amount);
    if (isNaN(amount) || amount < 1000 || amount > 100000) {
      return sendJSON({ success: false, message: 'Loan amount must be between 1,000 and 100,000 IDR', code: 'INVALID_AMOUNT' });
    }
    
    // Step 4: Validate term
    const validTerms = ['3', '7', '14'];
    if (!validTerms.includes(String(payload.term))) {
      return sendJSON({ success: false, message: 'Invalid loan term', code: 'INVALID_TERM' });
    }
    
    // Step 5: Validate reason (length and content)
    if (!payload.reason || payload.reason.trim().length < 5 || payload.reason.trim().length > 200) {
      return sendJSON({ success: false, message: 'Reason must be between 5-200 characters', code: 'INVALID_REASON' });
    }
    
    // Step 6: Spam keyword check
    if (containsSpamKeywords(payload.reason)) {
      return sendJSON({ success: false, message: 'Your request contains prohibited content', code: 'SPAM_DETECTED' });
    }
    
    // Step 7: Rate limiting
    const clientIp = e.parameter.clientIp || getClientIp(e) || 'unknown';
    if (isRateLimited(clientIp)) {
      return sendJSON({ success: false, message: 'Too many requests from this address. Try again in 1 hour.', code: 'RATE_LIMIT' });
    }
    
    // Step 8: Calculate fee
    const fee = Math.round((amount * 0.03) / 500) * 500;
    const total = amount + fee;
    
    // Verify fee calculation matches client-side
    const clientFee = Number(String(payload.fee).replace(/,/g, '')) || 0;
    if (Math.abs(fee - clientFee) > 500) {
      return sendJSON({ success: false, message: 'Fee calculation mismatch', code: 'FEE_MISMATCH' });
    }
    
    // Step 9: Get the sheet
    let sheet;
    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        return sendJSON({ success: false, message: 'Loans sheet not found. Check configuration.', code: 'SHEET_ERROR' });
      }
    } catch (err) {
      return sendJSON({ success: false, message: 'Cannot access spreadsheet. Check SHEET_ID.', code: 'ACCESS_ERROR' });
    }
    
    // Step 10: Append data to sheet
    const timestamp = new Date().toISOString();
    sheet.appendRow([
      timestamp,
      payload.email,
      payload.phone || '',
      amount,
      payload.term,
      payload.reason.trim(),
      fee,
      total,
      payload.repayMethod || 'cash',
      'Pending'
    ]);
    
    // Step 11: Log successful submission
    logEvent({
      type: 'submission_success',
      email: payload.email,
      amount: amount,
      ip: clientIp,
      timestamp: timestamp
    });
    
    // Step 12: Return success
    return sendJSON({
      success: true,
      message: 'Loan request received successfully! We will review your request and contact you within 24 hours.',
      code: 'SUCCESS',
      requestId: timestamp
    });
    
  } catch (error) {
    // Catch any unexpected errors
    logEvent({
      type: 'error',
      error: error.toString(),
      stack: error.stack
    });
    
    return sendJSON({
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      code: 'SYSTEM_ERROR'
    });
  }
}

// ========== VALIDATION FUNCTIONS ==========

/**
 * Validate email format (RFC 5322 simplified)
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.length <= 120 && email.length >= 5;
}

/**
 * Check for spam keywords
 */
function containsSpamKeywords(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SPAM_KEYWORDS.some(keyword => lower.includes(keyword));
}

/**
 * Get client IP from request headers
 */
function getClientIp(e) {
  if (e.parameter && e.parameter.clientIp) return e.parameter.clientIp;
  
  const headers = e.contextPath ? null : e.headers;
  if (headers) {
    return headers['x-forwarded-for']?.split(',')[0]?.trim() || 
           headers['x-real-ip'] || 
           headers['remote-addr'] || 
           'unknown';
  }
  return 'unknown';
}

// ========== RATE LIMITING ==========

/**
 * Check if IP has exceeded request limit
 */
function isRateLimited(clientIp) {
  const properties = PropertiesService.getScriptProperties();
  const key = 'rate_' + clientIp;
  const now = Date.now();
  const oneHourMs = 3600000;
  
  const stored = properties.getProperty(key);
  
  if (!stored) {
    properties.setProperty(key, JSON.stringify({
      count: 1,
      firstRequest: now
    }));
    return false;
  }
  
  try {
    const data = JSON.parse(stored);
    const timeSinceFirstRequest = now - data.firstRequest;
    
    // Reset if outside 1-hour window
    if (timeSinceFirstRequest > oneHourMs) {
      properties.setProperty(key, JSON.stringify({
        count: 1,
        firstRequest: now
      }));
      return false;
    }
    
    // Check if limit exceeded
    if (data.count >= MAX_REQUESTS_PER_HOUR) {
      return true;
    }
    
    // Increment counter
    data.count++;
    properties.setProperty(key, JSON.stringify(data));
    return false;
  } catch (err) {
    return false; // Fail open on parsing error
  }
}

// ========== LOGGING ==========

/**
 * Log events for debugging and analytics
 */
function logEvent(event) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Try to find or create a _Log sheet
    let logSheet = ss.getSheetByName('_Log');
    if (!logSheet) {
      logSheet = ss.insertSheet('_Log');
      logSheet.appendRow(['Timestamp', 'Type', 'Details']);
    }
    
    logSheet.appendRow([
      new Date().toISOString(),
      event.type || 'unknown',
      JSON.stringify(event)
    ]);
  } catch (err) {
    // Silently fail if logging doesn't work (don't block main process)
  }
}

// ========== RESPONSE HELPERS ==========

/**
 * Send JSON response with proper CORS headers
 */
function sendJSON(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'POST')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ========== TESTING & SETUP ==========

/**
 * Test function - run this from the Apps Script editor to verify setup
 * Click "Run" and check the Execution Log
 */
function testSetup() {
  Logger.log('Testing Xeversea Loan System Setup...');
  
  if (SHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    Logger.log('❌ ERROR: SHEET_ID not configured. Update the SHEET_ID variable.');
    return;
  }
  
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('✓ Spreadsheet found');
    
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log('❌ ERROR: Sheet "' + SHEET_NAME + '" not found. Create it and try again.');
      return;
    }
    Logger.log('✓ Loans sheet found');
    
    const headers = sheet.getRange(1, 1, 1, 10).getValues()[0];
    Logger.log('✓ Headers: ' + headers.join(' | '));
    
    Logger.log('\n✅ Setup looks good! Your deployment URL should work.');
    
  } catch (err) {
    Logger.log('❌ ERROR: ' + err.toString());
  }
}

/**
 * Send test submission
 */
function sendTestSubmission() {
  Logger.log('Sending test submission...');
  
  const testPayload = {
    email: 'test@example.com',
    phone: '+62812345678',
    amount: 25000,
    term: '7',
    reason: 'Testing the loan system',
    fee: 1000,
    total: 26000,
    repayMethod: 'cash',
    hp: ''
  };
  
  const mockRequest = {
    postData: {
      contents: JSON.stringify(testPayload)
    },
    parameter: {
      clientIp: '127.0.0.1'
    },
    headers: {},
    contextPath: ''
  };
  
  const response = doPost(mockRequest);
  Logger.log('Response: ' + response.getContent());
}
