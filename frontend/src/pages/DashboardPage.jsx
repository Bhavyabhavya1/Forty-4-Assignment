import { useState } from 'react';
import { useUserContext } from '../context/UserContext';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import Header from '../components/Header';
import { FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { users, loading, error, addUser, deleteUser, updateUser } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', phone: '', website: '', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, company: { name: '', catchPhrase: '', bs: '' } });
  const [errors, setErrors] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email) {
      let hasErrors = false;
      const newErrors = {};

      // Check for duplicate email before submitting
      const existingEmailUser = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (existingEmailUser && (!isEditing || existingEmailUser.id !== editingUser.id)) {
        newErrors.email = "This email is already taken";
        toast.error("This email is already taken");
        hasErrors = true;
      }

      // Check for duplicate username before submitting
      const existingUsernameUser = users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase());
      if (existingUsernameUser && (!isEditing || existingUsernameUser.id !== editingUser.id)) {
        newErrors.username = "This username is already taken";
        toast.error("This username is already taken");
        hasErrors = true;
      }

      // Check for duplicate phone before submitting
      const existingPhoneUser = users.find(u => u.phone === newUser.phone);
      if (existingPhoneUser && (!isEditing || existingPhoneUser.id !== editingUser.id)) {
        newErrors.phone = "This phone number is already taken";
        toast.error("This phone number is already taken");
        hasErrors = true;
      }

      setErrors(newErrors);

      if (hasErrors) {
        return;
      }

      try {
        const userPayload = newUser;
        if (isEditing) {
          await updateUser(editingUser.id, userPayload);
          toast.success("User updated successfully!");
        } else {
          await addUser(userPayload);
          toast.success("User added successfully!");
        }
        setNewUser({ name: '', username: '', email: '', phone: '', website: '', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, company: { name: '', catchPhrase: '', bs: '' } });
        setErrors({});
        setShowForm(false);
        setIsEditing(false);
        setEditingUser(null);
      } catch (error) {
        if (error.message) {
          toast.error(`Failed to save user: ${error.message}`);
        } else {
          toast.error("Failed to save user!");
        }
      }
    }
  };

  const handleEditUser = (user) => {
    setNewUser({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      address: {
        street: user.address.street,
        suite: user.address.suite,
        city: user.address.city,
        zipcode: user.address.zipcode,
        geo: {
          lat: user.address.geo.lat,
          lng: user.address.geo.lng
        }
      },
      company: {
        name: user.company.name,
        catchPhrase: user.company.catchPhrase,
        bs: user.company.bs
      }
    });
    setErrors({});
    setIsEditing(true);
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
    } catch {
      toast.error("Failed to delete user!");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main id="main-content" className="container mx-auto p-6 lg:p-8" role="main">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 hidden md:block">User Dashboard</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEditing(false);
              setEditingUser(null);
              setNewUser({ name: '', username: '', email: '', phone: '', website: '', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, company: { name: '', catchPhrase: '', bs: '' } });
              setErrors({});
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors cursor-pointer"
            aria-controls="add-user-form"
          >
            Add User
          </button>
        </div>

        {users.length > 0 && (
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <label htmlFor="search-users" className="sr-only">Search users by name</label>
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="search-users"
                type="search"
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-lg pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-describedby="search-help"
              />
              <span id="search-help" className="sr-only">Type to filter users by their name</span>
            </div>
          </div>
        )}

        {showForm && (
          <UserForm
            newUser={newUser}
            setNewUser={setNewUser}
            handleSubmitUser={handleSubmitUser}
            isEditing={isEditing}
            onCancel={() => {
              setShowForm(false);
              setIsEditing(false);
              setEditingUser(null);
              setNewUser({ name: '', username: '', email: '', phone: '', website: '', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, company: { name: '', catchPhrase: '', bs: '' } });
              setErrors({});
            }}
            users={users}
            editingUser={editingUser}
            errors={errors}
            setErrors={setErrors}
          />
        )}

        {users.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No users found.</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No users found from your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard key={user.id} user={user} onDelete={handleDeleteUser} onEdit={handleEditUser} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
