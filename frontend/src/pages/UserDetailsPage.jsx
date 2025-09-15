import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchUserById } from "../api/userService";
import { useUserContext } from "../context/UserContext";
import Header from "../components/Header";
import UserForm from "../components/UserForm";
import { IoArrowBack } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const UserDetailsPage = () => {
  const { id } = useParams();
  const { users, updateUser, deleteUser } = useUserContext();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', phone: '', website: '', address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } }, company: { name: '', catchPhrase: '', bs: '' } });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchUserById(id);
        setUser(response.data || response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      setNewUser({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        address: { ...user.address },
        company: { ...user.company }
      });
    }
  }, [user]);

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, newUser);
      // Refetch user data after update
      const response = await fetchUserById(id);
      setUser(response.data || response);
      toast.success("User updated successfully!");
      setShowForm(false);
    } catch (error) {
      toast.error(`Failed to update user: ${error.message}`);
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
      navigate("/");
    } catch {
      toast.error("Failed to delete user!");
    }
  };



  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-center py-8">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main
        id="main-content"
        className="container mx-auto p-5 md:p-8"
        role="main"
      >
        <nav aria-label="Breadcrumb" className="mb-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-0 transition-colors flex items-center"
          >
            <IoArrowBack className="mr-2" /> Back to Dashboard
          </Link>
        </nav>
        <article
          className=" bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 md:p-8 hover:shadow-lg transition-shadow outline-none focus-within:ring-2 focus-within:ring-blue-400"
          tabIndex="0"
        >
          <header className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl mr-4">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {user.name}
              </h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowForm(true);
                  setErrors({});
                }}
                aria-label="Edit User"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
              >
                <FiEdit size={24} />
              </button>
              <button
                onClick={handleDeleteUser}
                aria-label="Delete User"
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
              >
                <FiTrash2 size={24} />
              </button>
            </div>
          </header>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <section aria-labelledby="personal-info" className="mt-3 mb-5">
                <h2 id="personal-info" className="sr-only">
                  Personal Information
                </h2>
                <p className="mb-2">
                  <span className="text-gray-800 dark:text-gray-100 ">
                    User Name:
                  </span>{" "}
                  <span className="text-green-500">{user.username}</span>
                </p>
                <p className="mb-2">
                  <span className="text-gray-800 dark:text-gray-100">
                    Email:
                  </span>{" "}
                  <a
                    href={`mailto:${user.email}`}
                    className="text-green-500 hover:underline"
                  >
                    {user.email}
                  </a>
                </p>
                <p className="mb-2">
                  <span className="text-gray-800 dark:text-gray-100">
                    Phone:
                  </span>{" "}
                  <a
                    href={`tel:${user.phone}`}
                    className="text-green-500 hover:underline"
                  >
                    {user.phone}
                  </a>
                </p>
                <p className="mb-2">
                  <span className="text-gray-800 dark:text-gray-100 ">
                    Website:
                  </span>{" "}
                  <span className="text-green-500">
                    {user.website ? (
                      <a
                        href={`http://${user.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.website}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </span>
                </p>
              </section>
              <section aria-labelledby="address-info" className="mt-3">
                <h2 id="address-info" className="text-xl font-semibold mb-2">
                  Address
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {user.address.street}, {user.address.suite}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {user.address.city}, {user.address.zipcode}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}
                </p>
              </section>
            </div>
            <div className="flex-1">
              <section aria-labelledby="company-info" className="mt-3">
                <h2 id="company-info" className="text-xl font-semibold mb-2">
                  Company
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {user.company.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {user.company.catchPhrase}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {user.company.bs}
                </p>
              </section>
            </div>
          </div>
        </article>
        {showForm && (
          <UserForm
            newUser={newUser}
            setNewUser={setNewUser}
            handleSubmitUser={handleSubmitUser}
            isEditing={true}
            onCancel={() => {
              setShowForm(false);
              setErrors({});
            }}
            users={users}
            editingUser={user}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </main>
    </div>
  );
};

export default UserDetailsPage;
