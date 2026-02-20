import React, { useState } from 'react';
import {
    MoreHorizontal,
    Plus,
    Search,
    Scissors,
    DollarSign,
    Clock,
} from 'lucide-react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next"

import { useQuery } from "@tanstack/react-query";
import { getSpecies } from "../../api/species";

const columnHelper = createColumnHelper<Species>();

export const SpeciesTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    /* ---------------- Fetch Data ---------------- */
    const { data = [], isLoading, error } = useQuery({
        queryKey: ["species"],
        queryFn: getSpecies,
    });


    /* ---------------- Columns ---------------- */
    const columns = [
        columnHelper.accessor("id", {
            header: "ID",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("name", {
            header: "Name",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("created_at", {
            header: "Created",
            cell: info => {
                const v = info.getValue();
                return v ? new Date(v).toLocaleDateString() : "-";
            },
        }),
    ];

    /* ---------------- Table Instance ---------------- */
    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    /* ---------------- UI ---------------- */
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading species</p>;

   return (
  <div className="space-y-4">
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-6 py-3 font-semibold cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination OUTSIDE table */}
    <div className="flex items-center justify-between">
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm text-gray-600">
        Page {table.getState().pagination.pageIndex + 1}
      </span>

      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-3 py-1 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
);
}

export const Species = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [services, setServices] = useState([]);
    const [species, setSpecies] = useState([]);

    const filteredServices = services.filter(
        (service) =>
            service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-500 mt-1">Manage your service offerings</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="h-4 w-4" />
                    Add Service
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <h2>Species</h2>
                    <SpeciesTable />
                    {/* <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-indigo-500" />
                      {service.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-gray-500">
                    {service.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${service.price}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{service.duration}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
                </div>

                {filteredServices.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No services found matching your search.
                    </div>
                )}
            </div>
        </div>
    );

};
