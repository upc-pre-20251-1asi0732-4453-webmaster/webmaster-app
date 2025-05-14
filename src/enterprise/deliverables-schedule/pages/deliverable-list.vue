<script>
import DeliverablesScheduleCard from "../components/deliverables-schedule-card.component.vue";
import { DeliverableService } from "../../../../public/services/deliverable.service.js";
import { DeliverableEntity } from "../../../shared/models/deliverable.model.js";

export default {
  name: "deliverables-list",
  props: ['projectId'],
  components: {
    'deliverable-card': DeliverablesScheduleCard
  },
  data() {
    return {
      errors: {
        title: '',
        description: '',
        deadline: ''
      },
      deliverables: [],
      projectId: null,
      deliverableService: new DeliverableService(),
      visible: false,
      editableDeliverable: {
        title: '',
        description: '',
        deadline: ''
      },
      isEditing: false
    };
  },
  methods: {
    async fetchDeliverables() {
      try {
        const raw = await this.deliverableService.getAllDeliverables(this.projectId);

        this.deliverables = raw.map(item => {

          // 1) Creamos un Date a partir del ISO-string
          const dateObj = new Date(item.date);

          // 2) Extraemos la hora en formato "HH:mm"
          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          const timeStr = `${hours}:${minutes}`;

          return new DeliverableEntity(
              item.id,               // deliverable_id
              item.name,             // title
              item.description,      // description
              item.developerDescription, // (si existe)
              item.state,            // state
              item.file,             // (si existe)
              dateObj,               // deadlineDateValue (Date con fecha y hora)
              timeStr,               // deadlineTime  (string "HH:mm")
              item.orderNumber,      // (si existe)
              item.projectId,        // (si existe)
              item.developer_id      // (si existe)
          );
        });

        console.log('Mapped DeliverableEntity[]:', this.deliverables);
      } catch (err) {
        console.error('Error fetching deliverables:', err);
      }
    },
    openModal() {
      this.visible = true;
    },
    closeModal() {
      this.visible = false;
      this.isEditing = false;
      this.editableDeliverable = { title: '', description: '', deadline: null };
      this.$router.push(`/Projects/${this.projectId}/Deliverables`);
    },
    formatDateForBackend(date) {
      const iso = new Date(date).toISOString();
      return iso.slice(0, 19);
    },
    addDeliverable() {
      this.openModal();
    },
    async saveDeliverable() {
      this.errors = { title: '', description: '', deadline: '' };
      let hasError = false;
      if (this.editableDeliverable.title.trim().length < 10) {
        this.errors.title = "El nombre debe tener al menos 10 caracteres.";
        hasError = true;
      }
      if (this.editableDeliverable.description.trim().length < 20) {
        this.errors.description = "La descripción debe tener al menos 20 caracteres.";
        hasError = true;
      }
      if (!this.editableDeliverable.deadline || new Date(this.editableDeliverable.deadline) < new Date()) {
        this.errors.deadline = "La fecha debe ser igual o mayor a la actual.";
        hasError = true;
      }
      if (hasError) return;

      const payload = {
        name: this.editableDeliverable.title,
        description: this.editableDeliverable.description,
        date: this.formatDateForBackend(this.editableDeliverable.deadline),
        projectId: this.projectId
      };

      try {
        if (this.isEditing) {
          await this.deliverableService.updateDeliverable(
              this.projectId,
              this.editableDeliverable.deliverable_id,
              payload
          );
          this.closeModal();
        } else {
          await this.deliverableService.createDeliverable(this.projectId, payload);
        }
        this.closeModal();
        await this.fetchDeliverables();
      } catch (error) {
        console.error('Error creating/updating deliverable:', error);
        const msg = error.response?.data?.message || "Error al guardar deliverable.";
        this.errors.deadline = msg;
      }
    },
    async updateDeliverable(updated) {
      try {
        const { deliverable_id, orderNumber } = updated;
        await this.deliverableService.updateDeliverable(this.projectId, orderNumber, updated);
        const idx = this.deliverables.findIndex(d => d.deliverable_id === deliverable_id);
        if (idx !== -1) this.$set(this.deliverables, idx, { ...updated });
      } catch (err) {
        console.error('Error updating deliverable:', err);
      }
    },
    editDeliverable(deliverable) {
      // Suponiendo que quieres editar también la parte de fecha+hora:
      this.editableDeliverable = {
        title: deliverable.title,
        description: deliverable.description,
        // Para editar, pasamos un Date al v-model del calendario:
        deadline: deliverable.deadlineDateValue
      };
      this.isEditing = true;
      this.openModal();
      this.$router.push(`/Projects/${this.projectId}/Deliverables/${deliverable.deliverable_id}`);
    }
  },
  created() {
    this.projectId = this.$route.params.projectId;
    this.fetchDeliverables();
  }
};
</script>


<template>
  <div class="text-white-alpha-90 flex flex-column">
    <p class="text-4xl text-center font-bold">{{ $t('deliverable-list-part1') }}</p>
    <div class="grid col-fixed justify-content-center gap-5 mt-4 mb-4">
      <deliverable-card v-for="deliverable in deliverables"
                        :key="deliverable.deliverable_id"
                        :deliverable="deliverable"
                        @edit-deliverable="editDeliverable"/>
    </div>
  </div>

  <pv-modal v-model:visible="visible" modal :header="isEditing ? $t('deliverable-list-part7') : $t('deliverable-list-part3')" :breakpoints="{ '1199px': '50%', '500px': '50%', '700px':'50%','1900px': '50%'}" aria-label="Add/Edit Deliverable Modal">
    <div class="flex flex-column align-content-center justify-content-center" aria-label="Modal Content">
      <div class="flex flex-row align-items-center justify-content-center flex-wrap" aria-label="Input Fields">
        <div class="flex flex-column w-10" aria-label="Deliverable Name and Description">
          <pv-textarea type="text" v-model="editableDeliverable.title" :placeholder="$t('deliverable-list-part4')" class="mb-3 pr-5" maxlength="50" aria-label="Title Textarea"></pv-textarea>
          <pv-textarea v-model="editableDeliverable.description" :placeholder="$t('deliverable-list-part5')" class="mb-3" aria-label="Description Textarea"></pv-textarea>
          <pv-calendar
              v-model="editableDeliverable.deadline"
              :placeholder="$t('deliverable-list-part9')"
              class="mb-3"
              showTime
              hourFormat="24"
              :showIcon="true"
              aria-label="Deadline Calendar"
          ></pv-calendar>
        </div>
      </div>

      <div class="flex flex-column align-items-center justify-content-center" aria-label="Confirmation Button">
        <pv-button @click="saveDeliverable" class="bg-white text-black-alpha-90 border-black-alpha-90 border-round-3xl text-xl" aria-label="Confirm Button">
          {{ $t('deliverable-list-part8') }}
        </pv-button>

        <div class="text-red-500 mt-2" v-if="errors.title">{{ errors.title }}</div>
        <div class="text-red-500" v-if="errors.description">{{ errors.description }}</div>
        <div class="text-red-500" v-if="errors.deadline">{{ errors.deadline }}</div>
      </div>
    </div>
  </pv-modal>

  <div class="flex flex-column flex align-items-center mb-5">
    <span class="pi pi-plus-circle cursor-pointer" style="font-size: 3rem; color:white;" @click="addDeliverable"></span>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}
</style>

