<script>
export default {
  name: 'SupportTicketCard',
  props: {
    ticketId: { type: [String, Number], required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    creationDate: { type: String, required: true },
    error: { type: String, default: null }
  },
  emits: ['resolve'],
};
</script>

<template>
  <div class="ticket-card">
    <h3>{{ title }}</h3>
    <p><strong>Tipo:</strong> {{ type }}</p>
    <p><strong>Descripción:</strong> {{ description }}</p>
    <p><strong>Creado:</strong> {{ creationDate }}</p>
    <button @click="$emit('resolve', ticketId)">Marcar como resuelto</button>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<style scoped>
.ticket-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background: #fafafa;
  margin-left: 16px;
  margin-right: 16px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.ticket-card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1.5px 6px rgba(0,0,0,0.10);
  transform: translateY(-2px) scale(1.01);
  background: #f5faff;
}
.ticket-card button {
  background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,123,255,0.10);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  margin-top: 18px;
  letter-spacing: 0.5px;
}
.ticket-card button:hover {
  background: linear-gradient(90deg, #0056b3 0%, #007bff 100%);
  box-shadow: 0 4px 16px rgba(0,123,255,0.18);
  transform: translateY(-1px) scale(1.03);
}
.error-message {
  color: #fff;
  background: #e53935;
  border-radius: 6px;
  margin-top: 14px;
  margin-left: 0;
  padding: 12px 18px;
  font-size: 0.98rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(229,57,53,0.10);
  width: calc(100% + 0px);
}
</style>