import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, BarChart3, Users, Star, MessageCircle, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">DonateStream</h1>
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button variant="secondary">داشبورد</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                  ورود
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">مدیریت دونیت‌های استریم خود را آسان کنید</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              با DonateStream می‌توانید دونیت‌ها را به صورت زنده در OBS نمایش دهید، اهداف دونیت تعیین کنید و تجربه بهتری
              برای بینندگان خود فراهم کنید.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  شروع کنید
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  مشاهده دمو
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">ویژگی‌های جدید</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">اعلان دونیت زنده</h3>
                <p className="text-gray-600">نمایش اعلان‌های جذاب برای دونیت‌ها به صورت زنده در استریم شما</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">سیستم امتیازدهی</h3>
                <p className="text-gray-600">کسب امتیاز برای دونیت‌کنندگان و سیستم جوایز</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">چت زنده</h3>
                <p className="text-gray-600">تعامل مستقیم با بینندگان از طریق چت زنده</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">نوار پیشرفت هدف</h3>
                <p className="text-gray-600">تعیین هدف دونیت و نمایش پیشرفت آن به صورت زنده در استریم</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">API های عمومی</h3>
                <p className="text-gray-600">دسترسی برنامه‌نویسی برای توسعه‌دهندگان</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center border">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">لیست دونیت‌کنندگان</h3>
                <p className="text-gray-600">نمایش لیست آخرین دونیت‌کنندگان به صورت زنده در استریم</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">آماده برای شروع هستید؟</h2>
            <p className="text-xl text-gray-600 mb-8">همین الان شروع کنید و تجربه استریم خود را بهبود دهید</p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                شروع رایگان
                <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} DonateStream - تمامی حقوق محفوظ است</p>
        </div>
      </footer>
    </div>
  )
}
