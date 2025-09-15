import React from 'react';

const UserForm = ({
  newUser, setNewUser,
  handleSubmitUser,
  isEditing, onCancel,
  users, editingUser,
  errors, setErrors
}) => {

  const validatePhone = (phone) => phone.length === 10;

  const handleBlur = (e) => {
    const { id, value } = e.target;
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [id]: 'This field is required' }));
    } else {
      let error = '';
      if (id === 'phone') {
        if (!validatePhone(value)) {
          error = 'Phone number must be 10 digits';
        } else {
          const existingUser = users.find(u => u.phone === value);
          if (existingUser && (!isEditing || existingUser.id !== editingUser.id)) {
            error = 'This phone number is already taken';
          }
        }
      } else if (id === 'email') {
        const existingUser = users.find(u => u.email.toLowerCase() === value.toLowerCase());
        if (existingUser && (!isEditing || existingUser.id !== editingUser.id)) {
          error = 'This email is already taken';
        }
      } else if (id === 'username') {
        const existingUser = users.find(u => u.username.toLowerCase() === value.toLowerCase());
        if (existingUser && (!isEditing || existingUser.id !== editingUser.id)) {
          error = 'This username is already taken';
        }
      }
      setErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto px-6 py-8 relative border dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 tracking-tight">
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmitUser} className="space-y-8">
          {/* Personal Details */}
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-1 border-gray-300 dark:border-gray-700">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Reusable Input */}
              {[
                { id: "name", label: "Name", placeholder: "Ex: John Doe" },
                { id: "username", label: "Username", placeholder: "Ex: johndoe123" },
                { id: "email", label: "Email", placeholder: "Ex: john@example.com", type: "email" },
                { id: "phone", label: "Phone", placeholder: "1234567890", type: "number" },
                { id: "website", label: "Website", placeholder: "https://example.com", type: "url" }
              ].map(({ id, label, placeholder, type = "text" }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={newUser[id]}
                    onChange={(e) => {
                      const val = id === 'phone' ? e.target.value.replace(/\D/g, '').slice(0,10) : e.target.value;
                      setNewUser({ ...newUser, [id]: val });
                    }}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={id !== "website"}
                  />
                  {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Address */}
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-1 border-gray-300 dark:border-gray-700">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: "street", label: "Street", placeholder: "123 Main St" },
                { id: "suite", label: "Apartment Address", placeholder: "Apt 4B" },
                { id: "city", label: "City", placeholder: "New York" },
                { id: "zipcode", label: "Zipcode", placeholder: "10001" },
                { id: "latitude", label: "Latitude", placeholder: "40.7128" },
                { id: "longitude", label: "Longitude", placeholder: "-74.0060" },
              ].map(({ id, label, placeholder }) => {
                const [key, subkey] = id === "latitude" || id === "longitude"
                  ? ["geo", id === "latitude" ? "lat" : "lng"]
                  : [null, null];

                const value = key
                  ? newUser.address[key][subkey]
                  : newUser.address[id];

                return (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      id={id}
                      type="text"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => {
                        if (key) {
                          setNewUser({
                            ...newUser,
                            address: {
                              ...newUser.address,
                              [key]: { ...newUser.address[key], [subkey]: e.target.value }
                            }
                          });
                        } else {
                          setNewUser({
                            ...newUser,
                            address: { ...newUser.address, [id]: e.target.value }
                          });
                        }
                      }}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={["street", "city", "zipcode"].includes(id)}
                    />
                    {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Company */}
          <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-1 border-gray-300 dark:border-gray-700">Company</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: "company-name", label: "Company Name", placeholder: "Acme Corp", key: "name" },
                { id: "company-catch-phrase", label: "Catch Phrase", placeholder: "Innovative Solutions", key: "catchPhrase" },
                { id: "company-bs", label: "Tagline", placeholder: "Leading the industry", key: "bs" },
              ].map(({ id, label, placeholder, key }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    value={newUser.company[key]}
                    onChange={(e) =>
                      setNewUser({ ...newUser, company: { ...newUser.company, [key]: e.target.value } })
                    }
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors[id] && <p className="text-red-500 text-xs mt-1">{errors[id]}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-300 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {isEditing ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
