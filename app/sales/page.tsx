"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/useAuth"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { Plus, ShoppingBag, X } from "lucide-react"

export default function SalesPage() {
  useAuth()
  const { sales, setSales, products } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [cart, setCart] = useState<{ productId: string; quantity: number; price: number }[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("Cash")

  const handleAddToCart = () => {
    if (!selectedProduct) return
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = cart.find((item) => item.productId === selectedProduct)
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === selectedProduct ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      )
    } else {
      setCart([...cart, { productId: selectedProduct, quantity, price: product.price }])
    }
    setSelectedProduct("")
    setQuantity(1)
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const newSale = {
      id: `SAL-${String(sales.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
      products: cart,
      total,
      paymentMethod,
      status: "completed" as const,
    }
    setSales([...sales, newSale])

    setDialogOpen(false)
    setCart([])
    setPaymentMethod("Cash")
  }

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0)
  const todaySales = sales.filter((s) => s.date === new Date().toISOString().split("T")[0]).length
  const cartTotal = cart.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-3 sm:p-4 md:p-6">
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Sales</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Record and manage sales transactions</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto" onClick={() => setCart([])}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Sale
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Record Sale</DialogTitle>
                    <DialogDescription className="text-sm">Add products to create a sale transaction</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="product">Product</Label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .filter((p) => p.quantity > 0)
                              .map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} - ${p.price} (Stock: {p.quantity})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Qty</Label>
                        <div className="flex gap-2">
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                          />
                          <Button type="button" onClick={handleAddToCart}>
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>

                    {cart.length > 0 && (
                      <div className="space-y-2">
                        <Label>Cart Items</Label>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {cart.map((item) => {
                                const product = products.find((p) => p.id === item.productId)
                                return (
                                  <TableRow key={item.productId}>
                                    <TableCell>{product?.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>${item.price.toFixed(2)}</TableCell>
                                    <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveFromCart(item.productId)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">
                                  Total:
                                </TableCell>
                                <TableCell className="font-bold">${cartTotal.toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="payment">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Mobile Payment">Mobile Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={cart.length === 0}>
                        Complete Sale
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs sm:text-sm">Total Sales</CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">${totalSales.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs sm:text-sm">Today&apos;s Sales</CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{todaySales}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="text-xs sm:text-sm">Total Transactions</CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{sales.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sale ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                              {sale.id}
                            </div>
                          </TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.products.length} items</TableCell>
                          <TableCell>{sale.paymentMethod}</TableCell>
                          <TableCell className="font-semibold">${sale.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                sale.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                              }
                            >
                              {sale.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {sales.map((sale) => (
                    <Card key={sale.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-sm">{sale.id}</h3>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              sale.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                            }
                          >
                            {sale.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium">{sale.date}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Items:</span>
                            <p className="font-medium">{sale.products.length} items</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Payment:</span>
                            <p className="font-medium">{sale.paymentMethod}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total:</span>
                            <p className="font-semibold">${sale.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
