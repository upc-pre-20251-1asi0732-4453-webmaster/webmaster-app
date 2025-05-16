<script>
export default {
  name: "toolbar-freelancer",
  data() {
    return {
      id: localStorage.getItem('user id'),
      type: localStorage.getItem('user type'),
      visibleRight: false,
      screenWidth: window.innerWidth,
      languages: ['en', 'es'],
      language: 'en'
    }
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
    logOut() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
}
</script>

<template>
  <!-- Toolbar desktop -->
  <div class="flex flex-wrap justify-content-center" v-if="!showSidebar">
    <pv-toolbar
        style="border-radius: 25px; background-color: rgba(255, 255, 255, 0.3); border: 2px solid white; padding: 0.75rem 1.5rem;"
        class="my-4"
    >
      <template #start>
        <!-- 1. Home -->
        <router-link :to="`/main/${type}/${id}`">
          <pv-button text plain class="responsive-button justify-content-center">
            <i class="pi pi-home" style="font-size: 1.3rem;"></i>
            <span>{{ $t('toolbar-freelancer-option1') }}</span>
          </pv-button>
        </router-link>

        <!-- 2. Messages -->
        <router-link to="/message">
          <pv-button text plain class="responsive-button justify-content-center">
            <i class="pi pi-envelope" style="font-size: 1.3rem;"></i>
            <span>{{ $t('toolbar-freelancer-option2') }}</span>
          </pv-button>
        </router-link>
      </template>

      <!-- 3. Logo central (decorativo) -->
      <template #center>
        <div class="navbar-icon-center">
          <router-link :to="`/main/${type}/${id}`">
            <img src="https://i.imgur.com/DOPLKzN.png" alt="Logo" class="imgsize cursor-pointer"/>
          </router-link>
        </div>
      </template>

      <template #end>
        <!-- 4. Explore Project -->
        <router-link to="/search-project">
          <pv-button text plain class="responsive-button justify-content-center">
            <i class="pi pi-compass" style="font-size: 1.3rem;"></i>
            <span>{{ $t('toolbar-freelancer-option3') }}</span>
          </pv-button>
        </router-link>

        <!-- 5. Exit -->
        <pv-button @click="logOut" text plain class="responsive-button justify-content-center">
          <i class="pi pi-sign-out" style="font-size: 1.3rem;"></i>
          <span>{{ $t('toolbar-freelancer-option4') }}</span>
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

  <!-- Toolbar mobile (sidebar) -->
  <div v-else class="navbar-mobile-wrapper flex flex-wrap justify-content-center">
    <pv-toolbar
        style="border-radius: 25px; background-color: rgba(255, 255, 255, 0.8); border: 2px solid white; padding: 0.75rem 1.5rem;"
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
        <pv-sidebar
            v-model:visible="visibleRight"
            header="Options"
            position="right"
            class="flex flex-column gap-6 p-4"
        >
          <router-link :to="`/main/${type}/${id}`" class="p-mb-3">
            <pv-button text plain class="w-full">
              <h3>{{ $t('toolbar-freelancer-option1') }}</h3>
            </pv-button>
          </router-link>
          <router-link to="/message" class="p-mb-3">
            <pv-button text plain class="w-full">
              <h3>{{ $t('toolbar-freelancer-option2') }}</h3>
            </pv-button>
          </router-link>
          <router-link to="/search-project" class="p-mb-3">
            <pv-button text plain class="w-full">
              <h3>{{ $t('toolbar-freelancer-option3') }}</h3>
            </pv-button>
          </router-link>
          <pv-button @click="logOut" text plain class="w-full">
            <h3>{{ $t('toolbar-freelancer-option4') }}</h3>
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
  color: white;
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
