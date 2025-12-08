import { Link } from "react-router-dom";

const links = [
  { to: "/admin/products", label: "Products", description: "Manage burger items and pricing" },
  { to: "/admin/categories", label: "Categories", description: "Organize menu into categories" },
  { to: "/admin/orders", label: "Orders", description: "Review and update order statuses" },
  { to: "/admin/users", label: "Users", description: "View customers and manage access" },
  { to: "/admin/reports", label: "Sales Reports", description: "Track sales and revenue trends" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Control your BurgerByte POS: products, orders, users, and reports.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400/70 hover:shadow-md"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 sm:text-base">
                  {link.label}
                </p>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {link.description}
                </p>
              </div>
              <p className="mt-3 text-xs font-medium text-amber-600">
                Go to {link.label} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
