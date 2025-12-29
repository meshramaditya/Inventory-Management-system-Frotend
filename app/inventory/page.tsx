"use client"

import type React from "react"

import { useState } from "react"
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
import { Package2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

export default function InventoryPage() {
  const { products, setProducts } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add")
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProducts(
      products.map((p) => {
        if (p.id === selectedProduct) {
          const newQuantity = adjustmentType === "add" ? p.quantity + quantity : Math.max(0, p.quantity - quantity)
          const status = newQuantity === 0 ? "out-of-stock" : newQuantity <= p.reorderLevel ? "low-stock" : "in-stock"
          return {
            ...p,
            quantity: newQuantity,
            status: status as "in-stock" | "low-stock" | "out-of-stock",
            lastUpdated: new Date().toISOString().split("T")[0],
          }
        }
        return p
      }),
    )

    setDialogOpen(false)
    setSelectedProduct("")
    setQuantity(0)
    setReason("")
  }

  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStockCount = products.filter((p) => p.status === "low-stock").length
  const outOfStockCount = products.filter((p) => p.status === "out-of-stock").length

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <p className="text-muted-foreground">Track and adjust stock levels</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Package2 className="mr-2 h-4 w-4" />
                    Adjust Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Stock Adjustment</DialogTitle>
                    <DialogDescription>Add or remove items from inventory</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} (Current: {p.quantity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Adjustment Type</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={adjustmentType === "add" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setAdjustmentType("add")}
                        >
                          <ArrowUpCircle className="mr-2 h-4 w-4" />
                          Add Stock
                        </Button>
                        <Button
                          type="button"
                          variant={adjustmentType === "remove" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setAdjustmentType("remove")}
                        >
                          <ArrowDownCircle className="mr-2 h-4 w-4" />
                          Remove Stock
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Received shipment, Damaged goods"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Confirm Adjustment</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Items in Stock</CardDescription>
                  <CardTitle className="text-3xl">{totalItems.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Low Stock Items</CardDescription>
                  <CardTitle className="text-3xl text-orange-600">{lowStockCount}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Out of Stock</CardDescription>
                  <CardTitle className="text-3xl text-destructive">{outOfStockCount}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Stock Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <span className="font-semibold">{product.quantity}</span>
                          </TableCell>
                          <TableCell>{product.reorderLevel}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                product.status === "in-stock"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : product.status === "low-stock"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.lastUpdated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
