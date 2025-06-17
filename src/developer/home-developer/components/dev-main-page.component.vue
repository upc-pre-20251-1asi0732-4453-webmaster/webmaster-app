<script>
import { ref, computed } from "vue";
import { HomeService } from "../../../../public/services/home.service.js";
import useSupabase from "../../../utils/supabase.js";

export default {
  name: "dev-main-page",
  props: {
    developer: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const homeService = new HomeService();
    const { uploadFile, getPublicUrl } = useSupabase();

    const previewImage = ref(null);
    const selectedFile = ref(null);

    console.log(props.developer, "props.developer");

    const developerId = computed(() => props.developer.user.id);
    const userId = localStorage.getItem("user id");

    // Estados de edición
    const isEditingMain = ref(false);
    const mainText = ref(props.developer.description || "");
    const isEditingCategories = ref([false, false, false]);
    const categoryTexts = ref([
      props.developer.country || "",
      props.developer.phone || "",
      props.developer.specialties || ""
    ]);
    const displayDialog = ref(false);
    const newImgUrl = ref("");

    // Estados para hover de imagen
    const isHoveringImage = ref(false);

    // --- Variables de Error ---
    const summaryRequiredError = ref(false);
    const summaryLengthError = ref(false);
    const countryRequiredError = ref(false);
    const countryLettersOnlyError = ref(false);
    const phoneRequiredError = ref(false);
    const phoneNumbersPlusError = ref(false);
    const phoneMinLengthError = ref(false);
    const specialtiesRequiredError = ref(false);
    const specialtiesLengthError = ref(false);
    const specialtiesAllowedCharsError = ref(false);

    const hasValidationErrors = computed(() => {
      return summaryRequiredError.value || summaryLengthError.value ||
          countryRequiredError.value || countryLettersOnlyError.value ||
          phoneRequiredError.value || phoneNumbersPlusError.value || phoneMinLengthError.value ||
          specialtiesRequiredError.value || specialtiesLengthError.value || specialtiesAllowedCharsError.value;
    });

    // Computed para verificar si hay cambios pendientes
    const hasUnsavedChanges = computed(() => {
      return isEditingMain.value || isEditingCategories.value.some(editing => editing);
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

    const validateSpecialties = (text) => {
      const trimmed = text.trim();
      specialtiesRequiredError.value = trimmed === "";
      specialtiesLengthError.value = !specialtiesRequiredError.value && trimmed.length < 2;
      specialtiesAllowedCharsError.value = !specialtiesRequiredError.value && !/^[a-zA-Z0-9\s,]+$/.test(trimmed);
      return !specialtiesRequiredError.value && !specialtiesLengthError.value && !specialtiesAllowedCharsError.value;
    };

    // Editar campo principal (descripción) - solo cambia el estado
    const toggleEditingMain = () => {
      if (isEditingMain.value) {
        const isValid = validateSummary();
        if (!isValid) return;

        if (hasUnsavedChanges.value) {
          alert('¡Tienes cambios sin guardar! Guarda o cancela antes de cerrar este campo.');
          return;
        }
      }
      isEditingMain.value = !isEditingMain.value;
    };

    // Función para guardar todos los cambios
    const saveAllChanges = async () => {
      // Resetear todos los errores
      summaryRequiredError.value = false;
      summaryLengthError.value = false;
      countryRequiredError.value = false;
      countryLettersOnlyError.value = false;
      phoneRequiredError.value = false;
      phoneNumbersPlusError.value = false;
      phoneMinLengthError.value = false;
      specialtiesRequiredError.value = false;
      specialtiesLengthError.value = false;
      specialtiesAllowedCharsError.value = false;

      // Validar cada campo
      const isSummaryValid = validateSummary();
      const isCountryValid = validateCountry(categoryTexts.value[0]);
      const isPhoneValid = validatePhone(categoryTexts.value[1]);
      const isSpecialtiesValid = validateSpecialties(categoryTexts.value[2]);

      // Si todos los campos son válidos
      if (isSummaryValid && isCountryValid && isPhoneValid && isSpecialtiesValid) {
        const updatedInfo = {
          firstName: props.developer.firstName,
          lastName: props.developer.lastName,
          description: mainText.value,
          country: categoryTexts.value[0],
          phone: categoryTexts.value[1],
          specialties: categoryTexts.value[2],
          profileImgUrl: props.developer.profile_img_url
        };

        try {
          await homeService.updateDevInfo(developerId.value, updatedInfo);
          // Salir del modo edición después de guardar exitosamente
          isEditingCategories.value = [false, false, false];
          isEditingMain.value = false;

          // Opcional: Mostrar mensaje de éxito
          console.log("Cambios guardados exitosamente");
        } catch (err) {
          console.error("Error al actualizar información:", err);
        }
      }
    };

    // Función para cancelar cambios
    const cancelAllChanges = () => {
      // Restaurar valores originales
      mainText.value = props.developer.description || "";
      categoryTexts.value = [
        props.developer.country || "",
        props.developer.phone || "",
        props.developer.specialties || ""
      ];

      // Salir del modo edición
      isEditingMain.value = false;
      isEditingCategories.value = [false, false, false];

      // Limpiar errores
      summaryRequiredError.value = false;
      summaryLengthError.value = false;
      countryRequiredError.value = false;
      countryLettersOnlyError.value = false;
      phoneRequiredError.value = false;
      phoneNumbersPlusError.value = false;
      phoneMinLengthError.value = false;
      specialtiesRequiredError.value = false;
      specialtiesLengthError.value = false;
      specialtiesAllowedCharsError.value = false;
    };

    const toggleEditingCategory = (index) => {
      if (isEditingCategories.value[index]) {
        // Validar antes de salir del modo edición
        let isValid = false;
        const text = categoryTexts.value[index];

        if (index === 0) { // Country
          countryRequiredError.value = false;
          countryLettersOnlyError.value = false;
          isValid = validateCountry(text);
        } else if (index === 1) { // Phone
          phoneRequiredError.value = false;
          phoneNumbersPlusError.value = false;
          phoneMinLengthError.value = false;
          isValid = validatePhone(text);
        } else if (index === 2) { // Specialties
          specialtiesRequiredError.value = false;
          specialtiesLengthError.value = false;
          specialtiesAllowedCharsError.value = false;
          isValid = validateSpecialties(text);
        }

        if (!isValid) return;
        if (hasUnsavedChanges.value) {
          alert('¡Tienes cambios sin guardar! Guarda o cancela antes de cerrar este campo.');
          return;
        }
      }

      isEditingCategories.value[index] = !isEditingCategories.value[index];
    };

    const handleFileSelect = (event) => {
      const file = event.files[0];
      if (!file) return;

      selectedFile.value = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const updateImg = async () => {
      try {
        if (selectedFile.value) {
          const fileExtension = selectedFile.value.name.split(".").pop().toLowerCase();
          const allowedExtensions = ["jpg", "jpeg", "png", "gif"];

          if (!allowedExtensions.includes(fileExtension)) {
            throw new Error("Formato de imagen no válido. Use JPG, PNG o GIF");
          }

          const filePath = `profiles/profile_developer_${developerId.value}.${fileExtension}`;
          await uploadFile("webmasterprofiles", filePath, selectedFile.value);
          const publicUrl = `${getPublicUrl("webmasterprofiles", filePath)}?t=${Date.now()}`;
          newImgUrl.value = publicUrl;
        }

        if (newImgUrl.value) {
          const updatedInfo = {
            firstName: props.developer.firstName,
            lastName: props.developer.lastName,
            description: mainText.value,
            country: categoryTexts.value[0],
            phone: categoryTexts.value[1],
            specialties: categoryTexts.value[2],
            profileImgUrl: newImgUrl.value
          };

          await homeService.updateDevInfo(developerId.value, updatedInfo);
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
      isHoveringImage,
      hasUnsavedChanges,
      toggleEditingMain,
      toggleEditingCategory,
      saveAllChanges,
      cancelAllChanges,
      updateImg,
      handleFileSelect,
      openDialog,
      closeDialog,

      // Variables de Error para el Template
      summaryRequiredError,
      summaryLengthError,
      countryRequiredError,
      countryLettersOnlyError,
      phoneRequiredError,
      phoneNumbersPlusError,
      phoneMinLengthError,
      specialtiesRequiredError,
      specialtiesLengthError,
      specialtiesAllowedCharsError,
      hasValidationErrors
    };
  }
};
</script>

<template>
  <pv-card aria-label="Developer Information" class="flex col gap-1">
    <template #title>
      <!-- Avatar con hover effect -->
      <div
          class="avatar-container"
          @mouseenter="isHoveringImage = true"
          @mouseleave="isHoveringImage = false"
          @click="openDialog"
      >
        <pv-avatar
            :image="developer.profile_img_url"
            class="mr-2"
            size="xlarge"
            shape="circle"
        />
        <div class="edit-overlay" :class="{ visible: isHoveringImage }">
          <i class="pi pi-camera edit-icon"></i>
          <span class="edit-text">Editar foto</span>
        </div>
      </div>
      <div aria-label="Developer Name">
        <p>{{ developer.firstName }} {{ developer.lastName }}</p>
      </div>
    </template>

    <template #content>
      <hr aria-label="Separator Line" />
      <div class="subtitle" aria-label="Summary">{{ $t("dev-main-page-part1") }}</div>

      <!-- Descripción editable -->
      <div class="editable-container">
        <span v-if="!isEditingMain" class="editable-text">{{ mainText }}</span>
        <pv-textarea
            v-else
            v-model="mainText"
            auto-resize
            class="editable-input"
            :class="{'p-invalid': summaryRequiredError || summaryLengthError}"
        />
        <pv-button
            @click="toggleEditingMain"
            :icon="isEditingMain ? 'pi pi-check' : 'pi pi-pencil'"
            class="edit-button"
            :class="{ 'editing': isEditingMain }"
        />
      </div>
      <small id="summary-required-error" v-if="summaryRequiredError" class="p-error">El summary es requerido.</small>
      <small id="summary-length-error" v-if="summaryLengthError" class="p-error">El summary debe tener al menos 20 caracteres.</small>
      <br v-if="summaryRequiredError || summaryLengthError">

      <!-- Campos editables básicos -->
      <div v-for="(label, idx) in ['country', 'phone', 'specialties']"
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
               idx === 1 ? phoneRequiredError || phoneNumbersPlusError || phoneMinLengthError :
               idx === 2 ? specialtiesRequiredError || specialtiesLengthError || specialtiesAllowedCharsError :
               false
          }"
        />
        <pv-button
            @click="toggleEditingCategory(idx)"
            :icon="isEditingCategories[idx] ? 'pi pi-check' : 'pi pi-pencil'"
            class="edit-button"
            :class="{ 'editing': isEditingCategories[idx] }"
        />
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons" v-if="hasUnsavedChanges">
        <button
            class="button-green"
            @click="saveAllChanges"
            :disabled="hasValidationErrors"
        >
          <i class="pi pi-check"></i>
          Guardar cambios
        </button>
        <button
            class="button-cancel"
            @click="cancelAllChanges"
        >
          <i class="pi pi-times"></i>
          Cancelar
        </button>
      </div>

      <!-- Mensajes de error -->
      <div class="error-messages">
        <small id="country-required-error" v-if="countryRequiredError" class="p-error">El país es obligatorio.</small><br v-if="countryRequiredError">
        <small id="country-letters-only-error" v-if="countryLettersOnlyError" class="p-error">El país solo debe contener letras y espacios.</small><br v-if="countryLettersOnlyError">

        <small id="phone-required-error" v-if="phoneRequiredError" class="p-error">El teléfono es obligatorio.</small><br v-if="phoneRequiredError">
        <small id="phone-numbers-plus-error" v-if="phoneNumbersPlusError" class="p-error">Número en formato incorrecto.</small><br v-if="phoneNumbersPlusError">
        <small id="phone-min-length-error" v-if="phoneMinLengthError" class="p-error">El teléfono es demasiado corto.</small><br v-if="phoneMinLengthError">

        <small id="specialties-required-error" v-if="specialtiesRequiredError" class="p-error">Las especialidades son obligatorias.</small><br v-if="specialtiesRequiredError">
        <small id="specialties-length-error" v-if="specialtiesLengthError" class="p-error">La especialidad debe tener al menos 2 caracteres.</small><br v-if="specialtiesLengthError">
        <small id="specialties-allowed-chars-error" v-if="specialtiesAllowedCharsError" class="p-error">Las especialidades solo pueden contener letras, números, espacios y comas.</small><br v-if="specialtiesAllowedCharsError">
      </div>
    </template>
  </pv-card>

  <!-- Diálogo para cambiar imagen -->
  <pv-modal v-model:visible="displayDialog" modal header="Actualizar Imagen" style="width: 80%; height: 100%; max-width: 600px; min-width: 300px; max-height: 500px;" class="flex flex-column justify-content-center gap-5">
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
        chooseLabel="Seleccionar Imagen"
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
      <pv-button label="Aceptar" @click="updateImg" />
      <pv-button label="Cancelar" @click="closeDialog" />
    </footer>
  </pv-modal>
</template>

<style scoped>
/* Avatar con hover effect */
.avatar-container {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 0.8rem;
}

.edit-overlay.visible {
  opacity: 1;
}

.edit-icon {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.edit-text {
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  justify-content: center;
}

.button-green {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.button-green:hover:not(:disabled) {
  background: linear-gradient(135deg, #15803d, #166534);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.4);
}

.button-green:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-cancel {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.button-cancel:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

/* Botones de edición mejorados */
.edit-button {
  transition: all 0.3s ease;
  border-radius: 6px;
}

.edit-button.editing {
  background-color: #16a34a !important;
  color: white !important;
  border-color: #16a34a !important;
}

.edit-button:hover {
  transform: scale(1.1);
}

/* Estilos existentes */
.editable-container {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.editable-input {
  flex: 1;
  border-bottom: 1px solid #ccc;
  padding: 0.25rem;
}

.edit-button {
  margin-left: 0.5rem;
  max-height: 34px;
}

.secondary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.subtitle {
  color: #64748b;
  width: 6rem;
}

hr {
  opacity: 0.3;
}

@media (max-width: 799px) {
  .p-card {
    margin-top: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .button-green,
  .button-cancel {
    width: 100%;
    max-width: 200px;
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

.editable-text {
  word-wrap: break-word;
}

.editable-text,
.editable-input {
  flex-grow: 1;
  border: none;
}

.editable-input {
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

span {
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

.secondary {
  display: grid;
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

.error-messages {
  margin-top: 1rem;
}

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
}
</style>