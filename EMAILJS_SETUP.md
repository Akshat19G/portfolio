# EmailJS Setup Instructions

This portfolio website uses EmailJS to send emails from the contact form. Follow these steps to configure EmailJS:

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add an Email Service

1. Go to the **Email Services** section in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account
5. **Save the Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. Go to the **Email Templates** section
2. Click **Create New Template**
3. Use the following template structure:

```
Subject: New Portfolio Contact: {{subject}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
Reply-to: {{from_email}}
```

4. **Important:** In the template settings:
   - Set **To Email** to: `srivastavaakshat1909@gmail.com`
   - **Save the Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** > **General**
2. Copy your **Public Key** (also called User ID)

## Step 5: Update the Code

Open `/src/app/components/Contact.tsx` and replace these placeholders:

```typescript
await emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your Service ID from Step 2
  'YOUR_TEMPLATE_ID',     // Replace with your Template ID from Step 3
  templateParams,
  'YOUR_PUBLIC_KEY'       // Replace with your Public Key from Step 4
);
```

## Example Configuration

After setup, your code should look like this:

```typescript
await emailjs.send(
  'service_abc1234',
  'template_xyz5678',
  templateParams,
  'user_K9mN2pQ4rS6tV8wX'
);
```

## Testing the Contact Form

1. Start your development server
2. Navigate to the Contact section
3. Fill out the form with test data
4. Click "Send Message"
5. Check your email inbox at `srivastavaakshat1909@gmail.com`

## Troubleshooting

### Email not sending?
- Verify all IDs are correct (Service ID, Template ID, Public Key)
- Check your EmailJS dashboard for any error logs
- Ensure your email service is properly connected and verified
- Check browser console for error messages

### Getting a CORS error?
- Make sure you're using the Public Key, not the Private Key
- Verify your domain is whitelisted in EmailJS settings (for production)

### Emails going to spam?
- Add your sending domain to your email's safe sender list
- Configure SPF and DKIM records in EmailJS settings

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Limited to 2 email templates
- Basic features

For higher volume, consider upgrading to a paid plan.

## Alternative: Backend Implementation

If you prefer a backend solution instead of EmailJS, you can:
1. Create a Node.js/Express backend
2. Use Nodemailer with SMTP
3. Update the contact form to POST to your backend API

## Support

For more help, visit:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/support/)
