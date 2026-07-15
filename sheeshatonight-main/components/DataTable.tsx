'use client';

import React, { useState } from 'react';
import { Loader } from './Loader';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loadingIds?: Set<string | number>;
  isLoading?: boolean;
}

export const DataTable = <T extends Record<string, any>>({ 
  columns, 
  data, 
  emptyMessage = 'No records found.',
  loadingIds = new Set(),
  isLoading = false,
}: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column, idx) => (
              <th key={idx} className={`px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 ${column.className ?? ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.length === 0 ? (
            <tr>
              <td className="px-5 py-8 text-center text-slate-500" colSpan={columns.length}>
                {isLoading ? <Loader /> : emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowId = row.id || rowIndex;
              const isRowLoading = loadingIds.has(rowId);
              
              return (
                <tr 
                  key={rowIndex} 
                  className={`hover:bg-slate-50 transition ${isRowLoading ? 'opacity-60' : ''}`}
                >
                  {columns.map((column, cellIndex) => (
                    <td key={cellIndex} className={`px-5 py-4 align-top text-sm text-slate-700 ${column.className ?? ''}`}>
                      {column.render ? column.render(row) : row[column.accessor as string]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
