"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { Package, TrendingDown, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export default function DashboardPage() {
  const { products, sales } = useStore()

  // Calculate stats
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.status === "low-stock").length
  const outOfStockProducts = products.filter((p) => p.status === "out-of-stock").length
  const totalInventoryValue = products.reduce((sum, p) => sum + p.quantity * p.cost, 0)
  const totalSalesValue = sales.reduce((sum, s) => sum + s.total, 0)

  // Mock data for charts
  const salesData = [
    { name: "Jan 10", sales: 4500 },
    { name: "Jan 11", sales: 3800 },
    { name: "Jan 12", sales: 5200 },
    { name: "Jan 13", sales: 4100 },
    { name: "Jan 14", sales: 6300 },
    { name: "Jan 15", sales: 5500 },
  ]

  const categoryData = [
    { name: "Electronics", value: 25 },
    { name: "Accessories", value: 48 },
    { name: "Software", value: 12 },
    { name: "Office", value: 65 },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Overview of your inventory and sales</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{totalProducts}</div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Active SKUs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
                  <p className="text-[10px] sm:text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                    12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">{lowStockProducts}</div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Need reordering</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-destructive">{outOfStockProducts}</div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Urgent attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Sales Trend</CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                    {`$${totalSalesValue.toLocaleString()} closed in the last 48 hours`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={salesData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} className="sm:text-xs" />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} className="sm:text-xs" />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Products by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={categoryData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} className="sm:text-xs" />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} className="sm:text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {products
                    .filter((p) => p.status === "low-stock" || p.status === "out-of-stock")
                    .map((product) => (
                      <div key={product.id} className="flex items-center justify-between border-b pb-3 sm:pb-4 last:border-0">
                        <div>
                          <p className="text-sm sm:text-base font-medium">{product.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-xs sm:text-sm font-medium ${
                              product.status === "out-of-stock" ? "text-destructive" : "text-orange-600"
                            }`}
                          >
                            {product.quantity} units
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Reorder at {product.reorderLevel}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
