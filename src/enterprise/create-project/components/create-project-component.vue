<template>
  <div class="p-grid p-justify-center p-align-center flex-container m-2">
    <pv-card aria-label="Create Project Form" class="card-flex form-container">
      <!-- Título editable -->
      <template #title>
        <div class="title-container">
          <pv-avatar :image="profile_img" class="mr-2 mt-2" size="xlarge" shape="circle" aria-label="Developer Avatar" />

          <h1 class="text-center" v-if="!isEditingTitle">{{ titleText }}</h1>
          <pv-inputText
              v-else
              v-model="titleText"
              placeholder="Nombre del proyecto"
              class="editable-input"
          />
          <pv-button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text edit-button"
              v-if="!isEditingTitle"
              @click="toggleEditingTitle"
          />
          <pv-button
              icon="pi pi-check"
              class="p-button-rounded p-button-text edit-button"
              v-else
              @click="toggleEditingTitle"
          />
        </div>
      </template>

      <!-- Subtítulo -->
      <template #subtitle>
        {{$t('create-project-part1')}}
      </template>

      <!-- Contenido -->
      <template #content>
        <!-- Descripción -->
        <div class="form-group">
          <label for="project-description">Descripción</label>
          <pv-textarea
              id="project-description"
              v-model="descriptionText"
              placeholder="Descripción del proyecto"
              class="form-input"
              autoResize
          />
          <pv-button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text edit-button"
              v-if="!isEditingDescription"
              @click="toggleEditingDescription"
          />
          <pv-button
              icon="pi pi-check"
              class="p-button-rounded p-button-text edit-button"
              v-else
              @click="toggleEditingDescription"
          />
        </div>

        <hr />

        <!-- Lenguajes -->
        <div class="form-group">
          <label for="project-languages">Lenguajes</label>
          <pv-multi-select
              id="project-languages"
              v-model="selectedLanguages"
              :options="languages"
              option-value="id"
              option-label="name"
              placeholder="Selecciona lenguajes"
              class="form-input"
          />
        </div>

        <!-- Frameworks -->
        <div class="form-group">
          <label for="project-frameworks">Frameworks</label>
          <pv-multi-select
              id="project-frameworks"
              v-model="selectedFrameworks"
              :options="frameworks"
              option-value="id"
              option-label="name"
              placeholder="Selecciona frameworks"
              class="form-input"
          />
        </div>

        <!-- Tipo de proyecto -->
        <div class="form-group">
          <label for="project-type">Tipo de proyecto</label>
          <pv-drop-down
              id="project-type"
              v-model="selectedType"
              :options="typeOptions"
              option-value="value"
              option-label="label"
              placeholder="Selecciona tipo"
              class="form-input"
          />
        </div>

        <!-- Presupuesto -->
        <div class="form-group">
          <label for="project-budget">Presupuesto</label>
          <pv-inputText
              id="project-budget"
              v-model="budget"
              placeholder="Ej: 1000 USD"
              class="form-input"
          />
        </div>

        <!-- Metodologías -->
        <div class="form-group">
          <label for="project-methodologies">Metodologías</label>
          <pv-inputText
              id="project-methodologies"
              v-model="methodologies"
              placeholder="Ej: Agile, Scrum"
              class="form-input"
          />
        </div>

        <!-- Error Message -->
        <p v-if="errorMessage" class="p-error">{{ errorMessage }}</p>

        <!-- Botón publicar -->
        <div class="form-group">
          <pv-button
              label="Crear proyecto"
              class="submit-button"
              @click="publishProject"
          />
        </div>
      </template>
    </pv-card>
  </div>
</template>

<script>
import { ProjectService } from "../../../../public/services/project.service.js";

export default {
  name: "create-project",
  data() {
    return {
      isEditingTitle: false,
      titleText: "Nombre del proyecto",
      isEditingDescription: false,
      descriptionText: "Descripción del proyecto",

      // Listas estáticas según tabla pre‑poblada
      languages: [
        { id: 1, name: "Java" },
        { id: 2, name: "Python" },
        { id: 3, name: "JavaScript" },
        { id: 4, name: "C#" },
        { id: 5, name: "Ruby" }
      ],
      frameworks: [
        { id: 1, name: "Spring Boot" },
        { id: 2, name: "Vue.js" },
        { id: 3, name: "Angular" },
        { id: 4, name: "Nest.js" },
        { id: 5, name: ".NET Core" }
      ],
      typeOptions: [
        { label: "Landing Page", value: "LANDING_PAGE" },
        { label: "E-commerce", value: "ECOMMERCE" },
        { label: "One Page Website", value: "ONE_PAGE_WEBSITE" },
        { label: "Mobile App", value: "MOBILE_APPLICATION" },
        { label: "Desktop App", value: "DESKTOP_APPLICATION" },
        { label: "Otro", value: "OTHER" }
      ],

      // Modelos vinculados
      selectedLanguages: [],
      selectedFrameworks: [],
      selectedType: "LANDING_PAGE",
      budget: "",
      methodologies: "",
      errorMessage: "",

      projectService: new ProjectService(),

      profile_img: localStorage.getItem('profile img')
    };
  },
  methods: {
    toggleEditingTitle() {
      this.isEditingTitle = !this.isEditingTitle;
    },
    toggleEditingDescription() {
      this.isEditingDescription = !this.isEditingDescription;
    },
    validate() {
      if (!this.titleText.trim()) return "El nombre es obligatorio.";
      if (!this.descriptionText.trim()) return "La descripción es obligatoria.";
      if (!this.selectedLanguages.length) return "Selecciona al menos un lenguaje.";
      if (!this.selectedFrameworks.length) return "Selecciona al menos un framework.";
      // type ya tiene valor por defecto
      if (!this.budget.trim()) return "El presupuesto es obligatorio.";
      return null;
    },
    publishProject() {
      const err = this.validate();
      if (err) {
        this.errorMessage = err;
        return;
      }
      this.errorMessage = "";

      // construimos el payload
      const payload = {
        name: this.titleText,
        description: this.descriptionText,
        ownerId: parseInt(localStorage.getItem("user id"), 10),
        languages: this.selectedLanguages,
        frameworks: this.selectedFrameworks,
        type: this.selectedType,
        budget: this.budget,
        methodologies: this.methodologies
      };

      console.log("Payload a enviar:", payload);

      this.projectService
          .createProject(payload)
          .then(() => {
            this.$router.push(`/main/enterprises/${payload.ownerId}`);
          })
          .catch(err => {
            this.errorMessage = err.response?.data?.message || "Error al crear proyecto.";
          });
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-flex {
  max-width: 800px;
  width: 100%;
  margin: 50px auto;
  padding: 2rem;
  border-radius: 10px;
  font-family: 'Roboto', sans-serif;
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.form-input {
  width: 100%;
}
.submit-button {
  width: 100%;
  margin-top: 1rem;
}
.p-error {
  color: #f44336;
  margin-top: 0.5rem;
  text-align: center;
}
.editable-input {
  width: 100%;
}
.edit-button {
  margin-left: 0.5rem;
}
.title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
