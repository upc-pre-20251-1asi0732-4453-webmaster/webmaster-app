<script>
import { ref, computed } from "vue";
import { HomeService } from "../../../../public/services/home.service.js";
import useSupabase from "../../../utils/supabase.js"

export default {
  name: "company-main-page",
  props: {
    company: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const homeService = new HomeService();
    const { uploadFile, getPublicUrl } = useSupabase();

    const previewImage = ref(null);
    const selectedFile = ref(null);

    console.log(props.company, "props.company");

    // Usar directamente el ID de la empresa desde props
    const enterpriseId = computed(() => props.company.enterprise_id || props.company.id);
    console.log(enterpriseId, "enterpriseId");

    const userId = localStorage.getItem("user id");

    // Estados de edición
    const isEditingMain = ref(false);
    const mainText = ref(props.company.description || "");
    const isEditingCategories = ref([false, false, false, false, false]);
    const categoryTexts = ref([
      props.company.country || "",
      props.company.RUC || "",
      props.company.phone || "",
      props.company.website || "",
      props.company.sector || ""
    ]);
    const displayDialog = ref(false);
    const newImgUrl = ref("");

    // Editar campo principal (descripción)
    const toggleEditingMain = async () => {
      if ( isEditingMain.value ) {
        const updatedInfo = {
          // Aquí definimos exactamente el payload que espera el endpoint PUT /enterprises/{id}
          enterpriseName: props.company.enterprise_name,
          description:    mainText.value,
          country:        categoryTexts.value[0],
          ruc:            categoryTexts.value[1],
          phone:          categoryTexts.value[2],
          website:        categoryTexts.value[3],
          profileImgUrl:  props.company.profile_img_url,
          sector:         categoryTexts.value[4]
        };

        try {
          await homeService.updateEnterpriseInfo( userId, updatedInfo );
        }
        catch(err) {
          console.error("Error al actualizar información:", err);
        }
      }
      isEditingMain.value = !isEditingMain.value;
    };

    // Editar categoría individual
    const toggleEditingCategory = async (index) => {
      if ( isEditingCategories.value[index] ) {
        const updatedInfo = {
          enterpriseName: props.company.enterprise_name,
          description:    mainText.value,
          country:        categoryTexts.value[0],
          ruc:            categoryTexts.value[1],
          phone:          categoryTexts.value[2],
          website:        categoryTexts.value[3],
          profileImgUrl:  props.company.profile_img_url,
          sector:         categoryTexts.value[4]
        };

        try {
          await homeService.updateEnterpriseInfo( userId, updatedInfo );
        }
        catch(err) {
          console.error("Error al actualizar categoría:", err);
        }
      }
      isEditingCategories.value[index] = !isEditingCategories.value[index];
    };

    const handleFileSelect = (event) => {
      const file = event.files[0];
      if (!file) return;

      selectedFile.value = file;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    // Actualizar imagen
    const updateImg = async () => {
      try {
        if (selectedFile.value) {
          const fileExtension = selectedFile.value.name.split('.').pop().toLowerCase();
          const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

          if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Formato de imagen no válido. Use JPG, PNG o GIF');
          }

          // Nombre del archivo: "profile_[ID_EMPRESA].[extensión]"
          const filePath = `profiles/profile_enterprise_${enterpriseId.value}.${fileExtension}`;

          // Opción 1: Usando tu función uploadFile existente
          await uploadFile("webmasterprofiles", filePath, selectedFile.value);

          const publicUrl = `${getPublicUrl("webmasterprofiles", filePath)}?t=${Date.now()}`;
          newImgUrl.value = publicUrl;
        }

        if (newImgUrl.value) {
          const updatedInfo = {
            enterpriseName: props.company.enterprise_name,
            description: mainText.value,
            country: categoryTexts.value[0],
            ruc: categoryTexts.value[1],
            phone: categoryTexts.value[2],
            website: categoryTexts.value[3],
            profileImgUrl: newImgUrl.value, // Usar la nueva URL
            sector: categoryTexts.value[4]
          };

          await homeService.updateEnterpriseInfo(userId, updatedInfo);

          closeDialog();

          window.location.reload();
        }
      } catch (err) {
        console.error("Error al actualizar imagen:", err);
      }
    };

    const openDialog = () => (displayDialog.value = true);
    const closeDialog = () => {
      displayDialog.value = false;
      previewImage.value = null;
      selectedFile.value = null;
      newImgUrl.value = "";
    };
    return {
      isEditingMain,
      mainText,
      isEditingCategories,
      categoryTexts,
      displayDialog,
      newImgUrl,
      previewImage,
      toggleEditingMain,
      toggleEditingCategory,
      updateImg,
      handleFileSelect,
      openDialog,
      closeDialog
    };
  }
};
</script>

