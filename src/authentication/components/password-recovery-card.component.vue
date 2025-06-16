<script>
export default {
  name: 'password-recovery-card',
  data() {
    return {
      mail: '',
      mailSend: false,
      errors: {
        mail: ''
      }
    };
  },
  methods: {
    validateFields() {
      let isValid = true;
      this.errors.mail = '';

      if (!this.mail) {
        this.errors.mail = 'El correo es obligatorio.';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.mail)) {
        this.errors.mail = 'El formato del correo no es válido.';
        isValid = false;
      }

      return isValid;
    },

    activate() {
      if (this.validateFields()) {
        this.mailSend = true;
      } else {
        this.mailSend = false;
      }
    }
  }
};
</script>

<template>
  <div class="bg-white">
    <!--<div class="mt-5 mx-3">
      <router-link aria-label="Go back to login" to="/login" class="text-purple-500 text-sm">
        <i class="pi pi-chevron-left" style="font-size: 2rem"></i>
      </router-link>
    </div>*/-->

    <div class="back-button">
      <router-link aria-label="go to login" to="/login" class="text-purple-500 text-sm">
        <i class="pi pi-chevron-left" style="font-size: 2rem"></i>
      </router-link>
    </div>

    <div class="flex justify-content-center align-items-center text-center" style="height: 80vh;">
      <pv-card aria-label="Password Recovery Form" class="flex border-card shadow-4 px-6">
        <template #title>
          <div>
            <img src="../../assets/logo.png" alt="Webmaster's logo" width="210" class="-m-2">
            <p>Cambiar contraseña</p>
          </div>
        </template>

        <template #content>
          <div>
            <div class="flex flex-column gap-2 align-items-center">
              <pv-inputText
                  aria-label="Email input field"
                  type="text"
                  v-model="mail"
                  placeholder="Ingresa tu correo electrónico"
                  class="border-round-3xl"
              />

              <p v-if="errors.mail" class="text-red-500 text-sm -mt-2">{{ errors.mail }}</p>

              <div class="flex flex-row mr-1 mt-0" v-if="mailSend">
                <span class="pi pi-check-circle" style="color: #B864F3"></span>
                <span class="ml-2 color-confirm">Correo enviado con éxito</span>
              </div>
            </div>

            <pv-button
                aria-label="Send email"
                label="Enviar correo"
                @click="activate"
                class="border-round-xl w-10rem bg-blue-600 text-lg mt-5 mr-1 p-3"
            />
          </div>

          <div class="color-auth font-bold">
            <p>
              <router-link aria-label="go to login" to="/login" class="text-purple-500 text-sm">Volver a iniciar
                sesión
              </router-link>
            </p>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
:deep(body) {
  background-color: #F5F5F5 !important;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: transparent; /* Fondo transparente */
  z-index: 10; /* Asegura que esté encima de otros elementos */
}

.p-button {
  border: 0;
}

.color-auth {
  color: #38B397;
}

.color-confirm {
  color: #B864F3;
}

.border-card {
  border: 2px solid #333333;
  border-radius: 5rem;
}
</style>