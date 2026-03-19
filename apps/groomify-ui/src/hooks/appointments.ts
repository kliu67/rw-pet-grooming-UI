import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAppointments, getAppointmentByStylistId, getUpcomingAppointmentsByStylistId, createAppointment, updateAppointment, deleteAppointment } from "@/api/appointments";
import { APPOINTMENTS_QUERY_KEY } from "@/constants";

export function useAppointments() {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY],
    queryFn: getAppointments
  });
}
export function useAppointmentsByStylistId(stylistId: number | string | undefined){
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, stylistId],
    queryFn: ()=>getAppointmentByStylistId(stylistId)
  })
}

export function useUpcomingAppointmentsByStylistId(stylistId: number | string | undefined){
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, stylistId],
    queryFn: ()=>getUpcomingAppointmentsByStylistId(stylistId)
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      // refresh appointments table
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAppointment(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });

      const prevAppointments = queryClient.getQueryData([APPOINTMENTS_QUERY_KEY]);

      queryClient.setQueryData([APPOINTMENTS_QUERY_KEY], (old) =>
        old?.map((appointment) =>
          appointment.id === id ? { ...appointment, ...data } : appointment
        )
      );

      return { prevAppointments };
    },

    // 🔥 Rollback on error
    onError: (err, variables, context) => {
      if (context?.prevAppointments) {
        queryClient.setQueryData([APPOINTMENTS_QUERY_KEY], context.prevAppointments);
      }
    },

    // 🔥 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    }
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAppointment(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });

      const prevAppointments = queryClient.getQueryData([APPOINTMENTS_QUERY_KEY]);

      queryClient.setQueryData([APPOINTMENTS_QUERY_KEY], (old: any[]) =>
        old?.filter((app) => app.id !== id)
      );

      return { prevAppointments };
    },

    // 🔹 Rollback on error
    onError: (_err, _id, context) => {
      if (context?.prevAppointments) {
        queryClient.setQueryData([APPOINTMENTS_QUERY_KEY], context.prevAppointments);
      }
    },

    // 🔹 Ensure server truth
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    }
  });
}
