<template>
  <div class="min-h-screen p-4 flex items-center justify-center">
    <div v-if="myCom" class="custom-card-container">
      <CompanyMainPageComponent :company="myCom" />
    </div>

    <div v-else-if="hasError" class="status-card">
      <div class="status-icon">⚠️</div>
      <h3 class="status-title">Error loading company data</h3>
      <p class="status-text">There was a problem getting the information. Please try again.</p>
      <button @click="reloadPage" class="status-button">
        Try again
      </button>
    </div>

    <div v-else class="status-card">
      <div class="loading-spinner"></div>
      <p class="status-text">Loading enterprise data…</p>
    </div>
  </div>
</template>

<script>
import CompanyMainPageComponent from "../components/company-main-page.component.vue";
import { CompanyEntity } from "../../../shared/models/company.model.js";
import { HomeService } from "../../../../public/services/home.service.js";

export default {
  name: "company-data",
  components: { CompanyMainPageComponent },
  data() {
    return {
      homeService: new HomeService(),
      myCom: null,
      enterprise: null,
      hasError: false
    };
  },
  provide() {
    return {
      enterpriseId: this.enterprise?.id
    };
  },
  async created() {
    try {
      const userId = localStorage.getItem("user id");
      const response = await this.homeService.getEnterpriseByUserId(userId);
      this.enterprise = response.data;

      console.log("Datos de la empresa:",response.data);
      this.myCom = new CompanyEntity(
          this.enterprise.id,
          this.enterprise.enterpriseName,
          this.enterprise.profileImgUrl,
          this.enterprise.description,
          this.enterprise.country,
          this.enterprise.ruc,
          this.enterprise.phone,
          this.enterprise.website,
          this.enterprise.sector
      );
      localStorage.setItem("profile img", this.enterprise.profileImgUrl);
      localStorage.setItem("user name", this.enterprise.enterpriseName);
      localStorage.setItem("user email", this.enterprise.enterpriseEmail);
    } catch (err) {
      console.error("Error al cargar los datos de la empresa", err);
      this.hasError = true;
    }
  },
  methods: {
    reloadPage() {
      window.location.reload();
    }
  }
};
</script>

<style scoped>

.min-h-screen {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Alinea el contenido hacia la parte superior */
  align-items: center; /* Centra horizontalmente */
}

.custom-card-container {
  max-width: 800px; /* Ajusta el tamaño máximo */
  margin-top:-3.3rem; /* Ajusta la distancia desde la parte superior */
  padding: 2rem; /* Espaciado interno */
  border-radius: 12px; /* Bordes redondeados */

}

.status-card {
  background: #ffffff; /* Fondo blanco puro */
  border-radius: 16px; /* Bordes más redondeados para un diseño moderno */
  padding: 8.75rem; /* Espaciado interno más equilibrado */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombra más suave y extendida */
  border: 1px solid #dfe3e8; /* Color de borde más claro para menor contraste */
  text-align: center;
  max-width: 480px; /* Ancho máximo más amplio para mejor legibilidad */
  margin: 2.5rem auto; /* Espaciado vertical uniforme */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animación para interacción */
}

.status-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.status-title {
  color: #e74c3c;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.5rem 0 1rem;
}

.status-text {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.status-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.status-button:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
