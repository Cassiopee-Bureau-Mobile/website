import { baseUrl, pages } from '@/utils/constants';
import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';

const createTransporter = async () => {
    const transporter = nodemailer.createTransport({
        //@ts-ignore
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'login',
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    return transporter;
};

export async function sendEmail(to: string, subject: string, html: string) {
    logger.info(`Sending email to ${to} with subject "${subject}"`);
    const transporter = await createTransporter();
    await transporter.sendMail({
        from: `Noreply SafeOfficeAnywhere <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}

export async function sendVerificationEmail(to: string, token: string) {
    const subject = 'Verify your email address';
    const html = `
    <div>
        <p>Hi there,</p>
        <p>Thanks for signing up to our app!</p>
        <p>Please verify your email address by clicking on the link below:</p>
        <a href="${baseUrl}${pages.verifyEmail}?token=${token}">Verify your email address</a>
    </div>
    `;

    await sendEmail(to, subject, html);
}

export async function sendResetPasswordEmail(to: string, token: string) {
    const subject = 'Reset your password';
    const html = `
    <div>
        <p>Hi there,</p>
        <p>Please reset your password by clicking on the link below:</p>
        <a href='${baseUrl}${pages.forgotPassword}?token=${token}'>Reset your password</a>
    </div>
    `;

    await sendEmail(to, subject, html);
}
