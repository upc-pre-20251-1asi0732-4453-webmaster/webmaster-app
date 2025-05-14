<script>
import DeliverablesScheduleCard from "../components/deliverables-schedule-card.component.vue";
import { DeliverableService } from "../../../../public/services/deliverable.service.js";
import {DeliverableEntity} from "../../../shared/models/deliverable.model.js";

export default {
  name: "deliverables-list",
  props: ['projectId'],
  components: {
    'deliverable-card': DeliverablesScheduleCard
  },
  data() {
    return {
      deliverables: [],
      projectId: this.$route.params.projectId,
      //projectId: 1,
      deliverableService: new DeliverableService(),
      visible: false,
      editableDeliverable: {
        title: '',
        description: '',
        deadlineDateValue: '',
        deadlineTime: ''
      },
      isEditing: false
    };
  },
  methods: {
    async fetchDeliverables() {
      try {
        const deliverables = await this.deliverableService.getAllDeliverables(this.projectId);
        this.deliverables = deliverables.map(deliverableData => {
          const dateObj = new Date(deliverableData.date);
          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          const timeStr = `${hours}:${minutes}`;

          return new DeliverableEntity(
              deliverableData.id,               // deliverable_id
              deliverableData.name,             // title
              deliverableData.description,      // description
              deliverableData.developerDescription, // (si existe)
              deliverableData.state,            // state
              deliverableData.file,             // (si existe)
              dateObj,
              timeStr,
              deliverableData.orderNumber,      // (si existe)
              deliverableData.projectID,        // (si existe)
              deliverableData.developer_id      // (si existe)
          );
        });
        console.log('Array of deliverables:', this.deliverables);
      } catch (error) {
        console.error('Error fetching deliverables:', error);
      }
    }
  },
  created() {
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
                        :deliverable="deliverable"/>
    </div>
  </div>

</template>

<style scoped>
textarea {
  resize: none;
}
</style>