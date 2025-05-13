<script>
import { DeliverableService } from "../../../../public/services/deliverable.service.js";
import { supabase } from "../../../config/supabase.js";

export default {
  name: 'CreateDeliverableCard',
  data() {
    return {
      developerDescription: '',
      file: null,
      uploadedFiles: [],
      deliverableService: new DeliverableService(),
      deliverable: {},
      summaryError: false,
    };
  },
  methods: {
    triggerUpload() {
      if (this.developerDescription.length < 20) {
        this.summaryError = true;
      } else {
        this.summaryError = false;
        this.uploadFile();
      }
    },
    onFileSelect(event) {
      const file = event.files[0];
      this.file = file;
      this.uploadedFiles = [file];
    },

    redirectToDeliverables() {
      const projectId = this.$route.params.projectId;
      this.$router.push(`/projects/developers/${projectId}/Deliverables`);
    },

    async uploadFile() {
      const projectId = this.$route.params.projectId;
      const deliverableId = this.$route.params.deliverableId;

      // normalize the file name (remove special characters)
      const normalizeFileName = this.file.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9._-]/g, "");

      const filePath = `${Date.now()}_${normalizeFileName}`;

      // update the file to supabease storage
      const {data, error} = await supabase.storage
          .from("deliverables")
          .upload(filePath, this.file);

      if (error) {
        console.error("error", error.message);
        return;
      }

      // get URL of the file
      const {data: urlData} = supabase.storage
          .from("deliverables")
          .getPublicUrl(filePath);

      // the object to sent to the backend with the data (as the uploadDeliverableRequest model)
      const uploadData = {
        developerDescription: this.developerDescription,
        file: urlData.publicUrl,
      };

      try {
        //send the file to the backend
        const response = await this.deliverableService.uploadDeliverableFile(projectId, deliverableId, uploadData);
        this.$router.push(`/Projects/${projectId}/Deliverables/${deliverableId}/Upload`);
      } catch (error) {
        console.error("error in the backend:", error);
      }
    }
  }
};
</script>

<template>
  <div>
    <form @submit.prevent="triggerUpload">
      <pv-card class="shadow-8 card">
        <template #title>
          <div class="flex flex-column justify-content-center align-items-center mt-3 mb-4"
               aria-label="Deliverable Title">
            <div>{{ $t('delivery-card-part1') }} {{ deliverable.orderNumber }}</div>
            <i class="pi pi-times close-button" style="font-size: 1.8rem" @click="redirectToDeliverables()"
               aria-label="Close Card"> </i>
          </div>
        </template>

        <template #content>
          <div class="flex flex-column">
            <label class="font-bold text-xl mb-3" for="description">{{ $t('upload-description') }}</label>
            <pv-textarea
                v-model="developerDescription"
                auto-resize
                rows="5"
                cols="30"
                class="mb-1"
                :class="{ 'p-invalid': summaryError }"
            ></pv-textarea>
            <small v-if="summaryError" class="p-error">{{ $t('Description debe tener al menos 20 caracteres') }}</small>
          </div>
          <hr>
        </template>

        <template #footer>
          <div class="flex flex-column justify-content-center align-items-center">
            <div class="font-bold text-xl mb-2">{{ $t('delivery-card-part5') }}</div>

            <pv-file-upload
                class="large-fileupload"
                name="demo[]"
                mode="advanced"
                :multiple="false"
                :maxFileSize="26214400"
                accept=".pdf,.doc,.docx,.rar,.zip,.png,.jpg,.jpeg"
                @select="onFileSelect"
            >
              <template #empty>
                <div v-for="(file, index) in uploadedFiles" :key="index">
                  <p>{{ file.name }}</p>
                </div>
                <p>{{ $t('create-project-part10') }}</p>
              </template>
            </pv-file-upload>

            <pv-button
                :label="$t('send-deliverable')"
                type="submit"
                class="text-black-alpha-90 border-black-alpha-90 border-round-3xl text-xl bg-white mt-3"
            ></pv-button>
          </div>
        </template>
      </pv-card>
    </form>
  </div>
</template>

<style scoped>
.card {
  width: 75%;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto 9rem;
  position: relative;
}

.close-button {
  position: absolute;
  padding: 20px;
  top: 10px;
  left: 10px;
  cursor: pointer;
}
</style>