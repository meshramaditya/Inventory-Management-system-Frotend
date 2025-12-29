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
import { Plus, FileText, CheckCircle, XCircle } from "lucide-react"

export default function PurchaseOrdersPage() {
  const { purchaseOrders, setPurchaseOrders, suppliers, products } = useStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    supplier: "",
    expectedDate: "",
    productId: "",
    quantity: 0,
    cost: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPO = {
      id: `PO-${String(purchaseOrders.length + 1).padStart(3, "0")}`,
      supplier: formData.supplier,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: formData.expectedDate,
      status: "pending" as const,
      total: formData.quantity * formData.cost,
      items: [{ productId: formData.productId, quantity: formData.quantity, cost: formData.cost }],
    }
    setPurchaseOrders([...purchaseOrders, newPO])

    setDialogOpen(false)
    setFormData({ supplier: "", expectedDate: "", productId: "", quantity: 0, cost: 0 })
  }

  const handleStatusUpdate = (id: string, status: "pending" | "approved" | "received" | "cancelled") => {
    setPurchaseOrders(purchaseOrders.map((po) => (po.id === id ? { ...po, status } : po)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "received":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return ""
    }
  }

  const pendingOrders = purchaseOrders.filter((po) => po.status === "pending").length
  const approvedOrders = purchaseOrders.filter((po) => po.status === "approved").length
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Purchase Orders</h1>
                <p className="text-muted-foreground">Manage orders from suppliers</p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create PO
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Purchase Order</DialogTitle>
                    <DialogDescription>Create a new order from a supplier</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Select
                        value={formData.supplier}
                        onValueChange={(v) => setFormData({ ...formData, supplier: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((s) => (
                            <SelectItem key={s.id} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <Select
                        value={formData.productId}
                        onValueChange={(v) => setFormData({ ...formData, productId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Unit Cost</Label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.cost}
                          onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedDate">Expected Delivery Date</Label>
                      <Input
                        id="expectedDate"
                        type="date"
                        value={formData.expectedDate}
                        onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Create Order</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Pending Orders</CardDescription>
                  <CardTitle className="text-3xl">{pendingOrders}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Approved Orders</CardDescription>
                  <CardTitle className="text-3xl">{approvedOrders}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total PO Value</CardDescription>
                  <CardTitle className="text-3xl">${totalValue.toLocaleString()}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO Number</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Expected Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseOrders.map((po) => (
                        <TableRow key={po.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {po.id}
                            </div>
                          </TableCell>
                          <TableCell>{po.supplier}</TableCell>
                          <TableCell>{po.orderDate}</TableCell>
                          <TableCell>{po.expectedDate}</TableCell>
                          <TableCell>${po.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(po.status)}>
                              {po.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {po.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStatusUpdate(po.id, "approved")}
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              {po.status === "approved" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStatusUpdate(po.id, "received")}
                                  title="Mark as Received"
                                >
                                  <CheckCircle className="h-4 w-4 text-blue-600" />
                                </Button>
                              )}
                              {(po.status === "pending" || po.status === "approved") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleStatusUpdate(po.id, "cancelled")}
                                  title="Cancel"
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
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
