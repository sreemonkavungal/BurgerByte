import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function SalesReportAdmin() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const res = await axiosClient.get(
        `/api/admin/reports/sales?${params.toString()}`
      );

      setReport(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load sales report", err);
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Sales Report
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
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  From
                </label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                />
              </div>

              <div className="w-full sm:w-auto">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  To
                </label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none"
                />
              </div>
            </div>

            <button
              onClick={loadReport}
              disabled={loading}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition w-full sm:w-auto ${
                loading
                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                  : "bg-amber-500 text-slate-900 hover:bg-amber-400"
              }`}
            >
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        </div>

        {/* Report Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-500">
              Loading sales data…
            </p>
          ) : report.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No sales data for the selected range.
            </p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Group</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Total Sales
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
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
                      <td className="px-4 py-3 text-slate-800">
                        {row._id}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        ₹{row.totalSales}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-800">
                        {row.orderCount} orders
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
