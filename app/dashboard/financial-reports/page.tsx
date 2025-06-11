"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserData, getFinancialReports, exportFinancialReport } from "@/lib/api"
import { BarChart3, TrendingUp, DollarSign, Download, PieChart, FileText, CreditCard } from "lucide-react"

export default function FinancialReportsPage() {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData()
        setUser(userData)

        const reportsData = await getFinancialReports(selectedPeriod, selectedYear)
        setReports(reportsData)
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, selectedPeriod, selectedYear])

  const handleExportReport = async (format: "pdf" | "excel") => {
    setExporting(true)
    try {
      await exportFinancialReport(selectedPeriod, selectedYear, format)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setExporting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان"
  }

  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 ml-2 text-purple-600" />
          <h1 className="text-2xl font-bold">گزارش‌های مالی</h1>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">این ماه</SelectItem>
              <SelectItem value="lastMonth">ماه گذشته</SelectItem>
              <SelectItem value="thisYear">امسال</SelectItem>
              <SelectItem value="lastYear">سال گذشته</SelectItem>
              <SelectItem value="custom">سفارشی</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2023, 2022].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => handleExportReport("pdf")} disabled={exporting}>
            <Download className="h-4 w-4 ml-2" />
            {exporting ? "در حال صادرات..." : "صادرات PDF"}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل درآمد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reports?.totalRevenue || 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 ml-1" />+
              {getGrowthPercentage(reports?.totalRevenue || 0, reports?.previousRevenue || 0)}% نسبت به قبل
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تعداد تراکنش‌ها</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.totalTransactions || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 ml-1" />+
              {getGrowthPercentage(reports?.totalTransactions || 0, reports?.previousTransactions || 0)}% نسبت به قبل
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">میانگین دونیت</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reports?.averageDonation || 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 ml-1" />+
              {getGrowthPercentage(reports?.averageDonation || 0, reports?.previousAverageDonation || 0)}% نسبت به قبل
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کارمزد پرداختی</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(reports?.totalFees || 0)}</div>
            <div className="text-xs text-muted-foreground">
              {(((reports?.totalFees || 0) / (reports?.totalRevenue || 1)) * 100).toFixed(1)}% از کل درآمد
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
          <TabsTrigger value="methods">روش‌های پرداخت</TabsTrigger>
          <TabsTrigger value="tax">مالیات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>روند درآمد ماهانه</CardTitle>
                <CardDescription>درآمد در 12 ماه گذشته</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports?.monthlyRevenue?.map((month: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-sm">{month.name}</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${(month.amount / (reports.maxMonthlyRevenue || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium w-20 text-left">{formatCurrency(month.amount)}</div>
                      </div>
                    </div>
                  )) || <div className="text-center py-8 text-gray-500">داده‌ای برای نمایش وجود ندارد</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>بهترین دونیت‌کنندگان</CardTitle>
                <CardDescription>پرداخت‌کنندگان برتر در این دوره</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports?.topDonors?.map((donor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{donor.name}</div>
                          <div className="text-sm text-gray-500">{donor.donations} دونیت</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{formatCurrency(donor.amount)}</div>
                      </div>
                    </div>
                  )) || <div className="text-center py-8 text-gray-500">داده‌ای برای نمایش وجود ندارد</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تحلیل روزانه</CardTitle>
              <CardDescription>درآمد و تراکنش‌های روزانه</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports?.dailyAnalysis?.map((day: any, index: number) => (
                  <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div>
                      <div className="text-sm text-gray-500">تاریخ</div>
                      <div className="font-medium">{day.date}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">درآمد</div>
                      <div className="font-medium">{formatCurrency(day.revenue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">تراکنش‌ها</div>
                      <div className="font-medium">{day.transactions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">میانگین</div>
                      <div className="font-medium">{formatCurrency(day.average)}</div>
                    </div>
                  </div>
                )) || <div className="text-center py-8 text-gray-500">داده‌ای برای نمایش وجود ندارد</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>لیست تراکنش‌ها</CardTitle>
              <CardDescription>جزئیات تمام تراکنش‌های مالی</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports?.transactions?.map((transaction: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{transaction.donorName}</div>
                        <div className="text-sm text-gray-500">
                          {transaction.date} • {transaction.paymentMethod}
                        </div>
                        {transaction.message && (
                          <div className="text-sm text-gray-600 italic">"{transaction.message}"</div>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                      <div className="text-sm text-gray-500">کارمزد: {formatCurrency(transaction.fee)}</div>
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {transaction.status === "completed" ? "تکمیل شده" : "ناموفق"}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-center py-8 text-gray-500">تراکنشی برای نمایش وجود ندارد</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>توزیع روش‌های پرداخت</CardTitle>
                <CardDescription>درصد استفاده از هر روش پرداخت</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports?.paymentMethods?.map((method: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{method.name}</span>
                        <span className="text-sm text-gray-500">{method.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{method.count} تراکنش</span>
                        <span>{formatCurrency(method.amount)}</span>
                      </div>
                    </div>
                  )) || <div className="text-center py-8 text-gray-500">داده‌ای برای نمایش وجود ندارد</div>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>کارمزد روش‌های پرداخت</CardTitle>
                <CardDescription>مقایسه کارمزدهای پرداختی</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports?.paymentFees?.map((fee: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{fee.method}</div>
                        <div className="text-sm text-gray-500">{fee.rate}% کارمزد</div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{formatCurrency(fee.totalFee)}</div>
                        <div className="text-sm text-gray-500">{fee.transactions} تراکنش</div>
                      </div>
                    </div>
                  )) || <div className="text-center py-8 text-gray-500">داده‌ای برای نمایش وجود ندارد</div>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>گزارش مالیاتی</CardTitle>
              <CardDescription>اطلاعات مورد نیاز برای اظهارنامه مالیاتی</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">کل درآمد مشمول مالیات</div>
                    <div className="text-xl font-bold">{formatCurrency(reports?.taxableIncome || 0)}</div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">کل کارمزدهای قابل کسر</div>
                    <div className="text-xl font-bold">{formatCurrency(reports?.deductibleFees || 0)}</div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-gray-500">درآمد خالص</div>
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency((reports?.taxableIncome || 0) - (reports?.deductibleFees || 0))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      این گزارش صرفاً جهت اطلاع است و نمی‌تواند جایگزین مشاوره مالیاتی حرفه‌ای باشد.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportReport("excel")}
                      disabled={exporting}
                    >
                      <Download className="h-4 w-4 ml-2" />
                      دانلود گزارش مالیاتی (Excel)
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleExportReport("pdf")}
                      disabled={exporting}
                    >
                      <FileText className="h-4 w-4 ml-2" />
                      دانلود گزارش مالیاتی (PDF)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تفکیک درآمد بر اساس ماه</CardTitle>
              <CardDescription>جزئیات درآمد ماهانه برای اظهارنامه</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">ماه</th>
                      <th className="text-center p-2">کل درآمد</th>
                      <th className="text-center p-2">کارمزد</th>
                      <th className="text-center p-2">درآمد خالص</th>
                      <th className="text-center p-2">تعداد تراکنش</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.monthlyTaxReport?.map((month: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{month.month}</td>
                        <td className="text-center p-2">{formatCurrency(month.grossIncome)}</td>
                        <td className="text-center p-2">{formatCurrency(month.fees)}</td>
                        <td className="text-center p-2 font-medium">{formatCurrency(month.netIncome)}</td>
                        <td className="text-center p-2">{month.transactions}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          داده‌ای برای نمایش وجود ندارد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
