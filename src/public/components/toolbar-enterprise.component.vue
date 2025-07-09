<script>
export default {
  name: 'toolbar-enterprise',
  data() {
    return {
      id: localStorage.getItem('user id'),
      type: localStorage.getItem('user type'),
      visibleRight: false,
      screenWidth: window.innerWidth,
      languages: ['en', 'es'],
      language: 'es'
    };
  },
  computed: {
    showSidebar() {
      return this.screenWidth <= 856;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth > 856) {
        this.visibleRight = false;
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<template>
  <!-- Toolbar desktop -->
  <div class="flex flex-wrap justify-content-center" v-if="!showSidebar">
    <pv-toolbar
        style="border-radius: 25px; background-color: rgba(255, 255, 255, 0.3); border: 2px solid white; padding: 0.75rem 1.5rem;"
        class="my-4"
    >
      <template #start>

        <router-link :to="`/main/${type}/${id}`">
          <pv-button text plain class="responsive-button justify-content-center">
            <i class="pi pi-home" style="font-size: 1.3rem;"></i>
            <span>{{ $t('toolbar-enterprise-option5') }}</span>
          </pv-button>
        </router-link>

        <router-link to="/message">
          <pv-button text plain class="responsive-button justify-content-center">
            <i class="pi pi-envelope" style="font-size: 1.3rem;"></i>
            <span>{{ $t('toolbar-enterprise-option2') }}</span>
          </pv-button>
        </router-link>
      </template>

      <template #center>
        <div class="navbar-icon-center">
          <router-link :to="`/main/${type}/${id}`">
            <img src="https://i.imgur.com/DOPLKzN.png" alt="Logo" class="imgsize cursor-pointer"/>
          </router-link>
        </div>
      </template>

      <template #end>
        <router-link to="/search-developer">
          <pv-button text plain class="responsive-button justify-content-center">
            <i class="pi pi-compass" style="font-size: 1.3rem;"></i>
            <span>{{ $t('toolbar-enterprise-option1') }}</span>
          </pv-button>
        </router-link>

        <pv-button @click="logout" text plain class="responsive-button justify-content-center">
          <i class="pi pi-sign-out" style="font-size: 1.3rem;"></i>
          <span>{{ $t('toolbar-enterprise-option4') }}</span>
        </pv-button>
      </template>
    </pv-toolbar>

    <!-- Selector de idioma -->
    <pv-select-button
        v-model="$i18n.locale"
        :options="languages"
        class="uppercase my-6 ml-6"
    />
  </div>

  <!-- Toolbar mobile -->
  <div v-else class="navbar-mobile-wrapper flex flex-wrap justify-content-center">
    <pv-toolbar
        style="border-radius: 25px; background-color: rgba(255, 255, 255, 0.7); border: 2px solid white; padding: 0.75rem 1.5rem;"
        class="my-4 w-full"
    >
      <template #start>
        <router-link :to="`/main/${type}/${id}`">
          <img src="https://i.imgur.com/DOPLKzN.png" alt="Logo" class="imgsize cursor-pointer"/>
        </router-link>
      </template>

      <template #end>
        <pv-button @click="visibleRight = true" class="bg-blue-600">
          <i class="pi pi-bars" style="font-size: 2.2rem;"></i>
        </pv-button>

        <pv-sidebar v-model:visible="visibleRight" header="Opciones" position="right"
                    class="flex flex-column gap-6 p-4">
          <router-link :to="`/main/${type}/${id}`">
            <pv-button text plain class="w-full"><h3>{{ $t('toolbar-enterprise-option5') }}</h3></pv-button>
          </router-link>
          <router-link to="/message">
            <pv-button text plain class="w-full"><h3>{{ $t('toolbar-enterprise-option2') }}</h3></pv-button>
          </router-link>
          <router-link to="/search-developer" class="p-mb-3">
            <pv-button text plain class="w-full"><h3>{{ $t('toolbar-enterprise-option1') }}</h3></pv-button>
          </router-link>
          <pv-button @click="logout" text plain class="w-full"><h3>{{ $t('toolbar-enterprise-option4') }}</h3>
          </pv-button>
          <pv-select-button
              v-model="$i18n.locale"
              :options="languages"
              class="uppercase my-6 mr-6"
          />
        </pv-sidebar>
      </template>
    </pv-toolbar>
  </div>
</template>

<style scoped>
.responsive-button {
  font-size: 1.1rem;
  border: white;
  background-color: transparent;
  color: white;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-bottom 0.3s ease, transform 0.3s ease;
  gap:0.5rem;
}

.responsive-button:hover {
  text-decoration: underline;
  text-decoration-color: white;
  text-underline-offset: 10px;
  transform: translateY(-3px);
}


@media screen and (max-width: 768px) {
  .responsive-button {
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 576px) {
  .responsive-button {
    font-size: 1rem;
  }
}

.imgsize {
  width: 75px;
  height: 75px;
  opacity: 1;
}

.navbar-icon-center {
  flex: 1;
  display: flex !important;
  justify-content: center;
}

.navbar-mobile-wrapper {
  padding: 0 1rem; /* margen lateral solo para mobile */
}

@media screen and (min-width: 769px) {
  .navbar-mobile-wrapper {
    padding: 0; /* quita el padding en desktop */
  }
}

</style>
