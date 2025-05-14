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




    // --- Variables de Error ---
    const countryRequiredError = ref(false);
    const summaryRequiredError = ref(false);
    const summaryLengthError = ref(false);
    const countryLettersOnlyError = ref(false);
    const phoneNumbersPlusError = ref(false);
    const phoneMinLengthError = ref(false);
    const specialtiesLengthError = ref(false);
    const specialtiesAllowedCharsError = ref(false);

    const hasValidationErrors = computed(() => {
      return summaryRequiredError.value || summaryLengthError.value ||
          countryLettersOnlyError.value || countryRequiredError.value ||
          phoneNumbersPlusError.value || phoneMinLengthError.value ||
          specialtiesLengthError.value || specialtiesAllowedCharsError.value;
    });


    // --- Funciones de Validación ---
    const validateMainText = () => {
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
      const trimmedText = text.trim();
      const hasMultipleSpaces = (trimmedText.split(' ').length - 1) > 1;
      const startsWithPlusAndHasSpaceAfter = /^\+\s/.test(trimmedText);
      const hasSpaceNotAfterPlus = /^\+[^\s]/.test(trimmedText) && trimmedText.includes(' ');
      const isValidFormat = /^\+?\d+(\s?\d+)*$/.test(trimmedText);

      phoneNumbersPlusError.value = !isValidFormat || startsWithPlusAndHasSpaceAfter || hasSpaceNotAfterPlus || hasMultipleSpaces;
      phoneMinLengthError.value = !phoneNumbersPlusError.value && trimmedText.replace(/\s/g, '').length < 7;

      return !phoneNumbersPlusError.value && !phoneMinLengthError.value;
    };

    const validateSpecialties = (text) => {
      const trimmedText = text.trim();
      specialtiesLengthError.value = trimmedText.length < 2;
      specialtiesAllowedCharsError.value = !/^[a-zA-Z0-9\s,]+$/.test(trimmedText); // Permite letras, números, espacios y comas
      return !specialtiesLengthError.value && !specialtiesAllowedCharsError.value;
    };

    // Editar campo principal (descripción)
    const toggleEditingMain = async () => {
      if (isEditingMain.value) {
        const isValid = validateMainText();
        if (!isValid) return;
      }

      isEditingMain.value = !isEditingMain.value;
    };





    const saveAllChanges = async () => {
      // Resetear todos los errores
      summaryRequiredError.value = false;
      countryRequiredError.value = false;

      summaryLengthError.value = false;
      countryLettersOnlyError.value = false;
      phoneNumbersPlusError.value = false;
      phoneMinLengthError.value = false;
      specialtiesLengthError.value = false;
      specialtiesAllowedCharsError.value = false;

      // Validar cada campo
      const isSummaryValid = validateMainText();
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
          isEditingMain.value = false;
          isEditingCategories.value = [false, false, false];
        } catch (err) {
          console.error("Error al guardar cambios:", err);
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
        if (index === 0) {
          countryLettersOnlyError.value = false;
          isValid = validateCountry(text);
        } else if (index === 1) {
          phoneNumbersPlusError.value = false;
          phoneMinLengthError.value = false;
          isValid = validatePhone(text);
        } else if (index === 2) {
          specialtiesLengthError.value = false;
          specialtiesAllowedCharsError.value = false;
          isValid = validateSpecialties(text);
        }

        // Si NO es válido, no permitas salir del modo edición
        if (!isValid) return;
      }

      // Si NO estaba en modo edición, simplemente entra en modo edición
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

          const publicUrl = `<span class="math-inline">\{getPublicUrl\("webmasterprofiles", filePath\)\}?t\=</span>{Date.now()}`;
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
      toggleEditingMain,
      toggleEditingCategory,
      updateImg,
      handleFileSelect,
      openDialog,
      closeDialog,

      // --- Variables de Error para el Template ---
      summaryRequiredError,
      summaryLengthError,
      countryLettersOnlyError,
      phoneNumbersPlusError,
      phoneMinLengthError,
      specialtiesLengthError,
      specialtiesAllowedCharsError,
        hasValidationErrors,
        saveAllChanges
    };
  }
};
</script>

