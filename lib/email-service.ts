// lib/email-service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export async function sendConsultationConfirmation(data: {
  email: string;
  fullName: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  category: string;
  reference: string;
  amount: number;
}) {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: data.email,
    subject: 'Consultation Booking Confirmed',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #fff; }
            .details { background: #f9f9f9; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Consultation Confirmed</h1>
            </div>
            <div class="content">
              <p>Dear ${data.fullName},</p>
              <p>Thank you for booking a consultation with us. Your payment has been received and your consultation is confirmed.</p>
              
              <div class="details">
                <h3>Booking Details:</h3>
                <p><strong>Consultation Type:</strong> ${data.consultationType}</p>
                <p><strong>Date:</strong> ${data.preferredDate}</p>
                <p><strong>Time:</strong> ${data.preferredTime}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p><strong>Amount Paid:</strong> ₦${data.amount.toLocaleString()}</p>
                <p><strong>Reference:</strong> ${data.reference}</p>
              </div>
              
              <p>We will contact you within 2 business days to confirm the final details.</p>
              <p>If you have any questions, please don't hesitate to reach out.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendOrderConfirmation(data: {
  email: string;
  fullName: string; 
  phone: string;  
  address: string; 
  items: Array<{ title: string; size: string; color: string; height?: string; quantity: number; price: number }>;
  totalAmount: number;
  deliveryOption?: string;
  deliveryFee?: number;
  finalTotal?: number;
  reference: string;
  fitProfile?: { measurements?: Record<string, string>; bodyShape?: string };
}) {
  const itemsList = data.items
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Size ${item.size}${item.height ? ` / Height ${item.height}` : ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.color}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">₦${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const deliveryText = data.deliveryOption === 'within-lagos' 
    ? 'Within Lagos' 
    : data.deliveryOption === 'outside-lagos'
      ? 'Outside Lagos'
      : 'Standard Delivery';

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: data.email,
    subject: 'Order Confirmation - Lizzaworld Atelier',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #fff; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f4f4f4; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
            .details { background: #f9f9f9; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.fullName},</p>
              <p>Thank you for your purchase! Your payment has been received and your order is being processed.</p>
              
              <div class="details">
                <h3>Delivery Information:</h3>
                <p><strong>Name:</strong> ${data.fullName}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Address:</strong> ${data.address}</p>
                <p><strong>Delivery Option:</strong> ${deliveryText}</p>
              </div>

              ${data.fitProfile ? `
                <div class="details" style="margin-top: 10px;">
                  <h3>Saved Fit Profile:</h3>
                  <p><strong>Body Shape:</strong> ${data.fitProfile.bodyShape || 'Balanced'}</p>
                  ${Object.entries(data.fitProfile.measurements || {})
                    .filter(([_, v]) => v)
                    .map(([k, v]) => `<p><strong>${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${v}"</p>`)
                    .join('')}
                </div>
              ` : ''}
              
              <h3>Order Details:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              
              <div style="border-top: 2px solid #ddd; padding-top: 15px;">
                <p style="display: flex; justify-content: space-between; margin: 5px 0;">
                  <span>Subtotal:</span>
                  <span>₦${data.totalAmount.toLocaleString()}</span>
                </p>
                ${data.deliveryFee ? `
                  <p style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span>Delivery Fee:</span>
                    <span>₦${data.deliveryFee.toLocaleString()}</span>
                  </p>
                ` : ''}
                <p class="total" style="display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
                  <span>Total Paid:</span>
                  <span>₦${(data.finalTotal || data.totalAmount).toLocaleString()}</span>
                </p>
              </div>
              
              <p><strong>Reference:</strong> ${data.reference}</p>
              
              <p>We will contact you within 24-48 hours to arrange delivery.</p>
              <p>If you have any questions, please don't hesitate to reach out.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendInternationalShippingInquiry(data: {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address?: string;
  items: Array<{ title: string; size: string; color?: string; height?: string; quantity: number; price: number }>;
  totalAmount: number;
}) {
  const itemsList = data.items
    .map(item => `${item.title} (Size ${item.size}${item.height ? `, Height ${item.height}` : ''}${item.color ? `, Color ${item.color}` : ''}) × ${item.quantity} - ₦${item.price.toLocaleString()}`)
    .join('\n');

  // Send to customer
  await transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: data.email,
    subject: 'International Shipping Request Received',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #fff; }
            .details { background: #f9f9f9; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Shipping Request Received</h1>
            </div>
            <div class="content">
              <p>Dear ${data.fullName},</p>
              <p>Thank you for your interest in our products! We've received your international shipping request.</p>
              
              <div class="details">
                <h3>Your Request:</h3>
                <p><strong>Destination:</strong> ${data.country}</p>
                ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
                <p><strong>Order Value:</strong> ₦${data.totalAmount.toLocaleString()}</p>
              </div>
              
              <p>Our team will calculate the DHL shipping costs for your location and contact you within 24 hours with:</p>
              <ul>
                <li>Exact shipping costs</li>
                <li>Estimated delivery time</li>
                <li>Payment instructions</li>
              </ul>
              
              <p>If you have any immediate questions, please don't hesitate to reach out.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  // Send to admin
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL;
  await transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: adminEmail,
    subject: `New International Shipping Request - ${data.country}`,
    html: `
      <h2>New International Shipping Request</h2>
      <h3>Customer Details:</h3>
      <p><strong>Name:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Country:</strong> ${data.country}</p>
      ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ''}
      
      <h3>Order Items:</h3>
      <pre>${itemsList}</pre>
      
      <p><strong>Order Value:</strong> ₦${data.totalAmount.toLocaleString()}</p>
      
      <p><em>Action Required: Calculate DHL shipping costs and contact customer within 24 hours.</em></p>
    `,
  });
}

// Send welcome email to newsletter subscriber
export async function sendNewsletterConfirmation(data: { email: string; fullName: string }) {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: data.email,
    subject: 'Welcome to the Lizza Atelier Newsletter',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Playfair Display', Georgia, serif; line-height: 1.8; color: #1c1c1c; background-color: #faf6f0; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #ffffff; border: 1px solid rgba(28,28,28,0.08); }
            .header { text-align: center; border-bottom: 1px solid rgba(28,28,28,0.08); padding-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 300; letter-spacing: 0.3em; text-transform: uppercase; color: #1c1c1c; margin: 0; }
            .content { padding: 40px 0; }
            .greeting { font-size: 18px; margin-bottom: 24px; font-weight: 400; color: #1c1c1c; }
            .text { font-size: 14px; color: #4a4a4a; margin-bottom: 20px; }
            .divider { width: 40px; height: 1px; background-color: #1c1c1c; margin: 30px auto; }
            .footer { text-align: center; color: #8c8c8c; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding-top: 30px; border-top: 1px solid rgba(28,28,28,0.08); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">Lizza Atelier</h1>
            </div>
            <div class="content" style="text-align: center;">
              <p class="greeting">Welcome to the inner circle, ${data.fullName}</p>
              <p class="text">You have successfully subscribed to the Lizza Atelier newsletter. You will now receive private viewings, collection drops, and stories of modern luxury directly in your inbox.</p>
              <div class="divider"></div>
              <p class="text" style="font-style: italic;">Luxury with intention.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Lizza Atelier. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Send notification to admin
export async function sendAdminNotification(type: 'consultation' | 'order' | 'newsletter', data: any) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL;
  
  let subject = '';
  if (type === 'consultation') {
    subject = `New Consultation Booking - ${data.reference || 'N/A'}`;
  } else if (type === 'order') {
    subject = `New Order - ${data.reference || 'N/A'}`;
  } else if (type === 'newsletter') {
    subject = `New Newsletter Subscriber: ${data.fullName}`;
  }

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: adminEmail,
    subject,
    html: `
      <h2>New ${type.charAt(0).toUpperCase() + type.slice(1)} Event</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `,
  };

  await transporter.sendMail(mailOptions);
}