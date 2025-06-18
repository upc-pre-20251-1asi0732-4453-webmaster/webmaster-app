<script>
import DevDataComponent from "../../../developer/home-developer/pages/dev-data.component.vue";
import ProjectsDataComponent from "./projects-data.component.vue";

export default {
  name: "home-page",
  components: {DevDataComponent, ProjectsDataComponent},
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <div class="main-container">
    <dev-data-component/>
    <projects-data-component/>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 6rem;
  padding: 0 1rem; /* margen lateral en pantallas pequeñas */
  box-sizing: border-box; /* asegura que padding no cause overflow */
  width: 100%; /* ocupa todo el ancho disponible */
  max-width: 100vw; /* previene que se pase del ancho de la ventana */
  overflow-x: hidden; /* como última defensa */
}
</style>
