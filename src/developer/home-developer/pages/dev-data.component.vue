<template>
  <div class="min-h-screen p-4 flex items-center justify-center">
    <div v-if="myDev" class="custom-card-container">
      <DevMainPageComponent :developer="myDev" />
    </div>

    <div v-else-if="hasError" class="status-card">
      <div class="status-icon">⚠️</div>
      <h3 class="status-title">Error loading developer data</h3>
      <p class="status-text">
        There was a problem getting the information. Please try again.
      </p>
      <button @click="reloadPage" class="status-button">
        Try again
      </button>
    </div>

    <div v-else class="status-card">
      <div class="loading-spinner" />
      <p class="status-text">Loading developer data…</p>
    </div>
  </div>
</template>

<script>
import DevMainPageComponent from "../components/dev-main-page.component.vue";
import { DeveloperEntity } from "../../../shared/models/developer.model.js";
import { HomeService } from "../../../../public/services/home.service.js";

export default {
  name: "developer-data-component",
  components: { DevMainPageComponent },
  data() {
    return {
      homeService: new HomeService(),
      myDev: null,
      developer: null,
      hasError: false
    };
  },
  created() {
    const userId = localStorage.getItem("user id");
    this.homeService.getDevProfileByUserId(userId)
        .then(({data}) => {
          this.developer = data;
          localStorage.setItem("developer id", data.id);
          this.myDev = new DeveloperEntity(
              data.id,
              data.firstName,
              data.lastName,
              data.description,
              data.country,
              data.phone,
              data.completed_projects,
              data.specialties,
              data.profileImgUrl,
              {
                id: data.userId,
                mail: data.developerEmail
              }
          );
          localStorage.setItem("user name", data.firstName + " " + data.lastName);
          localStorage.setItem("user email", data.developerEmail);
          console.log("Perfil de desarrollador cargado:", this.myDev);
        })
        .catch((err) => {
          console.error("Error al cargar perfil de desarrollador", err);
          this.hasError = true;
        });
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
  justify-content: flex-start;
  align-items: center;
}

.custom-card-container {
  max-width: 800px;
  margin-top: -3.3rem;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 8.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #dfe3e8;
  text-align: center;
  max-width: 480px;
  margin: 2.5rem auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
