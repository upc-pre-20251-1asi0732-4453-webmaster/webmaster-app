<script>
import DeveloperCardComponent from "../components/developer-card.component.vue";
import Paginator from "primevue/paginator";
import {HomeService} from "../../../../public/services/home.service.js";

export default{
  name: "search-developer-list",
  components: {
    'developer-card': DeveloperCardComponent,
    'pv-paginator': Paginator
  },
  data() {
    return {
      developers: [],
      first: 0,
      itemsPerPage: 5,
      homeService: new HomeService()
    }
  },
  computed: {
    paginatedDevelopers() {
      return this.developers.slice(this.first, this.first + this.itemsPerPage);
    }
  },
  created(){

    this.homeService.getDeveloperList().then((response) => {
      this.developers = response.data;
    });
  },
  methods: {
    onPageChange(event) {
      this.first = event.first;
      this.itemsPerPage = event.rows;
    }
  }
}
</script>

<template>
  <div id="searchDev">
  <div  class="grid col-fixed justify-content-center gap-5 mt-8 mb-4">
    <developer-card v-for="developer in paginatedDevelopers"
                    :key="developer.name"
                    :developer="developer"></developer-card>
  </div>
  <pv-paginator :first="first" :rows="itemsPerPage" :totalRecords="developers.length"
             :rowsPerPageOptions="[5,10,20]" @page="onPageChange"></pv-paginator>
  </div>
</template>

<style scoped>
  :deep(.p-paginator.p-component){
    background: transparent;
  }
  :deep(.p-paginator.p-component button){
    color: #ffffff;
  }
  :deep(.p-paginator-page.p-paginator-element.p-link.p-highlight){
    background: #bb0dbb;
  }
  :deep(.p-paginator-page.p-paginator-element.p-link:hover){
    background: rgba(187, 13, 187, 0.54);
  }

  #searchDev{
    min-height: 54vh;
  }

</style>