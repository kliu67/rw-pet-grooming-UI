import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useModal } from "@/components/modals/ModalProvider";
import PetModal from "@/components/modals/PetModal";
import { Table as PetTable } from "@/components/Table";
import { MODAL_TYPES } from "@/components/modals/modalRegistry";
import { usePets, useCreatePet, useUpdatePet, useDeletePet } from "@/hooks/pets";
import { useClients } from "@/hooks/clients";
import { useWeightClasses } from "@/hooks/weightClasses"
import { RowActionsMenu } from "@/components/RowActionDropdown";
import { useAuth } from "@/context/AuthContext";
import { EmptyState } from "@/components/emptyState";

const columnHelper = createColumnHelper();

export const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [pet, setPet] = useState({});
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();
  const { isAuthenticated } = useAuth();

  //query hooks
  const {
    data: petsData = [],
    isLoading: petsIsLoading,
    error: petsError
  } = usePets();

  const {
    data: weightClassesData = [],
    isLoading: weightClassesIsLoading,
    error: weightClassesError
  } = useWeightClasses();


  const {
    data: clientsData = [],
    isLoading: clientsIsLoading,
    error: clientsError
  } = useClients();

  const isLoading = petsIsLoading || weightClassesIsLoading || clientsIsLoading;
  const isError = petsError || weightClassesError || clientsError

  const petInputs = React.useMemo(
    () => ({
      name: {
        id: "pets-name",
        name: "name",
        displayName: "Name",
        placeholder: t("pets.placeholderText.name")
      },
      breed: {
        id: "pets-breed",
        name: "breed",
        displayName: "Breed",
        placeholder: t("pets.placeholderText.breed")
      },
      owner: {
        id: "pets-owner",
        name: "owner",
        displayName: "Owner",
        placeholder: t("pets.placeholderText.owner")
      },
      weightClass: {
        id: "pets-weight_class",
        name: "weight_class",
        displayName: "Weight Class",
        placeholder: t("pets.placeholderText.weightClass")
      }
    }),
    [t]
  );

  const isSubmitting =
    mode === "create"
      ? createPetMutation.isPending
      : mode === "edit"
        ? updatePetMutation.isPending
        : false;

  const pets = petsData.map((pet) => {
    const owner = clientsData.find((client) => client.id === pet.owner);
    const weightClass = weightClassesData.find(
      (wc) => wc.id === pet.weight_class_id
    );
  
    return {
      id: pet.id,
      name: pet.name,
      // breed: breed?.name || t("general.notFound"),
      owner: owner,
      ownerDisplayName: (owner && `${owner.last_name}, ${owner.first_name}`) ||
        t("general.notFound"),
      breed: pet.breed,
      breedDisplayName: pet.breed,
      weightClass: weightClass,
      weightClassDisplayName: weightClass?.label || t("general.notFound"),
      uuid: pet.uuid,
      createdAt: pet.created_at,
      updatedAt: pet.updated_at
    };
  });

  const filteredPets = pets.filter(
    (pet) =>
      pet.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- CREATE AND EDIT ACTION HANDLER ---------------- */
  const handleAction = React.useCallback(
    (action = "", pet = {}) => {
      if (action === "create" || action === "edit") {
        (setMode(action), setPet(pet));
        setIsOpen(true);
      }

      if (action === "delete") {
        openModal(MODAL_TYPES.DELETE, {
          onSubmit: async () => {
            try {
              console.log("deleting pet");
              await deletePetMutation.mutateAsync(pet.id);
              closeModal();
            } catch (err) {
              console.error(err?.message);
            }
          },
          isLoading: deletePetMutation.isPending,
          serverError: deletePetMutation.error?.message,
          entityName: pet.name || "",
          entityType: "pet"
        });
      }
    },
    [openModal, closeModal,  deletePetMutation]
  );

  const handleSubmit = async (formData) => {
    if (mode === "edit") {
      if (!pet?.id) {
        throw new Error("Missing pet id");
      }
      return updatePetMutation.mutateAsync({
        id: pet.id,
        data: formData
      });
    }

    return createPetMutation.mutateAsync(formData);
  };

  /* ---------------- Columns ---------------- */
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("id", {
        header: t('columns.id'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("name", {
        header: t('columns.name'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("ownerDisplayName", {
        header: t('columns.owner'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("breedDisplayName", {
        header: t('columns.breed'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("weightClassDisplayName", {
        header: t('columns.weightClass'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("uuid", {
        header: t('columns.uuid'),
        cell: (info) => info.getValue()
      }),
      columnHelper.accessor("createdAt", {
        header: t('columns.createdAt'),
        cell: (info) => {
          const v = info.getValue();
          return v ? new Date(v).toLocaleDateString() : "-";
        }
      }),
      columnHelper.accessor("updatedAt", {
        header: t('columns.updatedAt'),
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
          const pet = row.original;
          return (
            <RowActionsMenu
              onEdit={() => handleAction("edit", pet)}
              onDelete={() => handleAction("delete", pet)}
            />
          );
        }
      })
    ],
    [handleAction]
  );

  if (isLoading) return <p>{t("general.loading")}</p>;
  if (isError) return <p>{t("pets.errors.loading")}</p>;

  return (
    isAuthenticated ? (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("pets.heading")}
          </h1>
          <p className="text-gray-500 mt-1">{t("pets.subheading")}</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => handleAction("create")}
        >
          <Plus className="h-4 w-4" />
          {t("pets.add")}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('pets.search')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <PetTable data={filteredPets} columns={columns} />
        </div>
        {isOpen && (
          <PetModal
            mode={mode || "create"}
            inputs={petInputs}
            onSubmit={handleSubmit}
            petData={pet}
            onClose={() => setIsOpen(false)}
            isLoading={isSubmitting}
            weightClassData={weightClassesData}
            clientData={clientsData}
          />
        )}
      </div>
    </div>
    ) : (
      <EmptyState />
    )
  );
};
