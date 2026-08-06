const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Message cannot be empty'),
  documentId: z.string().optional(),
});

const draftGenerationSchema = z.object({
  draftType: z.enum([
    'Legal Notice',
    'Complaint',
    'Rental Agreement',
    'Employment Agreement',
    'NDA',
    'Affidavit',
    'Contract',
    'Power of Attorney',
    'Service Agreement',
    'Freelancer Agreement',
    'Privacy Policy',
    'Terms & Conditions',
    'Other',
  ]),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  prompt: z.string().min(10, 'Prompt must be descriptive (at least 10 characters)'),
});

const documentUploadSchema = z.object({
  documentName: z.string().optional(),
  documentType: z.string().optional(),
});

const conversationSchema = z.object({
  title: z.string().optional(),
  documentId: z.string().optional(),
});

const messageSchema = z.object({
  message: z.string().min(1),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileSchema,
  changePasswordSchema,
  chatSchema,
  draftGenerationSchema,
  documentUploadSchema,
  conversationSchema,
  messageSchema,
};
