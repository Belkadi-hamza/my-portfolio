import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../firebase/auth';
import { getUserData } from '../../firebase/database';
import { 
  GraduationCap, 
  Briefcase, 
  Code, 
  Brain, 
  Share2, 
  User,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    education: 0,
    experience: 0,
    projects: 0,
    skills: 0,
    socialLinks: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          const data = await getUserData(user.uid);
          setUserData(data);
          
          // Calculate stats
          setStats({
            education: Object.keys(data?.education || {}).length,
            experience: Object.keys(data?.experiences || {}).length,
            projects: Object.keys(data?.projects || {}).length,
            skills: data?.skill_categories?Object.values(data.skill_categories).reduce(
              (total, category) => total + (category.skills?.length || 0),
              0
            ): 0,
            // skills: Object.keys(data?.skill_categories?.skills?.skills || {}).length,
            socialLinks: Object.keys(data?.social_links || {}).length
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Education', value: stats.education, icon: GraduationCap, color: 'bg-blue-500' },
    { name: 'Experience', value: stats.experience, icon: Briefcase, color: 'bg-green-500' },
    { name: 'Projects', value: stats.projects, icon: Code, color: 'bg-purple-500' },
    { name: 'Skills', value: stats.skills, icon: Brain, color: 'bg-yellow-500' },
    { name: 'Social Links', value: stats.socialLinks, icon: Share2, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <User className="w-12 h-12" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">
              Welcome back, {userData?.full_name || 'Admin'}!
            </h1>
            <p className="text-purple-100">
              Manage your portfolio content from this dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/projects"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Code className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-gray-700">Add New Project</span>
            </a>
            <a
              href="/admin/experience"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-gray-700">Update Experience</span>
            </a>
            <a
              href="/admin/skills"
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Brain className="w-5 h-5 text-yellow-600 mr-3" />
              <span className="text-gray-700">Manage Skills</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 rounded-lg bg-gray-50">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                <p className="text-xs text-gray-500">Last updated today</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-50">
              <TrendingUp className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Portfolio Analytics</p>
                <p className="text-xs text-gray-500">View performance metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      {userData && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={userData.image_url || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h4 className="text-xl font-semibold text-gray-900">{userData.full_name}</h4>
              <p className="text-gray-600">{userData.bio}</p>
              <p className="text-sm text-gray-500 mt-2">{userData.email}</p>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium text-gray-900">Contact Information</h5>
                <p className="text-gray-600">{userData.contact_info && Object.values(userData.contact_info)[0]?.phone}</p>
              </div>
              <div>
                <h5 className="font-medium text-gray-900">Last Updated</h5>
                <p className="text-gray-600">Today</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}