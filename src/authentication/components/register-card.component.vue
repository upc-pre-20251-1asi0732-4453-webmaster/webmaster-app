
<script>
import { AuthService } from "../../../public/services/auth.service.js";

export default {
  name: 'register-card',
  data() {
    return {
      authService: new AuthService(),
      selectedRole: null,
      roleOptions: [
        { label: 'Empresa', value: 'empresa' },
        { label: 'Desarrollador', value: 'desarrollador' }
      ],
      mail: "",
      password: "",
      firstName: "",
      lastName: "",
      companyName: "",
      errors: {}
    };
  },
  watch: {
    selectedRole(newRole) {
      if (newRole === 'empresa') {
        this.errors.firstName = null;
        this.errors.lastName = null;
      }
      if (newRole === 'desarrollador') {
        this.errors.companyName = null;
      }
    }
  },
  methods: {
    validateForm() {
      this.errors = {};

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/;

      if (!this.mail) {
        this.errors.mail = "El correo es obligatorio.";
      } else if (!emailRegex.test(this.mail)) {
        this.errors.mail = "Ingresa un correo válido.";
      }

      if (!this.password) {
        this.errors.password = "La contraseña es obligatoria.";
      } else if (this.password.length < 8) {
        this.errors.password = "Mínimo 8 caracteres.";
      }

      if (!this.selectedRole) {
        this.errors.selectedRole = "Selecciona un rol.";
      }

      if (this.selectedRole === 'empresa') {
        if (!this.companyName) {
          this.errors.companyName = "El nombre de la empresa es obligatorio.";
        }
      }

      if (this.selectedRole === 'desarrollador') {
        if (!this.firstName) {
          this.errors.firstName = "El nombre es obligatorio.";
        } else if (!nameRegex.test(this.firstName)) {
          this.errors.firstName = "El nombre no debe contener números.";
        }

        if (!this.lastName) {
          this.errors.lastName = "El apellido es obligatorio.";
        } else if (!nameRegex.test(this.lastName)) {
          this.errors.lastName = "El apellido no debe contener números.";
        }
      }

      return Object.keys(this.errors).length === 0;
    },
    async registerAccount() {
      if (!this.validateForm()) return;

      if (this.selectedRole === 'empresa') {
        const enterpriseData = {
          username: this.mail,
          password: this.password,
          enterpriseName: this.companyName
        };
        try {
          const response = await this.authService.registerEnterprise(enterpriseData);
          console.log("Empresa creada:", response);
          this.$router.push('/login');
        } catch (error) {
          console.error("Error al registrar empresa", error);
        }
      }

      if (this.selectedRole === 'desarrollador') {
        const developerData = {
          username: this.mail,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName
        };
        try {
          const response = await this.authService.registerDeveloper(developerData);
          console.log("Desarrollador creado:", response);
          this.$router.push('/login');
        } catch (error) {
          console.error("Error al registrar desarrollador", error);
        }
      }
    }
  }
};
</script>

<template>
  <div class="bg-white">
    <div class="mt-5 mx-3">
      <router-link aria-label="go to login" to="/login" class="text-purple-500 text-sm">
        <i class="pi pi-chevron-left" style="font-size: 2rem"></i>
      </router-link>
    </div>

    <div class="flex justify-content-center align-items-center text-center" style="height: 80vh;">
      <pv-card aria-label="Registration Form" class="flex border-card shadow-4 px-6">
        <template #title>
          <div>
            <img src="../../assets/logo.png" alt="Webmaster's logo" width="210" class="-m-2">
          </div>
        </template>

        <template #content>
          <div>
            <div class="flex flex-column gap-4 align-items-center">

              <pv-inputText
                  aria-label="Email input field"
                  type="email"
                  v-model="mail"
                  placeholder="Correo electrónico"
                  class="border-round-3xl"
              />
              <p v-if="errors.mail" class="text-red-500 text-sm">{{ errors.mail }}</p>

              <pv-inputText
                  v-if="selectedRole === 'desarrollador'"
                  aria-label="First name input field"
                  type="text"
                  v-model="firstName"
                  placeholder="Nombre"
                  class="border-round-3xl"
              />
              <p v-if="selectedRole === 'desarrollador' && errors.firstName" class="text-red-500 text-sm">{{ errors.firstName }}</p>

              <pv-inputText
                  v-if="selectedRole === 'desarrollador'"
                  aria-label="Last name input field"
                  type="text"
                  v-model="lastName"
                  placeholder="Apellido"
                  class="border-round-3xl"
              />
              <p v-if="selectedRole === 'desarrollador' && errors.lastName" class="text-red-500 text-sm">{{ errors.lastName }}</p>

              <pv-inputText
                  v-if="selectedRole === 'empresa'"
                  aria-label="Company name input field"
                  type="text"
                  v-model="companyName"
                  placeholder="Nombre de la empresa"
                  class="border-round-3xl"
              />
              <p v-if="selectedRole === 'empresa' && errors.companyName" class="text-red-500 text-sm">{{ errors.companyName }}</p>

              <pv-inputText
                  aria-label="Password input field"
                  type="password"
                  v-model="password"
                  placeholder="Contraseña"
                  class="border-round-3xl"
              />
              <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>

              <pv-drop-down
                  aria-label="Role selection dropdown menu"
                  v-model="selectedRole"
                  :options="roleOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Selecciona un rol"
                  class="border-round-3xl w-12rem"
              />
              <p v-if="errors.selectedRole" class="text-red-500 text-sm">{{ errors.selectedRole }}</p>

            </div>

            <pv-button
                aria-label="Create account button"
                label="Crear cuenta"
                class="border-round-xl w-10rem bg-blue-600 text-lg mt-4 mr-1 p-3"
                @click="registerAccount"
            />
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.p-button {
  border: 0;
}
.border-card {
  border: 2px solid #333333;
  border-radius: 5rem;
}
.text-red-500 {
  color: red;
  margin-top: -1rem;
  font-size: 0.875rem;
}
</style>






