import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST,
  port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
  secure: true, // true for 465, false for 587
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
  items: Array<{ title: string; size: string; quantity: number; price: number }>;
  totalAmount: number;
  reference: string;
}) {
  const itemsList = data.items
    .map(
      item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">Size ${item.size}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">₦${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: data.email,
    subject: 'Order Confirmation',
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
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Thank you for your purchase!</p>
              <p>Your payment has been received and your order is being processed.</p>
              
              <h3>Order Details:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              
              <p class="total">Total: ₦${data.totalAmount.toLocaleString()}</p>
              <p><strong>Reference:</strong> ${data.reference}</p>
              
              <p>We will contact you shortly regarding delivery arrangements.</p>
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

// Send notification to admin
export async function sendAdminNotification(type: 'consultation' | 'order', data: any) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL;
  
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: adminEmail,
    subject: `New ${type === 'consultation' ? 'Consultation Booking' : 'Order'} - ${data.reference}`,
    html: `
      <h2>New ${type === 'consultation' ? 'Consultation Booking' : 'Order'}</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `,
  };

  await transporter.sendMail(mailOptions);
}