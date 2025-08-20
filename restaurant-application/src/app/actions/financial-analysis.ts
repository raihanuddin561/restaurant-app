'use server'

import { prisma } from '@/lib/prisma'

export interface FinancialDataInput {
  date: Date
  period: 'today' | 'week' | 'month'
}

export interface ComprehensiveFinancialData {
  date: string
  
  // Revenue Data
  dailySales: number
  totalOrders: number
  averageOrderValue: number
  
  // Expense Data
  stockExpenses: number           // Money spent buying inventory
  employeeExpenses: number        // Salaries, wages, benefits
  operationalExpenses: number     // Rent, utilities, other expenses
  totalExpenses: number
  
  // Inventory Data
  currentStockValue: number       // Value of current inventory
  stockMovement: number           // Stock purchased vs used
  stockTurnover: number
  
  // Calculated Metrics
  grossProfit: number             // Sales - Cost of Goods Sold
  netProfit: number               // Gross Profit - All Expenses
  profitMargin: number            // Net Profit / Sales * 100
  
  // Balance Sheet Items
  totalAssets: number
  totalLiabilities: number
  equity: number
  
  // Cash Flow
  cashInflow: number
  cashOutflow: number
  netCashFlow: number
}

export async function getComprehensiveFinancialData({ date, period }: FinancialDataInput) {
  try {
    // Calculate date range based on period
    let startDate: Date
    let endDate: Date

    const selectedDate = new Date(date)
    endDate = new Date(selectedDate)
    endDate.setHours(23, 59, 59, 999)

    switch (period) {
      case 'today':
        startDate = new Date(selectedDate)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate = new Date(selectedDate)
        startDate.setDate(startDate.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'month':
        startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59, 999)
        break
      default:
        startDate = new Date(selectedDate)
        startDate.setHours(0, 0, 0, 0)
    }

    // 1. GET SALES DATA (Revenue)
    const salesData = await prisma.sale.aggregateRaw([
      {
        $match: {
          saleDate: {
            $gte: startDate,
            $lte: endDate
          },
          status: { $ne: 'REFUNDED' }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$finalAmount' },
          totalOrders: { $sum: 1 },
          averageOrder: { $avg: '$finalAmount' }
        }
      }
    ])

    const salesResult = Array.isArray(salesData) && salesData.length > 0 ? salesData[0] : {
      totalSales: 0,
      totalOrders: 0,
      averageOrder: 0
    }

    // 2. GET EXPENSE DATA
    const expenseData = await prisma.expense.groupBy({
      by: ['type'],
      where: {
        date: {
          gte: startDate,
          lte: endDate
        },
        status: 'PAID'
      },
      _sum: {
        amount: true
      }
    })

    // Categorize expenses
    let stockExpenses = 0
    let employeeExpenses = 0  
    let operationalExpenses = 0

    expenseData.forEach(expense => {
      const amount = expense._sum.amount || 0
      switch (expense.type) {
        case 'STOCK':
          stockExpenses += amount
          break
        case 'PAYROLL':
          employeeExpenses += amount
          break
        case 'OPERATIONAL':
        case 'UTILITIES':
        case 'RENT':
        case 'MAINTENANCE':
        case 'INSURANCE':
          operationalExpenses += amount
          break
      }
    })

    const totalExpenses = stockExpenses + employeeExpenses + operationalExpenses

    // 3. GET INVENTORY DATA
    const inventoryData = await prisma.item.aggregate({
      where: {
        isActive: true
      },
      _sum: {
        currentStock: true
      }
    })

    // Calculate inventory value
    const inventoryItems = await prisma.item.findMany({
      where: { isActive: true },
      select: {
        currentStock: true,
        costPrice: true
      }
    })

    const currentStockValue = inventoryItems.reduce((total, item) => {
      return total + (item.currentStock * item.costPrice)
    }, 0)

    // 4. CALCULATE FINANCIAL METRICS
    const dailySales = salesResult.totalSales || 0
    const totalOrders = salesResult.totalOrders || 0
    const averageOrderValue = salesResult.averageOrder || 0

    // Cost of Goods Sold = Stock expenses for the period
    const costOfGoodsSold = stockExpenses
    
    // Gross Profit = Sales - COGS
    const grossProfit = dailySales - costOfGoodsSold
    
    // Net Profit = Gross Profit - Operating Expenses
    const netProfit = grossProfit - employeeExpenses - operationalExpenses
    
    // Profit Margin = (Net Profit / Sales) * 100
    const profitMargin = dailySales > 0 ? (netProfit / dailySales) * 100 : 0

    // Stock Movement and Turnover
    const stockMovement = -stockExpenses // Negative because it's money going out
    const stockTurnover = currentStockValue > 0 ? costOfGoodsSold / currentStockValue : 0

    // 5. BALANCE SHEET CALCULATIONS
    // Assets = Inventory + Cash (estimated from net profit)
    const totalAssets = currentStockValue + Math.max(0, netProfit)
    
    // Liabilities = Outstanding expenses (simplified)
    const totalLiabilities = totalExpenses * 0.1 // Assuming 10% outstanding
    
    // Equity = Assets - Liabilities
    const equity = totalAssets - totalLiabilities

    // 6. CASH FLOW
    const cashInflow = dailySales
    const cashOutflow = totalExpenses
    const netCashFlow = cashInflow - cashOutflow

    const result: ComprehensiveFinancialData = {
      date: date.toISOString().split('T')[0],
      
      // Revenue
      dailySales,
      totalOrders,
      averageOrderValue,
      
      // Expenses
      stockExpenses,
      employeeExpenses,
      operationalExpenses,
      totalExpenses,
      
      // Inventory
      currentStockValue,
      stockMovement,
      stockTurnover,
      
      // Profitability
      grossProfit,
      netProfit,
      profitMargin,
      
      // Balance Sheet
      totalAssets,
      totalLiabilities,
      equity,
      
      // Cash Flow
      cashInflow,
      cashOutflow,
      netCashFlow
    }

    return {
      success: true,
      data: result
    }

  } catch (error) {
    console.error('Error calculating comprehensive financial data:', error)
    return {
      success: false,
      error: 'Failed to calculate financial data',
      data: null
    }
  }
}

