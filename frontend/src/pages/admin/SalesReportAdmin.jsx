import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function SalesReportAdmin() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    axiosClient
      .get(`/admin/reports/sales?${params.toString()}`)
      .then((res) => setReport(res.data))
      .catch(() => setError("Failed to load report"));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Sales report
            </h1>
            <p className="text-sm text-slate-500">
              View total sales and order counts for a selected date range.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                />
              </div>
            </div>

            <button
              onClick={load}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400 transition w-full sm:w-auto"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Report */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-auto">
            {report.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No sales data for the selected range.
              </p>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Group</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Total sales
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row) => (
                    <tr
                      key={row._id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-4 py-3 text-sm text-slate-800">
                        {row._id}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        ₹{row.totalSales}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-slate-800">
                        {row.orderCount} orders
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
