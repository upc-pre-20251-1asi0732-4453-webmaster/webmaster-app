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

    // --- Variables de Error ---
    const summaryRequiredError = ref(false);
    const summaryLengthError = ref(false);
    const countryRequiredError = ref(false);
    const countryLettersOnlyError = ref(false);
    const rucRequiredError = ref(false);
    const rucOnlyNumbersError = ref(false);
    const rucMinLengthError = ref(false);
    const phoneRequiredError = ref(false);
    const phoneNumbersPlusError = ref(false);
    const phoneMinLengthError = ref(false);
    const websiteRequiredError = ref(false);
    const websiteFormatError = ref(false);
    const sectorRequiredError = ref(false);
    const sectorMinLengthError = ref(false);

    const hasValidationErrors = computed(() => {
      return summaryRequiredError.value || summaryLengthError.value ||
          countryRequiredError.value || countryLettersOnlyError.value ||
          rucRequiredError.value || rucOnlyNumbersError.value || rucMinLengthError.value ||
          phoneRequiredError.value || phoneNumbersPlusError.value || phoneMinLengthError.value ||
          websiteRequiredError.value || websiteFormatError.value ||
          sectorRequiredError.value || sectorMinLengthError.value;
    });

    // --- Funciones de Validación ---
    const validateSummary = () => {
      summaryRequiredError.value = mainText.value.trim() === "";
      summaryLengthError.value = !summaryRequiredError.value && mainText.value.trim().length < 20;
      return !summaryRequiredError.value && !summaryLengthError.value;
    };



    const validateCountry = (text) => {
      const trimmed = text.trim();
      countryRequiredError.value = trimmed === "";
      countryLettersOnlyError.value = !countryRequiredError.value && !/^[a-zA-Z\s]*$/.test(trimmed);
      return !countryRequiredError.value && !countryLettersOnlyError.value;
    };

    const validateRUC = (text) => {
      const trimmed = text.trim();
      rucRequiredError.value = trimmed === "";
      rucOnlyNumbersError.value = !rucRequiredError.value && /\D/.test(trimmed);
      rucMinLengthError.value = !rucRequiredError.value && trimmed.length < 11;
      return !rucRequiredError.value && !rucOnlyNumbersError.value && !rucMinLengthError.value;
    };

    const validatePhone = (text) => {
      const trimmed = text.trim();
      phoneRequiredError.value = trimmed === "";

      const hasMultipleSpaces = (trimmed.split(' ').length - 1) > 1;
      const startsWithPlusAndHasSpaceAfter = /^\+\s/.test(trimmed);
      const hasSpaceNotAfterPlus = /^\+[^\s]/.test(trimmed) && trimmed.includes(' ');
      const isValidFormat = /^\+?\d+(\s?\d+)*$/.test(trimmed);

      phoneNumbersPlusError.value = !phoneRequiredError.value &&
          (!isValidFormat || startsWithPlusAndHasSpaceAfter || hasSpaceNotAfterPlus || hasMultipleSpaces);

      phoneMinLengthError.value = !phoneRequiredError.value &&
          !phoneNumbersPlusError.value && trimmed.replace(/\s/g, '').length < 7;

      return !phoneRequiredError.value && !phoneNumbersPlusError.value && !phoneMinLengthError.value;
    };

    const validateWebsite = (text) => {
      const trimmed = text.trim();
      websiteRequiredError.value = trimmed === "";
      // Validar formato de URL simple (no perfecta, pero útil para frontend)
      websiteFormatError.value = !websiteRequiredError.value && !/^https?:\/\/[\w.-]+\.\w+/.test(trimmed);
      return !websiteRequiredError.value && !websiteFormatError.value;
    };


    // Editar campo principal (descripción)
    const toggleEditingMain = async () => {
      if ( isEditingMain.value ) {
        const isValid = validateSummary();
          if (!isValid) return;
        }
      isEditingMain.value = !isEditingMain.value;
    };





    const saveAllChanges = async () => {
      // Resetear todos los errores
      summaryRequiredError.value = false;
       summaryLengthError.value = false;
       countryRequiredError.value = false;
       countryLettersOnlyError.value = false;
       rucRequiredError.value = false;
       rucOnlyNumbersError.value = false;
       rucMinLengthError.value = false;
       phoneRequiredError.value = false;
       phoneNumbersPlusError.value = false;
       phoneMinLengthError.value = false;
       websiteRequiredError.value = false;
       websiteFormatError.value = false;
       sectorRequiredError.value = false;
       sectorMinLengthError.value = false;

      // Validar cada campo
      const isSummaryValid = validateSummary(mainText.value);
      const isCountryValid = validateCountry(categoryTexts.value[0]);
      const isRUCValid = validateRUC(categoryTexts.value[1]);
      const isPhoneValid = validatePhone(categoryTexts.value[2]);
      const isWebsiteValid = validateWebsite(categoryTexts.value[3]);
      const isSectorValid = validateSummary(categoryTexts.value[4]);

      //Si todos los campos son validos
      if (isCountryValid && isRUCValid && isPhoneValid && isWebsiteValid && isSectorValid) {
        const updatedInfo = {
          enterpriseName: props.company.enterprise_name,
          description: mainText.value,
          country: categoryTexts.value[0],
          ruc: categoryTexts.value[1],
          phone: categoryTexts.value[2],
          website: categoryTexts.value[3],
          profileImgUrl: props.company.profile_img_url,
          sector: categoryTexts.value[4]
        };

        try {
          await homeService.updateEnterpriseInfo(userId, updatedInfo);
          isEditingCategories.value = [false, false, false, false, false];
          isEditingMain.value = false;
        } catch (err) {
          console.error("Error al actualizar categoría:", err);
        }
      }
    };




    const toggleEditingCategory = async (index) => {
      if (isEditingCategories.value[index]) {
        // El usuario está saliendo del modo edición
        // Validamos, pero NO hacemos update
        let isValid = false;
        const text = categoryTexts.value[index];

        // Resetear errores para este campo antes de validar
        if (index === 0) { // Country
          countryRequiredError.value = false;
          countryLettersOnlyError.value = false;
          isValid = validateCountry(text);
        } else if (index === 1) { // RUC
          rucRequiredError.value = false;
          rucOnlyNumbersError.value = false;
          rucMinLengthError.value = false;
          isValid = validateRUC(text);
        } else if (index === 2) { // Phone
          phoneRequiredError.value = false;
          phoneNumbersPlusError.value = false;
          phoneMinLengthError.value = false;
          isValid = validatePhone(text);
        } else if (index === 3) { // Website
          websiteRequiredError.value = false;
          websiteFormatError.value = false;
          isValid = validateWebsite(text);
        } else if (index === 4) { // Sector
          sectorRequiredError.value = false;
          sectorMinLengthError.value = false;
          isValid = validateSummary(text);
        }


        // Si NO es válido, no permitas salir del modo edición
        if (!isValid) return;
      }

      // Alternar el estado de edición
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
      closeDialog,


      // --- Variables de Error para el Template ---
      summaryRequiredError,
      summaryLengthError,
      countryRequiredError,
      countryLettersOnlyError,
      rucRequiredError,
      rucOnlyNumbersError,
      rucMinLengthError,
      phoneRequiredError,
      phoneNumbersPlusError ,
      phoneMinLengthError ,
      websiteRequiredError,
      websiteFormatError,
      sectorRequiredError,
      sectorMinLengthError,
      hasValidationErrors ,
      saveAllChanges
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
            :class="{'p-invalid': summaryRequiredError || summaryLengthError}" />
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
      <small id="summary-required-error" v-if="summaryRequiredError" class="p-error">El summary es requerido.</small>
      <small id="summary-length-error" v-if="summaryLengthError" class="p-error">El summary debe tener al menos 20 caracteres.</small>
      <br v-if="summaryRequiredError || summaryLengthError">

      <!-- Campos editables básicos -->
      <div v-for="(label, idx) in ['country','ruc','phone',/*'email'*/'website','sector']"
           :key="idx"
           class="editable-container secondary"
      >
        <div class="subtitle">{{ $t(`categories.${label}`) }}</div>
        <span v-if="!isEditingCategories[idx]" class="editable-text">{{ categoryTexts[idx] }}</span>
        <input
            v-else
            v-model="categoryTexts[idx]"
            type="text"
            class="editable-input"
            :class="{
            'p-invalid': idx === 0 ? countryRequiredError || countryLettersOnlyError :
               idx === 1 ? rucRequiredError || rucOnlyNumbersError || rucMinLengthError :
               idx === 2 ? phoneRequiredError || phoneNumbersPlusError || phoneMinLengthError :
               idx === 3 ? websiteRequiredError || websiteFormatError :
               idx === 4 ? sectorRequiredError || sectorMinLengthError :
               false
          }"

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

      <button
          class="button-green"
          @click="saveAllChanges" :disabled="hasValidationErrors">
        Guardar cambios
      </button>

      <div class="error-messages">
        <small id="country-required-error" v-if="countryRequiredError" class="p-error">El país es obligatorio.</small><br v-if="countryRequiredError">
        <small id="country-letters-only-error" v-if="countryLettersOnlyError" class="p-error">El país solo debe contener letras y espacios.</small><br v-if="countryLettersOnlyError">

        <small id="ruc-required-error" v-if="rucRequiredError" class="p-error">El RUC es obligatorio.</small><br v-if="rucRequiredError">
        <small id="ruc-only-numbers-error" v-if="rucOnlyNumbersError" class="p-error">El RUC solo debe contener números.</small><br v-if="rucOnlyNumbersError">
        <small id="ruc-min-length-error" v-if="rucMinLengthError" class="p-error">El RUC debe tener al menos 11 caracteres.</small><br v-if="rucMinLengthError">

        <small id="phone-required-error" v-if="phoneRequiredError" class="p-error">El teléfono es obligatorio.</small><br v-if="phoneRequiredError">
        <small id="phone-numbers-plus-error" v-if="phoneNumbersPlusError" class="p-error">Número en formato incorrecto.</small><br v-if="phoneNumbersPlusError">
        <small id="phone-min-length-error" v-if="phoneMinLengthError" class="p-error">El teléfono es demasiado corto.</small><br v-if="phoneMinLengthError">

        <small id="website-required-error" v-if="websiteRequiredError" class="p-error">El sitio web es obligatorio.</small><br v-if="websiteRequiredError">
        <small id="website-format-error" v-if="websiteFormatError" class="p-error">El formato del sitio web es incorrecto.</small><br v-if="websiteFormatError">

        <small id="sector-required-error" v-if="sectorRequiredError" class="p-error">El sector es obligatorio.</small><br v-if="sectorRequiredError">
        <small id="sector-min-length-error" v-if="sectorMinLengthError" class="p-error">El sector debe tener al menos 3 caracteres.</small><br v-if="sectorMinLengthError">
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
  .button-green {
    background-color: #16a34a; /* Equivalente a bg-green-600 */
    color: #ffffff;            /* Texto blanco */
    padding: 0.5rem 1rem;      /* py-2 (0.5rem top/bottom) y px-4 (1rem left/right) */
    border-radius: 9999px;     /* Borde redondeado al máximo (pill shape) */
    border: none;              /* Sin borde */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1); /* Sombra grande similar a shadow-lg */
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease;
  }
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