// Quick Action Functions
export async function recordStockInput(data: {
  itemId: string
  quantity: number
  costPrice: number
  supplierInvoice?: string
  date?: Date
}) {
  try {
    const { itemId, quantity, costPrice, supplierInvoice, date = new Date() } = data
    
    // Update inventory
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        currentStock: {
          increment: quantity
        },
        costPrice: costPrice // Update with latest cost price
      }
    })

    // Create inventory log
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (adminUser) {
      await prisma.inventoryLog.create({
        data: {
          itemId,
          userId: adminUser.id,
          type: 'RECEIVED',
          quantity,
          reason: supplierInvoice ? `Stock received - Invoice: ${supplierInvoice}` : 'Stock received',
          date
        }
      })
    }

    // Create stock expense
    const totalCost = quantity * costPrice
    await prisma.expense.create({
      data: {
        amount: totalCost,
        type: 'STOCK',
        description: `Stock purchase: ${updatedItem.name} - ${quantity} ${updatedItem.unit}`,
        date,
        category: 'Inventory Purchase',
        status: 'PAID'
      }
    })

    return {
      success: true,
      message: `Stock added successfully. ${quantity} ${updatedItem.unit} of ${updatedItem.name}`,
      expense: totalCost
    }
  } catch (error) {
    console.error('Error recording stock input:', error)
    return {
      success: false,
      error: 'Failed to record stock input'
    }
  }
}

export async function recordEmployeeExpense(data: {
  employeeId: string
  amount: number
  type: 'SALARY' | 'WAGES' | 'BONUS' | 'ALLOWANCE'
  description: string
  date?: Date
}) {
  try {
    const { employeeId, amount, type, description, date = new Date() } = data
    
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return {
        success: false,
        error: 'Employee not found'
      }
    }

    // Create expense record
    await prisma.expense.create({
      data: {
        amount,
        type: 'PAYROLL',
        description: `${type}: ${employee.name} - ${description}`,
        date,
        category: 'Employee Expense',
        status: 'PAID',
        employeeId
      }
    })

    return {
      success: true,
      message: `Employee expense recorded: ${type} for ${employee.name}`
    }
  } catch (error) {
    console.error('Error recording employee expense:', error)
    return {
      success: false,
      error: 'Failed to record employee expense'
    }
  }
}

export async function getFinancialSummary(period: 'week' | 'month' | 'quarter') {
  try {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3
        startDate = new Date(now.getFullYear(), quarterStart, 1)
        break
    }

    const result = await getComprehensiveFinancialData({
      date: now,
      period: period === 'week' ? 'week' : 'month'
    })

    return result
  } catch (error) {
    console.error('Error getting financial summary:', error)
    return {
      success: false,
      error: 'Failed to get financial summary'
    }
  }
}
