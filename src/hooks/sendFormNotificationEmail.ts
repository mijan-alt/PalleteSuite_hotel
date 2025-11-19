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
      to: 'mijanigoni@gmail.com',
      from: process.env.SMTP_USER || 'noreply@sunlinkenergy.com',
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

    // Don't throw - we don't want form submission to fail if email fails
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
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>New Form Submission</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f9fafb;">
          <tr>
            <td style="padding: 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">📬</div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      New Form Submission
                    </h1>
                    <p style="color: #dbeafe; margin: 12px 0 0 0; font-size: 16px; font-weight: 500;">
                      ${formTitle}
                    </p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      You've received a new submission from your website. Here are the details:
                    </p>
                    
                    <!-- Submission Data Table -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      ${submissionHTML}
                    </table>
                  </td>
                </tr>
                
                <!-- Footer Info -->
                <tr>
                  <td style="padding: 0 30px 40px 30px;">
                    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tr>
                          <td style="padding-bottom: 8px;">
                            <span style="color: #1e40af; font-size: 14px; font-weight: 600;">📅 Submitted:</span>
                            <span style="color: #1e3a8a; font-size: 14px; margin-left: 8px;">${submittedDate}</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span style="color: #1e40af; font-size: 14px; font-weight: 600;">🆔 Form ID:</span>
                            <span style="color: #1e3a8a; font-size: 14px; margin-left: 8px; font-family: 'Courier New', monospace;">${formId}</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
                
                <!-- Action Button (Optional) -->
                <tr>
                  <td style="padding: 0 30px 40px 30px; text-align: center;">
                    <a href="${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/collections/form-submissions" 
                       style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; transition: background 0.3s ease;">
                      View in Admin Panel →
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0;">
                      This is an automated notification from <strong>Sunlink Energy</strong>.<br/>
                      You're receiving this because you're listed as the form notification recipient.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
                      © ${new Date().getFullYear()} Sunlink Energy. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
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