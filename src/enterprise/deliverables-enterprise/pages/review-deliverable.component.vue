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
    async reviewDeliverable(isApproved) {
      const { projectId, deliverableId } = this.$route.params;
      try {
        await this.deliverableService.reviewDeliverable(projectId, deliverableId, isApproved);

        const status = isApproved ? 'Approved' : 'Rejected';
        this.$router.push(`/Projects/${projectId}/Deliverables/${deliverableId}/${status}`);
      } catch (error) {
        console.error('Error reviewing deliverable:', error);
      }
    },
    handleApproval(action) {
      this.action = action;
      this.showConfirmationDialog = true;
    },
    async confirmAction() {
      const isApproved = this.action === 'approve';
      await this.reviewDeliverable(isApproved);
      this.showConfirmationDialog = false;
    }
  }
};
</script>

<template>
  <div :class="{ blur: showConfirmationDialog }">
    <deliverable-card :deliverable="myDeliverable" @approve-deliverable="handleApproval('approve')" @reject-deliverable="handleApproval('reject')"></deliverable-card>
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
  background-color: rgba(0, 0, 0, 0.5);
}
</style>