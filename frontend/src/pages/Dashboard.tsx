import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavigationTest } from "@/components/NavigationTest";
import { QuickActionCard } from "@/components/QuickActionCard";
import {
  Package,
  Tags,
  Users,
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  lowStockProducts: number;
  totalInventoryValue: number;
  totalIssuances: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard statistics");
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: "Items in inventory",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      description: "Product categories",
      icon: Tags,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Suppliers",
      value: stats.totalSuppliers,
      description: "Active suppliers",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockProducts,
      description: "Items need restocking",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: stats.lowStockProducts > 0 ? "up" : "down",
    },
    {
      title: "Inventory Value",
      value: `$${stats.totalInventoryValue.toLocaleString()}`,
      description: "Total value of stock",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Issuances",
      value: stats.totalIssuances,
      description: "Items issued",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Overview of your inventory system
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-md ${card.bgColor}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                    {card.trend && (
                      <div className="flex items-center mt-2">
                        {card.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        )}
                        <span
                          className={`text-xs ${
                            card.trend === "up"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {card.trend === "up"
                            ? "Attention needed"
                            : "All good"}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alerts Section */}
          {stats.lowStockProducts > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription className="text-red-600">
                  You have {stats.lowStockProducts} items that need to be
                  restocked soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  Consider reviewing your inventory levels and placing orders
                  for items below their reorder level.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                title="Manage Products"
                description="Add, edit, or view products"
                icon={Package}
                path="/products"
                iconColor="text-blue-600"
                hoverBorderColor="border-blue-200"
              />
              <QuickActionCard
                title="Record Issuance"
                description="Issue items to departments"
                icon={FileText}
                path="/issuance"
                iconColor="text-green-600"
                hoverBorderColor="border-green-200"
              />
              <QuickActionCard
                title="View Reports"
                description="Generate inventory reports"
                icon={AlertTriangle}
                path="/reports"
                iconColor="text-red-600"
                hoverBorderColor="border-red-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
