import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/services";
import { useTranslation } from "react-i18next";
import { useModal } from "@/components/modal/ModalProvider";
import { MODAL_TYPES } from "@/components/modal/modalRegistry";
import {
  useCreateService,
  useUpdateService,
  useDeleteService
} from "@/hooks/service";
import { RowActionsMenu } from "@/components/RowActionDropdown";

const columnHelper = createColumnHelper<Services>();

export const ServicesTable = ({ data, columns }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                      desc: " 🔽"
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
};
export const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  //query hooks
  const {
    data = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["services"],
    queryFn: getServices
  });

  const serviceInputs = React.useMemo(
    () => ({
      name: {
        id: "services-name",
        name: "name",
        placeholder: t("services.placeholderText.name"),
        errorMsg: t("services.errors.name")
      },
      base_price: {
        id: "services-base_price",
        name: "base_price",
        placeholder: t("services.placeholderText.base_price"),
        errorMsg: t("services.errors.base_price")
      },
      description: {
        id: "services_description",
        name: "description",
        placeholder: t("services.placeholderText.description"),
        errorMsg: t("services.errors.description")
      }
    }),
    [t]
  );

  const filteredServices = data.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onCreateSubmit = async (formData) => {
    try {
      console.log("submitting service data", formData);
      const service = await createServiceMutation.mutateAsync(formData);
      console.log("created");
      closeModal();
    } catch (err) {
      console.error(err?.message);
    }
  };

  const onEditSubmit = async (id, formData) => {
    try {
      console.log("submitting service data", formData);
      const service = await updateServiceMutation.mutateAsync({
        id,
        data: formData
      });
      console.log("updated");
      closeModal();
    } catch (err) {
      console.error(err?.message);
    }
  };

  const onDeleteSubmit = async (id) => {
    try{
      console.log("deleting service");
      const response = await deleteServiceMutation.mutateAsync(id)
      closeModal();
    }
    catch (err) {
      console.error(err?.message);
    }
  };

  const handleCreate = React.useCallback(() => {
    openModal(MODAL_TYPES.CREATE_SERVICE, {
      onSubmit: onCreateSubmit,
      inputs: serviceInputs,
      isLoading: createServiceMutation.isPending,
      serverError: createServiceMutation.error?.message
    });
  }, [openModal, createServiceMutation]);

  const handleEdit = React.useCallback(
    (service) => {
      openModal(MODAL_TYPES.EDIT_SERVICE, {
        initialData: service,
        onSubmit: onEditSubmit,
        inputs: serviceInputs,
        isLoading: updateServiceMutation.isPending,
        serverError: updateServiceMutation.error?.message
      });
    },
    [openModal, updateServiceMutation]
  );

  const handleDelete = React.useCallback(
    (service) => {
      openModal(MODAL_TYPES.DELETE, {
        onSubmit: async ()=> onDeleteSubmit(service.id),
        isLoading: deleteServiceMutation.isPending,
        serverError: deleteServiceMutation.error?.message, 
        entityName: service.name || '',
        entityType: 'service',
      });
    },
    [openModal, deleteServiceMutation]
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("base_price", {
        header: "Base Price",
        cell: (info) => `$${Number(info.getValue()).toFixed(2)}`
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      }),

      //ACTIONS COLUMN
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const service = row.original;

          return (
            <RowActionsMenu
              onEdit={() => handleEdit(service)}
              onDelete={() => handleDelete(service)}
            />
          );
        }
      })
    ],[handleEdit, handleDelete]);

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("services.errors.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("services.heading")}
          </h1>
          <p className="text-gray-500 mt-1">{t("services.subheading")}</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
          {t("services.add")}
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
          <ServicesTable data={filteredServices} columns={columns} />
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
