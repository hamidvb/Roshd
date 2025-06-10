import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, TrendingUp, Users, Lightbulb } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">سامانه پروفایل جامع</h1>
              <p className="text-xl text-gray-600">دانش‌آموز</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            سامانه هوشمند رشد همه‌جانبه دانش‌آموزان با تحلیل ۸ بُعد تربیتی و ارائه توصیه‌های شخصی‌سازی شده
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">رشد چندبعدی</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                رصد و تحلیل رشد در ۸ بُعد تربیتی با استفاده از هوش مصنوعی
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <CardTitle className="text-lg">همکاری والدین</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                درگیری فعال والدین در فرآیند رشد و پیشرفت فرزندان
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Lightbulb className="w-12 h-12 text-accent mx-auto mb-4" />
              <CardTitle className="text-lg">توصیه‌های هوشمند</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                ارائه توصیه‌های شخصی‌سازی شده بر اساس تحلیل رفتار و عملکرد
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <GraduationCap className="w-12 h-12 text-success mx-auto mb-4" />
              <CardTitle className="text-lg">مشاوره تخصصی</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                هدایت تحصیلی و مشاوره مبتنی بر داده‌های دقیق و علمی
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Dimensions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">هشت بُعد رشد انسان‌محور</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">رشد دینی و معنوی</h3>
                <p className="text-sm text-gray-600">تعمیق باورها و ارزش‌های معنوی</p>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2">رشد عاطفی و اخلاقی</h3>
                <p className="text-sm text-gray-600">تقویت هوش عاطفی و اخلاق</p>
              </div>
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <h3 className="font-semibold text-accent mb-2">رشد علمی و پژوهشی</h3>
                <p className="text-sm text-gray-600">توسعه مهارت‌های تحقیق و دانش</p>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <h3 className="font-semibold text-success mb-2">رشد اقتصادی و حرفه‌ای</h3>
                <p className="text-sm text-gray-600">آمادگی برای آینده شغلی</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">رشد اجتماعی و سیاسی</h3>
                <p className="text-sm text-gray-600">مهارت‌های اجتماعی و مدنی</p>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <h3 className="font-semibold text-secondary mb-2">رشد میهن‌دوستی</h3>
                <p className="text-sm text-gray-600">عشق به وطن و هویت ملی</p>
              </div>
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <h3 className="font-semibold text-accent mb-2">رشد هنری و زیباشناختی</h3>
                <p className="text-sm text-gray-600">حس زیبایی و خلاقیت</p>
              </div>
              <div className="text-center p-4 bg-success/5 rounded-lg">
                <h3 className="font-semibold text-success mb-2">رشد زیستی و جسمانی</h3>
                <p className="text-sm text-gray-600">سلامت جسم و روح</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button onClick={handleLogin} size="lg" className="text-lg px-8 py-4">
            ورود به سامانه
            <GraduationCap className="w-5 h-5 mr-2" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            با استفاده از حساب کاربری مدرسه وارد شوید
          </p>
        </div>
      </div>
    </div>
  );
}
