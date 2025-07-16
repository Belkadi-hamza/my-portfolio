import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getCurrentUser } from '../../firebase/auth';
import { getSkills, updateSkills } from '../../firebase/database';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Brain, Save, X } from 'lucide-react';

const skillSchema = yup.object({
  name: yup.string().required('Skill name is required'),
  level: yup.number().min(0).max(100).required('Skill level is required'),
});

const categorySchema = yup.object({
  title: yup.string().required('Category title is required'),
  icon: yup.string().required('Icon is required'),
  skills: yup.array().of(skillSchema).min(1, 'At least one skill is required'),
});

type SkillForm = yup.InferType<typeof skillSchema>;
type CategoryForm = yup.InferType<typeof categorySchema>;

const iconOptions = [
  'Code', 'Brain', 'Database', 'GitBranch', 'Users', 'Settings'
];

export default function SkillsManager() {
  const [skillCategories, setSkillCategories] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<CategoryForm>({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      skills: [{ name: '', level: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        const data = await getSkills(user.uid);
        setSkillCategories(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    }
  };

  const onSubmit = async (data: CategoryForm) => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (user) {
        const updatedCategories = { ...skillCategories };
        
        if (editingCategory) {
          updatedCategories[editingCategory] = data;
        } else {
          const newId = Date.now().toString();
          updatedCategories[newId] = data;
        }
        
        await updateSkills(user.uid, updatedCategories);
        await fetchSkills();
        toast.success(editingCategory ? 'Category updated successfully!' : 'Category added successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Failed to save skills');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoryId: string, data: any) => {
    setEditingCategory(categoryId);
    setShowForm(true);
    setValue('title', data.title);
    setValue('icon', data.icon);
    
    // Convert skills object to array format
    const skillsArray = Object.entries(data.skills || {}).map(([id, skill]: [string, any]) => ({
      name: skill.name,
      level: skill.level,
    }));
    
    setValue('skills', skillsArray.length > 0 ? skillsArray : [{ name: '', level: 0 }]);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this skill category?')) {
      try {
        const user = getCurrentUser();
        if (user) {
          const updatedCategories = { ...skillCategories };
          delete updatedCategories[categoryId];
          
          await updateSkills(user.uid, updatedCategories);
          await fetchSkills();
          toast.success('Category deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    reset({ skills: [{ name: '', level: 0 }] });
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Skills Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingCategory ? 'Edit Skill Category' : 'Add Skill Category'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Title
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Frontend, Backend"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: '', level: 0 })}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    + Add Skill
                  </button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2 mb-2">
                    <input
                      {...register(`skills.${index}.name` as const)}
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Skill name"
                    />
                    <input
                      {...register(`skills.${index}.level` as const)}
                      type="number"
                      min="0"
                      max="100"
                      className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Level"
                    />
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
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

      {/* Skills Categories */}
      <div className="grid gap-6">
        {Object.entries(skillCategories).map(([categoryId, category]: [string, any]) => (
          <div key={categoryId} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">{category.title}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(categoryId, category)}
                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(categoryId)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(category.skills || {}).map(([skillId, skill]: [string, any]) => (
                <div key={skillId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(skillCategories).length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No skill categories found. Add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}