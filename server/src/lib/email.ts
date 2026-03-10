import nodemailer, { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";

// Cấu hình transporter - sử dụng SMTP
const transporter: Transporter = createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email admin nhận thông báo
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@reviewbdsdanang.com";

interface RegisterEmailData {
  fullname: string;
  email: string;
  phonenum: string;
  project: string;
  note: string;
}

/**
 * Gửi email thông báo cho admin khi có khách hàng đăng ký tư vấn
 */
export async function sendAdminNotification(data: RegisterEmailData): Promise<void> {
  const subject = `📢 Yêu cầu tư vấn mới từ: ${data.fullname}`;

  const htmlContent = `
    <div style="margin:0; padding:0; width:100%; background:#f5f5f5;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse; background:#f5f5f5;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; border-collapse:separate; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08); border-top:6px solid #f59e0b;">
              <tr>
                <td style="padding:22px 24px 10px 24px; font-family: Arial, sans-serif;">
                  <div style="font-size:13px; letter-spacing:0.3px; color:#9a6a00; font-weight:700; text-transform:uppercase;">
                    ReviewBDSDaNang.com
                  </div>
                  <div style="margin-top:6px; font-size:22px; line-height:28px; font-weight:800; color:#111827;">
                    🔔 Yêu cầu tư vấn mới
                  </div>
                  <div style="margin-top:10px; font-size:14px; line-height:20px; color:#6b7280;">
                    Thông tin chi tiết của khách hàng được gửi bên dưới.
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 8px 24px; font-family: Arial, sans-serif;">
                  <div style="background:#fff7ed; border:1px solid #fde68a; border-radius:12px; padding:14px 14px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate; border-spacing:0; font-size:14px; line-height:20px; color:#111827;">
                      <tr>
                        <td style="padding:10px 12px; border-top-left-radius:10px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e;">Họ và tên:</td>
                        <td style="padding:10px 12px; border-top-right-radius:10px; border:1px solid #fde68a; border-left:none; background:#ffffff;">${data.fullname}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none;">Email:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none;">${data.email}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none;">Số điện thoại:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none;">${data.phonenum}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none;">Dự án quan tâm:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none;">${data.project || "Chưa chọn dự án"}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none; vertical-align:top;">Ghi chú:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none; vertical-align:top;">${data.note || "Không có"}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none; border-bottom-left-radius:10px;">Thời gian:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none; border-bottom-right-radius:10px;">${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 24px 22px 24px; font-family: Arial, sans-serif;">
                  <div style="height:1px; background:#f3f4f6; margin:8px 0 14px 0;"></div>
                  <div style="font-size:12px; line-height:18px; color:#6b7280;">
                    Email này được gửi tự động từ hệ thống đăng ký tư vấn reviewbdsdanang.com.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@reviewbdsdanang.com",
    to: ADMIN_EMAIL,
    subject,
    html: htmlContent,
  });
}

/**
 * Gửi email tự động cho khách hàng (auto-reply)
 */
export async function sendAutoReply(data: RegisterEmailData): Promise<void> {
  const subject = "📧(No Reply) Xác nhận đăng ký tư vấn - reviewbdsdanang.com";

  const htmlContent = `
    <div style="margin:0; padding:0; width:100%; background:#f5f5f5;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse; background:#f5f5f5;">
        <tr>
          <td align="center" style="padding:32px 16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; border-collapse:separate; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08); border-top:6px solid #f59e0b;">
              <tr>
                <td style="padding:22px 24px 10px 24px; font-family: Arial, sans-serif;">
                  <div style="font-size:13px; letter-spacing:0.3px; color:#9a6a00; font-weight:700; text-transform:uppercase;">
                    ReviewBDSDaNang.com
                  </div>
                  <div style="margin-top:6px; font-size:22px; line-height:28px; font-weight:800; color:#111827;">
                    Xin chào ${data.fullname}!
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:0 24px 8px 24px; font-family: Arial, sans-serif;">
                  <div style="font-size:14px; line-height:22px; color:#111827;">
                    <p style="margin:0 0 10px 0;">
                      Cảm ơn bạn đã quan tâm và gửi yêu cầu tư vấn đến <strong>reviewbdsdanang.com</strong>.
                    </p>
                    <p style="margin:0 0 12px 0;">
                      Chúng tôi đã tiếp nhận thông tin của bạn:
                    </p>
                  </div>

                  <div style="background:#fff7ed; border:1px solid #fde68a; border-radius:12px; padding:14px 14px; margin:0 0 14px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate; border-spacing:0; font-size:14px; line-height:20px; color:#111827;">
                      <tr>
                        <td style="padding:10px 12px; border-top-left-radius:10px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e;">Họ và tên:</td>
                        <td style="padding:10px 12px; border-top-right-radius:10px; border:1px solid #fde68a; border-left:none; background:#ffffff;">${data.fullname}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none;">Email:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none;">${data.email}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none;">Số điện thoại:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none;">${data.phonenum}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 12px; border:1px solid #fde68a; background:#fffbeb; width:160px; font-weight:700; color:#92400e; border-top:none; border-bottom-left-radius:10px;">Dự án quan tâm:</td>
                        <td style="padding:10px 12px; border:1px solid #fde68a; border-left:none; background:#ffffff; border-top:none; border-bottom-right-radius:10px;">${data.project || "Chưa chọn dự án"}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="font-size:14px; line-height:22px; color:#111827;">
                    <p style="margin:0 0 10px 0;"><strong>Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất!</strong></p>

                    <p style="margin:0 0 8px 0;">Nếu bạn có câu hỏi khẩn cấp, vui lòng liên hệ trực tiếp qua:</p>
                    <ul style="margin:0; padding:0 0 0 18px;">
                      <li style="margin:0 0 6px 0;">📞 Điện thoại: ${process.env.CONTACT_PHONE || "Liên hệ qua email"}</li>
                      <li style="margin:0 0 0 0;">📧 Email: ${ADMIN_EMAIL}</li>
                    </ul>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 24px 22px 24px; font-family: Arial, sans-serif;">
                  <div style="height:1px; background:#f3f4f6; margin:8px 0 14px 0;"></div>
                  <div style="font-size:12px; line-height:18px; color:#6b7280;">
                    Email này được gửi tự động từ hệ thống reviewbdsdanang. Vui lòng không reply trực tiếp email này.
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@reviewbdsdanang.com",
    to: data.email,
    subject,
    html: htmlContent,
  });
}

export { transporter };