<template>
  <pv-card aria-label="Developer Information" class="flex col gap-1">
    <template #title>
      <pv-avatar
          :image="developer.profile_img_url"
          class="mr-2"
          size="xlarge"
          shape="circle"
          @click="openDialog"
      />
      <div aria-label="Developer Name">
        <p>{{ developer.firstName }} {{ developer.lastName }}</p>
      </div>
    </template>

    <template #content>
      <hr aria-label="Separator Line" />
      <div class="subtitle" aria-label="Summary">{{ $t("dev-main-page-part1") }}</div>

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

      <div
          v-for="(label, idx) in ['country', 'phone', 'specialties']"
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
            'p-invalid': idx === 0 ? countryLettersOnlyError :
                         idx === 1 ? phoneNumbersPlusError || phoneMinLengthError :
                         idx === 2 ? specialtiesLengthError || specialtiesAllowedCharsError :
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
        <small id="country-letters-only-error" v-if="countryLettersOnlyError" class="p-error">El país solo debe contener letras y espacios.</small><br v-if="countryLettersOnlyError">

        <small id="phone-numbers-plus-error" v-if="phoneNumbersPlusError" class="p-error">Número en formato incorrecto.</small><br v-if="phoneNumbersPlusError">
        <small id="phone-min-length-error" v-if="phoneMinLengthError" class="p-error">El teléfono es demasiado corto.</small><br v-if="phoneMinLengthError">

        <small id="specialties-length-error" v-if="specialtiesLengthError" class="p-error">La especialidad debe tener al menos 2 caracteres.</small><br v-if="specialtiesLengthError">

      </div>
    </template>
  </pv-card>

  <pv-modal
      v-model:visible="displayDialog"
      modal
      header="Update Image URL"
      style="width: 80%; height: 100%; max-width: 600px; min-width: 300px; max-height: 500px;"
      class="flex flex-column justify-content-center gap-5"
  >
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

.button-green:hover {
  background-color: #15803b; /* Equivalente a hover:bg-green-700 */
}

.button-green:focus {
  outline: none; /* Remove el outline por defecto */
  box-shadow: 0 0 0 2px #22c55e; /* Efecto de focus similar a focus:ring-2 focus:ring-green-500 */
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

        try {
          await homeService.updateDevInfo(developerId.value, updatedInfo);
          isEditingMain.value = false;
          isEditingCategories.value = [false, false, false];
        } catch (err) {
          console.error("Error al guardar cambios:", err);
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
        if (index === 0) {
          countryLettersOnlyError.value = false;
          countryRequiredError.value = false;
          isValid = validateCountry(text);
        } else if (index === 1) {
          phoneNumbersPlusError.value = false;
          phoneMinLengthError.value = false;
          isValid = validatePhone(text);
        } else if (index === 2) {
          specialtiesLengthError.value = false;
          specialtiesAllowedCharsError.value = false;
          isValid = validateSpecialties(text);
        }

        // Si NO es válido, no permitas salir del modo edición
        if (!isValid) return;
      }

      // Si NO estaba en modo edición, simplemente entra en modo edición
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

          const publicUrl = `<span class="math-inline">\{getPublicUrl\("webmasterprofiles", filePath\)\}?t\=</span>{Date.now()}`;
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
      toggleEditingMain,
      toggleEditingCategory,
      updateImg,
      handleFileSelect,
      openDialog,
      closeDialog,

      // --- Variables de Error para el Template ---
      summaryRequiredError,
      countryRequiredError,
      summaryLengthError,
      countryLettersOnlyError,
      phoneNumbersPlusError,
      phoneMinLengthError,
      specialtiesLengthError,
      specialtiesAllowedCharsError,
      hasValidationErrors,
      saveAllChanges
    };
  }
};
</script>

<template>
  <pv-card aria-label="Developer Information" class="flex col gap-1">
    <template #title>
      <pv-avatar
          :image="developer.profile_img_url"
          class="mr-2"
          size="xlarge"
          shape="circle"
          @click="openDialog"
      />
      <div aria-label="Developer Name">
        <p>{{ developer.firstName }} {{ developer.lastName }}</p>
      </div>
    </template>

    <template #content>
      <hr aria-label="Separator Line" />
      <div class="subtitle" aria-label="Summary">{{ $t("dev-main-page-part1") }}</div>

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

      <div
          v-for="(label, idx) in ['country', 'phone', 'specialties']"
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
            'p-invalid': idx === 0 ? countryRequiredError  || countryLettersOnlyError :
                         idx === 1 ? phoneNumbersPlusError || phoneMinLengthError :
                         idx === 2 ? specialtiesLengthError || specialtiesAllowedCharsError :
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

        <small id="phone-numbers-plus-error" v-if="phoneNumbersPlusError" class="p-error">Número en formato incorrecto.</small><br v-if="phoneNumbersPlusError">
        <small id="phone-min-length-error" v-if="phoneMinLengthError" class="p-error">El teléfono es demasiado corto.</small><br v-if="phoneMinLengthError">

        <small id="specialties-length-error" v-if="specialtiesLengthError" class="p-error">La especialidad debe tener al menos 2 caracteres.</small><br v-if="specialtiesLengthError">

      </div>


    </template>
  </pv-card>

  <pv-modal
      v-model:visible="displayDialog"
      modal
      header="Update Image URL"
      style="width: 80%; height: 100%; max-width: 600px; min-width: 300px; max-height: 500px;"
      class="flex flex-column justify-content-center gap-5"
  >
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

.button-green:hover {
  background-color: #15803b; /* Equivalente a hover:bg-green-700 */
}

.button-green:focus {
  outline: none; /* Remove el outline por defecto */
  box-shadow: 0 0 0 2px #22c55e; /* Efecto de focus similar a focus:ring-2 focus:ring-green-500 */
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
</style>