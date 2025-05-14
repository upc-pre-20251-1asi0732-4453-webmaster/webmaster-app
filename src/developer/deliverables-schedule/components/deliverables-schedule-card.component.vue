<script>
import { DeliverableEntity } from "../../../shared/models/deliverable.model.js";

export default {
  name: "deliverables-schedule-card",
  props: {
    deliverable: {
      type: DeliverableEntity,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    goToSendDeliverable() {
      const projectId = this.deliverable.projectID;
      const deliverableId = this.deliverable.deliverable_id;
      this.$router.push(`/projects/developers/${projectId}/deliverables/${deliverableId}/create`);
    }
  },
};
</script>

<template>

  <pv-card class="w-8 border-round-3xl shadow-4 card" aria-label="Deliverable Card">
    <template #header>
      <div class="flex flex-row justify-content-center mt-4 -mb-4 ml-4 flex-wrap" aria-label="Deliverable Header">
        <h2>{{ deliverable.title }}</h2>
        <div class="m-3 flex justify-content-between">
          <pv-button @click="goToSendDeliverable" icon="pi pi-send" class="icons" aria-label="Send Button"></pv-button>
        </div>
      </div>
    </template>
    <template #title>
      <p class="-mb-1" aria-label="Description Label">{{ $t('deliverables-schedule-card-part1') }}</p>
    </template>
    <template #content>
      <div class="flex flex-row justify-content-between" aria-label="Deliverable Content">
        <div class="text-container flex flex-column w-10 h-5" aria-label="Description Content">
          <p>{{ deliverable.description }}</p>
        </div>
        <div class='flex flex-column ' aria-label="Additional Information">
          <div aria-label="Delivery Date Information">
            <div class="flex flex-column align-items-center relative-container ml-5">
              <span class="pi pi-stopwatch" style="font-size: 2rem"></span>
            </div>
            <div class="flex flex-column align-items-center -mt-3 ml-5 mb-2">
              <p>{{ formatDate(deliverable.deadlineDateValue) }}</p>
              <p class="-mt-3">{{ (deliverable.deadlineTime) }}</p>
            </div>
          </div>
          <div aria-label="Status Information" class='flex flex-column '>
            <div class="flex flex-column align-items-center -mt-2 ml-5 ">
              <span v-if="deliverable.state === 'Aprobado'" class="pi pi-check-circle" style="font-size: 2rem; color: green;"></span>
              <span v-else-if="deliverable.state === 'En espera de revisión'" class="pi pi-info-circle" style="font-size: 2rem; color: purple;"></span>
              <span v-else-if="deliverable.state === 'Rechazado'" class="pi pi-times-circle" style="font-size: 2rem; color: red;"></span>
              <span v-else class="pi pi-chevron-circle-down" style="font-size: 2rem"></span>
            </div>
            <div class="flex flex-column align-items-center card text-center -mt-3 ml-5">
              <span v-if="deliverable.state === 'Aprobado'" >
                <br>
                {{ $t('approved') }}
              </span>
              <span v-else-if="deliverable.state === 'WAITING'" >
                <br>{{ $t('pending') }}
              </span>
              <span v-else-if="deliverable.state === 'Rechazado'">
                <br>{{ $t('rejected') }}
              </span>
              <span v-else>
                <br>{{ $t('waiting') }}
              </span>

            </div>
          </div>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.icons {
  color: rgba(184, 100, 243, 0.54);
  background-color: white;
  border: none;
}

textarea {
  resize: none;
}

.text-container {
  overflow: hidden;
  word-wrap: break-word;
}

</style>
