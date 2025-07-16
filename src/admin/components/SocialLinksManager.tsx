import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getCurrentUser } from '../../firebase/auth';
import { getSocialLinks, addSocialLink, updateSocialLink, deleteSocialLink } from '../../firebase/database';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Share2, Save, X, ExternalLink } from 'lucide-react';

const schema = yup.object({
  platform_name: yup.string().required('Platform name is required'),
  url: yup.string()
    .required('URL/Email is required')
    .test('url-or-email', 'Must be a valid URL or email address', function(value) {
      if (!value) return false;
      
      // Check if it's a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        return true;
      }
      
      // Check if it's a valid URL
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
  icon: yup.string().required('Icon is required'),
});

type SocialLinkForm = yup.InferType<typeof schema>;

const iconOptions = [
  'Github', 'Linkedin', 'Twitter', 'Instagram', 'Facebook', 
  'Youtube', 'Mail', 'Globe', 'Phone'
];

export default function SocialLinksManager() {
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SocialLinkForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const data = await getSocialLinks(user.uid);
        setSocialLinks(data);
      }
    } catch (error) {
      console.error('Error fetching social links:', error);
      toast.error('Failed to load social links');
    }
  };

  const onSubmit = async (data: SocialLinkForm) => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (user) {
        if (editingId) {
          await updateSocialLink(user.uid, editingId, data);
          toast.success('Social link updated successfully!');
        } else {
          await addSocialLink(user.uid, data);
          toast.success('Social link added successfully!');
        }
        
        await fetchSocialLinks();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving social link:', error);
      toast.error('Failed to save social link');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string, data: any) => {
    setEditingId(id);
    setShowForm(true);
    setValue('platform_name', data.platform_name);
    setValue('url', data.url);
    setValue('icon', data.icon);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this social link?')) {
      try {
        const user = getCurrentUser();
        if (user) {
          await deleteSocialLink(user.uid, id);
          await fetchSocialLinks();
          toast.success('Social link deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting social link:', error);
        toast.error('Failed to delete social link');
      }
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Social Links Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Social Link
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Social Link' : 'Add Social Link'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name
                </label>
                <input
                  {...register('platform_name')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., GitHub, LinkedIn"
                />
                {errors.platform_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.platform_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL or Email
                </label>
                <input
                  {...register('url')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://github.com/username or email@example.com"
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  {...register('icon')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select icon</option>
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
                {errors.icon && (
                  <p className="mt-1 text-sm text-red-600">{errors.icon.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(socialLinks).map(([id, link]: [string, any]) => (
          <div key={id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{link.platform_name}</h3>
                  <p className="text-sm text-gray-600">{link.icon}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(id, link)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <a
                href={link.url}
                href={link.url.includes('@') ? `mailto:${link.url}` : link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-purple-600 hover:text-purple-700 text-sm truncate"
              >
                <ExternalLink className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{link.url}</span>
              </a>
            </div>
          </div>
        ))}

        {Object.keys(socialLinks).length === 0 && (
          <div className="col-span-full text-center py-12">
            <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No social links found. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}