import { Plus, Users, UserCheck, UserX, Search, Filter, Edit, Trash2, Clock, DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

// Get employee data from database
async function getEmployeeData() {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  try {
    const [employees, attendanceStats] = await Promise.all([
      // Get all employees with their user information
      prisma.employee.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          user: {
            name: 'asc'
          }
        }
      }),
      
      // Get this month's attendance statistics
      prisma.attendance.findMany({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        include: {
          employee: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
    ])

    // Calculate attendance stats for each employee
    const employeesWithAttendance = employees.map(employee => {
      const employeeAttendance = attendanceStats.filter(att => att.employeeId === employee.id)
      const present = employeeAttendance.filter(att => att.checkIn && att.checkOut).length
      const absent = employeeAttendance.filter(att => !att.checkIn).length
      const late = employeeAttendance.filter(att => {
        if (!att.checkIn) return false
        const checkInTime = att.checkIn.getHours() * 60 + att.checkIn.getMinutes()
        const workStartTime = 9 * 60 // 9:00 AM in minutes
        return checkInTime > workStartTime + 15 // More than 15 minutes late
      }).length

      return {
        ...employee,
        name: employee.user.name,
        email: employee.user.email,
        attendance: {
          present,
          absent,
          late
        }
      }
    })

    return { employees: employeesWithAttendance }
  } catch (error) {
    console.error('Employee data fetch error:', error)
    return { employees: [] }
  }
}

const departments = ['All', 'Kitchen', 'Service', 'Management', 'Maintenance']

export default async function EmployeesPage() {
  const { employees } = await getEmployeeData()
  
  // Calculate statistics
  const activeEmployees = employees.filter(emp => emp.isActive).length
  const totalSalary = employees
    .filter(emp => emp.isActive)
    .reduce((sum, emp) => sum + emp.salary, 0)
  const presentToday = employees.filter(emp => emp.isActive).length - 1 // Mock calculation
  const absentToday = 1 // Mock calculation

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employee Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage staff information, attendance, and payroll
          </p>
        </div>
        <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Active Employees</dt>
                <dd className="text-lg font-medium text-gray-900">{activeEmployees}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Monthly Salary</dt>
                <dd className="text-lg font-medium text-gray-900">{formatCurrency(totalSalary)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Present Today</dt>
                <dd className="text-lg font-medium text-gray-900">{presentToday}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserX className="h-8 w-8 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Absent Today</dt>
                <dd className="text-lg font-medium text-gray-900">{absentToday}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - This needs to be converted to a client component for interactivity */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Salary (BDT)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.position}</div>
                  <div className="text-sm text-gray-500">{employee.department}</div>
                  <div className="text-xs text-gray-400">
                    Joined: {formatDate(employee.hireDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{employee.email}</div>
                  <div className="text-sm text-gray-500">No phone available</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(employee.salary)}/month
                  </div>
                  {employee.hourlyRate && (
                    <div className="text-sm text-gray-500">
                      {formatCurrency(employee.hourlyRate)}/hour
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs">
                    <div className="flex items-center text-green-600">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Present: {employee.attendance.present}
                    </div>
                    <div className="flex items-center text-red-600">
                      <UserX className="h-3 w-3 mr-1" />
                      Absent: {employee.attendance.absent}
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Late: {employee.attendance.late}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    employee.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first employee.</p>
        </div>
      )}

      {/* Department Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Department Summary</h3>
            <div className="space-y-4">
              {departments.slice(1).map((dept) => {
                const deptEmployees = employees.filter(emp => emp.department === dept && emp.isActive)
                const deptSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0)
                return (
                  <div key={dept} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{dept}</span>
                      <div className="text-sm text-gray-500">{deptEmployees.length} employees</div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(deptSalary)}
                      </span>
                      <div className="text-sm text-gray-500">monthly</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">Employee checked in</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">New employee added</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
