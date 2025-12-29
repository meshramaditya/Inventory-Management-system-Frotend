"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { DollarSign, Package, TrendingUp, AlertCircle, ShoppingCart } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

export default function ReportsPage() {
  const { products, sales, purchaseOrders } = useStore()

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
  const totalProducts = products.length
  const inventoryValue = products.reduce((sum, p) => sum + p.quantity * p.cost, 0)
  const lowStockItems = products.filter((p) => p.status === "low-stock" || p.status === "out-of-stock").length
  const openPurchaseOrders = purchaseOrders.filter((po) => po.status === "pending" || po.status === "approved")
  const inboundInventoryValue = openPurchaseOrders.reduce((sum, po) => sum + po.total, 0)

  // Top products by sales
  const productSales = sales.flatMap((s) => s.products)
  const salesByProduct = productSales.reduce(
    (acc, item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        acc[product.name] = (acc[product.name] || 0) + item.quantity * item.price
      }
      return acc
    },
    {} as Record<string, number>,
  )
  const topProducts = Object.entries(salesByProduct)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Stock status distribution
  const stockStatus = [
    { name: "In Stock", value: products.filter((p) => p.status === "in-stock").length, color: "hsl(var(--chart-1))" },
    { name: "Low Stock", value: products.filter((p) => p.status === "low-stock").length, color: "hsl(var(--chart-4))" },
    {
      name: "Out of Stock",
      value: products.filter((p) => p.status === "out-of-stock").length,
      color: "hsl(var(--destructive))",
    },
  ]

  // Category distribution
  const categoryData = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const categoryChart = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  // Mock monthly data
  const monthlyData = [
    { month: "Aug", sales: 12000, purchases: 8000 },
    { month: "Sep", sales: 15000, purchases: 9000 },
    { month: "Oct", sales: 13500, purchases: 7500 },
    { month: "Nov", sales: 18000, purchases: 10000 },
    { month: "Dec", sales: 21000, purchases: 11000 },
    { month: "Jan", sales: 16000, purchases: 9500 },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">Comprehensive business insights and metrics</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    15% vs last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Active SKUs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Current stock value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Open Purchase Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{openPurchaseOrders.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {`$${inboundInventoryValue.toLocaleString()} inbound value`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sales vs Purchases</CardTitle>
                  <CardDescription>6 month trend comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Sales" />
                      <Line
                        type="monotone"
                        dataKey="purchases"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Purchases"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>By revenue generated</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stock Status Distribution</CardTitle>
                  <CardDescription>Current inventory health</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={stockStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {stockStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products by Category</CardTitle>
                  <CardDescription>Category distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryChart}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
