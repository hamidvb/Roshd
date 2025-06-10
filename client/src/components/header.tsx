interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "کاربر";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "کاربر";
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student": return "دانش‌آموز";
      case "parent": return "والدین";
      case "teacher": return "معلم";
      case "counselor": return "مشاور";
      case "admin": return "مدیر";
      default: return "کاربر";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">داشبورد اصلی</h1>
          <p className="text-gray-500">خوش آمدید، {getFullName()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-start">
              <p className="text-sm font-medium text-gray-800">{getFullName()}</p>
              <p className="text-xs text-gray-500">
                {getRoleLabel(user?.role || "student")}
                {user?.student?.grade && ` پایه ${user.student.grade}`}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              {getInitials(user?.firstName, user?.lastName)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
