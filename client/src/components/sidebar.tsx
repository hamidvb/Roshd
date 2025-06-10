import { Home, User, TrendingUp, CheckSquare, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { icon: Home, label: "داشبورد", href: "#", active: true },
  { icon: User, label: "پروفایل من", href: "#" },
  { icon: TrendingUp, label: "گزارش پیشرفت", href: "#" },
  { icon: CheckSquare, label: "فعالیت‌ها", href: "#" },
  { icon: Bell, label: "اعلان‌ها", href: "#", badge: 3 },
];

const growthDimensions = [
  "رشد دینی و معنوی",
  "رشد عاطفی و اخلاقی", 
  "رشد علمی و پژوهشی",
  "رشد اقتصادی و حرفه‌ای",
];

export default function Sidebar() {
  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside className="w-64 bg-white sidebar-shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">پروفایل جامع</h1>
            <p className="text-sm text-gray-500">دانش‌آموز</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">ابعاد رشد</h3>
          <ul className="space-y-2">
            {growthDimensions.map((dimension) => (
              <li key={dimension}>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                >
                  {dimension}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4 ms-2" />
            خروج از سیستم
          </Button>
        </div>
      </nav>
    </aside>
  );
}