<template>
  <pv-card aria-label="Company Information" class="flex col gap-1">
    <template #title>
      <pv-avatar
          :image="company.profile_img_url"
          class="mr-2"
          size="xlarge"
          shape="circle"
          @click="openDialog"
      />
      <div aria-label="Company Name">
        <p>{{ company.enterprise_name }}</p>
      </div>
    </template>

    <template #content>
      <hr aria-label="Separator Line" />
      <div class="subtitle" aria-label="Summary">{{ $t('company-main-page-part1') }}</div>
      
      <!-- Descripción editable -->
      <div class="editable-container">
        <span v-if="!isEditingMain" class="editable-text">{{ mainText }}</span>
        <pv-textarea
            v-else
            v-model="mainText"
            auto-resize
            class="editable-input"
        />
        <pv-button
            @click="toggleEditingMain"
            icon="pi pi-pencil"
            class="edit-button"
            v-if="!isEditingMain"
        />
        <pv-button
            @click="toggleEditingMain"
            icon="pi pi-check"
            class="edit-button"
            v-else
        />
      </div>

      <!-- Campos editables básicos -->
      <div v-for="(label, idx) in ['country','ruc','phone',/*'email'*/'website','sector']" :key="idx" class="editable-container secondary">
        <div class="subtitle">{{ $t(`categories.${label}`) }}</div>
        <span v-if="!isEditingCategories[idx]" class="editable-text">{{ categoryTexts[idx] }}</span>
        <input
            v-else
            v-model="categoryTexts[idx]"
            type="text"
            class="editable-input"
        />
        <pv-button
            @click="toggleEditingCategory(idx)"
            icon="pi pi-pencil"
            class="edit-button"
            v-if="!isEditingCategories[idx]"
        />
        <pv-button
            @click="toggleEditingCategory(idx)"
            icon="pi pi-check"
            class="edit-button"
            v-else
        />
      </div>
    </template>
  </pv-card>

  <!-- Diálogo para cambiar imagen -->
  <pv-modal v-model:visible="displayDialog" modal header="Update Image URL" style="width: 80%; height: 100%;max-width: 600px; min-width: 300px; max-height: 500px;" class="flex flex-column justify-content-center gap-5">
    <img
        v-if="previewImage"
        :src="previewImage"
        alt="Vista previa"
        class="preview-image"
    />
    <pv-file-upload
        mode="basic"
        name="file"
        :customUpload="true"
        @select="handleFileSelect"
        accept="image/*"
        chooseLabel="Select Image"
        class="mb-3"
    />

    <div class="flex flex-column gap-2">
      <label for="imageUrl">O ingresar URL:</label>
      <pv-inputText
          id="imageUrl"
          v-model="newImgUrl"
          placeholder="https://ejemplo.com/imagen.jpg"
      />
    </div>

    <footer class="w-full flex justify-content-center gap-2 mt-4">
      <pv-button label="Accept" @click="updateImg" />
      <pv-button label="Cancel" @click="closeDialog" />
    </footer>
  </pv-modal>
</template>

  <style scoped>
    .editable-container { display:flex; align-items:center; margin: .5rem 0; }
    .editable-input { flex:1; border-bottom:1px solid #ccc; padding: .25rem; }
    .edit-button { margin-left:.5rem; max-height: 34px; }
    .secondary { display:grid; grid-template-columns: 1fr auto; gap: .5rem; align-items:center; }
    .subtitle { color: #64748b; width: 6rem; }

    .editable-container { display:flex; align-items:center; margin: .5rem 0; }
    .editable-input { flex:1; border-bottom:1px solid #ccc; padding: .25rem; }
    .edit-button { margin-left:.5rem; }
    .secondary { display:grid; grid-template-columns: 1fr auto; gap: .5rem; align-items:center; }
    .subtitle { color: #64748b; width: 6rem; }


hr{
  opacity:0.3;
}

@media (max-width: 799px) {
  .p-card{
    margin-top:2rem;
  }
}
.p-card {
  width: 30rem;
  min-width: 20rem;
  box-shadow: 0 20px 40px rgb(57, 57, 57);
  margin-top: 4rem;
  max-height: 800px;
  min-height: 620px;
}

:deep(.p-card-title) {
  display: flex;
  align-items: center;
  margin: 20px 20px 0 20px;
  justify-content: center;
}
:deep(.p-avatar) {
  display: flex;
  justify-content: center;
}
img {
  min-width: 64px;
}

:deep(.p-card-content) {
  margin: 0 20px;
}
:deep(.p-rating .p-rating-item.p-rating-item-active .p-rating-icon) {
  color: gold;
}
.subtitle {
  color: #64748b;
}

.editable-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.editable-text{
  word-wrap: break-word;
}
.editable-text,
.editable-input {
  flex-grow: 1;
  border: none;
}



.editable-input{
  border: none;
  border-bottom: 1px solid black;
  outline: none;
  font-family: inherit;
  resize: none;
  overflow: hidden;
  word-wrap: break-word;
  min-height: 1.2rem;
}

:deep(.p-inputtext) {
  box-shadow: 0 0 #0000, 0 0 #0000, 0 0 0 0 rgba(18, 18, 23, 0.05) !important;
  padding: 0 !important;
  border-radius: 0px;

}

span{
  max-width: 90%;
}

.edit-button {
  padding: 6px;
  height: 100%;
}
:deep(.p-button.p-button-text) {
  background-color: transparent;
  color: #B864F3;
  border-color: transparent;
}
.secondary{
  display:grid;
  grid-template-columns: 10fr 10fr 1fr;
}
    .preview-image {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 8px;
      margin: 0 auto;
      display: block;
      border: 1px solid #ddd;
    }

</style>
