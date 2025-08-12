import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { Payment } from "../../types/customer";

const DEMO_STORAGE_KEY = "rental_pay";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load from API, but fall back to localStorage demo payments if fetch fails
  useEffect(() => {
    let mounted = true;
    fetch("/api/payment", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("API fetch failed");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        // Expecting either an object with payments or an array
        const apiPayments: Payment[] = data?.payments ?? data ?? [];
        setPayments(apiPayments);
        setLoading(false);
      })
      .catch(() => {
        // fallback: load demo payments from localStorage or seed one
        const stored = localStorage.getItem(DEMO_STORAGE_KEY);
        if (stored) {
          setPayments(JSON.parse(stored));
        } else {
          const seed: Payment[] = [
            {
              id: `${Date.now()}`,
              invoiceId: "inv__1",
              rentalId: "rent__1",
              type: "rental",
              amount: "₹120.00",
              method: "demo_card",
              status: "completed",
              date: new Date().toISOString().slice(0, 10),
            } as unknown as Payment,
          ];
          setPayments(seed);
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(seed));
        }
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Helper to save demo payments to localStorage
  const persistDemoPayments = (arr: Payment[]) => {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn("Could not persist demo payments", e);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === "all") return true;
    return payment.status === filterStatus;
  });

  const pagination = usePagination<Payment>({
    data: filteredPayments,
    itemsPerPage: 10,
  });

  // --- FRONTEND-ONLY demo payment creation (no backend) ---
  const createFrontendDemoPayment = (invoiceId?: string) => {
    const newPayment: Payment = {
      id: `${Date.now()}`,
      invoiceId: invoiceId || `inv__${Math.floor(Math.random() * 1000)}`,
      rentalId: `rent__${Math.floor(Math.random() * 1000)}`,
      type: "rental",
      amount: `$₹{(Math.round((50 + Math.random() * 300) * 100) / 100).toFixed(
        2
      )}`,
      method: "demo_card",
      status: Math.random() > 0.1 ? "completed" : "pending", // mostly completed
      date: new Date().toISOString().slice(0, 10),
    } as unknown as Payment;

    setPayments((prev) => {
      const next = [newPayment, ...prev];
      persistDemoPayments(next);
      return next;
    });
  };

  // Button-handler that optionally prompts for invoice id, then creates demo payment
  const handleSimulatePaymentClick = () => {
    const invoiceId = window.prompt(
      "Enter invoice id for demo payment (optional)",
      payments[0]?.invoiceId ?? "inv_demo"
    );
    createFrontendDemoPayment(invoiceId || undefined);
  };

  // --- EXPORT (CSV) ---
  const exportPaymentsCSV = (toExport: Payment[]) => {
    if (!toExport || toExport.length === 0) {
      alert("No payments to export");
      return;
    }

    // Choose the fields you'd like to export
    const headers = [
      "id",
      "invoiceId",
      "rentalId",
      "type",
      "amount",
      "method",
      "status",
      "date",
    ];

    const csvRows = [
      headers.join(","), // header row
      ...toExport.map((p) =>
        headers
          .map((h) => {
            // safe accessor, convert undefined to empty string, escape quotes
            const v = (p as any)[h] ?? "";
            const s = String(v).replace(/"/g, '""'); // escape quotes
            return `"₹{s}"`;
          })
          .join(",")
      ),
    ];

    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportClick = () => exportPaymentsCSV(filteredPayments);

  const handleDownloadReceipt = (payment: Payment) => {
    // demo: create a tiny text "receipt" and download it
    const receipt = `Payment Receipt\n\nID: ${payment.id}\nInvoice: ${
      (payment as any).invoiceId ?? ""
    }\nAmount: ${payment.amount}\nMethod: ${payment.method}\nStatus: ${
      payment.status
    }\nDate: ${payment.date}\n`;
    const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (payment: Payment) => {
    alert(
      `Payment details\n\nID: ${payment.id}\nInvoice: ${
        (payment as any).invoiceId ?? ""
      }\nAmount: ${payment.amount}\nMethod: ${payment.method}\nStatus: ${
        payment.status
      }\nDate: ${payment.date}`
    );
  };

  const getTotalAmount = () => {
    // allow amount string like "$120.00" or numeric, be defensive
    return filteredPayments.reduce((sum, payment) => {
      const raw = (payment.amount as any) ?? 0;
      const cleaned =
        typeof raw === "number"
          ? raw
          : String(raw).replace(/[^0-9.-]+/g, "") || "0";
      const n = parseFloat(cleaned);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
  };

  if (loading) return <div>Loading payments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Paid</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ₹{getTotalAmount().toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {payments.filter((p) => p.status === "completed").length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {payments.filter((p) => p.status === "pending").length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Failed</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {payments.filter((p) => p.status === "failed").length}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Payment History
            </h2>

            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <button
                onClick={handleExportClick}
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                title="Export filtered payments to CSV"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>

              <button
                onClick={handleSimulatePaymentClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Payment
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rental
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {pagination.currentData.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {payment.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(payment as any).rentalId ?? "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                        (payment as any).type === "rental"
                          ? "bg-blue-100 text-blue-800"
                          : (payment as any).type === "deposit"
                          ? "bg-green-100 text-green-800"
                          : (payment as any).type === "insurance"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(payment as any).type?.replace("_", " ") ?? ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {(payment as any).amount ?? ""}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(payment as any).method ?? ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${
                        (payment as any).status === "completed"
                          ? "bg-green-100 text-green-800"
                          : (payment as any).status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(payment as any).status === "completed" && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {(payment as any).status === "pending" && (
                        <Clock className="h-3 w-3" />
                      )}
                      {(payment as any).status === "failed" && (
                        <XCircle className="h-3 w-3" />
                      )}
                      {(payment as any).status ?? ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {(payment as any).date ?? ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(payment as any).status === "completed" && (
                        <button
                          onClick={() => handleDownloadReceipt(payment)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          onPageChange={pagination.goToPage}
          canGoNext={pagination.canGoNext}
          canGoPrev={pagination.canGoPrev}
        />
      </div>
    </div>
  );
};

export default Payments;