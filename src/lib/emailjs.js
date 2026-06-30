import emailjs from '@emailjs/browser';

export const OWNER_EMAIL = 'socialmain2025@gmail.com';
export const BUSINESS_NAME = 'Sumit Web Studio';

const NOT_PROVIDED = 'Not provided';

export function getEmailJsConfig() {
  return {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    ownerTemplateId: process.env.REACT_APP_EMAILJS_OWNER_TEMPLATE_ID,
    customerTemplateId: process.env.REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
  };
}

export function assertEmailJsConfig(config) {
  const missing = Object.entries({
    REACT_APP_EMAILJS_SERVICE_ID: config.serviceId,
    REACT_APP_EMAILJS_OWNER_TEMPLATE_ID: config.ownerTemplateId,
    REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID: config.customerTemplateId,
    REACT_APP_EMAILJS_PUBLIC_KEY: config.publicKey,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`EmailJS is not configured. Missing: ${missing.join(', ')}`);
  }
}

export function formatSubmissionDate(date = new Date()) {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function buildContactOwnerParams(form) {
  const submissionDate = formatSubmissionDate();

  return {
    full_name: form.name.trim(),
    email: form.email.trim(),
    phone_number: NOT_PROVIDED,
    company: form.company.trim() || NOT_PROVIDED,
    selected_service: form.project_type || NOT_PROVIDED,
    budget: form.budget || NOT_PROVIDED,
    timeline: NOT_PROVIDED,
    message: form.message.trim(),
    submission_date: submissionDate,
    to_email: OWNER_EMAIL,
  };
}

export function buildContactCustomerParams(form) {
  return {
    full_name: form.name.trim(),
    to_name: form.name.trim(),
    email: form.email.trim(),
    to_email: form.email.trim(),
    contact_email: OWNER_EMAIL,
    business_name: BUSINESS_NAME,
  };
}

export function buildNewsletterOwnerParams(subscriberEmail) {
  const submissionDate = formatSubmissionDate();

  return {
    full_name: 'Newsletter subscriber',
    email: subscriberEmail.trim(),
    phone_number: NOT_PROVIDED,
    company: NOT_PROVIDED,
    selected_service: 'Newsletter',
    budget: NOT_PROVIDED,
    timeline: NOT_PROVIDED,
    message: `New newsletter subscription from ${subscriberEmail.trim()}.`,
    submission_date: submissionDate,
    to_email: OWNER_EMAIL,
  };
}

export async function sendTemplate({ serviceId, templateId, templateParams, publicKey }) {
  return emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
