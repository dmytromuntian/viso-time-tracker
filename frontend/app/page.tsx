'use client';

import { useTimeEntries, TimeEntry } from '@/hooks/useTimeEntries';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

export default function Home() {
  const { entries, addEntry, isLoading } = useTimeEntries();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = (data: any) => {
    setServerError(null);
    addEntry.mutate(
      { 
        ...data, 
        hours: Number(data.hours) 
      },
      {
        onSuccess: () => {
          reset({
            date: '',
            project: 'Viso Internal',
            description: '',
            hours: ''
          });
        },
        onError: (err: any) => {
          setServerError(err.response?.data?.message || 'Помилка збереження');
        },
      }
    );
  };

  const { groupedEntries, grandTotal } = useMemo(() => {
    const groups: Record<string, TimeEntry[]> = {};
    let total = 0;
    (entries || []).forEach((entry) => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
      total += entry.hours;
    });
    return { groupedEntries: groups, grandTotal: total };
  }, [entries]);

  if (isLoading) return <div className="p-10 text-center text-gray-500">Завантаження...</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">⏱ Viso Time Tracker</h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-sm">
            Всього: {grandTotal.toFixed(1)} год
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-5 text-gray-800">Новий запис</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
              <input 
                id="date"
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register('date', { required: true })}
                className="w-full border-gray-300 border rounded-lg p-2.5 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Проект</label>
              <select 
                id="project"
                {...register('project')}
                className="w-full border-gray-300 border rounded-lg p-2.5 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Viso Internal">Viso Internal</option>
                <option value="Client A">Client A</option>
                <option value="Client B">Client B</option>
                <option value="Personal Development">Personal Development</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Опис роботи</label>
              <textarea 
                id="description"
                {...register('description', { required: true })}
                placeholder="Над чим ви працювали?"
                className="w-full border-gray-300 border rounded-lg p-2.5 h-24 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">Кількість годин</label>
              <input 
                id="hours"
                type="number" 
                step="0.1"
                {...register('hours', { required: true, min: 0.1 })}
                className="w-full border-gray-300 border rounded-lg p-2.5 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={addEntry.isPending}
                className={clsx(
                  "w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all shadow-sm",
                  addEntry.isPending 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                )}
              >
                {addEntry.isPending ? 'Збереження...' : 'Зберегти запис'}
              </button>
            </div>
          </form>

          {serverError && (
            <div className="mt-5 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center">
              <span className="mr-2 text-xl">⚠️</span> {serverError}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 px-1">Історія активності</h2>
          
          {Object.keys(groupedEntries).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">Записів ще немає. Додайте перший!</p>
            </div>
          )}

          {Object.keys(groupedEntries).sort().reverse().map((date) => (
            <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-700 flex items-center gap-2">
                  📅 {date}
                </span>
                <span className="text-sm font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {groupedEntries[date].reduce((sum, e) => sum + e.hours, 0).toFixed(1)} год
                </span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {groupedEntries[date].map((entry) => (
                  <div key={entry.id} className="p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-800">{entry.project}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{entry.description}</div>
                    </div>
                    <div className="font-mono font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded text-center whitespace-nowrap">
                      {entry.hours} год
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}