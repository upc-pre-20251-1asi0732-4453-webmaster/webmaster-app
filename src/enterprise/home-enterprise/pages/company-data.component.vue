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
      enterprise: null
    };
  },
  provide() {
    return {
      // inyecta el enterpriseId para los hijos (projects-data)
    enterpriseId: this.enterprise?.id
    };
  },
  async created() {
    try {
      const userId = localStorage.getItem("user id");
      // llamamos al endpoint /enterprises/user/{userId}
      const response = await this.homeService.getEnterpriseByUserId(userId);
      this.enterprise = response.data;

      // construimos la entidad con los nombres de campo que devuelve la API
      this.myCom = new CompanyEntity(
          this.enterprise.id,
          this.enterprise.enterpriseName,
          this.enterprise.profileImgUrl,
          this.enterprise.description,
          this.enterprise.country,
          this.enterprise.ruc,
          this.enterprise.phone,
          this.enterprise.website,
          this.enterprise.sector,
          [] // no viene el objeto User completo, dejamos array vacío
      );

      localStorage.setItem('profile img', this.enterprise.profileImgUrl);
    } catch (err) {
      console.error('Error al cargar los datos de la empresa', err);
    }
  }
};
</script>

<template>
  <div v-if="myCom">
    <CompanyMainPageComponent :company="myCom"/>
  </div>
  <div v-else class="p-m-3">Cargando datos de la empresa…</div>
</template>
