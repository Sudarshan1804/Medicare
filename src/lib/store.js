import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
        ).filter((i) => i.quantity > 0)
      })),
      clearCart: () => set({ cart: [] }),

      // Orders
      orders: [],
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, status } : o
        )
      })),

      // Appointments
      appointments: [],
      addAppointment: (appointment) => set((state) => ({
        appointments: [{ ...appointment, paid: false, paymentId: null }, ...state.appointments]
      })),
      cancelAppointment: (id) => set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === id ? { ...a, status: "cancelled" } : a
        )
      })),
      rescheduleAppointment: (id, newDate, newTime) => set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === id ? { ...a, date: newDate, time: newTime, status: "rescheduled" } : a
        )
      })),
      markAppointmentAsPaid: (id, paymentId) => set((state) => ({
        appointments: state.appointments.map((a) =>
          a.id === id ? { ...a, paid: true, paymentId, status: "confirmed" } : a
        )
      })),
      getAppointmentByDoctorId: (doctorId) => {
        const state = get();
        return state.appointments.find((a) => a.doctorId === doctorId && a.paid && a.status !== "cancelled");
      },

      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          { ...notification, id: Date.now().toString(), read: false, timestamp: new Date() },
          ...state.notifications
        ]
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),

      // Medicine Reminders
      reminders: [],
      addReminder: (reminder) => set((state) => ({
        reminders: [...state.reminders, { ...reminder, id: Date.now().toString() }]
      })),
      removeReminder: (id) => set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id)
      })),
      toggleReminder: (id) => set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, active: !r.active } : r
        )
      })),

      // User Medical Profile
      medicalProfile: {
        name: "",
        bloodType: "",
        allergies: "",
        conditions: "",
        emergencyContact: "",
        medications: ""
      },
      updateMedicalProfile: (profile) => set((state) => ({
        medicalProfile: { ...state.medicalProfile, ...profile }
      }))
    }),
    {
      name: "medicare-storage"
    }
  )
);
