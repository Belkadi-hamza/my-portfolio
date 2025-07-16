import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getCurrentUser } from '../../firebase/auth';
import { getUserData, updateUserData } from '../../firebase/database';
import toast from 'react-hot-toast';
import { Save, User, Mail, Phone, FileText, Key, Copy, Lock, Eye, EyeOff } from 'lucide-react';

const schema = yup.object({
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  bio: yup.string().required('Bio is required'),
  image_url: yup.string().url('Invalid URL').required('Image URL is required'),
  phone: yup.string().required('Phone is required'),
});

type UserSettingsForm = yup.InferType<typeof schema>;

export default function UserSettings() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSecurityForm, setShowSecurityForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserSettingsForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          const data = await getUserData(user.uid);
          setUserData(data);
          
          // Populate form with existing data
          setValue('full_name', data?.full_name || '');
          setValue('email', data?.email || '');
          setValue('bio', data?.bio || '');
          setValue('image_url', data?.image_url || '');
          
          // Get phone from contact_info
          const contactInfo = data?.contact_info;
          if (contactInfo) {
            const firstContact = Object.values(contactInfo)[0] as any;
            setValue('phone', firstContact?.phone || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, [setValue]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('User ID copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };
  const onSubmit = async (data: UserSettingsForm) => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (user) {
        // Update user basic info
        await updateUserData(user.uid, {
          full_name: data.full_name,
          email: data.email,
          bio: data.bio,
          image_url: data.image_url,
        });

        // Update contact info
        const contactInfoKey = userData?.contact_info ? Object.keys(userData.contact_info)[0] : null;
        if (contactInfoKey) {
          await updateUserData(user.uid, {
            [`contact_info/${contactInfoKey}/phone`]: data.phone,
            [`contact_info/${contactInfoKey}/email`]: data.email,
          });
        }

        toast.success('Settings updated successfully!');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User Settings</h2>
          <p className="text-gray-600">Manage your profile information</p>
        </div>

        {/* User ID Section */}
        {currentUser && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Key className="w-5 h-5 text-gray-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">User ID</h3>
                  <p className="text-xs text-gray-500">Your unique Firebase user identifier</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800 max-w-xs truncate">
                  {currentUser.uid}
                </code>
                <button
                  onClick={() => copyToClipboard(currentUser.uid)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy User ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <p className="text-gray-600">Update your basic profile details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                {...register('full_name')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your bio"
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URL
            </label>
            <input
              {...register('image_url')}
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter image URL"
            />
            {errors.image_url && (
              <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                <p className="text-gray-600">Update your email and password</p>
              </div>
              <button
                onClick={() => setShowSecurityForm(!showSecurityForm)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showSecurityForm ? 'Cancel' : 'Change Credentials'}
              </button>
            </div>
          </div>

          {showSecurityForm && <SecurityForm onClose={() => setShowSecurityForm(false)} />}
        </div>
      </div>
    </div>
  );
}

// Security Form Component
function SecurityForm({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
  
  return (
    <div className="p-6">
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('email')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'email'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Change Email
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'password'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'email' ? (
        <EmailUpdateForm onClose={onClose} />
      ) : (
        <PasswordUpdateForm onClose={onClose} />
      )}
    </div>
  );
}

// Email Update Form
const emailSchema = yup.object({
  newEmail: yup.string().email('Invalid email').required('New email is required'),
  currentPassword: yup.string().required('Current password is required for verification'),
});

type EmailUpdateForm = yup.InferType<typeof emailSchema>;

function EmailUpdateForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailUpdateForm>({
    resolver: yupResolver(emailSchema),
  });

  const onSubmit = async (data: EmailUpdateForm) => {
    setLoading(true);
    try {
      const { updateUserEmail } = await import('../../firebase/auth');
      await updateUserEmail(data.newEmail, data.currentPassword);
      toast.success('Email updated successfully! Please verify your new email.');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in before changing your email');
      } else {
        toast.error(error.message || 'Failed to update email');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          New Email Address
        </label>
        <input
          {...register('newEmail')}
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter new email address"
        />
        {errors.newEmail && (
          <p className="mt-1 text-sm text-red-600">{errors.newEmail.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          Current Password
        </label>
        <div className="relative">
          <input
            {...register('currentPassword')}
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Updating...' : 'Update Email'}
        </button>
      </div>
    </form>
  );
}

// Password Update Form
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

type PasswordUpdateForm = yup.InferType<typeof passwordSchema>;

function PasswordUpdateForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordUpdateForm>({
    resolver: yupResolver(passwordSchema),
  });

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const onSubmit = async (data: PasswordUpdateForm) => {
    setLoading(true);
    try {
      const { updateUserPassword } = await import('../../firebase/auth');
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast.success('Password updated successfully!');
      reset();
      onClose();
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        toast.error('New password is too weak');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in before changing your password');
      } else {
        toast.error(error.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          Current Password
        </label>
        <div className="relative">
          <input
            {...register('currentPassword')}
            type={showPasswords.current ? 'text' : 'password'}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          New Password
        </label>
        <div className="relative">
          <input
            {...register('newPassword')}
            type={showPasswords.new ? 'text' : 'password'}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Lock className="w-4 h-4 inline mr-2" />
          Confirm New Password
        </label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showPasswords.confirm ? 'text' : 'password'}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Key className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Password Requirements
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>At least 6 characters long</li>
                <li>Should contain a mix of letters and numbers</li>
                <li>Avoid using common passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}