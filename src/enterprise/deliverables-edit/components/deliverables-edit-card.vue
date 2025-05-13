<script>
import { DeliverableService } from "../../../../public/services/deliverable.service.js";

export default {
  name: 'deliverable-edit-card',
  data() {
    return {
      editableDeliverable: {
        id: null,
        name: '',
        description: '',
        deadline: null
      },
      originalDeliverable: {
        id: null,
        name: '',
        description: '',
        deadline: null
      },
      validationErrors: {
        name: '',
        description: '',
        deadline: ''
      },
      hasSubmitted: false,
      deliverableService: new DeliverableService(),
    };
  },
  async created() {
    const { projectId, deliverableId } = this.$route.params;
    await this.fetchDeliverable(projectId, deliverableId);
  },
  methods: {
    async fetchDeliverable(projectId, deliverableId) {
      try {
        const deliverable = await this.deliverableService.getDeliverableById(projectId, deliverableId);
        const formattedDate = deliverable.date ? new Date(deliverable.date) : null;
        this.editableDeliverable = {
          id: deliverable.id,
          name: deliverable.name,
          description: deliverable.description,
          deadline: formattedDate
        };
        this.originalDeliverable = {
          id: deliverable.id,
          name: deliverable.name,
          description: deliverable.description,
          deadline: formattedDate
        };
      } catch (error) {
        console.error('Error fetching deliverable:', error);
      }
    },
    formatDateForBackend(date) {
      return new Date(date).toISOString().slice(0, 19);
    },
    validateForm() {
      this.validationErrors = {name: '', description: '', deadline: ''};
      let valid = true;

      const now = new Date();

      if (!this.editableDeliverable.name.trim()) {
        this.validationErrors.name = 'El título es obligatorio.';
        valid = false;
      } else if (this.editableDeliverable.name.trim().length < 10) {
        this.validationErrors.name = 'El título debe tener al menos 10 caracteres.';
        valid = false;
      }

      if (!this.editableDeliverable.description.trim()) {
        this.validationErrors.description = 'La descripción es obligatoria.';
        valid = false;
      } else if (this.editableDeliverable.description.trim().length < 20) {
        this.validationErrors.description = 'La descripción debe tener al menos 20 caracteres.';
        valid = false;
      }

      if (!this.editableDeliverable.deadline) {
        this.validationErrors.deadline = 'La fecha es obligatoria.';
        valid = false;
      } else if (new Date(this.editableDeliverable.deadline) < now) {
        this.validationErrors.deadline = 'La fecha no puede ser anterior a la actual.';
        valid = false;
      }


      return valid;
    },
    hasChanges() {
      const d1 = this.editableDeliverable;
      const d2 = this.originalDeliverable;
      return d1.name !== d2.name ||
          d1.description !== d2.description ||
          new Date(d1.deadline).getTime() !== new Date(d2.deadline).getTime();
    },
    async updateDeliverable() {
      this.hasSubmitted = true;
      if (!this.validateForm()) {
        return;
      }

      try {
        const {projectId} = this.$route.params;
        const payload = {
          name: this.editableDeliverable.name,
          description: this.editableDeliverable.description,
          date: this.formatDateForBackend(this.editableDeliverable.deadline)
        };
        await this.deliverableService.updateDeliverable(
            projectId,
            this.editableDeliverable.id,
            payload
        );
        this.$router.push(`/Projects/${projectId}/Deliverables`);
      } catch (error) {
        console.error('Error updating deliverable:', error);
      }
    }
  }
};
</script>

<template>
  <div class="flex justify-content-center">
    <div class="card-style p-6 mt-6 mb-6">
      <h1 class="flex align-items-center justify-content-center">{{ $t('Edit deliverable') }}</h1>
      <div v-if="editableDeliverable.id" class="flex flex-column">
        <!-- Name -->
        <pv-textarea
            v-model="editableDeliverable.name"
            :placeholder="$t('deliverable-list-part4')"
            class="mb-1 pr-5"
            maxlength="50"
            aria-label="Title Textarea"
        />
        <small v-if="hasSubmitted && validationErrors.name" class="text-red-500 mb-3">
          {{ validationErrors.name }}
        </small>

        <!-- Description -->
        <pv-textarea
            v-model="editableDeliverable.description"
            :placeholder="$t('deliverable-list-part5')"
            class="mb-1"
            aria-label="Description Textarea"
        />
        <small v-if="hasSubmitted && validationErrors.description" class="text-red-500 mb-3">
          {{ validationErrors.description }}
        </small>

        <!-- Deadline -->
        <pv-calendar
            v-model="editableDeliverable.deadline"
            :placeholder="$t('deliverable-list-part9')"
            class="mb-1"
            showTime
            hourFormat="24"
            :showIcon="true"
            aria-label="Deadline Calendar"
        />
        <small v-if="hasSubmitted && validationErrors.deadline" class="text-red-500 mb-3">
          {{ validationErrors.deadline }}
        </small>

        <!-- Save Button -->
        <div class="flex justify-content-center mt-4">
          <pv-button
              @click="updateDeliverable"
              :disabled="!hasChanges()"
              class="bg-white text-black-alpha-90 border-black-alpha-90 border-round-3xl text-xl"
              aria-label="Save Button"
          >
            {{ $t('Guardar') }}
          </pv-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-style {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  width: 60%;
}

textarea {
  resize: none;
}
</style>
