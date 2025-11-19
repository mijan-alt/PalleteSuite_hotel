import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function testEmail() {
  console.log('🚀 Testing email configuration...\n')

  // Check required environment variables
  const requiredVars = {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:\n')
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.log('\n💡 Make sure you have a .env.local or .env file with these variables')
    process.exit(1)
  }

  // Get recipient from command line or use SMTP_USER
  const recipient = process.argv[2] || process.env.SMTP_USER!
  
  console.log(`📬 Recipient: ${recipient}`)
  console.log(`📤 From: ${process.env.SMTP_USER}`)
  console.log(`🔌 SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}\n`)

  try {
    const payload = await getPayload({ config: configPromise })

    console.log('📧 Sending test email...')

    await payload.sendEmail({
      to: 'mijanigoni@gmail.com',
      from: process.env.SMTP_USER!,
      subject: 'Test Email from Sunlink Energy',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h1 style="color: #2563eb;">✅ Email Configuration Test</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            If you're reading this, your email configuration is working correctly!
          </p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Configuration Details:</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 5px 0;"><strong>Timestamp:</strong></td>
                <td style="padding: 5px 0;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Environment:</strong></td>
                <td style="padding: 5px 0;">${process.env.NODE_ENV || 'development'}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>SMTP Host:</strong></td>
                <td style="padding: 5px 0;">${process.env.SMTP_HOST}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>SMTP Port:</strong></td>
                <td style="padding: 5px 0;">${process.env.SMTP_PORT}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>From Address:</strong></td>
                <td style="padding: 5px 0;">${process.env.SMTP_USER}</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            This is an automated test email from Sunlink Energy website.
          </p>
        </div>
      `,
      text: `
✅ Email Configuration Test

If you're reading this, your email configuration is working correctly!

Configuration Details:
----------------------
Timestamp: ${new Date().toLocaleString()}
Environment: ${process.env.NODE_ENV || 'development'}
SMTP Host: ${process.env.SMTP_HOST}
SMTP Port: ${process.env.SMTP_PORT}
From Address: ${process.env.SMTP_USER}

This is an automated test email from Sunlink Energy website.
      `,
    })

    console.log('\n✅ Email sent successfully!')
    console.log(`📬 Check inbox: ${recipient}`)
    console.log('💡 Don\'t forget to check spam folder!\n')
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Email send failed!\n')
    console.error('Error Message:', error.message)
    
    if (error.code) {
      console.error('Error Code:', error.code)
    }
    
    if (error.response) {
      console.error('SMTP Response:', error.response)
    }
    
    console.log('\n🔍 Common Issues & Solutions:')
    console.log('─────────────────────────────────')
    
    if (error.code === 'EAUTH') {
      console.log('\n❌ Authentication Failed')
      console.log('   Solutions:')
      console.log('   1. Using Gmail? Generate an App Password')
      console.log('      → Go to: https://myaccount.google.com/apppasswords')
      console.log('      → Create new app password')
      console.log('      → Update SMTP_PASS in .env with the 16-character password')
      console.log('   2. Remove spaces from App Password')
      console.log('   3. Make sure 2FA is enabled on Gmail')
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
      console.log('\n❌ Connection Failed')
      console.log('   Solutions:')
      console.log('   1. Try port 587 with secure: false')
      console.log('   2. Or port 465 with secure: true')
      console.log('   3. Check SMTP_HOST is correct (smtp.gmail.com for Gmail)')
      console.log('   4. Check firewall/antivirus isn\'t blocking SMTP')
    } else if (error.code === 'EENVELOPE') {
      console.log('\n❌ Invalid Email Address')
      console.log('   Solutions:')
      console.log('   1. Check recipient email is valid')
      console.log('   2. Check SMTP_USER (from address) is valid')
    } else {
      console.log('\n   General troubleshooting:')
      console.log('   1. Verify .env.local file exists')
      console.log('   2. Restart terminal after changing .env')
      console.log('   3. Try using Resend instead for production')
    }
    
    console.log('\n📝 Current Configuration:')
    console.log('─────────────────────────────────')
    console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ Not set')
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ Not set')
    console.log('SMTP_USER:', process.env.SMTP_USER || '❌ Not set')
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? `✅ Set (${process.env.SMTP_PASS.length} chars)` : '❌ Not set')
    console.log('PAYLOAD_SECRET:', process.env.PAYLOAD_SECRET ? '✅ Set' : '❌ Not set')
    console.log()
    
    process.exit(1)
  }
}

testEmail()