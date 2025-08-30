import UserSidebar from "../user/UserSidebar";

const UserDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <UserSidebar />

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Welcome to User Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Ini adalah halaman user.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
