# Google Form - Xeversea Loan Request (Copy-Ready)

## Form Title
```
Xeversea Loan Request
```

## Form Description
```
Fast, secure, and non-binding loan request form. We will review your request within 24 hours and contact you with the decision.

All fields marked with * are required.
```

---

## FORM QUESTIONS (Copy-paste these)

### Question 1: Email Address *
**Type:** Short answer (Text)
**Question:** Email Address *
**Description:** We'll use this to contact you about your loan request
**Required:** Yes

---

### Question 2: Phone Number (Optional)
**Type:** Short answer (Text)
**Question:** Phone Number (Optional)
**Description:** Your WhatsApp or mobile number. This helps us reach you faster.
**Required:** No

---

### Question 3: Loan Amount (IDR) *
**Type:** Short answer (Number)
**Question:** How much would you like to borrow? (IDR) *
**Description:** Minimum: IDR 1,000 | Maximum: IDR 100,000
**Required:** Yes
**Input validation:** Number | Between 1000 and 100000

---

### Question 4: Loan Term *
**Type:** Multiple choice (Dropdown)
**Question:** How long do you need to repay? *
**Options:**
- 3 days
- 7 days
- 14 days

**Required:** Yes

---

### Question 5: Reason for Loan *
**Type:** Paragraph (Long text)
**Question:** Why do you need this loan? *
**Description:** Please explain briefly (50-200 characters)
**Required:** Yes

---

### Question 6: Agreement & Terms *
**Type:** Multiple choice (Checkbox)
**Question:** I agree to the following: *
**Options:**
- I have read and understand the loan terms (3% fee, calculated automatically)
- I understand this is not a binding contract; final approval depends on review
- I consent to my data being processed according to Xeversea's terms and privacy policy
- I confirm I am 18 years or older

**Required:** Yes (Check all)

---

## OPTIONAL: Add to Form Description (after main description)

```
LOAN TERMS & RULES:
• Borrowing limit: IDR 1,000 to IDR 100,000
• Fee: 3% of loan amount, rounded to nearest 500 IDR
• Late fee: IDR 500 per day if payment is overdue
• Payment method: Cash pickup (scheduled after approval)
• Due date: Set at approval, typically 3, 7, or 14 days
• This is a non-binding request; final approval is at our discretion

WHAT HAPPENS NEXT:
1. We review your request (usually within 24 hours)
2. We contact you via email/phone with approval or next steps
3. If approved, we schedule a cash pickup appointment
4. You receive the full loan amount in cash
5. You repay on the agreed date

By submitting this form, you consent to us processing your data as per our Terms & Privacy Policy.
```

---

## FORM SETTINGS (Recommended)

**Responses:**
- [ ] Collect email addresses: CHECK THIS
- [ ] Show progress bar: CHECK (optional)
- [ ] Shuffle question order: UNCHECK (keep in order)

**Confirmation message:**
```
Thank you for your loan request!

We'll review your application and contact you within 24 hours.
Check your email and phone for our response.

Xeversea Team
```

**Notification settings:**
- Collect responses to email
- Set as: your email address

---

## AFTER FORM IS CREATED:

1. Share the form link on your website
2. Responses automatically go to a Google Sheet
3. You can manually review and contact applicants, or
4. Set up Zapier to auto-notify you of new responses

---

## OPTIONAL: Add this to your new-loan.html page if using Google Form:

Replace the form section with an iframe or link:

```html
<div class="loan-panel">
  <div class="loan-header">
    <h1>Loan Request Form</h1>
    <div class="loan-meta">Fast review · Secure · Non-binding request</div>
  </div>
  
  <p>Click below to fill out the loan request form:</p>
  
  <a href="https://forms.gle/YOUR_FORM_ID_HERE" target="_blank" class="form-button">
    Open Loan Request Form
  </a>
  
  <p class="small-note">Opens in a new window. You can also embed it below:</p>
  
  <iframe src="https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/viewform?embedded=true" 
          width="100%" height="800" frameborder="0" marginheight="0" marginwidth="0">
    Loading...
  </iframe>
</div>
```

Add this CSS to style the button:
```css
.form-button {
  display: inline-block;
  background: linear-gradient(135deg, #0b63ff 0%, #0052cc 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  margin: 1rem 0;
  transition: all 0.25s ease;
}

.form-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(11, 99, 255, 0.4);
}
```
