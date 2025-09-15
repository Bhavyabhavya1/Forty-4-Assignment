import { Link } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';

const UserCard = ({ user, onDelete, onEdit }) => {
  return (
    <article
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 p-6 relative group focus-within:ring-2 focus-within:ring-blue-400"
      tabIndex="0"
      aria-labelledby={`user-name-${user.id}`}
    >
      {/* Edit Button */}
      <button
        onClick={() => onEdit(user)}
        aria-label={`Edit user ${user.name}`}
        className="absolute top-4 right-14 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiEdit size={18} />
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(user.id)}
        aria-label={`Delete user ${user.name}`}
        className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <FiTrash2 size={18} />
      </button>

      {/* Content */}
      <h3
        id={`user-name-${user.id}`}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight"
      >
        {user.name}
      </h3>

      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4">
        <p><span className="font-semibold">Username:</span> {user.username || 'N/A'}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Phone:</span> {user.phone}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Link
          to={`/user/${user.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          aria-label={`View details for ${user.name}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default UserCard;
