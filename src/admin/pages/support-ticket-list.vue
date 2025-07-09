<script>
// Importa las funciones de la Composition API si las vas a usar dentro de setup()
import { ref, onMounted } from 'vue';
import supportService from '../../../public/services/support.service.js';
import SupportTicketCard from '../components/support-ticket-card.component.vue';

export default {
  name: 'SupportTicketsList',

  // Si SupportTicketCard es un componente que se usa localmente, debe declararse aquí
  components: {
    SupportTicketCard // Asegúrate de que el nombre aquí coincida con cómo lo usas en <template>
  },

  // La lógica de la Composition API se traslada a la función setup()
  setup() {
    const tickets = ref([]);
    const loading = ref(false);
    const errorByTicketId = ref({});

    const fetchTickets = async () => {
      loading.value = true;
      try {
        tickets.value = await supportService.getSupportTickets();
      } catch (e) {
        // Error global si falla el fetch
      } finally {
        loading.value = false;
      }
    };

    const resolveTicket = async (ticketId) => {
      errorByTicketId.value[ticketId] = null;
      try {
        await supportService.resolveSupportTicket(ticketId);
        await fetchTickets();
      } catch (e) {
        errorByTicketId.value[ticketId] = 'No se pudo marcar como resuelto';
      }
    };

    onMounted(fetchTickets);

    // Retorna las variables y funciones que necesitas usar en la plantilla
    return {
      tickets,
      loading,
      errorByTicketId,
      resolveTicket
    };
  }
};
</script>

<template>
  <div>
    <div v-if="loading">Cargando tickets...</div>
    <SupportTicketCard
      v-for="ticket in tickets"
      :key="ticket.id"
      :ticketId="ticket.id"
      :title="ticket.title"
      :type="ticket.type"
      :description="ticket.description"
      :creationDate="ticket.creationDate"
      :error="errorByTicketId[ticket.id]"
      @resolve="resolveTicket"
    />
  </div>
</template>
<style scoped>
</style>
