"use client";

import { useState, useEffect } from "react";
import { IncomeTithesService, IncomeTithe } from "@/lib/income-tithes-service";



export default function IncomeTithes() {
  useEffect(() => {
    (async () => {
      try {
        const data = await IncomeTithesService.list();
        setEntries(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const [entries, setEntries] = useState<IncomeTithe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [selectedPercentage, setSelectedPercentage] = useState<number>(10);

  const addIncome = async () => {
    if (description.trim() === "" || amount === "" || Number(amount) <= 0)
      return;

    const computedTithe = Number(amount) * (selectedPercentage / 100);

    const payload = {
      description,
      amount: Number(amount),
      percentage: selectedPercentage,
      tithe_amount: computedTithe,
    };

    try {
      const created = await IncomeTithesService.create(payload);
      setEntries((prev) => [created, ...prev]);
    } catch (err:any) {
      setError(err.message);
      return;
    }
      

    
    setDescription("");
    setAmount("");
    
  };

  const payTithe = async (id: string) => {
    try {
      const updated = await IncomeTithesService.markPaid(id);
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch (err:any) {
      setError(err.message);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await IncomeTithesService.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err:any) {
      setError(err.message);
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <section className="content-section active">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-hand-holding-usd text-green-600"></i>
            Record Income
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Description"
              className="w-full border rounded px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              className="w-full border rounded px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
            <div className="flex gap-2 flex-wrap">
              {[10,20,30,40,50].map((pct)=>(
                <button
                  key={pct}
                  type="button"
                  onClick={()=>setSelectedPercentage(pct)}
                  className={`px-3 py-1 rounded border text-sm ${selectedPercentage===pct? 'bg-purple-600 text-white':'bg-white text-gray-700'}`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <button
              onClick={addIncome}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Add Income
            </button>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-seedling text-purple-600"></i>
            Income & Tithes History
          </h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : entries.length === 0 ? (
            <p className="text-gray-500 text-sm">No income recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {entry.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()} | {formatCurrency(entry.amount)} | Tithe: {formatCurrency(entry.tithe_amount)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    {entry.tithe_paid ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Tithe Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => payTithe(entry.id)}
                        className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Pay Tithe ({formatCurrency(entry.tithe_amount)})
                      </button>
                    )}
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
