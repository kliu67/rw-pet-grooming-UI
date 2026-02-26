import React, { useState } from "react";
import {
  Plus,
  Search,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";
import { getBreeds } from "../api/breeds";
import { useModal } from "@/components/modals/ModalProvider.jsx";
import { MODAL_TYPES } from "@/components/modals/modalRegistry.js";
import { RowActionsMenu } from "@/components/RowActionDropdown";
import { Table as SpeciesTable } from "@/components/Table";
import { useCreateBreed, useUpdateBreed, useDeleteBreed } from "@/hooks/breeds";
import BreedModal from "@/components/modals/types/BreedModal";

const columnHelper = createColumnHelper();

export const Breeds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { openModal, closeModal } = useModal();
  const createBreedMutation = useCreateBreed();
  const updateBreedMutation = useUpdateBreed();
  const deleteBreedMutation = useDeleteBreed();
  const [modal, setModal] = useState({});

  const { t } = useTranslation();

  const {
    data = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["species"],
    queryFn: getBreeds
  });

  //inputs
  const breedInputs = React.useMemo(
    () => ({
      name: {
        id: "breed-name",
        name: "name",
        displayName: "Breed name",
        placeholder: t("breeds.placeholderText.name"),
        errorMsg: t("breeds.errors.name")
      }
    }),
    [t]
  );

  const isSubmitting =
    modal.mode === "create"
      ? createBreedMutation.isPending
      : modal.mode === "edit"
        ? updateBreedMutation.isPending
        : false;

  const handleSubmit = async (formData) => {
    if (modal.mode === "edit") {
      if (!modal.breedData?.id) {
        throw new Error("Missing breed id");
      }
      return updateBreedMutation.mutateAsync({
        id: modal.breedData.id,
        data: formData
      });
    }

    return createBreedMutation.mutateAsync(formData);
  };

  const handleAction = React.useCallback((action = "", breedData = {}) => {
    if (action === "create" || action === "edit") {
      setModal({
        mode: action,
        breedData: breedData || {}
      });
      setIsOpen(true);
    }

    if (action === "delete") {
      openModal(MODAL_TYPES.DELETE, {
        onSubmit: async () => {
          try{
            console.log('deleting breed');
            await deleteBreedMutation.mutateAsync(breedData.id);
            closeModal();
          }
          catch (err) {
            console.error(err?.message);
          }
        },
        isLoading: deleteBreedMutation.isPending,
        serverError: deleteBreedMutation.error?.message,
        entityName: breedData.name || "",
        entityType: 'breed'
      });
    }
  }, [openModal, deleteBreedMutation]);
  
  /* ---------------- Columns ---------------- */
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
          const breed = row.original;

          return (
            <RowActionsMenu
              onEdit={() => handleAction("edit", breed)}
              onDelete={() => handleAction("delete", breed)}
            />
          );
        }
      })
    ],
    [handleAction]
  );

  const filteredBreeds = data.filter((species) =>
    species.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (error) return <p>{t("breeds.errors.loading")}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("breeds.heading")}
          </h1>
          <p className="text-gray-500 mt-1">{t("breeds.subheading")}</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          // onClick={()=>setIsOpen(true)}
          onClick={() => handleAction("create")}
        >
          <Plus className="h-4 w-4" />
          {t("breeds.add")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("breeds.search")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <SpeciesTable data={filteredBreeds} columns={columns} />
        </div>
      </div>
      {isOpen && (
        <BreedModal
          mode={modal.mode || "create"}
          inputs={breedInputs}
          onSubmit={handleSubmit}
          breedData={modal.breedData}
          onClose={() => setIsOpen(false)}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};
