<script>

import ToolbarEnterprise from "../../public/components/toolbar-enterprise.component.vue";
import FooterWebmaster from "../../public/components/footer-webstorm.component.vue";
import HomePage from "../../enterprise/home-enterprise/pages/home-page.component.vue";
import ToolbarFreelancer from "../../public/components/toolbar-freelancer.component.vue";

export default {
  name: "main-page-view",
  components: {ToolbarFreelancer, ToolbarEnterprise, FooterWebmaster, HomePage},
  data() {
    return {
      user_type: null
    };
  },
  created() {
    this.user_type = localStorage.getItem('user type')
  }
}
</script>

<template>

  <div class="flex flex-column justify-content-between container">
    <main>
      <div>
        <div v-if="this.user_type ==='developers'">
          <toolbar-freelancer/>
        </div>
        <div v-else>
          <toolbar-enterprise/>
        </div>
        <div class="p-container-fluid px-0">
          <div class="mt-3 w-full mt-3 mb-3">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <footer-webmaster></footer-webmaster>
    </footer>

  </div>

</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}


.container{
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main {
  flex: 1;
}

footer {
  flex-shrink: 0;

}

.p-container-fluid
{
  width:100%;
}
.p-container
{
  margin: auto !important;
}
@media (min-width: 1200px) {
  .p-container
  {
    max-width: 1140px;
    width: 1140px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .p-container
  {
    max-width: 960px;
    width: 960px;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .p-container
  {
    max-width: 720px;
    width: 720px;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .p-container
  {
    max-width: 540px;
    width: 540px;
  }
}
@media screen and (max-width: 576px) {
  .p-container
  {
    max-width: 95%;
    width: 95%;
  }
}
.p-container-sm
{
  margin: auto !important;
}
@media (min-width: 1200px) {
  .p-container-sm
  {
    max-width: 1140px;
    width: 1140px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .p-container-sm
  {
    max-width: 960px;
    width: 960px;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .p-container-sm
  {
    max-width: 720px;
    width: 720px;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .p-container-sm
  {
    max-width: 540px;
    width: 540px;
  }
}
@media screen and (max-width: 576px) {
  .p-container-sm
  {
    max-width: 95%;
    width: 95%;
  }
}
.p-container-md
{
  margin: auto !important;
}
@media (min-width: 1200px) {
  .p-container-md
  {
    max-width: 1140px;
    width: 1140px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .p-container-md
  {
    max-width: 960px;
    width: 960px;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .p-container-md
  {
    max-width: 720px;
    width: 720px;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .p-container-md
  {
    max-width: 95%;
    width: 95%;
  }
}
@media screen and (max-width: 576px) {
  .p-container-md
  {
    max-width: 95%;
    width: 95%;
  }
}
.p-container-lg
{
  margin: auto !important;
}
@media (min-width: 1200px) {
  .p-container-lg
  {
    max-width: 1140px;
    width: 1140px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .p-container-lg
  {
    max-width: 960px;
    width: 960px;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .p-container-lg
  {
    max-width: 95%;
    width: 95%;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .p-container-lg
  {
    max-width: 95%;
    width: 95%;
  }
}
@media screen and (max-width: 576px) {
  .p-container-lg
  {
    max-width: 95%;
    width: 95%;
  }
}
.p-container-xl
{
  margin: auto !important;
}
@media (min-width: 1200px) {
  .p-container-xl
  {
    max-width: 1140px;
    width: 1140px;
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .p-container-xl
  {
    max-width: 95%;
    width: 95%;
  }
}
@media screen and (min-width: 768px) and (max-width: 992px) {
  .p-container-xl
  {
    max-width: 95%;
    width: 95%;
  }
}
@media screen and (min-width: 576px) and (max-width: 768px) {
  .p-container-xl
  {
    max-width: 95%;
    width: 95%;
  }
}
@media screen and (max-width: 576px) {
  .p-container-xl
  {
    max-width: 95%;
    width: 95%;
  }
}

</style>