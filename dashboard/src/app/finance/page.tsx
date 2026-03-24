"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { feeRecords, feeStructure, getFinanceStats } from "@/data/finance";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Receipt } from "lucide-react";

export default function FinancePage() {
  const [tab, setTab] = useState<"records" | "structure">("records");
  const stats = getFinanceStats();

  return (
    <>
      <PageHeader
        title="Finance"
        subtitle="Fee collection and financial overview"
        actions={<button className="btn-primary flex items-center gap-2"><Receipt size={16} /> Record Payment</button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Due (Q4)" value={`₹${stats.totalDue.toLocaleString()}`} icon={DollarSign} color="primary" />
        <StatCard label="Collected" value={`₹${stats.totalCollected.toLocaleString()}`} icon={TrendingUp} color="success" />
        <StatCard label="Outstanding" value={`₹${stats.outstanding.toLocaleString()}`} icon={AlertTriangle} color="danger" />
        <StatCard label="Collection Rate" value={`${stats.collectionRate}%`} icon={CheckCircle} color="info" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("records")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "records" ? "bg-primary text-white" : "bg-surface text-text-light"}`}>
          Payment Records
        </button>
        <button onClick={() => setTab("structure")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "structure" ? "bg-primary text-white" : "bg-surface text-text-light"}`}>
          Fee Structure
        </button>
      </div>

      {tab === "records" && (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10 bg-surface-cream">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Student</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Class</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Paid</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">Method</th>
                </tr>
              </thead>
              <tbody>
                {feeRecords.map((record) => (
                  <tr key={record.id} className="border-b border-primary/5 hover:bg-surface-cream/50">
                    <td className="px-4 py-3 text-sm font-medium text-primary-dark">{record.studentName}</td>
                    <td className="px-4 py-3 text-sm text-text-light">{record.class}</td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{record.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-success">₹{record.paid.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        record.status === "paid" ? "bg-green-100 text-green-700" :
                        record.status === "partial" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted uppercase hidden md:table-cell">{record.method || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "structure" && (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10 bg-surface-cream">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Class</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Quarterly</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Annual</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Admission Fee</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee) => (
                  <tr key={fee.class} className="border-b border-primary/5">
                    <td className="px-4 py-3 font-semibold text-sm text-primary-dark">{fee.class}</td>
                    <td className="px-4 py-3 text-sm">₹{fee.quarterly.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">₹{fee.annual.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-text-muted">₹{fee.admission.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
