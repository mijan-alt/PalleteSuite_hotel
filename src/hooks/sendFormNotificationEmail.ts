import type { CollectionAfterChangeHook } from 'payload'

/**
 * Sends email notification when a form is submitted
 * Notifies site admin with formatted submission details
 */
export const sendFormNotificationEmail: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  // Only send email for new submissions (not updates)
  if (operation !== 'create') {
    return doc
  }

  console.log('📧 New form submission detected, preparing notification email...')

  try {
    const { form, submissionData, createdAt } = doc

    // Get the form details
    const formDoc =
      typeof form === 'object'
        ? form
        : await req.payload.findByID({
            collection: 'forms',
            id: form,
          })

    if (!formDoc) {
      console.error('❌ Form document not found')
      return doc
    }

    console.log(`📝 Processing submission for: ${formDoc.title}`)

    // Format submission data for HTML email
    const submissionHTML = submissionData
      .map(
        (field: any) => `
        <tr>
          <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
            <div style="font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px; text-transform: capitalize;">
              ${formatFieldName(field.field)}
            </div>
            <div style="color: #1f2937; font-size: 15px; line-height: 1.6; word-wrap: break-word;">
              ${field.value || '<span style="color: #9ca3af; font-style: italic;">Not provided</span>'}
            </div>
          </td>
        </tr>
      `,
      )
      .join('')

    // Format submission data for plain text email
    const submissionText = submissionData
      .map((field: any) => {
        const label = formatFieldName(field.field)
        const value = field.value || 'Not provided'
        return `${label}:\n${value}\n`
      })
      .join('\n')

    // Format date
    const submittedDate = new Date(createdAt).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })

    // Send notification email
    await req.payload.sendEmail({
      to: process.env.SMTP_USER,
      from: process.env.SMTP_USER,
      replyTo: extractEmailFromSubmission(submissionData),
      subject: `📬 New Submission: ${formDoc.title}`,
      html: generateHTMLEmail({
        formTitle: formDoc.title,
        submissionHTML,
        submittedDate,
        formId: formDoc.id,
      }),
      text: generateTextEmail({
        formTitle: formDoc.title,
        submissionText,
        submittedDate,
        formId: formDoc.id,
      }),
    })

    console.log('✅ Form notification email sent successfully!')
  } catch (error: any) {
    console.error('❌ Failed to send form notification email')
    console.error('Error:', error.message)

    if (error.code) {
      console.error('Error Code:', error.code)
    }
  }

  return doc
}

/**
 * Formats field name from camelCase/snake_case to Title Case
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim()
}

/**
 * Extracts email address from submission data for reply-to
 */
function extractEmailFromSubmission(submissionData: any[]): string | undefined {
  const emailField = submissionData.find(
    (field) =>
      field.field.toLowerCase().includes('email') ||
      field.field === 'email' ||
      field.field === 'emailAddress',
  )
  return emailField?.value || undefined
}

/**
 * Generates beautiful HTML email template
 */
/**
 * Modern, luxurious, minimalist email template for Palette Suite (2025)
 * Replace only this function in your existing hook
 */
function generateHTMLEmail({
  formTitle,
  submissionHTML,
  submittedDate,
  formId,
}: {
  formTitle: string
  submissionHTML: string
  submittedDate: string
  formId: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Inquiry – Palette Suite</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:'Inter',sans-serif;color:#1f1f1f;">
  <center style="width:100%;background:#faf9f7;padding:40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.06);">
      
      <!-- Header – Warm Desert Gradient -->
      <tr>
        <td style="background:linear-gradient(135deg,#b74e4e 0%,#8b2d4a 100%);padding:70px 40px;text-align:center;">
          <h1 style="color:#ffffff;font-family:'Libre Baskerville',serif;font-size:40px;font-weight:400;margin:0;letter-spacing:1.5px;">
            A Message Has Arrived
          </h1>
          <p style="color:#fff8f8;font-size:18px;margin:16px 0 0;opacity:0.9;">
            ${formTitle}
          </p>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding:60px 50px 50px;">
          <p style="font-size:18px;line-height:1.7;margin:0 0 36px;color:#333;">
            A new inquiry has reached Palette Suite.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 16px;">
            ${submissionHTML}
          </table>

          <div style="margin:50px 0 20px;height:1px;background:#e8e6e2;"></div>

          <table width="100%" style="font-size:15px;color:#666;">
            <tr>
              <td style="padding:8px 0;"><strong>Received</strong></td>
              <td style="padding:8px 0;text-align:right;">${submittedDate}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;"><strong>Form ID</strong></td>
              <td style="padding:8px 0;text-align:right;font-family:monospace;">${formId}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:0 50px 70px;text-align:center;">
          <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/form-submissions"
             style="display:inline-block;background:#8b2d4a;color:#ffffff;text-decoration:none;padding:18px 40px;border-radius:12px;font-weight:500;font-size:16px;letter-spacing:0.5px;">
            Open in Admin Panel
          </a>
        </td>
      </tr>

      <!-- Signature -->
      <tr>
        <td style="background:#f8f5f2;padding:50px 40px;text-align:center;">
          <p style="margin:0;font-family:'Libre Baskerville',serif;font-size:22px;color:#555;letter-spacing:1px;">
            Palette Suite
          </p>
          <p style="margin:12px 0 0;font-size:14px;color:#888;">
            Where every arrival feels like coming home
          </p>
        </td>
      </tr>
    </table>

    <p style="margin-top:50px;font-size:12px;color:#aaa;">
      © ${new Date().getFullYear()} Palette Suite • Automated notification
    </p>
  </center>
</body>
  `
}
/**
 * Generates plain text email (fallback)
 */
function generateTextEmail({
  formTitle,
  submissionText,
  submittedDate,
  formId,
}: {
  formTitle: string
  submissionText: string
  submittedDate: string
  formId: string
}): string {
  return `
═══════════════════════════════════════════
📬 NEW FORM SUBMISSION
═══════════════════════════════════════════

Form: ${formTitle}

You've received a new submission from your website.

─────────────────────────────────────────────
SUBMISSION DETAILS
─────────────────────────────────────────────

${submissionText}

─────────────────────────────────────────────
METADATA
─────────────────────────────────────────────

📅 Submitted: ${submittedDate}
🆔 Form ID: ${formId}

─────────────────────────────────────────────

View in admin panel:
${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/form-submissions

═══════════════════════════════════════════

This is an automated notification from Sunlink Energy.
© ${new Date().getFullYear()} Sunlink Energy. All rights reserved.
  `
}
