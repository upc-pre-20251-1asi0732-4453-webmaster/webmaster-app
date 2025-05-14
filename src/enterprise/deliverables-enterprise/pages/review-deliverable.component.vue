// review-deliverable.vue

<script>
import { DeliverableService } from '../../../../public/services/deliverable.service.js';
import DeliverableCard from '../components/deliverable-card.component.vue';
import ConfirmationDialog from '../components/confirmationDialog.component.vue';

export default {
  name: 'review-deliverable',
  components: { ConfirmationDialog, DeliverableCard },
  data() {
    return {
      myDeliverable: null,
      showConfirmationDialog: false,
      deliverableService: new DeliverableService(),
      action: null
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
        this.myDeliverable = deliverable;
      } catch (error) {
        console.error('Error fetching deliverable:', error);
      }
    },
    async approveDeliverable() {
      const { projectId, deliverableId } = this.$route.params;
      await this.deliverableService.reviewDeliverable(projectId, deliverableId, true);
      this.$router.push(`/Projects/${projectId}/Deliverables/${deliverableId}/Approved`);
    },
    async rejectDeliverable() {
      const { projectId, deliverableId } = this.$route.params;
      await this.deliverableService.reviewDeliverable(projectId, deliverableId, false);
      this.$router.push(`/Projects/${projectId}/Deliverables/${deliverableId}/Rejected`);
    },
    handleApproval(action) {
      console.log('handleApproval action:', action);
      this.action = action;
      this.showConfirmationDialog = true;
    },
    handleRejection(action) {
      console.log('handleApproval action:', action);
      this.action = action;
      this.showConfirmationDialog = true;
    },
    async confirmAction() {
      if (this.action === 'approve') {
        await this.approveDeliverable();
      } else if (this.action === 'reject') {
        await this.rejectDeliverable();
      }
      this.showConfirmationDialog = false;
    }
  }
};
</script>

<template>
  <div :class="{ blur: showConfirmationDialog }">
    <deliverable-card :deliverable="myDeliverable" @approve-deliverable="handleApproval" @reject-deliverable="handleRejection"></deliverable-card>
  </div>
  <div v-if="showConfirmationDialog" class="dialog-container">
    <confirmation-dialog :action="action" @confirm="confirmAction" @cancel="showConfirmationDialog = false"></confirmation-dialog>
  </div>
</template>

<style scoped>
.blur {
  filter: blur(2px);
}

.dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Optional: This adds a semi-transparent background */
}
</style>
