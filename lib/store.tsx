"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff"
}

interface Product {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  price: number
  cost: number
  reorderLevel: number
  supplier: string
  status: "in-stock" | "low-stock" | "out-of-stock"
  lastUpdated: string
}

interface Category {
  id: string
  name: string
  description: string
  productCount: number
}

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
}

interface PurchaseOrder {
  id: string
  supplier: string
  orderDate: string
  expectedDate: string
  status: "pending" | "approved" | "received" | "cancelled"
  total: number
  items: { productId: string; quantity: number; cost: number }[]
}

interface Sale {
  id: string
  date: string
  products: { productId: string; quantity: number; price: number }[]
  total: number
  paymentMethod: string
  status: "completed" | "pending" | "cancelled"
}

interface StoreContextType {
  user: User | null
  setUser: (user: User | null) => void
  products: Product[]
  setProducts: (products: Product[]) => void
  categories: Category[]
  setCategories: (categories: Category[]) => void
  suppliers: Supplier[]
  setSuppliers: (suppliers: Supplier[]) => void
  purchaseOrders: PurchaseOrder[]
  setPurchaseOrders: (orders: PurchaseOrder[]) => void
  sales: Sale[]
  setSales: (sales: Sale[]) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: 'Laptop Pro 15"',
    sku: "LPT-001",
    category: "Electronics",
    quantity: 45,
    price: 1299,
    cost: 899,
    reorderLevel: 10,
    supplier: "Tech Suppliers Inc",
    status: "in-stock",
    lastUpdated: "2025-01-15",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    sku: "MSE-002",
    category: "Accessories",
    quantity: 8,
    price: 29.99,
    cost: 15,
    reorderLevel: 20,
    supplier: "Tech Suppliers Inc",
    status: "low-stock",
    lastUpdated: "2025-01-14",
  },
  {
    id: "3",
    name: "USB-C Cable",
    sku: "CBL-003",
    category: "Accessories",
    quantity: 0,
    price: 12.99,
    cost: 5,
    reorderLevel: 50,
    supplier: "Cable Co",
    status: "out-of-stock",
    lastUpdated: "2025-01-13",
  },
  {
    id: "4",
    name: 'Monitor 27"',
    sku: "MON-004",
    category: "Electronics",
    quantity: 23,
    price: 399,
    cost: 250,
    reorderLevel: 5,
    supplier: "Display World",
    status: "in-stock",
    lastUpdated: "2025-01-15",
  },
]

const mockCategories: Category[] = [
  { id: "1", name: "Electronics", description: "Electronic devices and components", productCount: 25 },
  { id: "2", name: "Accessories", description: "Computer accessories and peripherals", productCount: 48 },
  { id: "3", name: "Software", description: "Software licenses and subscriptions", productCount: 12 },
  { id: "4", name: "Office Supplies", description: "General office supplies", productCount: 65 },
]

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Tech Suppliers Inc",
    contact: "John Smith",
    email: "john@techsuppliers.com",
    phone: "555-0101",
    address: "123 Tech Street, Silicon Valley, CA",
  },
  {
    id: "2",
    name: "Cable Co",
    contact: "Sarah Johnson",
    email: "sarah@cableco.com",
    phone: "555-0102",
    address: "456 Wire Ave, Los Angeles, CA",
  },
  {
    id: "3",
    name: "Display World",
    contact: "Mike Chen",
    email: "mike@displayworld.com",
    phone: "555-0103",
    address: "789 Screen Blvd, San Francisco, CA",
  },
]

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    supplier: "Tech Suppliers Inc",
    orderDate: "2025-01-10",
    expectedDate: "2025-01-20",
    status: "pending",
    total: 15000,
    items: [{ productId: "1", quantity: 10, cost: 899 }],
  },
  {
    id: "PO-002",
    supplier: "Cable Co",
    orderDate: "2025-01-12",
    expectedDate: "2025-01-18",
    status: "approved",
    total: 500,
    items: [{ productId: "3", quantity: 100, cost: 5 }],
  },
]

const mockSales: Sale[] = [
  {
    id: "SAL-001",
    date: "2025-01-15",
    products: [{ productId: "1", quantity: 2, price: 1299 }],
    total: 2598,
    paymentMethod: "Credit Card",
    status: "completed",
  },
  {
    id: "SAL-002",
    date: "2025-01-15",
    products: [
      { productId: "2", quantity: 5, price: 29.99 },
      { productId: "4", quantity: 1, price: 399 },
    ],
    total: 548.95,
    paymentMethod: "Cash",
    status: "completed",
  },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "1",
    name: "Admin User",
    email: "admin@inventory.com",
    role: "admin",
  })
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders)
  const [sales, setSales] = useState<Sale[]>(mockSales)

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        products,
        setProducts,
        categories,
        setCategories,
        suppliers,
        setSuppliers,
        purchaseOrders,
        setPurchaseOrders,
        sales,
        setSales,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
